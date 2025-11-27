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

  // Generar badge desde nombre
  const badge = unit.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
      
      {/* Imagen / Fondo */}
      <div className="relative h-56 w-full overflow-hidden">
        {unit.cover_url ? (
          
          // =============================
          // NUEVA VERSIÓN: PNG TRANSPARENTE + FONDO MORADO (LOGO MÁS PEQUEÑO)
          // =============================
          <div className="h-full w-full bg-[#341A67] flex items-center justify-center relative overflow-hidden">

            <img
              src={unit.cover_url}
              alt={unit.name}
              className="max-w-[200px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

        ) : (
          // SIN IMAGEN
          <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
            <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/30" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Badge superior izquierdo */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold bg-white text-primary-600 shadow-lg backdrop-blur-sm border border-white/20">
            {badge}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col gap-4">
        
        {/* Título y descripción */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
            {unit.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {unit.description || 'Unidad administrativa del GAMC'}
          </p>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col gap-3 py-3 border-t border-slate-100">
          
          {/* Ubicación */}
          {unit.address && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 text-slate-400 mt-0.5">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm text-slate-600 flex-1">{unit.address}</span>
            </div>
          )}

          {/* Teléfono */}
          {unit.phones && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0 text-slate-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-sm text-slate-600">{unit.phones}</span>
            </div>
          )}

          {/* Sitio web */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-slate-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            {unit.website ? (
              <a 
                href={unit.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline truncate"
              >
                Sitio web disponible
              </a>
            ) : (
              <span className="text-sm text-slate-500">Sitio web disponible</span>
            )}
          </div>
        </div>

        {/* Botón Ver Detalles */}
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all group/btn border border-primary-200"
        >
          <span>Ver detalles</span>
          <svg 
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
