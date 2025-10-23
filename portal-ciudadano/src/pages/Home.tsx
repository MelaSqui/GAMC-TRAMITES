import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTramites as fetchTramitesApi } from '../lib/api';
import type { Tramite } from '../lib/types';
import SearchInput from '../components/SearchInput';
import TramiteCard from '../components/TramiteCard';
import TramiteModal from '../components/TramiteModal';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState<{ tramites: number; units: number } | null>(null);

  const [openTramite, setOpenTramite] = useState<Tramite | null>(null);
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchTramitesApi({ q: '' });
        if (!mounted) return;
        setSummary({ tramites: list.length, units: new Set(list.map(t => t.unit?.id)).size });
        setTramites(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return tramites;
    const q = query.toLowerCase();
    return tramites.filter((t) =>
      [
        t.title,
        t.description,
        t.unit?.name,
        Array.isArray(t.keywords) ? t.keywords.join(',') : t.keywords,
        t.code,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [tramites, query]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative">
        <div className="hero">
          <div className="container">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-6 opacity-90">
                <img src="/brand/cocha.svg" alt="Alcaldía de Cochabamba" className="h-10" />
                <img src="/brand/yo-cocha.svg" alt="Yo ❤️ Cocha" className="h-8" />
              </div>

              <h1 className="mt-6">Alcaldía de Cochabamba</h1>
              <p className="mt-2 text-white/90">Sistema de Trámites y Servicios</p>
              <p className="mt-1 text-white/80 text-sm">“Al servicio de la ciudadanía cochabambina”</p>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl w-full">
                <div className="stat-pill">
                  <div className="text-3xl font-semibold">
                    {summary ? summary.tramites : '—'}
                  </div>
                  <div className="text-xs tracking-wide">Trámites disponibles</div>
                </div>
                <div className="stat-pill">
                  <div className="text-3xl font-semibold">
                    {summary ? summary.units : '—'}
                  </div>
                  <div className="text-xs tracking-wide">Unidades administrativas</div>
                </div>
                <div className="stat-pill">
                  <div className="text-3xl font-semibold">24/7</div>
                  <div className="text-xs tracking-wide">En línea siempre</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* barra de búsqueda + botón ver por unidades */}
        <div className="container -mt-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder='Buscar trámites… (ej: vehículo, licencia, certificado)'
              />
            </div>
            <Link
              to="/unidades"
              className="btn-primary h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <span>Ver por unidades</span>
            </Link>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="container">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-900">
            Resultados {filtered.length ? `(${filtered.length})` : ''}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <p className="text-text-600">
              No encontramos resultados para <strong>{query}</strong>. Intenta con otra palabra clave.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => (
              <TramiteCard key={t.id} tramite={t} onOpen={() => setOpenTramite(t)} />
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE TRÁMITE */}
      <TramiteModal
  open={!!openTramite}
  tramite={openTramite ?? null}
  onClose={() => setOpenTramite(null)}
/>


    </div>
  );
}


