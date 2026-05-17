import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Use Office Add-in dev certs if available, otherwise fall back to basic-ssl
const certsDir = path.join(process.env.HOME || '', '.office-addin-dev-certs')
const hasCerts = fs.existsSync(path.join(certsDir, 'localhost.crt'))

// Determine if we're in production build mode
const isProduction = process.env.NODE_ENV === 'production'

// Load certs only in dev mode
const httpsConfig = !isProduction && hasCerts
  ? {
      key: fs.readFileSync(path.join(certsDir, 'localhost.key')),
      cert: fs.readFileSync(path.join(certsDir, 'localhost.crt')),
      ca: fs.readFileSync(path.join(certsDir, 'ca.crt')),
    }
  : true

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3001,
    https: httpsConfig,
    host: true,
  },
  base: './',
})
