'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPropertyForm({
  initial,
  neighborhoods,
}: {
  initial?: any;
  neighborhoods: any[];
}) {
  const [d, setD] = useState<any>({
    title: '',
    description: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    featured: false,
    phone: '',
    whatsapp: '',
    locationNote: '',
    advertiserName: '',
    ownerName: '',
    ownerPhone: '',
    latitude: '',
    longitude: '',
    neighborhoodId: neighborhoods[0]?.id || '',
    ...initial,
    images: initial?.images?.map((x: any) => x.url) || [],
  });

  const [busy, setBusy] = useState(false);
  const r = useRouter();

  const set = (k: string, v: any) => {
    setD((x: any) => ({
      ...x,
      [k]: v,
    }));
  };

  async function upload(e: any) {
    const files = [...e.target.files];

    if (!files.length) return;

    const f = new FormData();

    files.forEach((x: any) => {
      f.append('files', x);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: f,
    });

    const j = await res.json();

    if (!res.ok) {
      alert(j.error || 'فشل رفع الصور');
      return;
    }

    set('images', [...d.images, ...j.urls]);
  }

  async function save(e: any) {
    e.preventDefault();
    setBusy(true);

    const url = initial
      ? '/api/admin/properties/' + initial.id
      : '/api/admin/properties';

    const res = await fetch(url, {
      method: initial ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(d),
    });

    if (res.ok) {
      r.push('/admin/properties');
    } else {
      const j = await res.json();
      alert(j.error || 'حدث خطأ');
    }

    setBusy(false);
  }

  return (
    <form onSubmit={save}>
      <div className="formgrid">

        <label>
          عنوان العقار
          <input
            required
            className="field"
            style={{ width: '100%' }}
            value={d.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </label>

        <label>
          الحي
          <select
            className="field"
            style={{ width: '100%' }}
            value={d.neighborhoodId}
            onChange={(e) => set('neighborhoodId', e.target.value)}
          >
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          السعر
          <input
            required
            type="number"
            className="field"
            style={{ width: '100%' }}
            value={d.price}
            onChange={(e) => set('price', e.target.value)}
          />
        </label>

        <label>
          المساحة م²
          <input
            required
            type="number"
            className="field"
            style={{ width: '100%' }}
            value={d.area}
            onChange={(e) => set('area', e.target.value)}
          />
        </label>

        <label>
          نوع العقار
          <select
            className="field"
            style={{ width: '100%' }}
            value={d.propertyType}
            onChange={(e) => set('propertyType', e.target.value)}
          >
            <option value="APARTMENT">شقة</option>
            <option value="VILLA">فيلا</option>
            <option value="LAND">أرض</option>
            <option value="FLOOR">دور</option>
          </select>
        </label>

        <label>
          الغرض
          <select
            className="field"
            style={{ width: '100%' }}
            value={d.listingType}
            onChange={(e) => set('listingType', e.target.value)}
          >
            <option value="SALE">للبيع</option>
            <option value="RENT">للإيجار</option>
          </select>
        </label>

        <label>
          عدد الغرف
          <input
            type="number"
            className="field"
            style={{ width: '100%' }}
            value={d.bedrooms}
            onChange={(e) => set('bedrooms', e.target.value)}
          />
        </label>

        <label>
          دورات المياه
          <input
            type="number"
            className="field"
            style={{ width: '100%' }}
            value={d.bathrooms}
            onChange={(e) => set('bathrooms', e.target.value)}
          />
        </label>

        <label>
          عن طريق المعلن
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.advertiserName || ''}
            onChange={(e) =>
              set('advertiserName', e.target.value)
            }
          />
        </label>

        <label>
          اسم المالك
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.ownerName || ''}
            onChange={(e) =>
              set('ownerName', e.target.value)
            }
          />
        </label>

        <label>
          رقم المالك
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.ownerPhone || ''}
            onChange={(e) =>
              set('ownerPhone', e.target.value)
            }
          />
        </label>

        <label>
          رقم التواصل للزائر
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.phone || ''}
            onChange={(e) =>
              set('phone', e.target.value)
            }
          />
        </label>

        <label>
          واتساب للزائر
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.whatsapp || ''}
            onChange={(e) =>
              set('whatsapp', e.target.value)
            }
          />
        </label>

        <label>
          خط العرض Latitude
          <input
            type="number"
            step="any"
            className="field"
            style={{ width: '100%' }}
            value={d.latitude ?? ''}
            onChange={(e) =>
              set('latitude', e.target.value)
            }
            placeholder="مثال: 24.7136"
          />
        </label>

        <label>
          خط الطول Longitude
          <input
            type="number"
            step="any"
            className="field"
            style={{ width: '100%' }}
            value={d.longitude ?? ''}
            onChange={(e) =>
              set('longitude', e.target.value)
            }
            placeholder="مثال: 46.6753"
          />
        </label>

        <label className="full">
          الوصف
          <textarea
            required
            className="field"
            style={{
              width: '100%',
              minHeight: 140,
            }}
            value={d.description}
            onChange={(e) =>
              set('description', e.target.value)
            }
          />
        </label>

        <label className="full">
          ملاحظات الموقع
          <input
            className="field"
            style={{ width: '100%' }}
            value={d.locationNote || ''}
            onChange={(e) =>
              set('locationNote', e.target.value)
            }
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={d.featured}
            onChange={(e) =>
              set('featured', e.target.checked)
            }
          />
          {' '}عقار مميز
        </label>

        <div className="full upload">
          <b>صور العقار</b>

          <p className="muted">
            ارفع عدة صور، ثم يمكنك حذفها.
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={upload}
          />

          <div className="thumbs">
            {d.images.map((x: string, i: number) => (
              <div
                key={x + i}
                style={{
                  position: 'relative',
                }}
              >
                <img
                  className="thumbsmall"
                  src={x}
                  alt="صورة العقار"
                />

                <button
                  type="button"
                  className="btn"
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    padding: '2px 6px',
                  }}
                  onClick={() =>
                    set(
                      'images',
                      d.images.filter(
                        (_: any, j: number) => j !== i
                      )
                    )
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          disabled={busy}
          className="btn primary"
        >
          {busy ? 'جارٍ الحفظ...' : 'حفظ العقار'}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() =>
            r.push('/admin/properties')
          }
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}