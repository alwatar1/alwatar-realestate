import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export default async function Property({
  params,
}: {
  params: { id: string };
}) {
  const existing = await prisma.property.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
    },
  });
  if (!existing) {
    notFound();
  }
  await prisma.property.update({
    where: {
      id: params.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  const p = await prisma.property.findUnique({
    where: {
      id: params.id,
    },
    select: {
      title: true,
      description: true,
      price: true,
      area: true,
      bedrooms: true,
      bathrooms: true,
      propertyType: true,
      listingType: true,
      phone: true,
      whatsapp: true,
      locationNote: true,
      latitude: true,
      longitude: true,
      views: true,
      neighborhood: {
        select: {
          name: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
        select: {
          url: true,
        },
      },
    },
  });
  if (!p) {
    notFound();
  }
  const propertyType =
    p.propertyType === 'APARTMENT'
      ? 'شقة'
      : p.propertyType === 'VILLA'
      ? 'فيلا'
      : p.propertyType === 'LAND'
      ? 'أرض'
      : p.propertyType === 'FLOOR'
      ? 'دور'
      : p.propertyType;
  const listingType =
    p.listingType === 'SALE'
      ? 'للبيع'
      : p.listingType === 'RENT'
      ? 'للإيجار'
      : p.listingType;
  const phone = p.phone || '';
  const whatsappNumber = (
    p.whatsapp || p.phone || ''
  ).replace(/\D/g, '');
  const hasLocation =
    p.latitude !== null &&
    p.longitude !== null;
  const mapUrl = hasLocation
    ? 'https://www.openstreetmap.org/?mlat=' +
      p.latitude +
      '&mlon=' +
      p.longitude +
      '#map=17/' +
      p.latitude +
      '/' +
      p.longitude
    : '';
  const mapEmbedUrl = hasLocation
    ? 'https://www.openstreetmap.org/export/embed.html?bbox=' +
      (p.longitude! - 0.01) +
      '%2C' +
      (p.latitude! - 0.01) +
      '%2C' +
      (p.longitude! + 0.01) +
      '%2C' +
      (p.latitude! + 0.01) +
      '&layer=mapnik&marker=' +
      p.latitude +
      '%2C' +
      p.longitude
    : '';
  return (
    <main className="detail">
      <div className="container">
        <div
          style={{
            marginBottom: 25,
          }}
        >
          <p
            className="muted"
            style={{
              marginBottom: 8,
            }}
          >
            حي {p.neighborhood.name}
          </p>
          <h1
            style={{
              marginBottom: 10,
            }}
          >
            {p.title}
          </h1>
          <div
            className="muted"
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span>{propertyType}</span>
            <span>•</span>
            <span>{listingType}</span>
            <span>•</span>
            <span>
              👁️{' '}
              {p.views.toLocaleString('ar-SA')}
              {' مشاهدة'}
            </span>
          </div>
        </div>
        {p.images.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
              marginBottom: 25,
            }}
          >
            {p.images.map(
              (
                image: { url: string },
                index: number
              ) => (
                <img
                  key={image.url + index}
                  src={image.url}
                  alt={p.title}
                  style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    borderRadius: 16,
                    display: 'block',
                  }}
                />
              )
            )}
          </div>
        )}
        <div
          className="card"
          style={{
            padding: 25,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            <div>
              <div className="muted">
                السعر
              </div>
              <div className="price">
                {p.price.toLocaleString('ar-SA')}
                {' ريال'}
              </div>
            </div>
            <div
              className="badge"
              style={{
                position: 'static',
              }}
            >
              {listingType}
            </div>
          </div>
          <div
            className="meta"
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <span>
              📐 {p.area.toLocaleString('ar-SA')} م²
            </span>
            {p.bedrooms !== null && (
              <span>
                🛏️ {p.bedrooms} غرف
              </span>
            )}
            {p.bathrooms !== null && (
              <span>
                🚿 {p.bathrooms} حمامات
              </span>
            )}
            <span>
              👁️{' '}
              {p.views.toLocaleString('ar-SA')}
              {' مشاهدة'}
            </span>
          </div>
        </div>
        {p.description && (
          <div
            className="card"
            style={{
              padding: 25,
              marginBottom: 20,
            }}
          >
            <h2>وصف العقار</h2>
            <p
              style={{
                lineHeight: 1.9,
                whiteSpace: 'pre-line',
              }}
            >
              {p.description}
            </p>
          </div>
        )}
        {p.locationNote && (
          <div
            className="card"
            style={{
              padding: 25,
              marginBottom: 20,
            }}
          >
            <h2>تفاصيل الموقع</h2>
            <p
              style={{
                lineHeight: 1.9,
              }}
            >
              {p.locationNote}
            </p>
          </div>
        )}
        {hasLocation && (
          <div
            className="card"
            style={{
              padding: 15,
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                padding: '0 10px',
              }}
            >
              📍 موقع العقار
            </h2>
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="420"
              style={{
                border: 0,
                borderRadius: 14,
              }}
              loading="lazy"
              title="موقع العقار على الخريطة"
            />
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{
                display: 'inline-block',
                marginTop: 12,
              }}
            >
              فتح الموقع على الخريطة
            </a>
          </div>
        )}
        {(phone || whatsappNumber) && (
          <div
            className="card"
            style={{
              padding: 25,
              marginBottom: 30,
            }}
          >
            <h2>
              تواصل معنا
            </h2>
            <p className="muted">
              للاستفسار عن هذا العقار والتفاصيل المتاحة.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 15,
              }}
            >
              {phone && (
                <a
                  href={'tel:' + phone}
                  className="btn primary"
                >
                  📞 اتصال
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={
                    'https://wa.me/' +
                    whatsappNumber
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                >
                  💬 واتساب
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}