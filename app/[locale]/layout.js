import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
