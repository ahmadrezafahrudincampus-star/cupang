import Image from 'next/image';
import { getBreedingStages } from '@/services/breeding';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import Timeline from '@/components/content/Timeline';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Selective Breeding Methodology' : 'Metodologi Pemuliaan Cupang',
    description: locale === 'en'
      ? 'Step-by-step genetic selection, conditioning, and fry rearing methodology.'
      : 'Tahapan seleksi genetik, pengondisian indukan, dan perawatan burayak cupang.',
    alternates: {
      canonical: `${baseUrl}/${locale}/breeding`,
      languages: { 'id': `${baseUrl}/id/breeding`, 'en': `${baseUrl}/en/breeding` }
    }
  };
}

export default async function BreedingPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const res = await getBreedingStages();
  const stages = res?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.breeding.title} 
          subtitle={dict.breeding.subtitle} 
        />

        <div className="max-w-3xl mx-auto my-12 text-on-surface-variant leading-relaxed space-y-6 font-body text-base md:text-lg">
          <p>{dict.breeding.intro}</p>
        </div>

        {stages.length > 0 ? (
          <div className="my-16">
            <Timeline items={stages} locale={locale} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 my-16">
            <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-surface-container">
                <Image
                  src="/images/dummy/breeding/dummy-breeding-01.jpg"
                  alt="Stage 01 Selection"
                  fill
                  className="object-cover opacity-85"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">Stage 01</span>
                <h3 className="font-display text-xl text-on-surface mb-3">{dict.breeding.stage1Title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{dict.breeding.stage1Desc}</p>
              </div>
            </div>

            <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-surface-container">
                <Image
                  src="/images/dummy/breeding/dummy-breeding-02.jpg"
                  alt="Stage 02 Conditioning"
                  fill
                  className="object-cover opacity-85"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">Stage 02</span>
                <h3 className="font-display text-xl text-on-surface mb-3">{dict.breeding.stage2Title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{dict.breeding.stage2Desc}</p>
              </div>
            </div>

            <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-surface-container">
                <Image
                  src="/images/dummy/breeding/dummy-breeding-03.jpg"
                  alt="Stage 03 Grading"
                  fill
                  className="object-cover opacity-85"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">Stage 03</span>
                <h3 className="font-display text-xl text-on-surface mb-3">{dict.breeding.stage3Title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{dict.breeding.stage3Desc}</p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
