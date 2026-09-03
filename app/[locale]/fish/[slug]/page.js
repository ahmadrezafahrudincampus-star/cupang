import { getFishBySlug, getRelatedFish } from '@/services/fish';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FishStatus from '@/components/fish/FishStatus';
import FishSpecs from '@/components/fish/FishSpecs';
import FishGallery from '@/components/fish/FishGallery';
import ProductCTA from '@/components/fish/ProductCTA';
import FishGrid from '@/components/fish/FishGrid';
import Link from 'next/link';

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
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await getFishBySlug(slug);
  const fish = res?.data || demoFish.find((f) => f.slug === slug);

  if (!fish) {
    return { title: 'Fish Details' };
  }

  return {
    title: `${fish.name} (${fish.fish_code}) | Aquatic Art`,
    description: fish.seo_description || fish.description || `Explore ${fish.name}, a premium ${fish.type || 'Betta'} specimen.`,
    alternates: {
      canonical: `${baseUrl}/${locale}/fish/${slug}`,
      languages: {
        'id': `${baseUrl}/id/fish/${slug}`,
        'en': `${baseUrl}/en/fish/${slug}`,
      }
    }
  };
}

export default async function FishDetailPage({ params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const res = await getFishBySlug(slug);
  const fish = res?.data || demoFish.find((f) => f.slug === slug) || demoFish[0];

  const relatedRes = await getRelatedFish(fish.id, fish.category_id, 3);
  const rawRelated = relatedRes?.data || [];
  const relatedFish = rawRelated.length > 0 ? rawRelated : demoFish.filter((f) => f.slug !== fish.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fish.name,
    sku: fish.fish_code,
    description: fish.description || fish.name,
    offers: {
      '@type': 'Offer',
      price: fish.price || '0',
      priceCurrency: fish.currency || 'IDR',
      availability: fish.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <div className="py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <Breadcrumbs items={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.collection, href: `/${locale}/collection` },
          { label: fish.name }
        ]} />

        <div className="grid md:grid-cols-12 gap-12 my-8">
          {/* Gallery Column */}
          <div className="md:col-span-7">
            <FishGallery media={fish.media || []} fallbackName={fish.name} />
          </div>

          {/* Details & CTA Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-body text-xs text-on-surface-variant uppercase tracking-widest">{dict.collection.idLabel}: {fish.fish_code}</span>
                <FishStatus status={fish.status} />
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-on-surface mb-2">{fish.name}</h1>
              <p className="text-primary font-body text-sm uppercase tracking-wider mb-6">
                {fish.type} {fish.gender ? `· ${fish.gender}` : ''}
              </p>

              {fish.price && (
                <div className="mb-6 pb-6 border-b border-white/[0.08]">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest block mb-1">{dict.collection.priceRef}</span>
                  <span className="font-display text-2xl text-on-surface">
                    {fish.currency || 'IDR'} {Number(fish.price).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {fish.description && (
                <div className="mb-8 text-on-surface-variant font-body text-sm leading-relaxed">
                  <p>{fish.description}</p>
                </div>
              )}

              {/* Specifications */}
              <div className="mb-8">
                <FishSpecs fish={fish} />
              </div>
            </div>

            {/* Product CTA (Inquiry Mode) */}
            <div className="pt-6 border-t border-white/[0.08]">
              <ProductCTA fish={fish} mode="inquiry" locale={locale} />
            </div>
          </div>
        </div>

        {/* Related Fish */}
        {relatedFish.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/[0.08]">
            <SectionHeading title={dict.collection.relatedTitle} subtitle={dict.collection.relatedSubtitle} />
            <FishGrid items={relatedFish} locale={locale} />
          </div>
        )}
      </Container>
    </div>
  );
}
