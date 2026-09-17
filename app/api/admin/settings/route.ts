import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

async function getSettings() {
  return prisma.siteSettings.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function GET() {
  try {
    await requireAdmin();

    let settings = await getSettings();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const data = await req.json();

    let existing = await getSettings();

    if (!existing) {
      existing = await prisma.siteSettings.create({
        data: {},
      });
    }

    const settings = await prisma.siteSettings.update({
      where: {
        id: existing.id,
      },
      data: {
        siteName:
          typeof data.siteName === 'string'
            ? data.siteName
            : existing.siteName,

        logoUrl:
          typeof data.logoUrl === 'string'
            ? data.logoUrl
            : existing.logoUrl,

        headline:
          typeof data.headline === 'string'
            ? data.headline
            : existing.headline,

        subheadline:
          typeof data.subheadline === 'string'
            ? data.subheadline
            : existing.subheadline,

        description:
          typeof data.description === 'string'
            ? data.description
            : existing.description,

        heroImageUrl:
          typeof data.heroImageUrl === 'string'
            ? data.heroImageUrl
            : existing.heroImageUrl,

        primaryButtonText:
          typeof data.primaryButtonText === 'string'
            ? data.primaryButtonText
            : existing.primaryButtonText,

        primaryButtonUrl:
          typeof data.primaryButtonUrl === 'string'
            ? data.primaryButtonUrl
            : existing.primaryButtonUrl,

        secondaryButtonText:
          typeof data.secondaryButtonText === 'string'
            ? data.secondaryButtonText
            : existing.secondaryButtonText,

        secondaryButtonUrl:
          typeof data.secondaryButtonUrl === 'string'
            ? data.secondaryButtonUrl
            : existing.secondaryButtonUrl,

        phone:
          typeof data.phone === 'string'
            ? data.phone
            : existing.phone,

        whatsapp:
          typeof data.whatsapp === 'string'
            ? data.whatsapp
            : existing.whatsapp,

        email:
          typeof data.email === 'string'
            ? data.email
            : existing.email,

        address:
          typeof data.address === 'string'
            ? data.address
            : existing.address,

        mapUrl:
          typeof data.mapUrl === 'string'
            ? data.mapUrl
            : existing.mapUrl,

        primaryColor:
          typeof data.primaryColor === 'string'
            ? data.primaryColor
            : existing.primaryColor,

        secondaryColor:
          typeof data.secondaryColor === 'string'
            ? data.secondaryColor
            : existing.secondaryColor,

        showFeatured:
          typeof data.showFeatured === 'boolean'
            ? data.showFeatured
            : existing.showFeatured,

        showNeighborhoods:
          typeof data.showNeighborhoods === 'boolean'
            ? data.showNeighborhoods
            : existing.showNeighborhoods,

        showAbout:
          typeof data.showAbout === 'boolean'
            ? data.showAbout
            : existing.showAbout,

        showContact:
          typeof data.showContact === 'boolean'
            ? data.showContact
            : existing.showContact,

        footerText:
          typeof data.footerText === 'string'
            ? data.footerText
            : existing.footerText,

        instagram:
          typeof data.instagram === 'string'
            ? data.instagram
            : existing.instagram,

        snapchat:
          typeof data.snapchat === 'string'
            ? data.snapchat
            : existing.snapchat,

        tiktok:
          typeof data.tiktok === 'string'
            ? data.tiktok
            : existing.tiktok,
      },
    });

    return NextResponse.json(settings);
  } catch (e: any) {
    console.error('Settings save error:', e);

    return NextResponse.json(
      {
        error:
          e?.message ||
          'حدث خطأ أثناء الحفظ',
      },
      { status: 400 }
    );
  }
}
