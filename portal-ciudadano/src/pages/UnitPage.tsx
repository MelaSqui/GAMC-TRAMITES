import { useEffect, useState } from 'react';
import { API } from '../lib/api';
import type { Unit } from '../lib/types';
import SearchInput from '../components/SearchInput';
import UnitCard from '../components/UnitCard';

export default function UnitPage() {
  const [all, setAll] = useState<Unit[]>([]);
  const [items, setItems] = useState<Unit[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    API.listUnits()
      .then((list) => {
        const units = Array.isArray(list) ? list : [];
        setAll(units);
        setItems(units);
      })
      .catch((e: any) => setErr(String(e?.message ?? 'Error')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = q.trim().toLowerCase();
    if (!t) return setItems(all);
    setItems(
      all.filter(
        (u) =>
          u.name.toLowerCase().includes(t) ||
          (u.code_prefix ?? '').toLowerCase().includes(t),
      ),
    );
  }, [q, all]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Unidades municipales</h1>
      <p className="text-slate-600 mb-4">
        Elige una unidad para ver los trámites disponibles.
      </p>

      <div className="mb-5">
        <SearchInput value={q} onChange={setQ} placeholder="Buscar..." />
      </div>

      {loading && <p className="text-slate-500">Cargando…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}
      {!loading && !err && items.length === 0 && (
        <p className="text-slate-500">No hay unidades.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((u) => (
          <UnitCard key={u.id} unit={u} />
        ))}
      </div>
    </div>
  );
}
