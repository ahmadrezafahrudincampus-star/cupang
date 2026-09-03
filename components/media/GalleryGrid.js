'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

export default function GalleryGrid({ items = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 8 High quality photographic gallery plates
  const demoGallery = [
    { storage_path: '/images/dummy/fish/dummy-fish-photo-01.jpg', title: 'Galaxy Koi Plakat Studio Study', caption: 'Macro photography of high grade Galaxy Koi with dense iridescent scales.', alt_text: 'Galaxy Koi Plakat' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-02.jpg', title: 'Super Red Halfmoon Full Flare', caption: '180-degree spread study highlighting intense crimson ray branching.', alt_text: 'Super Red Halfmoon' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-03.jpg', title: 'Blue Rim Marble Contrast', caption: 'Crisp porcelain white body with deep cobalt margins.', alt_text: 'Blue Rim Marble' },
    { storage_path: '/images/dummy/branding/dummy-brand-hero.jpg', title: 'Aquatic Art Masterpiece Plate', caption: 'Cinematic studio lighting capturing underwater fin dynamics.', alt_text: 'Betta Fin Motion' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-04.jpg', title: 'Black Samurai Metallic Mask', caption: 'Dense platinum mask contrasting deep black scales.', alt_text: 'Black Samurai' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-05.jpg', title: 'Copper Crowntail Ray Symmetry', caption: 'Double ray branching and delicate fin webbing.', alt_text: 'Copper Crowntail' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-06.jpg', title: 'Avatar Gordon Electric Cyan', caption: 'Iridescent star-tail patterns on dark body.', alt_text: 'Avatar Gordon' },
    { storage_path: '/images/dummy/fish/dummy-fish-photo-07.jpg', title: 'Candy Multi-Color Plakat', caption: 'Vibrant chromatic layering in studio black backdrop.', alt_text: 'Candy Plakat' },
  ];

  const galleryItems = (items && items.length > 0) ? items : demoGallery;

  const openLightbox = (index) => {
    setActiveIdx(index);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-square overflow-hidden border border-white/[0.08] bg-surface-container cursor-pointer"
          >
            <Image
              src={item.storage_path || item.url || item}
              alt={item.alt_text || item.title || `Gallery item ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="font-display text-sm text-on-surface font-semibold">{item.title}</span>
              <span className="font-body text-[11px] text-primary tracking-widest uppercase">View Plate &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          images={galleryItems}
          currentIndex={activeIdx}
          setCurrentIndex={setActiveIdx}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
