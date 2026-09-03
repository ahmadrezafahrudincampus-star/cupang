'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';

export default function Header({ locale = 'id', dict }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname() || `/${locale}`;

  const d = dict?.nav || {
    home: 'Home',
    collection: 'Collection',
    breeding: 'Breeding',
    farm: 'Farm',
    gallery: 'Gallery',
    journal: 'Journal',
    about: 'Story',
    inquire: 'Inquire',
  };

  const links = [
    { href: `/${locale}`, label: d.home },
    { href: `/${locale}/collection`, label: d.collection },
    { href: `/${locale}/breeding`, label: d.breeding },
    { href: `/${locale}/farm`, label: d.farm },
    { href: `/${locale}/gallery`, label: d.gallery },
    { href: `/${locale}/journal`, label: d.journal },
  ];

  // Language switch target path
  const getSwitchPath = (targetLocale) => {
    const segments = pathname.split('/');
    if (segments[1] === 'id' || segments[1] === 'en') {
      segments[1] = targetLocale;
      return segments.join('/') || `/${targetLocale}`;
    }
    return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between h-20">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="font-display text-2xl tracking-widest text-primary font-bold">
            AQUATIC ART
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs tracking-[0.1em] uppercase transition-colors duration-300 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher & Inquire CTA */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center text-xs font-body tracking-widest border border-white/[0.1] rounded-sm p-1 bg-surface-container/50">
            <Link
              href={getSwitchPath('id')}
              className={`px-2.5 py-1 transition-colors rounded-sm ${
                locale === 'id'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-label="Bahasa Indonesia"
            >
              ID
            </Link>
            <Link
              href={getSwitchPath('en')}
              className={`px-2.5 py-1 transition-colors rounded-sm ${
                locale === 'en'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-label="English"
            >
              EN
            </Link>
          </div>

          <Button href={`/${locale}/inquire`} variant="primary" size="sm">
            {d.inquire} &rarr;
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-on-surface p-2 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-white/[0.08] px-6 py-8">
          <nav className="flex flex-col gap-5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-body text-sm tracking-[0.1em] uppercase ${
                    isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-body">Language:</span>
              <div className="flex items-center text-xs font-body tracking-widest border border-white/[0.1] rounded-sm p-1">
                <Link
                  href={getSwitchPath('id')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-1 rounded-sm ${
                    locale === 'id' ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  ID
                </Link>
                <Link
                  href={getSwitchPath('en')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-1 rounded-sm ${
                    locale === 'en' ? 'bg-primary text-on-primary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button href={`/${locale}/inquire`} variant="primary" size="md" className="w-full justify-center">
                {d.inquire} &rarr;
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
