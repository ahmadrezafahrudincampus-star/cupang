import { getSiteSettings } from '@/services/settings';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import InquiryForm from '@/components/forms/InquiryForm';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Contact Breeder' : 'Kontak Kami',
    description: locale === 'en'
      ? 'Get in touch with our master breeder for inquiries, consultations, or facility appointments.'
      : 'Hubungi master breeder kami untuk pemesanan, konsultasi genetik, atau kunjungan farm.',
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: { 'id': `${baseUrl}/id/contact`, 'en': `${baseUrl}/en/contact` }
    }
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const settingsRes = await getSiteSettings();
  const settings = settingsRes?.data || {};

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading title={dict.contact.title} subtitle={dict.contact.subtitle} />

        <div className="grid md:grid-cols-12 gap-12 my-12">
          {/* Info Side */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="bg-surface border border-white/[0.08] p-8">
              <h3 className="font-display text-xl text-primary mb-3">{dict.contact.hours}</h3>
              <p className="text-on-surface-variant text-sm mb-6">{dict.contact.hoursVal}</p>

              <h3 className="font-display text-xl text-primary mb-3">{dict.contact.area}</h3>
              <p className="text-on-surface-variant text-sm">{dict.contact.areaVal}</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-7 bg-surface border border-white/[0.08] p-8 md:p-12">
            <InquiryForm dict={dict.inquiry} locale={locale} />
          </div>
        </div>
      </Container>
    </div>
  );
}
