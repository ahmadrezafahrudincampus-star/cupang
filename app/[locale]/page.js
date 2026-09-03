import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedFish } from '@/services/fish';
import { getPublishedTestimonials } from '@/services/testimonials';
import { getRecentPosts } from '@/services/journal';
import { getBreedingStages } from '@/services/breeding';
import { getFarmSections } from '@/services/farm';
import { getSiteSettings } from '@/services/settings';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import FishGrid from '@/components/fish/FishGrid';
import TestimonialCard from '@/components/content/TestimonialCard';
import JournalCard from '@/components/content/JournalCard';
import Timeline from '@/components/content/Timeline';
import Metric from '@/components/content/Metric';
import ScrollReveal from '@/components/ui/ScrollReveal';

const demoFish = [
  {
    "id": "demo-1",
    "fish_code": "BT-2026-001",
    "name": "Galaxy Koi Plakat",
    "slug": "galaxy-koi-plakat",
    "type": "Plakat HMPK",
    "gender": "Male",
    "grade": "Show Grade",
    "price": 1500000,
    "currency": "IDR",
    "status": "available",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-01.jpg",
        "alt_text": "Galaxy Koi Plakat"
      }
    ],
    "description": "Striking Galaxy Koi Plakat Betta with vibrant speckles of red, black, and iridescent blue scales against a deep obsidian background."
  },
  {
    "id": "demo-2",
    "fish_code": "BT-2026-002",
    "name": "Super Red Halfmoon",
    "slug": "super-red-halfmoon",
    "type": "Halfmoon HM",
    "gender": "Male",
    "grade": "Show Grade",
    "price": 1800000,
    "currency": "IDR",
    "status": "reserved",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-02.jpg",
        "alt_text": "Super Red Halfmoon"
      }
    ],
    "description": "Magnificent Super Red Halfmoon Betta displaying full 180-degree caudal fin spread with rich velvety crimson coloration."
  },
  {
    "id": "demo-3",
    "fish_code": "BT-2026-003",
    "name": "Blue Rim Marble",
    "slug": "blue-rim-marble",
    "type": "Plakat HMPK",
    "gender": "Male",
    "grade": "Competition Grade",
    "price": 2200000,
    "currency": "IDR",
    "status": "available",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-03.jpg",
        "alt_text": "Blue Rim Marble"
      }
    ],
    "description": "Ethereal Blue Rim Marble Betta featuring a pure clean white body contrasted by striking deep cobalt blue margins."
  },
  {
    "id": "demo-4",
    "fish_code": "BT-2026-004",
    "name": "Black Samurai Plakat",
    "slug": "black-samurai-plakat",
    "type": "Plakat HMPK",
    "gender": "Male",
    "grade": "Show Grade",
    "price": 1650000,
    "currency": "IDR",
    "status": "available",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-04.jpg",
        "alt_text": "Black Samurai Plakat"
      }
    ],
    "description": "High contrast Black Samurai Plakat with dense metallic silver mask across a jet black matte body."
  },
  {
    "id": "demo-5",
    "fish_code": "BT-2026-005",
    "name": "Copper Crowntail Show",
    "slug": "copper-crowntail-show",
    "type": "Crowntail CT",
    "gender": "Male",
    "grade": "Grand Champion Line",
    "price": 2500000,
    "currency": "IDR",
    "status": "available",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-05.jpg",
        "alt_text": "Copper Crowntail Show"
      }
    ],
    "description": "Exceptional ray branching and symmetrical web reduction with dense metallic copper sheen."
  },
  {
    "id": "demo-6",
    "fish_code": "BT-2026-006",
    "name": "Avatar Gordon Metallic",
    "slug": "avatar-gordon-metallic",
    "type": "Plakat HMPK",
    "gender": "Male",
    "grade": "Show Grade",
    "price": 1950000,
    "currency": "IDR",
    "status": "sold",
    "media": [
      {
        "storage_path": "/images/dummy/fish/dummy-fish-photo-06.jpg",
        "alt_text": "Avatar Gordon Metallic"
      }
    ],
    "description": "Deep navy and cyan iridescent star-tail pattern with exceptional vigor and active flaring response."
  }
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const title = locale === 'en' 
    ? 'AQUATIC ART — Premium Betta Fish Breeder & Genetic Heritage'
    : 'AQUATIC ART — Breeder Ikan Cupang Premium & Galur Murni';

  const desc = locale === 'en'
    ? 'Discover exclusive Betta fish genetics, selective lineage catalog, and master breeder portfolio.'
    : 'Pemuliaan ikan cupang kualitas premium, galur murni terkurasi, dan portofolio master breeder.';

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'id': `${baseUrl}/id`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/id`
      }
    }
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const [
    featuredFishRes,
    testimonialsRes,
    recentPostsRes,
    breedingStagesRes,
    farmSectionsRes,
    settingsRes
  ] = await Promise.all([
    getFeaturedFish(6),
    getPublishedTestimonials(3),
    getRecentPosts(3),
    getBreedingStages(),
    getFarmSections(),
    getSiteSettings()
  ]);

  // Real CMS media > Dummy photography fallback
  const featuredFish = (featuredFishRes?.data && featuredFishRes.data.length > 0) 
    ? featuredFishRes.data 
    : demoFish;

  const testimonials = (testimonialsRes?.data && testimonialsRes.data.length > 0)
    ? testimonialsRes.data
    : [
        { id: 't-1', customer_name: 'David K.', location: 'Singapore', rating: 5, quote: 'The finnage symmetry on the Blue Rim Plakat exceeded all expectations. Packaging arrived in pristine condition with active flaring response.' },
        { id: 't-2', customer_name: 'Budi Santoso', location: 'Jakarta, ID', rating: 5, quote: 'Indukan Super Red Halfmoon memiliki form 180 derajat sempurna dan mental tarung yang sangat stabil. Breeder sangat komunikatif.' },
        { id: 't-3', customer_name: 'Marcus V.', location: 'Germany', rating: 5, quote: 'International quarantine and transshipping was handled flawlessly. Exceptional scale iridescence and vitality.' }
      ];

  const recentPosts = (recentPostsRes?.data && recentPostsRes.data.length > 0)
    ? recentPostsRes.data
    : [
        { id: 'p-1', title: 'Water Chemistry & Tannin Management for Show Conditioning', slug: 'water-chemistry-tannin-management', excerpt: 'Optimizing TDS, pH stability, and Indian Almond leaves infusion for optimal scale hardness and fin elasticity.', published_at: '2026-02-15' },
        { id: 'p-2', title: 'The Genetic Principles of Metallic & Ray Branching', slug: 'genetic-principles-metallic-branching', excerpt: 'A study on stabilizing secondary and tertiary ray branching in modern show Halfmoon lineages.', published_at: '2026-01-28' },
        { id: 'p-3', title: 'Live Culture Nutrition: From Infusoria to Enriched Artemia', slug: 'live-culture-nutrition-artemia', excerpt: 'High protein feeding protocols for accelerating fry growth while preserving internal organ health.', published_at: '2026-01-10' }
      ];

  const breedingStages = (breedingStagesRes?.data && breedingStagesRes.data.length > 0)
    ? breedingStagesRes.data
    : [];

  const settings = settingsRes?.data || {};

  return (
    <div>
      {/* Hero Section with Cinematic Background Photography */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-16 pt-24 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <Image
            src="/images/dummy/branding/dummy-brand-hero.jpg"
            alt="Aquatic Art Cinematic Hero"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto text-center flex flex-col items-center gap-8 w-full">
          <ScrollReveal>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-primary max-w-5xl tracking-tight leading-none mb-6 whitespace-pre-line">
              {dict.hero.title}
            </h1>
            <p className="font-body text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href={`/${locale}/collection`} 
                className="px-8 py-4 border border-primary text-primary font-body text-xs tracking-widest uppercase hover:bg-primary/10 transition-all duration-300 font-semibold"
              >
                {dict.hero.exploreCollection}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="px-8 py-4 font-body text-xs tracking-widest uppercase text-on-surface hover:text-primary transition-all duration-300 border-b border-transparent hover:border-primary"
              >
                {dict.hero.ourStory}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Business Snapshot */}
      <section className="py-16 md:py-20 px-6 md:px-16 bg-surface border-y border-white/[0.08]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
            <Metric value={dict.snapshot.metric1Val} label={dict.snapshot.metric1Label} />
            <Metric value={dict.snapshot.metric2Val} label={dict.snapshot.metric2Label} />
            <Metric value={dict.snapshot.metric3Val} label={dict.snapshot.metric3Label} />
            <Metric value={dict.snapshot.metric4Val} label={dict.snapshot.metric4Label} />
          </div>
        </Container>
      </section>

      {/* Signature Collection */}
      <Section id="collection">
        <Container>
          <SectionHeading 
            title={dict.collection.title} 
            subtitle={dict.collection.subtitle} 
            linkText={dict.collection.viewAll} 
            linkHref={`/${locale}/collection`} 
          />
          <FishGrid items={featuredFish} locale={locale} />
        </Container>
      </Section>

      {/* Our Story Preview with Editorial Photography */}
      <Section className="bg-surface-container-lowest border-y border-white/[0.08]">
        <Container>
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <ScrollReveal>
                <span className="font-body text-xs uppercase tracking-widest text-primary mb-3 block">{dict.story.tag}</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-on-surface mb-6">{dict.story.title}</h2>
                <p className="text-on-surface-variant text-base md:text-lg mb-6 leading-relaxed">
                  {dict.story.p1}
                </p>
                <p className="text-on-surface-variant text-base md:text-lg mb-8 leading-relaxed">
                  {dict.story.p2}
                </p>
                <Link href={`/${locale}/about`} className="text-primary hover:text-primary-container text-xs uppercase tracking-widest border-b border-primary pb-1 font-semibold">
                  {dict.story.readMore} &rarr;
                </Link>
              </ScrollReveal>
            </div>
            <div className="md:col-span-5">
              <div className="aspect-[4/5] bg-surface border border-white/[0.08] relative overflow-hidden group">
                <Image
                  src="/images/dummy/fish/dummy-fish-photo-03.jpg"
                  alt="Aquatic Art Heritage Specimen"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 flex flex-col">
                  <span className="text-primary font-display text-2xl mb-1">{dict.story.heritage}</span>
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest font-body">{dict.story.est}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Breeding Process Preview */}
      <Section>
        <Container>
          <SectionHeading 
            title={dict.breeding.title} 
            subtitle={dict.breeding.subtitle}
            linkText={dict.breeding.exploreProcess} 
            linkHref={`/${locale}/breeding`} 
          />
          {breedingStages.length > 0 ? (
            <Timeline items={breedingStages} locale={locale} />
          ) : (
            <div className="grid md:grid-cols-3 gap-8 my-8">
              <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-surface-container">
                  <Image src="/images/dummy/breeding/dummy-breeding-01.jpg" alt="Stage 01 Selection" fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">Stage 01</span>
                  <h3 className="font-display text-xl text-on-surface mb-3">{dict.breeding.stage1Title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{dict.breeding.stage1Desc}</p>
                </div>
              </div>
              <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-surface-container">
                  <Image src="/images/dummy/breeding/dummy-breeding-02.jpg" alt="Stage 02 Conditioning" fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <span className="text-primary text-xs uppercase tracking-widest block mb-2 font-body">Stage 02</span>
                  <h3 className="font-display text-xl text-on-surface mb-3">{dict.breeding.stage2Title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{dict.breeding.stage2Desc}</p>
                </div>
              </div>
              <div className="bg-surface border border-white/[0.08] overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-surface-container">
                  <Image src="/images/dummy/breeding/dummy-breeding-03.jpg" alt="Stage 03 Grading" fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" />
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
      </Section>

      {/* Testimonials */}
      <Section className="bg-surface border-y border-white/[0.08]">
        <Container>
          <SectionHeading title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Journal Preview */}
      <Section>
        <Container>
          <SectionHeading 
            title={dict.journal.title} 
            subtitle={dict.journal.subtitle}
            linkText={dict.journal.viewAll} 
            linkHref={`/${locale}/journal`} 
          />
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <JournalCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-surface-container-lowest border-t border-white/[0.08] text-center">
        <Container>
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-5xl text-primary mb-6 max-w-3xl mx-auto">
              {dict.cta.title}
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {dict.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href={`/${locale}/inquire`} 
                className="px-8 py-4 border border-primary text-primary font-body text-xs tracking-widest uppercase hover:bg-primary/10 transition-all font-semibold"
              >
                {dict.cta.inquireBtn}
              </Link>
              <Link 
                href={`/${locale}/contact`} 
                className="px-8 py-4 font-body text-xs tracking-widest uppercase text-on-surface hover:text-primary transition-all border-b border-transparent hover:border-primary"
              >
                {dict.cta.contactBtn}
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </div>
  );
}
