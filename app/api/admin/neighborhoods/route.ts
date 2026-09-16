import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    return NextResponse.json(neighborhoods);
  } catch {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const d = await req.json();

    const slug =
      d.slug ||
      d.name.trim().replaceAll(' ', '-');

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: d.name,
        slug,
        city: d.city || 'الرياض',
        description: d.description || null,
      },
    });

    return NextResponse.json(neighborhood);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
