import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'الوتر المعماري',
  description:
    'الوتر المعماري - مكتب متخصص في التسويق والخدمات العقارية',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Language" content="ar" />
      </head>
      <body
        style={
          {
            '--site-primary':
              settings.primaryColor || '#B8954A',
            '--site-secondary':
              settings.secondaryColor || '#111111',
          } as React.CSSProperties
        }
      >
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
