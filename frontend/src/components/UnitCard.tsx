// src/components/UnitCard.tsx
// VERSIÓN FINAL - Con Tailwind + clases personalizadas

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Unit } from '../lib/types';

type Props = {
  unit: Unit;
  onOpen?: () => void;
};

export default function UnitCard({ unit, onOpen }: Props) {
  const navigate = useNavigate();

  const goTramites = () => navigate(`/unidades/${unit.id}`);

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Cover opcional */}
      {unit.cover_url && (
        <div className="h-28 w-full overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
          <img
            src={unit.cover_url}
            alt={unit.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3">
        {/* Header con icono y título */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-cyan-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-tight flex-1">
            {unit.name}
          </h3>
        </div>

        {/* Descripción */}
        <p className="text-sm text-slate-600 line-clamp-3">
          {unit.description
            ? unit.description.length > 140
              ? unit.description.slice(0, 140) + '…'
              : unit.description
            : 'Sin descripción.'}
        </p>

        {/* Información de contacto */}
        {(unit.contact || unit.phones || unit.address) && (
          <div className="flex flex-col gap-2 py-2 border-t border-slate-100">
            {unit.contact && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">{unit.contact}</span>
              </div>
            )}

            {unit.phones && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{unit.phones}</span>
              </div>
            )}

            {unit.address && (
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2">{unit.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}