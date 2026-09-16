import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const d = await req.json();

    const p = await prisma.property.create({
      data: {
        title: d.title,
        description: d.description,

        price: Number(d.price),
        area: Number(d.area),

        bedrooms:
          d.bedrooms === ''
            ? null
            : Number(d.bedrooms),

        bathrooms:
          d.bathrooms === ''
            ? null
            : Number(d.bathrooms),

        propertyType: d.propertyType,
        listingType: d.listingType,

        featured: !!d.featured,

        // بيانات التواصل التي تظهر للزائر
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,

        // بيانات خاصة بالإدارة
        advertiserName: d.advertiserName || null,
        ownerName: d.ownerName || null,
        ownerPhone: d.ownerPhone || null,

        // الموقع
        locationNote: d.locationNote || null,

        latitude:
          d.latitude === '' ||
          d.latitude === null ||
          d.latitude === undefined
            ? null
            : Number(d.latitude),

        longitude:
          d.longitude === '' ||
          d.longitude === null ||
          d.longitude === undefined
            ? null
            : Number(d.longitude),

        // المشاهدات تبدأ من صفر
        views: 0,

        neighborhoodId: d.neighborhoodId,

        images: {
          create: (d.images || []).map(
            (url: string, i: number) => ({
              url,
              sortOrder: i,
            })
          ),
        },
      },
    });

    return NextResponse.json(p);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const properties =
      await prisma.property.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          neighborhood: true,
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }
}