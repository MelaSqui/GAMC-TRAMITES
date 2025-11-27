import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listTramitesByUnit } from '../lib/api';
import type { Tramite, Unit } from '../lib/types';
import TramiteCard from '../components/TramiteCard';
import SearchInput from '../components/SearchInput';
import Breadcrumbs from '../components/Breadcrumbs';

export default function UnitTramitesPage() {
  const { id } = useParams<{ id: string }>();
  const unitId = id ?? '';

  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<Unit | undefined>(undefined);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!unitId) return;
      setLoading(true);
      try {
        const { unit, items } = await listTramitesByUnit(unitId);
        if (!mounted) return;
        setUnit(unit);
        setTramites(items);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [unitId]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return tramites;
    const q = query.toLowerCase();
    return tramites.filter((t) =>
      [t.title, t.description, t.code]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [tramites, query]);

  return (
    <div className="min-h-screen">
      <section className="page-header">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Unidades', to: '/unidades' },
              { label: unit?.name || 'Cargando...' },
            ]}
          />

          <div className="mt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-3">
                  {unit ? unit.name : 'Cargando...'}
                </h1>
                {unit?.description && (
                  <p className="text-white/90 text-lg max-w-3xl">
                    {unit.description.length > 200
                      ? unit.description.slice(0, 200) + '...'
                      : unit.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate('/', { replace: true })}
                className="btn btn-soft bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </div>

            {unit && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {unit.contact && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Responsable</p>
                        <p className="text-sm font-medium text-white truncate">{unit.contact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {unit.phones && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Teléfono</p>
                        <p className="text-sm font-medium text-white truncate">{unit.phones}</p>
                      </div>
                    </div>
                  </div>
                )}

                {unit.address && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Ubicación</p>
                        <p className="text-sm font-medium text-white truncate">{unit.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container -mt-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar trámites de esta unidad..."
          />
        </div>
      </section>

      <section className="container section">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {query ? 'Resultados de búsqueda' : 'Trámites disponibles'}
          </h2>
          {filtered.length > 0 && (
            <p className="text-slate-600">
              {filtered.length} {filtered.length === 1 ? 'trámite encontrado' : 'trámites encontrados'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No se encontraron trámites
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {query
                  ? `No hay trámites que coincidan con "${query}" en esta unidad.`
                  : 'Esta unidad no tiene trámites disponibles en este momento.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TramiteCard key={t.id} tramite={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}