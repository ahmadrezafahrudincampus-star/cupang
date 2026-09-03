import Link from 'next/link';
import Container from './Container';

export default function Footer({ locale = 'id', dict }) {
  const currentYear = new Date().getFullYear();
  const d = dict?.footer || {
    about: 'Dedicated selective Betta fish breeding with uncompromising standards.',
    rights: 'ALL RIGHTS RESERVED.',
    terms: 'Terms',
    privacy: 'Privacy',
    shipping: 'Shipping',
    guarantee: 'Guarantee',
    contact: 'Contact',
  };

  return (
    <footer className="bg-surface-container-lowest border-t border-white/[0.08] w-full py-16 md:py-24 px-6 md:px-16 text-on-surface-variant font-body">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href={`/${locale}`}>
              <span className="font-display text-2xl md:text-3xl text-primary font-bold tracking-widest block">
                AQUATIC ART
              </span>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed text-on-surface-variant">
              {d.about}
            </p>
            <p className="font-body text-xs tracking-widest text-outline uppercase mt-4">
              &copy; {currentYear} AQUATIC ART BREEDING HERITAGE.<br />
              {d.rights}
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 flex flex-col gap-3 text-sm">
            <span className="font-display text-base text-on-surface mb-2 font-semibold">Explore</span>
            <Link href={`/${locale}/collection`} className="hover:text-primary transition-colors">Collection</Link>
            <Link href={`/${locale}/breeding`} className="hover:text-primary transition-colors">Breeding Process</Link>
            <Link href={`/${locale}/farm`} className="hover:text-primary transition-colors">Our Farm</Link>
            <Link href={`/${locale}/gallery`} className="hover:text-primary transition-colors">Visual Gallery</Link>
            <Link href={`/${locale}/journal`} className="hover:text-primary transition-colors">Breeder Journal</Link>
          </div>

          {/* Legal & Contact */}
          <div className="md:col-span-4 flex flex-col gap-3 text-sm">
            <span className="font-display text-base text-on-surface mb-2 font-semibold">Trust & Policies</span>
            <Link href={`/${locale}/guarantee`} className="hover:text-primary transition-colors">{d.guarantee}</Link>
            <Link href={`/${locale}/shipping-policy`} className="hover:text-primary transition-colors">{d.shipping}</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{d.privacy}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">{d.terms}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-primary transition-colors">{d.contact}</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
