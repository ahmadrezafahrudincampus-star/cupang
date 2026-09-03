import { getFaqs } from '@/services/faqs';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import FAQAccordion from '@/components/content/FAQAccordion';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Frequently Asked Questions' : 'Pertanyaan Umum (FAQ)',
    description: locale === 'en'
      ? 'Learn about our specimen packaging, DOA live guarantees, and care recommendations.'
      : 'Pelajari sistem pengemasan spesimen, garansi ikan hidup (DOA), dan rekomendasi perawatan.',
    alternates: {
      canonical: `${baseUrl}/${locale}/faq`,
      languages: { 'id': `${baseUrl}/id/faq`, 'en': `${baseUrl}/en/faq` }
    }
  };
}

export default async function FAQPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const res = await getFaqs();
  const faqs = res?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.faq.title} 
          subtitle={dict.faq.subtitle}
        />

        <div className="max-w-3xl mx-auto my-12">
          {faqs.length > 0 ? (
            <FAQAccordion items={faqs} />
          ) : (
            <div className="space-y-6">
              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="font-display text-xl text-on-surface mb-2">{dict.faq.q1}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed">{dict.faq.a1}</p>
              </div>
              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="font-display text-xl text-on-surface mb-2">{dict.faq.q2}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed">{dict.faq.a2}</p>
              </div>
              <div className="border-b border-white/[0.08] pb-6">
                <h3 className="font-display text-xl text-on-surface mb-2">{dict.faq.q3}</h3>
                <p className="text-on-surface-variant font-body leading-relaxed">{dict.faq.a3}</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
