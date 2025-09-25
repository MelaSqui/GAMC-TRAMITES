import { Link } from "react-router-dom";
import type { Tramite } from "../lib/types";

type Props = { tramite: Tramite };

export default function TramiteCard({ tramite }: Props) {
  const costo =
    tramite.cost == null ? "N/D" : tramite.cost === 0 ? "Gratis" : `Bs. ${tramite.cost}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500">{tramite.code}</div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{tramite.title}</h3>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
            ⏱ {tramite.estimated_time ?? "N/D"}
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
            💰 {costo}
          </span>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{tramite.description}</p>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/tramites/${tramite.id}`}
          className="inline-flex items-center rounded-xl bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
}
