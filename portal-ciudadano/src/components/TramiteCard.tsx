import React, { useState } from 'react';
import TramiteModal from './TramiteModal';
import type { Tramite } from '../lib/types';

interface TramiteCardProps {
  tramite: Tramite;
  onOpen?: () => void;
}

const TramiteCard: React.FC<TramiteCardProps> = ({ tramite, onOpen }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (onOpen) onOpen();
  };

  return (
    <>
      <article className="card group cursor-pointer transition-all hover:-translate-y-1">
        <div className="p-5 flex flex-col h-full">
          {/* Header con badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tramite.code && (
              <span className="badge badge-gray">{tramite.code}</span>
            )}
            {tramite.cost != null && tramite.cost !== 0 && (
              <span className="badge badge-sky">
                Bs. {Number(tramite.cost).toFixed(2)}
              </span>
            )}
            {tramite.estimated_time && (
              <span className="badge badge-purple">{tramite.estimated_time}</span>
            )}
          </div>

          {/* Título */}
          <h3 className="font-bold text-lg leading-tight text-slate-900 mb-2 line-clamp-2 group-hover:text-[var(--c-primary)] transition-colors">
            {tramite.title}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
            {tramite.description || 'Haz clic para ver más información sobre este trámite.'}
          </p>

          {/* Unidad responsable */}
          {tramite.unit && (
            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">Unidad Responsable</p>
                  <p className="font-medium text-sm text-slate-900 truncate">{tramite.unit.name}</p>
                  {tramite.unit.address && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{tramite.unit.address}</p>
                  )}
                  {tramite.unit.phones && (
                    <p className="text-xs text-slate-500 mt-0.5">{tramite.unit.phones}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <button
            onClick={handleOpen}
            className="mt-4 w-full btn btn-primary"
          >
            Ver información completa
          </button>
        </div>
      </article>

      <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
    </>
  );
};

export default TramiteCard;