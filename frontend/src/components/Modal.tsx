import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  widthClass?: string;
  children: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  ariaLabel = 'Diálogo',
  widthClass = 'max-w-4xl',
  children,
}: Props) {
  // ✅ FIX simple: solo bloquear overflow
  useEffect(() => {
    if (!open) return;
    
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calcular ancho del scrollbar para evitar "salto"
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
      onClick={handleBackdrop}
    >
      <div
        className={`w-full ${widthClass} rounded-2xl bg-white shadow-xl ring-1 ring-black/5 outline-none grid my-8`}
        style={{ gridTemplateRows: 'auto 1fr auto', maxHeight: 'calc(100vh - 4rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  onClose,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="px-6 pt-6 pb-3 border-b border-slate-200 bg-white rounded-t-2xl">
      <div className="flex items-start gap-3">
        <h3 className="text-xl font-semibold text-slate-900 flex-1">{title}</h3>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 overflow-y-auto">
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t border-slate-200 bg-white rounded-b-2xl">
      <div className="flex items-center justify-end gap-2">{children}</div>
    </div>
  );
}