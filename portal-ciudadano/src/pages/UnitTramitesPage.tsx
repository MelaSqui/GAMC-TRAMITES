import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listTramitesByUnit } from '../lib/api';
import type { Tramite, Unit } from '../lib/types';
import TramiteCard from '../components/TramiteCard';

export default function UnitTramitesPage() {
  const { id } = useParams<{ id: string }>();
  const unitId = id ?? '';

  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<Unit | undefined>(undefined);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!unitId) return;
      setLoading(true);
      try {
        const { unit, items } = await listTramitesByUnit(unitId, q);
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
  }, [unitId, q]);

  return (
    <div className="min-h-screen">
      <div className="bg-primary-600/10 border-b border-primary-100">
        <div className="container py-8">
          <h1 className="text-2xl font-semibold text-text-900">
            {unit ? `Trámites de ${unit.name}` : 'Trámites de la unidad'}
          </h1>
          {unit?.description ? (
            <p className="text-text-600 mt-1">
              {unit.description.length > 160
                ? unit.description.slice(0, 160) + '…'
                : unit.description}
            </p>
          ) : null}

          <div className="mt-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar trámites de esta unidad…"
              className="w-full md:w-1/2 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      </div>

      <section className="container">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-44 animate-pulse" />
            ))}
          </div>
        ) : tramites.length === 0 ? (
          <div className="card">
            <p className="text-text-600">
              No se encontraron trámites para esta unidad {q ? 'con este criterio' : ''}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tramites.map((t) => (
              <TramiteCard key={t.id} tramite={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
