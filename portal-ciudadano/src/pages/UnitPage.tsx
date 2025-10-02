// src/pages/UnitPage.tsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SearchInput from "../components/SearchInput";
import Spinner from "../components/Spinner";
import UnitCard from "../components/UnitCard";
import UnitModal from "../components/UnitModal";
import EmptyState from "../components/EmptyState";
import API from "../lib/api";
import type { Unit } from "../lib/types";

export default function UnitsPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loadingUnit, setLoadingUnit] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    API.getUnits(q)
      .then((data) => !cancel && setItems(data))
      .catch((e) => !cancel && setError(e.message))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [q]);

  const handleUnitClick = async (unitId: number) => {
    setLoadingUnit(true);
    try {
      const fullUnit = await API.getUnit(unitId);
      setSelectedUnit(fullUnit);
    } catch (e: any) {
      console.error('Error cargando unidad:', e);
    } finally {
      setLoadingUnit(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title mb-2">Unidades municipales</h1>
        <p className="text-muted">
          Explora las diferentes unidades y sus trámites disponibles
        </p>
      </div>

      <div className="mb-6">
        <SearchInput value={q} onChange={setQ} placeholder="Buscar unidad..." />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-content text-center py-8">
            <div className="text-red-600 mb-2">Error al cargar</div>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No se encontraron unidades"
          subtitle={q ? "Intenta con otros términos de búsqueda" : "No hay unidades disponibles"}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => (
            <UnitCard
              key={u.id}
              unit={u}
              onClick={() => handleUnitClick(u.id)}
            />
          ))}
        </div>
      )}

      {loadingUnit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </Layout>
  );
}