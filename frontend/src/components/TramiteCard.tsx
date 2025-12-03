import React, { useState } from 'react';
import TramiteModal from './TramiteModal';
import type { Tramite } from '../lib/types';

interface TramiteCardProps {
  tramite: Tramite;
  onClick?: () => void;  // ✅ Si se pasa onClick, no usa modal interno
}

const TramiteCard: React.FC<TramiteCardProps> = ({ tramite, onClick }) => {
  const [open, setOpen] = useState(false);

  // Si hay onClick externo, usarlo. Si no, usar modal interno
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group h-full flex flex-col">
        <div className="p-5 flex flex-col h-full">
          {/* Header con título y código */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-[#341A67] transition-colors leading-tight flex-1">
              {tramite.title}
            </h3>
            {tramite.code && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#47B4D8] text-white flex-shrink-0">
                {tramite.code}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {tramite.description || 'Haz clic para ver más información sobre este trámite.'}
          </p>

          {/* Info rápida */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tramite.estimated_time && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#47B4D8]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tramite.estimated_time}</span>
              </div>
            )}
            {tramite.cost != null && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Number(tramite.cost) === 0 ? 'Gratuito' : `Bs. ${Number(tramite.cost).toFixed(0)}`}</span>
              </div>
            )}
          </div>

          {/* Unidad responsable */}
          {tramite.unit && (
            <div className="mt-auto pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{tramite.unit.name}</span>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <button
            onClick={handleClick}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#47B4D8] hover:text-white bg-white hover:bg-[#47B4D8] border-2 border-[#47B4D8] rounded-xl transition-all"
          >
            Ver detalles
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </article>

      {/* Solo renderizar modal si no hay onClick externo */}
      {!onClick && (
        <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
      )}
    </>
  );
};

export default TramiteCard;