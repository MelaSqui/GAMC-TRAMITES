"use client"

import type React from "react"
import { useState } from "react"
import TramiteModal from "./TramiteModal"
import type { Tramite } from "../lib/types"

interface TramiteCardProps {
  tramite: Tramite
}

const TramiteCard: React.FC<TramiteCardProps> = ({ tramite }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <article className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group h-full flex flex-col relative">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#341A67] via-[#47B4D8] to-[#341A67]" />

        <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
          {/* Header: Título y Código */}
          <div className="flex items-start justify-between gap-3 mb-3 flex-shrink-0 min-h-[4rem]">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight group-hover:text-[#341A67] transition-colors line-clamp-3 sm:line-clamp-2">
              {tramite.title}
            </h3>
            {tramite.code && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#47B4D8] to-[#3da5c7] text-white whitespace-nowrap flex-shrink-0 shadow-md">
                {tramite.code}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed flex-shrink-0 min-h-[3rem] sm:min-h-[4rem]">
            {tramite.description || "Haz clic para ver más información sobre este trámite."}
          </p>

          {/* Información detallada con mejores iconos */}
          <div className="flex flex-col gap-2.5 mb-4 flex-grow">
            {/* Unidad responsable */}
            {tramite.unit && (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-2 rounded-lg bg-slate-50 group-hover:bg-[#47B4D8]/5 transition-colors">
                <svg
                  className="w-4 h-4 text-[#47B4D8] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="truncate text-xs sm:text-xs font-medium">{tramite.unit.name}</span>
              </div>
            )}

            {/* Tiempo estimado */}
            {tramite.estimated_time && (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                <svg
                  className="w-4 h-4 text-[#47B4D8] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-xs">{tramite.estimated_time}</span>
              </div>
            )}

            {/* Costo */}
            {tramite.cost != null && (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-xs font-bold text-green-700">
                  {Number(tramite.cost) === 0 ? "Gratuito" : `Bs. ${Number(tramite.cost).toFixed(0)}`}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100">
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#47B4D8] to-[#3da5c7] hover:from-[#3da5c7] hover:to-[#47B4D8] rounded-xl transition-all group/btn shadow-md hover:shadow-xl transform hover:scale-[1.02]"
            >
              <span>Ver detalles</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </article>

      <TramiteModal open={open} onClose={() => setOpen(false)} tramite={tramite} />
    </>
  )
}

export default TramiteCard
