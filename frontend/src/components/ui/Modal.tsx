import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, ariaLabel, children }: ModalProps) {
  // Bloquea el scroll del body al abrir
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto w-[95%] max-w-3xl p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-500 hover:text-slate-800 text-xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
