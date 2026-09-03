import { getFishByCategory, getCategoryBySlug } from '@/services/fish';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import FishGrid from '@/components/fish/FishGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export async function generateMetadata({ params }) {
  const { locale, category: slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await getCategoryBySlug(slug);
  const category = res?.data;

  return {
    title: category ? `${category.name} Collection | Aquatic Art` : 'Category Collection',
    description: category?.description || 'Browse our selective Betta fish in this category.',
    alternates: {
      canonical: `${baseUrl}/${locale}/collection/${slug}`,
      languages: {
        'id': `${baseUrl}/id/collection/${slug}`,
        'en': `${baseUrl}/en/collection/${slug}`,
      }
    }
  };
}

export default async function CategoryCollectionPage({ params }) {
  const { locale, category: slug } = await params;
  const dict = getDictionary(locale);
  const catRes = await getCategoryBySlug(slug);
  const category = catRes?.data;

  if (!category) {
    return (
      <div className="py-20 md:py-28">
        <Container>
          <Breadcrumbs items={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.collection, href: `/${locale}/collection` }, { label: slug }]} />
          <SectionHeading title={dict.collection.title} subtitle={slug} />
          <div className="text-center py-20 border border-white/[0.08] bg-surface/40 p-8 my-8">
            <p className="text-on-surface-variant">No items found for this category.</p>
          </div>
        </Container>
      </div>
    );
  }

  const fishRes = await getFishByCategory(slug);
  const fishList = fishRes?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <Breadcrumbs items={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.collection, href: `/${locale}/collection` },
          { label: category.name }
        ]} />
        <SectionHeading 
          title={category.name} 
          subtitle={category.description || dict.collection.subtitle} 
        />
        <div className="my-10">
          {fishList.length > 0 ? (
            <FishGrid items={fishList} locale={locale} />
          ) : (
            <div className="text-center py-20 border border-white/[0.08] bg-surface/40 p-8">
              <p className="text-on-surface-variant">No specimens currently listed under {category.name}.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
