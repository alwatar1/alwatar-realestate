import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      name: 'المالك',
    },
  });

  const names = [
    'الرمال',
    'النرجس',
    'الياسمين',
    'الملقا',
    'العارض',
    'الندى',
    'حطين',
    'الصحافة',
  ];

  for (const name of names) {
    const slug = name.replaceAll(' ', '-');

    await prisma.neighborhood.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        city: 'الرياض',
      },
    });
  }

  const settings = await prisma.siteSettings.findFirst();

  if (settings) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        siteName: 'الوتر المعماري',
        headline: 'عقارك يبدأ من هنا',
        primaryButtonText: 'تصفح العقارات',
        primaryButtonUrl: '/properties',
        secondaryButtonText: 'تواصل معنا',
        secondaryButtonUrl: '#contact',
      },
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        siteName: 'الوتر المعماري',
        headline: 'عقارك يبدأ من هنا',
        primaryButtonText: 'تصفح العقارات',
        primaryButtonUrl: '/properties',
        secondaryButtonText: 'تواصل معنا',
        secondaryButtonUrl: '#contact',
      },
    });
  }

  const n = await prisma.neighborhood.findUnique({
    where: { slug: 'الرمال' },
  });

  if (n && (await prisma.property.count()) === 0) {
    await prisma.property.create({
      data: {
        title: 'شقة فاخرة في حي الرمال',
        description:
          'شقة عصرية بتشطيب راقٍ، مناسبة للسكن العائلي وقريبة من الخدمات الرئيسية.',
        price: 650000,
        area: 180,
        bedrooms: 3,
        bathrooms: 3,
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        featured: true,
        phone: process.env.NEXT_PUBLIC_SITE_PHONE || '0500000000',
        whatsapp: process.env.NEXT_PUBLIC_SITE_PHONE || '0500000000',
        neighborhoodId: n.id,
        images: {
          create: [
            {
              url: '/placeholder.svg',
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });