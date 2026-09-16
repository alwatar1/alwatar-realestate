import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';
export default async function Neighborhood({
  params,
}: {
  params: { slug: string };
}) {
  const value = decodeURIComponent(params.slug);
  const neighborhood = await prisma.neighborhood.findFirst({
    where: {
      OR: [
        {
          slug: value,
        },
        {
          id: value,
        },
        {
          name: value,
        },
      ],
    },
    include: {
      properties: {
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
      },
    },
  });
  if (!neighborhood) {
    notFound();
  }
  return (
    <main className="section">
      <div className="container">
        <h1>
          عقارات حي {neighborhood.name}
        </h1>
        <p className="muted">
          {neighborhood.description ||
            'استعرض العقارات المتاحة في حي ' +
              neighborhood.name +
              ' بمدينة ' +
              neighborhood.city +
              '.'}
        </p>
        {neighborhood.properties.length === 0 ? (
          <div
            className="panel"
            style={{ marginTop: 25 }}
          >
            لا توجد عقارات معروضة حاليًا في هذا الحي.
          </div>
        ) : (
          <div
            className="grid"
            style={{ marginTop: 25 }}
          >
            {neighborhood.properties.map(
              (property) => (
                <PropertyCard
                  key={property.id}
                  p={property}
                />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}