import Link from 'next/link';
import {
  typeLabels,
  listingLabels,
} from '@/lib/data';
export default function PropertyCard({
  p,
}: any) {
  const img =
    p.images?.[0]?.url ||
    '/placeholder.svg';
  return (
    <Link
      href={'/property/' + p.id}
      className="card"
    >
      <div className="thumb">
        <img
          src={img}
          alt={p.title}
        />
        <span className="badge">
          {
            listingLabels[
              p.listingType as keyof typeof listingLabels
            ]
          }
        </span>
      </div>
      <div className="cardbody">
        <div className="muted">
          {
            typeLabels[
              p.propertyType as keyof typeof typeLabels
            ]
          }
          {' · '}
          حي {p.neighborhood?.name}
        </div>
        <div className="price">
          {Number(p.price).toLocaleString('ar-SA')} ريال
        </div>
        <h3>
          {p.title}
        </h3>
        <div className="meta">
          <span>
            {p.area} م²
          </span>
          {p.bedrooms != null && (
            <span>
              {p.bedrooms} غرف
            </span>
          )}
          {p.bathrooms != null && (
            <span>
              {p.bathrooms} حمامات
            </span>
          )}
          <span>
            👁️ {Number(p.views || 0).toLocaleString('ar-SA')}
          </span>
        </div>
      </div>
    </Link>
  );
}