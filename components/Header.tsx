import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="nav">
      <div className="navin">

        <Link href="/" className="logo">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName || 'شعار المكتب'}
              style={{
                maxWidth: 150,
                maxHeight: 55,
                objectFit: 'contain',
              }}
            />
          ) : (
            <>
              {settings.siteName || 'الوتر المعماري'}
            </>
          )}
        </Link>

        <nav className="links">
          <Link href="/">الرئيسية</Link>
          <Link href="/properties">العقارات</Link>
          <Link href="/#neighborhoods">الأحياء</Link>
          <Link href="/admin/login">إدارة الموقع</Link>
        </nav>

        <Link
          href={settings.primaryButtonUrl || '/properties'}
          className="btn gold"
        >
          {settings.primaryButtonText || 'تصفح العقارات'}
        </Link>

      </div>
    </header>
  );
}