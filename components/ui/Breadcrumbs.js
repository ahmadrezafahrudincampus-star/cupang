import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="font-body text-xs text-muted mb-8">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-primary" aria-current="page">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-on-surface transition-colors">
                    {item.label}
                  </Link>
                  <span className="text-white/[0.2]">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
