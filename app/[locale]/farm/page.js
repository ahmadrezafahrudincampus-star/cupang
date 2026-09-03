import Image from 'next/image';
import { getFarmSections } from '@/services/farm';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Our Farm & Breeding Facility' : 'Fasilitas Farm & Budidaya',
    description: locale === 'en'
      ? 'A view into our dedicated aquaculture bio-facility, water preparation, and racks.'
      : 'Melihat fasilitas bio-akuakultur, pengolahan air, dan rak conditioning kami.',
    alternates: {
      canonical: `${baseUrl}/${locale}/farm`,
      languages: { 'id': `${baseUrl}/id/farm`, 'en': `${baseUrl}/en/farm` }
    }
  };
}

export default async function FarmPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const res = await getFarmSections();
  const rawSections = res?.data || [];

  const defaultSections = [
    {
      title: 'Water Preparation & Aging Reservoir',
      description: 'Automated reverse osmosis filtration and Indian almond leaves infusion tanks to maintain optimal pH 6.5 and low TDS conditioning water.',
      image: '/images/dummy/farm/dummy-farm-01.jpg'
    },
    {
      title: 'Individual Flaring & Conditioning Racks',
      description: 'Over 500 individual conditioning jars with visual separation barriers to cultivate full dorsal spread and aggressive flaring stamina.',
      image: '/images/dummy/farm/dummy-farm-02.jpg'
    },
    {
      title: 'Selective Spawning & Live Feed Laboratory',
      description: 'Temperature-controlled nursery tanks and continuous cultures of high-protein live feed including Moina and enriched Baby Brine Shrimp.',
      image: '/images/dummy/farm/dummy-farm-03.jpg'
    }
  ];

  const sections = rawSections.length > 0 ? rawSections : defaultSections;

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.farm.title} 
          subtitle={dict.farm.subtitle} 
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] bg-surface-container">
                  <Image
                    src={section.image || section.storage_path || `/images/dummy/farm/dummy-farm-0${(idx % 3) + 1}.jpg`}
                    alt={section.title}
                    fill
                    className="object-cover opacity-85"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <span className="text-primary font-body text-xs uppercase tracking-widest block mb-2">Section 0{idx + 1}</span>
                  <h3 className="font-display text-xl text-on-surface mb-3">{section.title}</h3>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
