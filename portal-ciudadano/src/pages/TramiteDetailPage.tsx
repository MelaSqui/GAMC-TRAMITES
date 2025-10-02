import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import API  from "../lib/api";
import type { Tramite } from "../lib/types";

export default function TramiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [t, setT] = useState<Tramite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    API.getTramite(id)
      .then((data) => setT(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const costo =
    t?.cost == null ? "No especificado" : t.cost === 0 ? "Gratuito" : `Bs. ${t.cost}`;

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Unidades", to: "/" },
          t?.unit ? { label: t.unit.name, to: `/units/${t.unit.id}` } : { label: "Unidad" },
          { label: "Trámite" },
        ]}
      />

      {/* Top pills + botón */}
      <div className="card mb-6">
        <div className="card-content flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-3 flex-wrap">
            <span className="badge badge-info">⏱️ Tiempo: {t?.estimated_time ?? "No especificado"}</span>
            <span className="badge badge-success">💰 Costo: {costo}</span>
          </div>
          <Link to="/" className="btn btn-primary">🏠 Inicio</Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : !t ? (
        <div className="text-slate-500">Trámite no encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="section-title">Descripción</h2>
              </div>
              <div className="card-content">
                {t.description ? (
                  <p className="text-slate-700 leading-relaxed">{t.description}</p>
                ) : (
                  <p className="text-slate-500">Sin descripción.</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="section-title">Requisitos</h2>
              </div>
              <div className="card-content">
                {t.requirements?.length ? (
                  <ul className="space-y-3">
                    {t.requirements.map((r, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="badge badge-neutral">{i + 1}</span>
                        <div>
                          <div className="font-medium">{r.item}</div>
                          {r.detalle && <div className="text-sm text-slate-600">{r.detalle}</div>}
                          {r.link && (
                            <a className="text-sm text-blue-700 underline" href={r.link} target="_blank" rel="noreferrer">
                              Ver enlace
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No hay requisitos registrados.</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="section-title">Procedimiento paso a paso</h2>
              </div>
              <div className="card-content">
                {t.steps?.length ? (
                  <ol className="space-y-4">
                    {t.steps.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="badge badge-info">{s.paso}</span>
                        <div>
                          <div className="font-medium">{s.detalle}</div>
                          {s.link && (
                            <a className="text-sm text-blue-700 underline" href={s.link} target="_blank" rel="noreferrer">
                              Ver más información
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-slate-500">No hay pasos registrados.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Información adicional</h3>
              </div>
              <div className="card-content space-y-4">
                <div>
                  <div className="text-sm text-slate-600">Código del trámite</div>
                  <div className="font-semibold">{t.code ?? "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Costo</div>
                  <div className="font-semibold">{costo}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Tiempo estimado</div>
                  <div className="font-semibold">{t.estimated_time ?? "No especificado"}</div>
                </div>
              </div>
            </div>

            {!!t.normativas?.length && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold">Marco normativo</h3>
                </div>
                <div className="card-content space-y-3">
                  {t.normativas!.map((n) => (
                    <div key={n.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="font-medium text-sm">{n.title}</div>
                      {n.link && (
                        <a className="btn btn-outline btn-sm" href={n.link} target="_blank" rel="noreferrer">
                          PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </Layout>
  );
}
