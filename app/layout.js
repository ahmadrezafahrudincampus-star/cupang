import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Aquatic Art',
    default: 'AQUATIC ART — Premium Betta Fish Portfolio & Breeding Heritage',
  },
  description: 'Premium Betta Fish breeding brand, selective genetics, authentic bloodline catalog, and master breeder portfolio.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    siteName: 'Aquatic Art Betta Heritage',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html className={`${bodoni.variable} ${hanken.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
