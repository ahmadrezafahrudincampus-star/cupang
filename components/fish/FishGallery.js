'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/media/Lightbox';

export default function FishGallery({ media = [], fallbackName = 'Betta specimen' }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // If no media uploaded yet, provide rich photographic dummy fallback
  const items = media.length > 0 ? media : [
    { storage_path: '/images/dummy/fish/dummy-fish-photo-01.jpg', alt_text: 'Demo Betta fish photography plate 1' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-02.jpg', alt_text: 'Demo Betta fish photography plate 2' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-03.jpg', alt_text: 'Demo Betta fish photography plate 3' },
  ];

  const current = items[activeIdx] || items[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image */}
      <div 
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[4/5] w-full overflow-hidden border border-white/[0.08] bg-surface-container-lowest cursor-zoom-in group"
      >
        <Image
          src={current?.storage_path || current?.url || current}
          alt={current?.alt_text || fallbackName}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-102"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 text-[11px] font-body uppercase tracking-widest text-on-surface-variant border border-white/[0.08] pointer-events-none">
          Click to Enlarge
        </div>
      </div>

      {/* Thumbnail Bar */}
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 flex-shrink-0 overflow-hidden border transition-all ${
                activeIdx === idx ? 'border-primary ring-1 ring-primary' : 'border-white/[0.08] opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={item?.storage_path || item?.url || item}
                alt={item?.alt_text || `${fallbackName} thumb ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <Lightbox
          images={items}
          currentIndex={activeIdx}
          setCurrentIndex={setActiveIdx}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
