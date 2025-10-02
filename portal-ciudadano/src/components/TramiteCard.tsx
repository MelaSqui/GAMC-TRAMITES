import { Link } from "react-router-dom";
import type { Tramite } from "../lib/types";

export default function TramiteCard({ t }: { t: Tramite }) {
  return (
    <Link to={`/tramites/${t.id}`} className="block group">
      <div className="card p-5 hover:shadow-md transition">
        <div className="flex items-start justify-between">
          <div className="pr-3">
            <div className="font-semibold text-slate-900">{t.title}</div>
            {t.description && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {t.description}
              </p>
            )}
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="badge badge-success">
                💰 {t.cost == null ? "No especificado" : t.cost === 0 ? "Gratuito" : `Bs. ${t.cost}`}
              </span>
              <span className="badge badge-info">
                ⏱️ {t.estimated_time ?? "No especificado"}
              </span>
            </div>
          </div>
          {t.code && (
            <span className="badge badge-neutral self-start">{t.code}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
