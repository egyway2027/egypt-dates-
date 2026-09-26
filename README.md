# نظام شركة تمور مصر للتجارة - ERP & Payroll System

نظام محاسبي وإداري سحابي متكامل لإدارة الرواتب، ورديات عمال المصنع، ومستخلصات المقاولين الزراعيين، مطور وفق أحدث المعايير البرمجية.

## التقنيات المستخدمة (Tech Stack)
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS (Dark/Light mode, RTL Support)
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** Zustand
- **Architecture:** Modular Clean Architecture (Domain-Driven Design)

## هيكل المجلدات والملفات
```text
src/
├── app/                  # مسارات وواجهات النظام (Dashboard, Payroll, etc.)
├── components/           # مكونات الواجهة (Header, Sidebar, KpiCard, etc.)
├── core/                 # محركات الحسابات المحاسبية البحتة (Pure Engines)
│   ├── payroll/          # أجر اليوم، الإضافي، خصم الغياب، صافي الراتب
│   ├── loans/            # جدول سداد السلف والأقساط
│   ├── leaves/           # نظام دورات الإجازات (23/7)
│   └── operations/       # عمالة المصنع والمقاولين والمحجوزات
├── stores/               # إدارة حالة القائمة الجانبية
└── types/                # تعريف أنواع وهياكل البيانات
```

## خطوات التشغيل المحلي
1. تثبيت الحزم:
   ```bash
   npm install
   ```
2. تهيئة قاعدة البيانات:
   ```bash
   npx prisma db push
   ```
3. تشغيل خادم التطوير:
   ```bash
   npm run dev
   ```
4. افتح المتصفح على: `http://localhost:3000`
