'use client';

import { useState } from 'react';
import clsx from 'clsx';

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t border-white/[0.08]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-white/[0.08]">
            <button
              className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl md:text-2xl text-on-surface group-hover:text-primary transition-colors">
                {item.question}
              </span>
              <span className="ml-6 flex-shrink-0 text-muted group-hover:text-primary transition-colors">
                {isOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </span>
            </button>
            <div 
              className={clsx(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
              )}
            >
              <p className="font-body text-muted leading-relaxed max-w-3xl">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
