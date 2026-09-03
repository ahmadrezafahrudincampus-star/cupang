'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, variant = 'info', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, variant }]);
    
    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={clsx(
                "px-6 py-4 border font-body text-sm shadow-xl animate-in slide-in-from-right-8 duration-300 flex justify-between items-center gap-4",
                toast.variant === 'success' ? 'bg-[#152e1c] border-green-500/30 text-green-200' :
                toast.variant === 'error' ? 'bg-[#2a1111] border-red-500/30 text-red-200' :
                'bg-surface border-white/[0.08] text-on-surface'
              )}
            >
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
