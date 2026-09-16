'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [propertyCount, setPropertyCount] = useState(0);
  const [neighborhoodCount, setNeighborhoodCount] = useState(0);
  const r = useRouter();

  useEffect(() => {
    async function load() {
      const propertiesResponse =
        await fetch('/api/admin/properties');

      if (propertiesResponse.status === 401) {
        return r.push('/admin/login');
      }

      const properties =
        await propertiesResponse.json();

      setPropertyCount(properties.length);

      const neighborhoodsResponse =
        await fetch('/api/admin/neighborhoods');

      const neighborhoods =
        await neighborhoodsResponse.json();

      setNeighborhoodCount(
        neighborhoods.length
      );
    }

    load();
  }, [r]);

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    r.push('/admin/login');
  }

  return (
    <main className="section">
      <div className="container">

        <div
          className="sectionhead"
          style={{
            marginBottom: 30,
          }}
        >
          <div>
            <h1>لوحة التحكم</h1>

            <p className="muted">
              تحكم كامل في موقع الوتر المعماري
            </p>
          </div>

          <button
            className="btn"
            onClick={logout}
          >
            🚪 خروج
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
          }}
        >

          <Link
            href="/admin/properties"
            className="panel"
            style={{
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 36 }}>
              🏠
            </div>

            <h2>إدارة العقارات</h2>

            <p className="muted">
              إضافة وتعديل وحذف العقارات والصور
            </p>

            <strong>
              {propertyCount} عقار
            </strong>
          </Link>

          <Link
            href="/admin/neighborhoods"
            className="panel"
            style={{
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 36 }}>
              🏘️
            </div>

            <h2>إدارة الأحياء</h2>

            <p className="muted">
              إضافة وتعديل وحذف الأحياء
            </p>

            <strong>
              {neighborhoodCount} حي
            </strong>
          </Link>

          <Link
            href="/admin/settings"
            className="panel"
            style={{
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 36 }}>
              🎨
            </div>

            <h2>تخصيص الموقع</h2>

            <p className="muted">
              الشعار، الألوان، الصور، النصوص
              والتواصل
            </p>

            <strong>
              فتح إعدادات الموقع ←
            </strong>
          </Link>

          <Link
            href="/properties"
            target="_blank"
            className="panel"
            style={{
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 36 }}>
              🌐
            </div>

            <h2>عرض الموقع</h2>

            <p className="muted">
              فتح الموقع كما يراه الزوار
            </p>

            <strong>
              فتح الموقع ←
            </strong>
          </Link>

        </div>

        <div
          className="panel"
          style={{
            marginTop: 25,
          }}
        >
          <h2>
            اختصارات سريعة
          </h2>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 15,
            }}
          >
            <Link
              className="btn gold"
              href="/admin/properties/new"
            >
              + إضافة عقار
            </Link>

            <Link
              className="btn"
              href="/admin/neighborhoods"
            >
              🏘️ الأحياء
            </Link>

            <Link
              className="btn"
              href="/admin/settings"
            >
              ⚙️ إعدادات الموقع
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}