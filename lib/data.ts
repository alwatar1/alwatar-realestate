import { prisma } from './prisma';

export const typeLabels = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  LAND: 'أرض',
  FLOOR: 'دور',
} as const;

export const listingLabels = {
  SALE: 'للبيع',
  RENT: 'للإيجار',
} as const;

export async function getNeighborhoods() {
  return prisma.neighborhood.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });
}

export async function getFeatured() {
  return prisma.property.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      neighborhood: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}