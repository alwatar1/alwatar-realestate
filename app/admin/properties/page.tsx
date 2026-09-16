'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProperties() {
  const [ps, setPs] = useState<any[]>([]);
  const [n, setN] = useState<any[]>([]);
  const r = useRouter();

  async function load() {
    const a = await fetch('/api/admin/properties');

    if (a.status === 401) {
      return r.push('/admin');
    }

    setPs(await a.json());

    const neighborhoodsResponse =
      await fetch('/api/admin/neighborhoods');

    setN(await neighborhoodsResponse.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id: string) {
    if (!confirm('حذف العقار؟')) return;

    await fetch(
      '/api/admin/properties/' + id,
      {
        method: 'DELETE',
      }
    );

    load();
  }

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    r.push('/admin');
  }

  return (
    <main className="section">
      <div className="container">

        <div className="sectionhead">
          <div>
            <h1>لوحة التحكم</h1>

            <p className="muted">
              إدارة العقارات والأحياء والموقع
            </p>
          </div>

          <button
            className="btn"
            onClick={logout}
          >
            خروج
          </button>
        </div>

        <div
          className="panel"
          style={{
            marginBottom: 25,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            إدارة الموقع
          </h2>

          <p className="muted">
            من هنا تتحكم في شكل ومحتوى الموقع بالكامل.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 18,
            }}
          >
            <Link
              className="btn gold"
              href="/admin/settings"
            >
              ⚙️ تخصيص الواجهة
            </Link>

            <Link
              className="btn"
              href="/admin/neighborhoods"
            >
              🏘️ إدارة الأحياء ({n.length})
            </Link>

            <Link
              className="btn"
              href="/admin/properties/new"
            >
              🏠 إضافة عقار
            </Link>
          </div>
        </div>

        <div className="panel">

          <h2 style={{ marginTop: 0 }}>
            العقارات
          </h2>

          <table className="table">

            <thead>
              <tr>
                <th>العقار</th>
                <th>الحي</th>
                <th>السعر</th>
                <th>النوع</th>
                <th>المعلن</th>
                <th>المالك</th>
                <th>رقم المالك</th>
                <th>المشاهدات</th>
                <th>إجراء</th>
              </tr>
            </thead>

            <tbody>

              {ps.map((p) => (
                <tr key={p.id}>

                  <td>{p.title}</td>

                  <td>
                    {p.neighborhood?.name || '-'}
                  </td>

                  <td>
                    {Number(
                      p.price
                    ).toLocaleString('ar-SA')}
                  </td>

                  <td>
                    {p.propertyType === 'APARTMENT'
                      ? 'شقة'
                      : p.propertyType === 'VILLA'
                      ? 'فيلا'
                      : p.propertyType === 'LAND'
                      ? 'أرض'
                      : p.propertyType === 'FLOOR'
                      ? 'دور'
                      : p.propertyType}
                  </td>

                  <td>
                    {p.advertiserName || '-'}
                  </td>

                  <td>
                    {p.ownerName || '-'}
                  </td>

                  <td>
                    {p.ownerPhone || '-'}
                  </td>

                  <td>
                    👁️{' '}
                    {Number(
                      p.views || 0
                    ).toLocaleString('ar-SA')}
                  </td>

                  <td>

                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >

                      <Link
                        className="btn"
                        href={
                          '/admin/properties/' +
                          p.id
                        }
                      >
                        تعديل
                      </Link>

                      <Link
                        className="btn"
                        href={
                          '/property/' +
                          p.id
                        }
                        target="_blank"
                      >
                        🌐 فتح
                      </Link>

                      <button
                        className="btn"
                        onClick={() =>
                          del(p.id)
                        }
                      >
                        حذف
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}