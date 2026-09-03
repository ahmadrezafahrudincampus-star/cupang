import { getGalleryItems } from '@/services/gallery';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import GalleryGrid from '@/components/media/GalleryGrid';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Visual Photography Gallery' : 'Galeri Fotografi Spesimen',
    description: locale === 'en'
      ? 'Authentic high-resolution macro photography of our Betta specimens.'
      : 'Fotografi makro otentik beresolusi tinggi spesimen ikan cupang kami.',
    alternates: {
      canonical: `${baseUrl}/${locale}/gallery`,
      languages: { 'id': `${baseUrl}/id/gallery`, 'en': `${baseUrl}/en/gallery` }
    }
  };
}

export default async function GalleryPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const itemsRes = await getGalleryItems();
  const items = itemsRes?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.nav.gallery} 
          subtitle="Authentic macro photography from our studio"
        />

        <div className="my-12">
          {/* GalleryGrid handles real items from Supabase or the 8 curated demo photography plates seamlessly */}
          <GalleryGrid items={items} />
        </div>
      </Container>
    </div>
  );
}
