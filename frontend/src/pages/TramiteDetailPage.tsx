// src/pages/TramiteDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../lib/api';
import type { Tramite } from '../lib/types';

export default function TramiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Tramite | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    API.getTramite(id!)
      .then((t) => {
        if (mounted) setData(t);
      })
      .catch((e) => setErr(e?.message ?? 'Error'))
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container mx-auto p-6">Cargando…</div>;
  if (err) return <div className="container mx-auto p-6 text-red-600">{err}</div>;
  if (!data) return <div className="container mx-auto p-6">Sin datos.</div>;

  const costo =
    data.cost === null ||
    data.cost === undefined ||
    (typeof data.cost === 'string' && data.cost === '')
      ? '—'
      : (typeof data.cost === 'string' ? data.cost : Number(data.cost).toFixed(2));

  const keywords = (data.keywords ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          {data.code ? (
            <p className="text-sm text-gray-500 mt-1">Código: {data.code}</p>
          ) : null}
        </div>
        <Link
          to={`/units/${data.unit_id}`}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          ← Volver a la unidad
        </Link>
      </div>

      {data.description ? (
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Tiempo estimado</p>
          <p className="font-medium">{data.estimated_time || '—'}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Costo</p>
          <p className="font-medium">{costo === '—' ? '—' : `Bs ${costo}`}</p>
        </div>
      </div>

      {/* Requisitos */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Requisitos</h2>
        {data.requirements_html ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.requirements_html }}
          />
        ) : (
          <p className="text-gray-500">Sin requisitos definidos.</p>
        )}
      </section>

      {/* Pasos */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Pasos</h2>
        {data.steps_html ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.steps_html }}
          />
        ) : (
          <p className="text-gray-500">Sin pasos definidos.</p>
        )}
      </section>

      {/* Normativas */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Normativas</h2>
        {data.normativas_html ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.normativas_html }}
          />
        ) : (
          <p className="text-gray-500">Sin normativas vinculadas.</p>
        )}
      </section>

      {/* Palabras clave */}
      {keywords.length ? (
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Palabras clave</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-gray-700"
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
