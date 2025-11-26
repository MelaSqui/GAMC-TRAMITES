import React, { useEffect, useMemo, useState } from 'react';
import { fetchTramites as fetchTramitesApi, getUnits } from '../lib/api';
import type { Tramite, Unit } from '../lib/types';
import SearchInput from '../components/SearchInput';
import TramiteCard from '../components/TramiteCard';
import TramiteModal from '../components/TramiteModal';
import UnitCard from '../components/UnitCard';
import UnitModal from '../components/UnitModal';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [query, setQuery] = useState('');
  const [openTramite, setOpenTramite] = useState<Tramite | null>(null);
  const [openUnit, setOpenUnit] = useState<Unit | null>(null);
  const [viewMode, setViewMode] = useState<'tramites' | 'unidades'>('tramites');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tramiteList, unitList] = await Promise.all([
          fetchTramitesApi({ q: '' }),
          getUnits(),
        ]);
        if (!mounted) return;
        setTramites(tramiteList);
        setUnits(unitList);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTramites = useMemo(() => {
    if (!query.trim()) return tramites;
    const q = query.toLowerCase();
    return tramites.filter((t) =>
      [t.title, t.description, t.unit?.name, t.code]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [tramites, query]);

  const filteredUnits = useMemo(() => {
    if (!query.trim()) return units;
    const q = query.toLowerCase();
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.description?.toLowerCase().includes(q) ||
        u.contact?.toLowerCase().includes(q),
    );
  }, [units, query]);

  const popularSearches = ['Vehículo', 'Licencia', 'Construcción', 'Certificado', 'Nacimiento', 'Predial'];

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 py-16 lg:py-20 font-poppins">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: "url('/images/Portada_1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundAttachment: 'fixed'
          }}
        ></div>

        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        {/* Contenido */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logos */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <img 
                src="/images/Logo_cocha_blanco.png" 
                alt="Logo Alcaldía" 
                className="w-56 h-56 object-contain"
              />
            </div>

            {/* Título */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                Guía de Trámites y Servicios
              </h1>
              <p className="text-lg text-white/90 font-medium mb-2">
                Alcaldía de Cochabamba
              </p>
              <p className="text-sm text-white/70 italic">
                "Al servicio de la ciudadanía cochabambina"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Búsqueda */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={
                  viewMode === 'tramites'
                    ? 'Buscar trámites... (ej: vehículo, licencia, certificado)'
                    : 'Buscar unidades... (ej: subalcaldía, medio ambiente)'
                }
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'tramites' ? 'unidades' : 'tramites')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all whitespace-nowrap"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>
                {viewMode === 'tramites' ? 'Ver por unidades' : 'Ver por trámites'}
              </span>
            </button>
          </div>

          {/* Búsquedas populares */}
          {!query && viewMode === 'tramites' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 font-semibold mb-2">
                Búsquedas populares:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 hover:border-slate-300 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            {viewMode === 'tramites'
              ? query
                ? 'Resultados de búsqueda'
                : 'Trámites disponibles'
              : query
              ? 'Unidades encontradas'
              : 'Unidades administrativas'}
          </h2>
          {viewMode === 'tramites' && filteredTramites.length > 0 && (
            <p className="text-slate-600">
              {filteredTramites.length} {filteredTramites.length === 1 ? 'trámite encontrado' : 'trámites encontrados'}
            </p>
          )}
          {viewMode === 'unidades' && filteredUnits.length > 0 && (
            <p className="text-slate-600">
              {filteredUnits.length} {filteredUnits.length === 1 ? 'unidad encontrada' : 'unidades encontradas'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse"
              />
            ))}
          </div>
        ) : viewMode === 'tramites' ? (
          filteredTramites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {query
                  ? `No encontramos trámites que coincidan con "${query}"`
                  : 'No hay trámites disponibles'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTramites.map((t) => (
                <TramiteCard key={t.id} tramite={t} onOpen={() => setOpenTramite(t)} />
              ))}
            </div>
          )
        ) : (
          filteredUnits.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No se encontraron unidades
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {query
                  ? `No encontramos unidades que coincidan con "${query}"`
                  : 'No hay unidades disponibles'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((u) => (
                <UnitCard key={u.id} unit={u} onOpen={() => setOpenUnit(u)} />
              ))}
            </div>
          )
        )}
      </section>

      <TramiteModal open={!!openTramite} tramite={openTramite} onClose={() => setOpenTramite(null)} />
      <UnitModal open={!!openUnit} unit={openUnit} onClose={() => setOpenUnit(null)} />
    </div>
  );
}