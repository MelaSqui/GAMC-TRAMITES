import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  widthClass?: string; // p.ej.: "max-w-4xl"
  children: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  ariaLabel = 'Diálogo',
  widthClass = 'max-w-4xl',
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
      onClick={handleBackdrop}
    >
      <div
        className={`w-full ${widthClass} rounded-2xl bg-white shadow-xl ring-1 ring-black/5 outline-none grid`}
        style={{ gridTemplateRows: 'auto 1fr auto', maxHeight: '90vh' }}  // <= clave
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
    <div className="px-6 pt-6 pb-3 border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-10">
      <div className="flex items-start gap-3">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <button
          onClick={onClose}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 overflow-y-auto"> {/* <= scroll interno */}
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-end gap-2">{children}</div>
    </div>
  );
}
