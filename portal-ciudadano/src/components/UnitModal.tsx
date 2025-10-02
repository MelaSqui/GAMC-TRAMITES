// src/components/UnitModal.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Unit } from "../lib/types";

export default function UnitModal({
  unit,
  onClose,
}: {
  unit: Unit;
  onClose: () => void;
}) {
  // Agrega esta línea para debug
  console.log('Datos de la unidad en el modal:', unit);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleViewTramites = () => {
    onClose();
    navigate(`/units/${unit.id}`);
  };

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
  ];
  const colorClass = colors[unit.id % colors.length];

  const initials = unit.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {unit.cover_url ? (
            <img
              src={unit.cover_url}
              alt={unit.name}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className={`w-full h-56 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <span className="text-7xl font-bold text-white/90">{initials}</span>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{unit.name}</h2>
            {unit.code_prefix && (
              <div className="flex items-center gap-2">
                <span className="badge badge-neutral">Código: {unit.code_prefix}</span>
              </div>
            )}
          </div>

          {unit.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Descripción
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {unit.description}
              </p>
            </div>
          )}

          {unit.level && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Nivel organizacional
              </h3>
              <p className="text-slate-600">{unit.level}</p>
            </div>
          )}

          {(unit.contact_name || unit.address || unit.phones || unit.internal_phone || unit.website_url) && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                Información de contacto
              </h3>
              <div className="space-y-3 text-sm">
                {unit.contact_name && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div className="text-slate-500 text-xs">Responsable</div>
                      <div className="text-slate-700 font-medium">{unit.contact_name}</div>
                    </div>
                  </div>
                )}
                
                {unit.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="text-slate-500 text-xs">Dirección</div>
                      <div className="text-slate-700">{unit.address}</div>
                    </div>
                  </div>
                )}
                
                {unit.phones && unit.phones.length > 0 && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <div className="text-slate-500 text-xs">Teléfonos</div>
                      <div className="text-slate-700">{unit.phones.join(", ")}</div>
                    </div>
                  </div>
                )}
                
                {unit.internal_phone && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-slate-500 text-xs">Teléfono interno</div>
                      <div className="text-slate-700">{unit.internal_phone}</div>
                    </div>
                  </div>
                )}
                
                {unit.website_url && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div>
                      <div className="text-slate-500 text-xs">Sitio web</div>
                      <a
                        href={unit.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {unit.website_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Trámites disponibles</div>
                <div className="text-3xl font-bold text-blue-600">
                  {unit.tramites_count ?? 0}
                </div>
              </div>
              <svg className="w-12 h-12 text-blue-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cerrar
          </button>
          <button onClick={handleViewTramites} className="btn btn-primary">
            Ver trámites
          </button>
        </div>
      </div>
    </div>
  );
}