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

  // Cargar trámites y unidades al inicio
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

  // Filtro dinámico según modo actual
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

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-8 mb-2">
              <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <div className="h-12 px-6 bg-white/10 rounded-full flex items-center backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold text-lg">Yo ❤️ Cocha</span>
              </div>
            </div>

            <div>
              <h1 className="text-white mb-3">Alcaldía de Cochabamba</h1>
              <p className="text-white/90 text-lg font-medium">Sistema de Trámites y Servicios</p>
              <p className="text-white/70 text-sm mt-2 italic">
                "Al servicio de la ciudadanía cochabambina"
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-6">
              <div className="stat-pill">
                <div className="text-4xl font-bold mb-1">
                  {loading ? '...' : tramites.length}
                </div>
                <div className="text-sm font-medium opacity-90">Trámites disponibles</div>
              </div>
              <div className="stat-pill">
                <div className="text-4xl font-bold mb-1">
                  {loading ? '...' : units.length}
                </div>
                <div className="text-sm font-medium opacity-90">Unidades administrativas</div>
              </div>
              <div className="stat-pill">
                <div className="text-4xl font-bold mb-1">24/7</div>
                <div className="text-sm font-medium opacity-90">En línea siempre</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de búsqueda y botón de cambio */}
      <section className="container -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={
                  viewMode === 'tramites'
                    ? 'Buscar trámites... (ej: vehículo, licencia, certificado)'
                    : 'Buscar unidades... (ej: subalcaldía, medio ambiente, planificación)'
                }
              />
            </div>
            <button
              onClick={() =>
                setViewMode(viewMode === 'tramites' ? 'unidades' : 'tramites')
              }
              className="btn btn-outline flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>
                {viewMode === 'tramites'
                  ? 'Ver por unidades'
                  : 'Ver por trámites'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Contenido dinámico */}
      <section className="container section">
        {viewMode === 'tramites' ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {query ? 'Resultados de búsqueda' : 'Trámites disponibles'}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTramites.map((t) => (
                  <TramiteCard key={t.id} tramite={t} onOpen={() => setOpenTramite(t)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {query ? 'Unidades encontradas' : 'Unidades administrativas'}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnits.map((u) => (
                  <UnitCard key={u.id} unit={u} onOpen={() => setOpenUnit(u)} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <TramiteModal open={!!openTramite} tramite={openTramite} onClose={() => setOpenTramite(null)} />
      <UnitModal open={!!openUnit} unit={openUnit} onClose={() => setOpenUnit(null)} />
    </div>
  );
}
