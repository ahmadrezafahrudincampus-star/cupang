'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className="relative bg-surface border border-white/[0.08] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {title && (
          <div className="p-6 border-b border-white/[0.08] flex justify-between items-center">
            <h2 id="modal-title" className="font-display text-xl text-primary">{title}</h2>
            <button 
              onClick={onClose}
              className="text-muted hover:text-on-surface transition-colors"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {!title && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-on-surface transition-colors z-10"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
