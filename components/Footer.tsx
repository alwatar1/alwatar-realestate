import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer
      className="footer"
      id="contact"
      style={{
        borderTop: '1px solid var(--site-primary)',
      }}
    >
      <div className="container">

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 30,
          }}
        >

          <div>
            <h2 style={{ marginTop: 0 }}>
              {settings.siteName || 'الوتر المعماري'}
            </h2>

            {settings.footerText && (
              <p className="muted">
                {settings.footerText}
              </p>
            )}

            {settings.address && (
              <p>
                📍 {settings.address}
              </p>
            )}
          </div>

          <div>
            <h3>تواصل معنا</h3>

            {settings.phone && (
              <p>
                📞{' '}
                <a href={'tel:' + settings.phone}>
                  {settings.phone}
                </a>
              </p>
            )}

            {settings.whatsapp && (
              <p>
                💬{' '}
                <a
                  href={
                    'https://wa.me/' +
                    settings.whatsapp.replace(/\D/g, '')
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  واتساب
                </a>
              </p>
            )}

            {settings.email && (
              <p>
                ✉️{' '}
                <a
                  href={'mailto:' + settings.email}
                >
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          <div>
            <h3>روابط سريعة</h3>

            <p>
              <Link href="/">الرئيسية</Link>
            </p>

            <p>
              <Link href="/properties">
                العقارات
              </Link>
            </p>

            <p>
              <Link href="/#neighborhoods">
                الأحياء
              </Link>
            </p>

            {settings.mapUrl && (
              <p>
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  📍 موقع المكتب
                </a>
              </p>
            )}
          </div>

          <div>
            <h3>تابعنا</h3>

            {settings.instagram && (
              <p>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </p>
            )}

            {settings.snapchat && (
              <p>
                <a
                  href={settings.snapchat}
                  target="_blank"
                  rel="noreferrer"
                >
                  Snapchat
                </a>
              </p>
            )}

            {settings.tiktok && (
              <p>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noreferrer"
                >
                  TikTok
                </a>
              </p>
            )}
          </div>

        </div>

        <hr
          style={{
            margin: '30px 0 18px',
            borderColor: 'rgba(255,255,255,.15)',
          }}
        />

        <p
          style={{
            margin: 0,
            textAlign: 'center',
          }}
          className="muted"
        >
          © {new Date().getFullYear()} {settings.siteName || 'الوتر المعماري'}
        </p>

      </div>
    </footer>
  );
}