import React, { useState } from 'react';
import TramiteModal from './TramiteModal';
import type { Tramite } from '../lib/types';

interface TramiteCardProps {
  tramite: Tramite;
  onOpen?: () => void;
}

const TramiteCard: React.FC<TramiteCardProps> = ({ tramite, onOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow bg-white overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 flex-1">
          {/* header pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tramite.code && <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">{tramite.code}</span>}
            {tramite.cost != null && (
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs">Bs. {Number(tramite.cost).toFixed(2)}</span>
            )}
            {tramite.estimated_time && (
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs">{tramite.estimated_time}</span>
            )}
          </div>

          <h3 className="font-semibold text-lg leading-tight mb-1">{tramite.title}</h3>
          <p className="text-slate-600 text-sm line-clamp-3">{tramite.description}</p>

          {/* unidad mini */}
          {tramite.unit && (
            <div className="mt-4 rounded-xl ring-1 ring-slate-200 p-3 text-sm">
              <div className="font-medium">Unidad Responsable</div>
              <div className="text-slate-600">{tramite.unit.name}</div>
              <div className="text-slate-600">{tramite.unit.address}</div>
              <div className="text-slate-600">{tramite.unit.phones}</div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 pt-0">
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-slate-900 hover:bg-black text-white font-semibold py-3"
          >
            Ver información completa
          </button>
        </div>
      </div>

      <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
    </>
  );
};

export default TramiteCard;
