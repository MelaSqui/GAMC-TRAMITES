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
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer">
        <div className="p-5 flex flex-col h-full">
          {/* Header con badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tramite.code && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {tramite.code}
              </span>
            )}
            {tramite.cost != null && tramite.cost !== 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 border border-cyan-200">
                Bs. {Number(tramite.cost).toFixed(2)}
              </span>
            )}
            {tramite.estimated_time && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-600 border border-primary-200">
                {tramite.estimated_time}
              </span>
            )}
          </div>

          {/* Titulo */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
            {tramite.title}
          </h3>

          {/* Descripcion */}
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
            {tramite.description || 'Haz clic para ver mas informacion sobre este tramite.'}
          </p>

          {/* Unidad responsable */}
          {tramite.unit && (
            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide font-semibold">
                    Unidad Responsable
                  </p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {tramite.unit.name}
                  </p>
                  {tramite.unit.address && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {tramite.unit.address}
                    </p>
                  )}
                  {tramite.unit.phones && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tramite.unit.phones}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Boton de accion */}
          <button
            onClick={handleOpen}
            className="mt-4 w-full px-5 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Ver informacion completa
          </button>
        </div>
      </article>

      <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
    </>
  );
};

export default TramiteCard;
