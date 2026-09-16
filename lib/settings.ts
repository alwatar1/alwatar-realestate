import Link from 'next/link';
import { getFeatured, getNeighborhoods } from '@/lib/data';
import { getSiteSettings } from '@/lib/settings';
import PropertyCard from '@/components/PropertyCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featured, neighborhoods, settings] = await Promise.all([
    getFeatured(),
    getNeighborhoods(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: settings.heroImageUrl
            ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${settings.heroImageUrl}")`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">

          {settings.logoUrl && (
            <div style={{ marginBottom: 20 }}>
              <img
                src={settings.logoUrl}
                alt={settings.siteName || 'شعار المكتب'}
                style={{
                  maxWidth: 180,
                  maxHeight: 80,
                  objectFit: 'contain',
                }}
              />
            </div>
          )}

          <h1>{settings.headline}</h1>

          {settings.subheadline && (
            <h2>{settings.subheadline}</h2>
          )}

          {settings.description && (
            <p>{settings.description}</p>
          )}

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            <Link
              href={settings.primaryButtonUrl}
              className="btn gold"
            >
              {settings.primaryButtonText}
            </Link>

            <Link
              href={settings.secondaryButtonUrl}
              className="btn"
            >
              {settings.secondaryButtonText}
            </Link>
          </div>

          <form
            className="search"
            action="/properties"
          >
            <input
              className="field"
              name="q"
              placeholder="ابحث باسم العقار أو الحي"
            />

            <select
              className="field"
              name="type"
            >
              <option value="">كل الأنواع</option>
              <option value="APARTMENT">شقق</option>
              <option value="VILLA">فلل</option>
              <option value="LAND">أراضي</option>
              <option value="FLOOR">أدوار</option>
            </select>

            <select
              className="field"
              name="listing"
            >
              <option value="">بيع وإيجار</option>
              <option value="SALE">للبيع</option>
              <option value="RENT">للإيجار</option>
            </select>

            <button
              className="btn gold"
              type="submit"
            >
              بحث
            </button>
          </form>

        </div>
      </section>

      {settings.showFeatured && (
        <section className="section">
          <div className="container">

            <div className="sectionhead">
              <h2>العقارات المميزة</h2>

              <Link
                className="btn"
                href="/properties"
              >
                عرض الكل
              </Link>
            </div>

            <div className="grid">
              {featured.length > 0 ? (
                featured.map((property) => (
                  <PropertyCard
                    key={property.id}
                    p={property}
                  />
                ))
              ) : (
                <p className="muted">
                  لا توجد عقارات مميزة حاليًا.
                </p>
              )}
            </div>

          </div>
        </section>
      )}

      {settings.showNeighborhoods && (
        <section
          className="section"
          id="neighborhoods"
        >
          <div className="container">

            <div className="sectionhead">
              <h2>تصفح حسب الحي</h2>
            </div>

            <div className="neighborhoods">
              {neighborhoods.length > 0 ? (
                neighborhoods.map((neighborhood) => (
                  <Link
                    className="ncard"
                    href={
                      '/neighborhood/' +
                      neighborhood.slug
                    }
                    key={neighborhood.id}
                  >
                    <b>
                      حي {neighborhood.name}
                    </b>

                    <p className="muted">
                      {neighborhood._count.properties}{' '}
                      عقار
                    </p>
                  </Link>
                ))
              ) : (
                <p className="muted">
                  لا توجد أحياء مضافة حاليًا.
                </p>
              )}
            </div>

          </div>
        </section>
      )}
    </>
  );
}
