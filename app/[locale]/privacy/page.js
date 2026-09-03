import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi',
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: { 'id': `${baseUrl}/id/privacy`, 'en': `${baseUrl}/en/privacy` }
    }
  };
}

export default async function PolicyPage({ params }) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi';

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading title={title} subtitle="Official breeder documentation" />
        <div className="max-w-3xl mx-auto my-12 text-on-surface-variant font-body leading-relaxed space-y-6 text-base">
          <p>
            {locale === 'en' 
              ? 'Aquatic Art operates with rigorous dedication to customer satisfaction, ethical animal handling, and certified packaging protocols.'
              : 'Aquatic Art beroperasi dengan dedikasi penuh pada kepuasan pelanggan, etika penanganan hewan, dan protokol pengemasan terverifikasi.'}
          </p>
        </div>
      </Container>
    </div>
  );
}
