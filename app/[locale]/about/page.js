import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import { getDictionary } from '@/lib/i18n/dictionaries';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Our Story & Breeder Heritage' : 'Kisah & Warisan Pemuliaan Kami',
    description: locale === 'en'
      ? 'Learn about our selective Betta breeding philosophy, history, and international standards.'
      : 'Pelajari filosofi pemuliaan cupang selektif, sejarah galur, dan standar kontes kami.',
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: { 'id': `${baseUrl}/id/about`, 'en': `${baseUrl}/en/about` }
    }
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading title={dict.story.title} subtitle={dict.story.tag} />

        <div className="max-w-4xl mx-auto my-12 text-on-surface-variant leading-relaxed space-y-8 font-body text-base md:text-lg">
          <p>{dict.story.p1}</p>
          <p>{dict.story.p2}</p>
          
          <div className="border-y border-white/[0.08] py-8 my-12 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-2xl text-on-surface mb-3">Lineage Integrity</h3>
              <p className="text-sm">We document parentage records across multiple generations to stabilize color traits and ray count.</p>
            </div>
            <div>
              <h3 className="font-display text-2xl text-on-surface mb-3">Individual Conditioning</h3>
              <p className="text-sm">Every adult specimen receives tailored live nutrition, acoustic isolation, and dedicated parameter monitoring.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
