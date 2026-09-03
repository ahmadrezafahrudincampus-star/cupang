import { getPublishedPosts } from '@/services/journal';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import SectionHeading from '@/components/layout/SectionHeading';
import JournalCard from '@/components/content/JournalCard';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    title: locale === 'en' ? "Breeder's Journal & Articles" : 'Jurnal & Artikel Breeder',
    description: locale === 'en'
      ? 'Original care guides, genetics, and water chemistry articles.'
      : 'Panduan perawatan otentik, genetika, dan kimia air ikan cupang.',
    alternates: {
      canonical: `${baseUrl}/${locale}/journal`,
      languages: { 'id': `${baseUrl}/id/journal`, 'en': `${baseUrl}/en/journal` }
    }
  };
}

export default async function JournalPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const postsRes = await getPublishedPosts({ page: 1, limit: 12 });
  const posts = postsRes?.data || [];

  return (
    <div className="py-20 md:py-28">
      <Container>
        <SectionHeading 
          title={dict.journal.title} 
          subtitle={dict.journal.subtitle}
        />

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 my-12">
            {posts.map((post) => (
              <JournalCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/[0.08] bg-surface/40 p-8 my-12">
            <h3 className="font-display text-2xl text-on-surface mb-3">{dict.journal.emptyTitle}</h3>
            <p className="text-on-surface-variant max-w-lg mx-auto">
              {dict.journal.emptyDesc}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
