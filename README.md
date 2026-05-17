# 📚 صفّي التفاعلي — Interactive Classroom Points

نظام احترافي لإدارة نقاط الطلاب وتحفيزهم مباشرة من داخل Microsoft PowerPoint.

## المميزات
- **إدارة الصفوف:** إنشاء وتعديل وحذف الفصول الدراسية.
- **إدارة الطلاب:** إضافة الطلاب وتخصيص رموز (أفاتار) ملونة.
- **نظام النقاط:** منح نقاط إيجابية ونقاط للتحسين مع أسباب مخصصة.
- **نظام الشارات:** مكافأة التميز بشارات تعليمية جذابة.
- **تقارير ذكية:** توليد تقارير أداء وإدراجها مباشرة في شرائح PowerPoint.
- **تصميم عربي أصيل:** واجهة مستخدم RTL بالكامل مع خطوط "Cairo" و "Tajawal".

## المتطلبات التقنية
- Node.js (Version 16 or later)
- Microsoft PowerPoint (Office 365 or 2019+)
- macOS 10.15+ (Catalina or later)

---

## 🚀 التثبيت السريع (macOS)

### الطريقة 1: التثبيت التلقائي
```bash
# 1. افتح Terminal وانتقل إلى مجلد المشروع
cd /path/to/classdojoapptest1

# 2. شغّل سكريبت التثبيت
chmod +x install-mac.sh
./install-mac.sh
```

### الطريقة 2: التثبيت اليدوي

#### الخطوة 1: تثبيت الاعتمادات
```bash
npm install
```

#### الخطوة 2: تشغيل خادم HTTPS
```bash
npm run dev
```
> سيتم تشغيل الخادم على `https://localhost:3001`

#### الخطوة 3: تحميل الإضافة في PowerPoint
1. افتح **Microsoft PowerPoint**
2. أنشئ عرضاً جديداً أو افتح عرضاً موجوداً
3. انتقل إلى تبويب **Insert** (إدراج)
4. اضغط على **My Add-ins** أو **Get Add-ins**
5. اختر تبويب **MY ADD-INS** في الأعلى
6. اضغط على **Upload My Add-in**
7. استعرض واختر ملف `manifest.xml` من مجلد المشروع
8. اضغط **Upload**
9. سيظهر تبويب **Classroom** جديد في شريط الأدوات!

---

## 📋 الاستخدام اليومي

### بدء التشغيل
```bash
./start-addin.sh
```
> يشغّل الخادم ويفتح PowerPoint تلقائياً

### إيقاف الخادم
```bash
./stop-addin.sh
```

---

## كيفية تجربة التطبيق
1. بمجرد فتح الإضافة، سيتم تحميل بيانات تجريبية (Seed Data) تلقائياً.
2. انتقل إلى قسم **النقاط** لتجربة منح الطلاب نقاطاً.
3. انتقل إلى قسم **التقارير** واضغط على "إدراج في PowerPoint" لمشاهدة التكامل مع الشرائح.
4. يمكنك مسح البيانات من الإعدادات للبدء من جديد.

## الهيكل التقني
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (RTL Configured)
- **Integration:** Office.js API
- **Icons:** Lucide React
- **HTTPS:** Vite Basic SSL Plugin (self-signed certificate)
- **Persistence:** LocalStorage (Service Layer ready for Firebase)

---
تم التطوير بواسطة **Antigravity** كجزء من مشروع الأدوات التعليمية المبتكرة.
