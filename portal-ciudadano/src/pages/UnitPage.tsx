import React, { useEffect, useState } from 'react';
import { getUnits } from '../lib/api';
import type { Unit } from '../lib/types';
import UnitCard from '../components/UnitCard';
import UnitModal from '../components/UnitModal';

export default function UnitPage() {
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [openUnit, setOpenUnit] = useState<Unit | null>(null);

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

  return (
    <div className="min-h-screen">
      <div className="bg-primary-600/10 border-b border-primary-100">
        <div className="container py-8">
          <h1 className="text-2xl font-semibold text-text-900">Unidades Administrativas</h1>
          <p className="text-text-600 mt-1">
            Explora los trámites organizados por unidad administrativa.
          </p>
        </div>
      </div>

      <section className="container">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-56 animate-pulse" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="card">
            <p className="text-text-600">No hay unidades disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {units.map((u) => (
              <UnitCard key={u.id} unit={u} onOpen={() => setOpenUnit(u)} />
            ))}
          </div>
        )}
      </section>

      <UnitModal open={!!openUnit} unit={openUnit} onClose={() => setOpenUnit(null)} />
    </div>
  );
}
