import React, { useEffect, useState } from 'react';
import { getUnits } from '../lib/api';
import type { Unit } from '../lib/types';
import UnitCard from '../components/UnitCard';
import UnitModal from '../components/UnitModal';

export default function UnitPage() {
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [openUnit, setOpenUnit] = useState<Unit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUnits();
        if (!mounted) return;
        setUnits(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUnits = React.useMemo(() => {
    if (!searchQuery.trim()) return units;
    const q = searchQuery.toLowerCase();
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.description?.toLowerCase().includes(q) ||
        u.contact?.toLowerCase().includes(q)
    );
  }, [units, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="page-header">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="section-title mb-3">Unidades Administrativas</h1>
            <p className="text-white/90 text-lg">
              Explora los trámites organizados por unidad administrativa del municipio.
            </p>
          </div>

          <div className="mt-6">
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar unidad por nombre..."
                className="input pl-11"
              />
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron unidades</h3>
              <p className="text-slate-600">
                {searchQuery
                  ? `No hay unidades que coincidan con "${searchQuery}".`
                  : 'No hay unidades administrativas disponibles.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600">
                Mostrando <strong>{filteredUnits.length}</strong> {filteredUnits.length === 1 ? 'unidad' : 'unidades'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((u) => (
                <UnitCard key={u.id} unit={u} onOpen={() => setOpenUnit(u)} />
              ))}
            </div>
          </>
        )}
      </section>

      <UnitModal open={!!openUnit} unit={openUnit} onClose={() => setOpenUnit(null)} />
    </div>
  );
}
