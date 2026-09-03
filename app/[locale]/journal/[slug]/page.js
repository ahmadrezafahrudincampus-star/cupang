import { getPostBySlug } from '@/services/journal';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await getPostBySlug(slug);
  const post = res?.data;

  return {
    title: post ? `${post.title} | Aquatic Art Journal` : 'Article',
    description: post?.excerpt || post?.seo_description || 'Read our breeder article.',
    alternates: {
      canonical: `${baseUrl}/${locale}/journal/${slug}`,
      languages: {
        'id': `${baseUrl}/id/journal/${slug}`,
        'en': `${baseUrl}/en/journal/${slug}`,
      }
    }
  };
}

export default async function JournalDetailPage({ params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const res = await getPostBySlug(slug);
  const post = res?.data;

  if (!post) {
    return (
      <div className="py-24 text-center">
        <Container>
          <h1 className="font-display text-4xl text-primary mb-4">{dict.journal.notFoundTitle}</h1>
          <p className="text-on-surface-variant mb-8">{dict.journal.notFoundDesc}</p>
          <Link href={`/${locale}/journal`} className="text-primary border-b border-primary pb-1 text-xs uppercase tracking-widest font-semibold">
            {dict.journal.backToJournal} &rarr;
          </Link>
        </Container>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'Master Breeder'
    }
  };

  return (
    <article className="py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.journal, href: `/${locale}/journal` },
            { label: post.title }
          ]} />

          <div className="my-8">
            <span className="text-primary font-body text-xs uppercase tracking-widest block mb-3">
              {post.category?.name || 'Care & Genetics'}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-on-surface mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant font-body border-y border-white/[0.08] py-4">
              <span>{dict.journal.by} {post.author?.full_name || 'Master Breeder'}</span>
              <span>&bull;</span>
              <span>{new Date(post.published_at || post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'long' })}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none my-12 text-on-surface-variant font-body leading-relaxed space-y-6 text-base md:text-lg">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}
