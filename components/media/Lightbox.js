'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function Lightbox({ images, currentIndex, setCurrentIndex, onClose }) {
  const nextImage = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images, setCurrentIndex]);

  const prevImage = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images, setCurrentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose]);

  if (!images || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface p-2 text-2xl z-10"
        aria-label="Close Lightbox"
      >
        &times;
      </button>

      {/* Navigation Left */}
      <button
        type="button"
        onClick={prevImage}
        className="absolute left-6 text-on-surface-variant hover:text-primary p-4 text-3xl z-10 hidden sm:block"
        aria-label="Previous image"
      >
        &#8249;
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[85vh] w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={current?.storage_path || current?.url || current}
            alt={current?.alt_text || 'Aquatic Art specimen'}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
        {current?.caption && (
          <p className="mt-4 text-sm text-on-surface-variant font-body text-center">
            {current.caption}
          </p>
        )}
      </div>

      {/* Navigation Right */}
      <button
        type="button"
        onClick={nextImage}
        className="absolute right-6 text-on-surface-variant hover:text-primary p-4 text-3xl z-10 hidden sm:block"
        aria-label="Next image"
      >
        &#8250;
      </button>
    </div>
  );
}
