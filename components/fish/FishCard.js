import Link from 'next/link';
import Image from 'next/image';
import FishStatus from './FishStatus';

export default function FishCard({ fish, locale = 'id' }) {
  if (!fish) return null;

  // Real media priority > Dummy photography fallback
  const firstMedia = fish.media?.[0]?.storage_path || fish.cover_image;
  
  // 8 JPG dummy photos exist: dummy-fish-photo-01.jpg through dummy-fish-photo-08.jpg
  const photoIndex = ((parseInt(fish.fish_code?.replace(/\D/g, '') || '1', 10) - 1) % 8) + 1;
  const photoNum = String(photoIndex).padStart(2, '0');
  const defaultPhoto = `/images/dummy/fish/dummy-fish-photo-${photoNum}.jpg`;

  const imageSrc = firstMedia || defaultPhoto;
  const isDemo = !firstMedia;

  return (
    <Link 
      href={`/${locale}/fish/${fish.slug}`}
      className="group cursor-pointer flex flex-col gap-4 focus:outline-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-white/[0.08] bg-surface-container-lowest">
        <Image
          src={imageSrc}
          alt={isDemo ? 'Demo Betta fish photograph placeholder' : (fish.name || 'Betta fish')}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
        
        {/* Status & Name Scrim */}
        <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-2 w-full">
          <FishStatus status={fish.status} />
          <h3 className="font-display text-xl sm:text-2xl text-on-surface">
            {fish.name}
          </h3>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <span className="font-body text-xs text-on-surface-variant tracking-wider">ID: {fish.fish_code}</span>
        <span className="font-body text-xs text-primary border-b border-transparent group-hover:border-primary transition-all uppercase tracking-widest font-semibold">
          {locale === 'en' ? 'VIEW FISH' : 'LIHAT IKAN'}
        </span>
      </div>
    </Link>
  );
}
