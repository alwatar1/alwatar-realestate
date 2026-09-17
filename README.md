# منصة الوتر المعماري

منصة عقارية عربية RTL مبنية بـ Next.js وPrisma وPostgreSQL. تدعم العقارات (شقق، فلل، أراضٍ وأدوار)، البيع والإيجار، الأحياء، لوحة تحكم المدير، إعدادات الموقع ورفع الصور عبر Cloudinary.

## التشغيل المحلي

1. أنشئ قاعدة PostgreSQL جديدة.
2. انسخ `.env.example` إلى `.env` وضع رابط PostgreSQL في `DATABASE_URL`.
3. نفّذ:

```bash
npm install
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

لإنشاء migration جديدة أثناء التطوير استخدم `npm run db:migrate`، وللدفع السريع في بيئة تجريبية يمكن استخدام `npm run db:push`.

## متغيرات البيئة

- `DATABASE_URL`: رابط PostgreSQL، ويجب أن يتضمن `?sslmode=require` عند استخدام مزود سحابي.
- `JWT_SECRET`: قيمة عشوائية طويلة.
- `ADMIN_EMAIL` و`ADMIN_PASSWORD`: بيانات المدير التي ينشئها seed.
- `CLOUDINARY_CLOUD_NAME` و`CLOUDINARY_API_KEY` و`CLOUDINARY_API_SECRET`: مطلوبة لرفع الصور في الإنتاج.

## النشر على Vercel

اربط المستودع في Vercel، ثم أضف متغيرات البيئة السابقة لبيئات Production وPreview وDevelopment حسب الحاجة. استخدم أمر البناء `npm run build`. نفّذ migration مرة واحدة بعد إنشاء قاعدة البيانات عبر `npx prisma migrate deploy` باستخدام `DATABASE_URL`، ثم نفّذ `npm run db:seed` لإنشاء المدير والأحياء والإعدادات الأولية.

لا تحفظ الصور المرفوعة في `public/uploads` على Vercel؛ نظام الرفع الحالي يستخدم Cloudinary، وهو التخزين المناسب للملفات الدائمة في بيئة Vercel عديمة الحالة.
