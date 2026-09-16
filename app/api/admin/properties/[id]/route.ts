import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const d = await req.json();

    await prisma.propertyImage.deleteMany({
      where: {
        propertyId: params.id,
      },
    });

    const p = await prisma.property.update({
      where: {
        id: params.id,
      },

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
        advertiserName:
          d.advertiserName || null,

        ownerName:
          d.ownerName || null,

        ownerPhone:
          d.ownerPhone || null,

        // الموقع
        locationNote:
          d.locationNote || null,

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

        // لا نعدل views هنا
        // حتى لا تصفر المشاهدات عند تعديل العقار

        neighborhoodId:
          d.neighborhoodId,

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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.property.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }
}