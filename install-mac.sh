#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 📚 Interactive Classroom — macOS PowerPoint Add-in Installer
# ═══════════════════════════════════════════════════════════════
# This script installs the "صفّي التفاعلي" (Interactive Classroom)
# PowerPoint Add-in on your macOS system.
#
# What it does:
#   1. Installs npm dependencies
#   2. Copies the manifest.xml to PowerPoint's wef folder (sideloading)
#   3. Creates convenience start/stop scripts
#   4. Opens PowerPoint with the add-in ready
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="Interactive Classroom"
# macOS PowerPoint sideload manifests path
MANIFEST_DIR="$HOME/Library/Containers/com.microsoft.Powerpoint/Data/Documents/wef"

echo ""
echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║${NC}  ${BOLD}📚 Interactive Classroom — PowerPoint Add-in Installer${NC}  ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║${NC}     ${CYAN}صفّي التفاعلي — نظام إدارة نقاط الطلاب${NC}            ${MAGENTA}║${NC}"
echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ─────────────────────────────────────────────────────────
# Step 1: Check Prerequisites
# ─────────────────────────────────────────────────────────
echo -e "${BLUE}[1/4]${NC} ${BOLD}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}  ✖ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}  ✖ Node.js version must be 16 or higher. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}  ✔ Node.js $(node -v) detected${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}  ✖ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}  ✔ npm $(npm -v) detected${NC}"

# Check if PowerPoint is installed
if [ -d "/Applications/Microsoft PowerPoint.app" ]; then
    echo -e "${GREEN}  ✔ Microsoft PowerPoint detected${NC}"
else
    echo -e "${YELLOW}  ⚠ Microsoft PowerPoint not found in /Applications${NC}"
    echo -e "${YELLOW}    The add-in will be installed but needs PowerPoint to run.${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────
# Step 2: Install Dependencies
# ─────────────────────────────────────────────────────────
echo -e "${BLUE}[2/4]${NC} ${BOLD}Installing dependencies...${NC}"
cd "$SCRIPT_DIR"

if [ -d "node_modules" ]; then
    echo -e "${CYAN}  → node_modules exists, running npm install to verify...${NC}"
fi
npm install --silent 2>/dev/null
echo -e "${GREEN}  ✔ Dependencies installed${NC}"
echo ""

# ─────────────────────────────────────────────────────────
# Step 3: Install manifest via osascript (bypasses sandbox)
# ─────────────────────────────────────────────────────────
echo -e "${BLUE}[3/4]${NC} ${BOLD}Installing add-in manifest for PowerPoint...${NC}"

# Use Finder to copy (avoids sandbox restrictions)
osascript <<EOF
tell application "Finder"
    set wefPath to (path to home folder as text) & "Library:Containers:com.microsoft.Powerpoint:Data:Documents:wef:"
    try
        wefPath as alias
    on error
        do shell script "mkdir -p " & quoted form of POSIX path of wefPath
    end try
end tell
do shell script "cp " & quoted form of "$SCRIPT_DIR/manifest.xml" & " " & quoted form of POSIX path of ((path to home folder as text) & "Library:Containers:com.microsoft.Powerpoint:Data:Documents:wef:manifest.xml")
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✔ Manifest installed to PowerPoint's add-in folder${NC}"
else
    echo -e "${YELLOW}  ⚠ Auto-install failed. You can manually sideload:${NC}"
    echo -e "${YELLOW}    1. Open PowerPoint → Insert → My Add-ins${NC}"
    echo -e "${YELLOW}    2. Upload: $SCRIPT_DIR/manifest.xml${NC}"
fi
echo ""

# ─────────────────────────────────────────────────────────
# Step 4: Create convenience scripts
# ─────────────────────────────────────────────────────────
echo -e "${BLUE}[4/4]${NC} ${BOLD}Creating utility scripts...${NC}"

cat > "$SCRIPT_DIR/start-addin.sh" << 'STARTSCRIPT'
#!/bin/bash
# ═══════════════════════════════════════════════════════════
# 🚀 Interactive Classroom — Start Add-in Server
# ═══════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "📚 Starting Interactive Classroom Add-in Server..."
echo "───────────────────────────────────────────────────"

# Check if already running
if lsof -i :3001 &> /dev/null; then
    echo "⚠️  Server already running on port 3001"
    echo "   To stop it, run: ./stop-addin.sh"
    echo ""
    echo "🔗 Opening PowerPoint..."
    open -a "Microsoft PowerPoint"
    exit 0
fi

echo "🔧 Starting HTTPS dev server on https://localhost:3001..."
echo ""

# Start server and open PowerPoint
npm run dev &
SERVER_PID=$!

# Wait for server
for i in {1..30}; do
    if curl -sk https://localhost:3001 > /dev/null 2>&1; then
        echo ""
        echo "✅ Server is ready!"
        echo ""
        echo "📋 Next steps:"
        echo "   1. PowerPoint will open automatically"
        echo "   2. Go to Insert → My Add-ins"
        echo "   3. Look for 'Interactive Classroom' under MY ADD-INS tab"
        echo "   4. Or click 'Upload My Add-in' and select:"
        echo "      $SCRIPT_DIR/manifest.xml"
        echo "   5. The 'Classroom' tab will appear in the ribbon!"
        echo ""
        echo "🔗 Opening PowerPoint..."
        open -a "Microsoft PowerPoint"
        break
    fi
    sleep 0.5
done

echo ""
echo "Press Ctrl+C to stop the server."
wait $SERVER_PID
STARTSCRIPT
chmod +x "$SCRIPT_DIR/start-addin.sh"

cat > "$SCRIPT_DIR/stop-addin.sh" << 'STOPSCRIPT'
#!/bin/bash
# ═══════════════════════════════════════════════════════════
# 🛑 Interactive Classroom — Stop Add-in Server
# ═══════════════════════════════════════════════════════════

echo ""
echo "🛑 Stopping Interactive Classroom Add-in Server..."

# Find and kill processes on port 3001
PIDS=$(lsof -ti :3001)
if [ -n "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null
    echo "✅ Server stopped."
else
    echo "ℹ️  No server was running on port 3001."
fi
echo ""
STOPSCRIPT
chmod +x "$SCRIPT_DIR/stop-addin.sh"

echo -e "${GREEN}  ✔ start-addin.sh created${NC}"
echo -e "${GREEN}  ✔ stop-addin.sh created${NC}"
echo ""

# ─────────────────────────────────────────────────────────
# Done!
# ─────────────────────────────────────────────────────────
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ✅ Installation Complete!${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}How to use:${NC}"
echo ""
echo -e "  ${CYAN}Step 1: Start the server${NC}"
echo -e "    ${YELLOW}./start-addin.sh${NC}"
echo ""
echo -e "  ${CYAN}Step 2: In PowerPoint:${NC}"
echo -e "    1. Go to ${BOLD}Insert${NC} tab"
echo -e "    2. Click ${BOLD}My Add-ins${NC} (or ${BOLD}Get Add-ins${NC})"
echo -e "    3. Choose ${BOLD}MY ADD-INS${NC} tab at the top"
echo -e "    4. You should see ${BOLD}Interactive Classroom${NC} listed"
echo -e "    5. Click it to open the dashboard panel!"
echo ""
echo -e "  ${CYAN}If the add-in is not listed:${NC}"
echo -e "    1. Click ${BOLD}Upload My Add-in${NC} in the dialog"
echo -e "    2. Browse to: ${YELLOW}$SCRIPT_DIR/manifest.xml${NC}"
echo -e "    3. Click ${BOLD}Upload${NC}"
echo ""
echo -e "  ${CYAN}To stop the server:${NC}"
echo -e "    ${YELLOW}./stop-addin.sh${NC}"
echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""
