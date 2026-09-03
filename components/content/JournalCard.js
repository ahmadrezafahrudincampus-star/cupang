import Link from 'next/link';
import Image from 'next/image';

export default function JournalCard({ post, locale = 'id' }) {
  if (!post) return null;

  // Photo dummy fallback
  const photoIndex = (Math.abs((post.slug?.length || 1) * 3) % 5) + 1;
  const imageSrc = post.cover_path || `/images/dummy/journal/dummy-journal-0${(photoIndex % 3) + 1}.jpg`;

  return (
    <article className="group bg-surface border border-white/[0.08] flex flex-col justify-between overflow-hidden">
      <Link href={`/${locale}/journal/${post.slug}`} className="block overflow-hidden relative aspect-[16/10] bg-surface-container">
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-primary font-body text-xs uppercase tracking-widest block mb-2">
            {post.category?.name || (locale === 'en' ? 'Husbandry & Care' : 'Perawatan & Galur')}
          </span>
          <h3 className="font-display text-xl text-on-surface group-hover:text-primary transition-colors mb-3 leading-snug">
            <Link href={`/${locale}/journal/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-6 line-clamp-3">
            {post.excerpt || post.content?.slice(0, 120)}
          </p>
        </div>
        <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center text-xs text-outline">
          <span>{new Date(post.published_at || post.created_at || '2026-01-01').toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'medium' })}</span>
          <Link href={`/${locale}/journal/${post.slug}`} className="text-primary uppercase tracking-widest font-semibold hover:underline">
            {locale === 'en' ? 'Read Article' : 'Baca Artikel'} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
