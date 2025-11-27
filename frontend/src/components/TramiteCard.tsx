import React, { useState } from 'react';
import TramiteModal from './TramiteModal';
import type { Tramite } from '../lib/types';

interface TramiteCardProps {
  tramite: Tramite;
}

const TramiteCard: React.FC<TramiteCardProps> = ({ tramite }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        <div className="p-6 flex flex-col h-full">
          {/* Header: Título y Código */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-[#341A67] transition-colors">
              {tramite.title}
            </h3>
            {tramite.code && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-[#47B4D8] text-white whitespace-nowrap flex-shrink-0">
                {tramite.code}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">
            {tramite.description || 'Haz clic para ver más información sobre este trámite.'}
          </p>

          {/* Información detallada */}
          <div className="flex flex-col gap-2.5 mb-5 flex-grow">
            {/* Unidad responsable */}
            {tramite.unit && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-[#47B4D8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{tramite.unit.name}</span>
              </div>
            )}

            {/* Tiempo estimado */}
            {tramite.estimated_time && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-[#47B4D8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tramite.estimated_time}</span>
              </div>
            )}

            {/* Costo */}
            {tramite.cost != null && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-[#47B4D8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {Number(tramite.cost) === 0 ? 'Gratuito' : `Bs. ${Number(tramite.cost).toFixed(0)}`}
                </span>
              </div>
            )}
          </div>

          {/* Botón de acción */}
          <button
            onClick={() => setOpen(true)}
            className="mt-auto flex items-center justify-end gap-1 text-[#47B4D8] hover:text-[#341A67] text-sm font-semibold transition-colors group/btn"
          >
            Ver detalles
            <svg 
              className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </article>

      <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
    </>
  );
};

export default TramiteCard;