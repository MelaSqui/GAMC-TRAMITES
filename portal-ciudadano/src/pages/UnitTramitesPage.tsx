// src/pages/UnitTramitesPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../lib/api';
import type { Tramite, Unit } from '../lib/types';
import SearchInput from '../components/SearchInput';
import TramiteCard from '../components/TramiteCard';

export default function UnitTramitesPage() {
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [items, setItems] = useState<Tramite[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([API.getUnit(id), API.listTramitesByUnit(id, q ? { q } : undefined)])
      .then(([u, { items }]) => {
        setUnit(u?.data ?? u ?? null);
        setItems(items ?? []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id, q]);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {unit?.name ?? 'Trámites'}
        </h1>
        {unit?.description ? (
          <p className="text-slate-600">{unit.description}</p>
        ) : null}
      </header>

      <div className="mb-4">
        <SearchInput value={q} onChange={setQ} placeholder="Buscar trámites..." />
      </div>

      {loading && <p className="text-slate-500">Cargando...</p>}
      {err && <p className="text-red-600">Error: {err}</p>}
      {!loading && !err && items.length === 0 && (
        <p className="text-slate-500">No hay trámites.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <TramiteCard key={t.id} tramite={t} />
        ))}
      </div>
    </div>
  );
}
