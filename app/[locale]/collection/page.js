import { getAvailableFish, getCategories } from '@/services/fish';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
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
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? 'Betta Collection Catalog' : 'Katalog Koleksi Ikan Cupang',
    description: locale === 'en'
      ? 'Browse available Plakat, Halfmoon, and Crowntail specimens with verified bloodline identity.'
      : 'Jelajahi spesimen Plakat, Halfmoon, dan Crowntail dengan identitas galur terverifikasi.',
    alternates: {
      canonical: `${baseUrl}/${locale}/collection`,
      languages: { 'id': `${baseUrl}/id/collection`, 'en': `${baseUrl}/en/collection` }
    }
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  const dict = getDictionary(locale);
  const category = sp?.category;
  const status = sp?.status || 'available';
  const page = parseInt(sp?.page || '1', 10);

  const [fishRes, catRes] = await Promise.all([
    getAvailableFish({ category, status, page, limit: 12 }),
    getCategories()
  ]);

  const rawFishList = fishRes?.data || [];
  const fishList = rawFishList.length > 0 ? rawFishList : demoFish;
  const categories = catRes?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.collection.title} 
          subtitle={dict.collection.subtitle} 
        />

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-4 my-8 pb-4 border-b border-white/[0.08]">
            <Link 
              href={`/${locale}/collection`} 
              className={`font-body text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${!category ? 'border-primary text-primary bg-primary/5' : 'border-white/[0.08] text-on-surface-variant hover:text-on-surface'}`}
            >
              {dict.collection.allCategories}
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/${locale}/collection?category=${cat.id}`}
                className={`font-body text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${category === cat.id ? 'border-primary text-primary bg-primary/5' : 'border-white/[0.08] text-on-surface-variant hover:text-on-surface'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <div className="my-10">
          <FishGrid items={fishList} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
