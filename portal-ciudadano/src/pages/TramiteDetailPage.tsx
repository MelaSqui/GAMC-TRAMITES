import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../lib/api";
import type { Tramite } from "../lib/types";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";

export default function TramiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [t, setT] = useState<Tramite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    API.getTramite(id)
      .then(setT)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const costo =
    t?.cost == null ? "N/D" : t.cost === 0 ? "Gratis" : `Bs. ${t.cost}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Unidades", to: "/" },
          t?.unit ? { label: t.unit.name, to: `/unidades/${t.unit.id}` } : { label: "Unidad" },
          { label: t?.title ?? "Trámite" },
        ]}
      />

      {loading ? (
        <Spinner className="mt-10" />
      ) : error ? (
        <div className="mt-6 text-sm text-red-700">{error}</div>
      ) : !t ? (
        <div className="mt-6 text-sm text-red-700">Trámite no encontrado.</div>
      ) : (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">{t.code}</div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">{t.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
                  ⏱ {t.estimated_time ?? "N/D"}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
                  💰 {costo}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {t.unit && (
                <Link
                  to={`/unidades/${t.unit.id}`}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
                >
                  ← Tramites de {t.unit.name}
                </Link>
              )}
              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                Inicio
              </Link>
            </div>
          </header>

          <section className="mt-5">
            <h2 className="text-lg font-semibold text-slate-900">Descripción</h2>
            <p className="mt-2 text-slate-700">{t.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Requisitos</h2>
            {t.requirements?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                {t.requirements.map((r, i) => (
                  <li key={i}>
                    <span className="font-medium">{r.item}</span>
                    {r.detalle ? <> — {r.detalle}</> : null}
                    {r.link ? (
                      <>
                        {" "}
                        <a
                          href={r.link}
                          target="_blank"
                          className="text-blue-700 underline"
                          rel="noreferrer"
                        >
                          enlace
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-slate-500">No hay requisitos registrados.</p>
            )}
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Pasos</h2>
            {t.steps?.length ? (
              <ol className="mt-2 list-decimal space-y-2 pl-6 text-slate-700">
                {t.steps.map((s, i) => (
                  <li key={i}>
                    <span className="font-medium">Paso {s.paso}:</span> {s.detalle}
                    {s.link ? (
                      <>
                        {" "}
                        <a
                          href={s.link}
                          target="_blank"
                          className="text-blue-700 underline"
                          rel="noreferrer"
                        >
                          enlace
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-slate-500">No hay pasos registrados.</p>
            )}
          </section>

          {t.normativas && t.normativas.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Normativas asociadas</h2>
              <ul className="mt-2 space-y-1 text-slate-700">
                {t.normativas.map((n) => (
                  <li key={n.id} className="flex items-center gap-2">
                    <span className="font-medium">{n.title}</span>
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        PDF
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
    </>
  );
}
