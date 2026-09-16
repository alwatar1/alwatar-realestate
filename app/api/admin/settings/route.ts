import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    let settings = await prisma.siteSettings.findFirst();

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

    const existing = await prisma.siteSettings.findFirst();

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data: {
            siteName: data.siteName,
            logoUrl: data.logoUrl || null,
            headline: data.headline,
            subheadline: data.subheadline || null,
            description: data.description || null,
            heroImageUrl: data.heroImageUrl || null,
            primaryButtonText: data.primaryButtonText,
            primaryButtonUrl: data.primaryButtonUrl,
            secondaryButtonText: data.secondaryButtonText,
            secondaryButtonUrl: data.secondaryButtonUrl,
            phone: data.phone || null,
            whatsapp: data.whatsapp || null,
            email: data.email || null,
            address: data.address || null,
            mapUrl: data.mapUrl || null,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            showFeatured: Boolean(data.showFeatured),
            showNeighborhoods: Boolean(data.showNeighborhoods),
            showAbout: Boolean(data.showAbout),
            showContact: Boolean(data.showContact),
            footerText: data.footerText || null,
            instagram: data.instagram || null,
            snapchat: data.snapchat || null,
            tiktok: data.tiktok || null,
          },
        })
      : await prisma.siteSettings.create({
          data: {
            siteName: data.siteName || 'الوتر المعماري',
            logoUrl: data.logoUrl || null,
            headline: data.headline || 'عقارك يبدأ من هنا',
            subheadline: data.subheadline || null,
            description: data.description || null,
            heroImageUrl: data.heroImageUrl || null,
            primaryButtonText: data.primaryButtonText || 'تصفح العقارات',
            primaryButtonUrl: data.primaryButtonUrl || '/properties',
            secondaryButtonText:
              data.secondaryButtonText || 'تواصل معنا',
            secondaryButtonUrl:
              data.secondaryButtonUrl || '#contact',
            phone: data.phone || null,
            whatsapp: data.whatsapp || null,
            email: data.email || null,
            address: data.address || null,
            mapUrl: data.mapUrl || null,
            primaryColor: data.primaryColor || '#b8954a',
            secondaryColor: data.secondaryColor || '#111111',
            showFeatured: data.showFeatured !== false,
            showNeighborhoods: data.showNeighborhoods !== false,
            showAbout: data.showAbout !== false,
            showContact: data.showContact !== false,
            footerText: data.footerText || null,
            instagram: data.instagram || null,
            snapchat: data.snapchat || null,
            tiktok: data.tiktok || null,
          },
        });

    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'حدث خطأ أثناء الحفظ' },
      { status: 400 }
    );
  }
}
