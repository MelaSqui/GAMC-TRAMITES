// src/pages/UnitTramitesPage.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SearchInput from "../components/SearchInput";
import Spinner from "../components/Spinner";
import TramiteCard from "../components/TramiteCard";
import EmptyState from "../components/EmptyState";
import API from "../lib/api";
import type { Tramite, Unit } from "../lib/types";

export default function UnitTramitesPage() {
  const { id } = useParams<{ id: string }>();
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState<Unit | null>(null);
  const [items, setItems] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancel = false;
    setLoading(true);

    API.listTramitesByUnit(id, q)
      .then(({ unit, items }) => {
        if (cancel) return;
        setUnit(unit ?? null);
        setItems(items);
        setError(null);
      })
      .catch((e) => !cancel && setError(e.message))
      .finally(() => !cancel && setLoading(false));

    return () => {
      cancel = true;
    };
  }, [id, q]);

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/units" },
          { label: "Unidades", to: "/units" },
          unit ? { label: unit.name } : { label: "..." },
        ]}
      />

      {/* Header de la unidad */}
      {unit && (
        <div className="card mb-6">
          <div className="card-content">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {unit.name}
                </h1>
                {unit.description && (
                  <p className="text-slate-600 mb-3">{unit.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {unit.code_prefix && (
                    <span className="badge badge-neutral">
                      Código: {unit.code_prefix}
                    </span>
                  )}
                  <span className="badge badge-info">
                    {items.length} trámites
                  </span>
                </div>
              </div>
              <Link to="/units" className="btn btn-outline">
                ← Volver
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="mb-6">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Buscar trámite..."
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-content text-center py-8">
            <div className="text-red-600 mb-2">❌ Error al cargar</div>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No se encontraron trámites"
          subtitle={
            q
              ? "Intenta con otros términos de búsqueda"
              : "Esta unidad aún no tiene trámites registrados"
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <TramiteCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </Layout>
  );
}