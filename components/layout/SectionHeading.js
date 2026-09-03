import Link from 'next/link';

export default function SectionHeading({ title, subtitle, linkText, linkHref }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 mb-12">
      <div>
        <h2 className="font-display text-4xl md:text-5xl text-primary">{title}</h2>
        {subtitle && <p className="font-body text-muted mt-2">{subtitle}</p>}
      </div>
      {linkText && linkHref && (
        <Link href={linkHref} className="mt-4 md:mt-0 font-body text-xs uppercase tracking-[0.1em] text-on-surface hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
          {linkText}
        </Link>
      )}
    </div>
  );
}
