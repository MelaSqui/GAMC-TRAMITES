// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../lib/api";
import type { Unit } from "../lib/types";
import SearchInput from "../components/SearchInput";
import Spinner from "../components/Spinner";
import UnitCard from "../components/UnitCard";
import UnitModal from "../components/UnitModal";

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loadingUnit, setLoadingUnit] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    API.getUnits(searchQuery)
      .then((list) => {
        if (!alive) return;
        setUnits(list);
        setError(null);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [searchQuery]);

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
    <div className="container section-padding">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Unidades municipales</h1>
        <Link to="/" className="btn btn-primary">Inicio</Link>
      </div>

      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar..." />

      {loading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : error ? (
        <p className="text-red-600 mt-4">Error: {error}</p>
      ) : units.length === 0 ? (
        <p className="mt-4 text-muted">No hay unidades.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {units.map((u) => (
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
    </div>
  );
}