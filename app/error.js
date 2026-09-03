'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="font-display text-3xl md:text-4xl text-error mb-4 animate-fade-up">
        Something went wrong
      </h2>
      <p className="text-on-surface-variant max-w-md mb-8 animate-fade-up delay-100">
        We apologize for the disturbance in the waters. An unexpected error has occurred.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
        <button
          onClick={() => reset()}
          className="px-6 py-3 border border-border bg-surface-container hover:bg-surface-container-high transition-colors rounded-sm text-sm uppercase tracking-widest text-on-surface"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary-container transition-colors rounded-sm text-sm uppercase tracking-widest text-on-primary font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
