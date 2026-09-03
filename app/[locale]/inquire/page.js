import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import InquiryForm from '@/components/forms/InquiryForm';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Direct Specimen Inquiry' : 'Formulir Pertanyaan & Inquire',
    description: locale === 'en'
      ? 'Inquire about available Betta fish specimens, upcoming pairings, or custom requests.'
      : 'Tanyakan ketersediaan spesimen ikan cupang, pemesanan galur khusus, atau indukan.',
    alternates: {
      canonical: `${baseUrl}/${locale}/inquire`,
      languages: { 'id': `${baseUrl}/id/inquire`, 'en': `${baseUrl}/en/inquire` }
    }
  };
}

export default async function InquirePage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  const dict = getDictionary(locale);
  const fishId = sp?.fish;

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading title={dict.inquiry.title} subtitle={dict.inquiry.subtitle} />
        <div className="max-w-2xl mx-auto my-12 bg-surface border border-white/[0.08] p-8 md:p-12">
          <InquiryForm initialFishId={fishId} dict={dict.inquiry} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
