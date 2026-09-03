import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="font-display text-6xl md:text-8xl text-primary mb-6 animate-fade-up">404</h1>
      <h2 className="font-display text-3xl md:text-4xl text-on-surface mb-4 animate-fade-up delay-100">
        Page Not Found
      </h2>
      <p className="text-on-surface-variant max-w-md mb-8 animate-fade-up delay-200">
        The specimen you are looking for has vanished into the deep. It may have been relocated or no longer exists.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
        <Link 
          href="/" 
          className="px-6 py-3 border border-border bg-surface-container hover:bg-surface-container-high transition-colors rounded-sm text-sm uppercase tracking-widest text-on-surface"
        >
          Return Home
        </Link>
        <Link 
          href="/collection" 
          className="px-6 py-3 bg-primary hover:bg-primary-container transition-colors rounded-sm text-sm uppercase tracking-widest text-on-primary font-medium"
        >
          View Collection
        </Link>
      </div>
    </div>
  );
}
