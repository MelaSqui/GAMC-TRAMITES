"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { listTramitesByUnit } from "../lib/api"
import type { Tramite, Unit } from "../lib/types"
import TramiteCard from "../components/TramiteCard"
import SearchInput from "../components/SearchInput"
import Breadcrumbs from "../components/Breadcrumbs"

export default function UnitTramitesPage() {
  const { id } = useParams<{ id: string }>()
  const unitId = id ?? ""

  const [loading, setLoading] = useState(true)
  const [unit, setUnit] = useState<Unit | undefined>(undefined)
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!unitId) return
      setLoading(true)
      try {
        const { unit, items } = await listTramitesByUnit(unitId)
        if (!mounted) return
        setUnit(unit)
        setTramites(items)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [unitId])

  const filtered = React.useMemo(() => {
    if (!query.trim()) return tramites
    const q = query.toLowerCase()
    return tramites.filter((t) => [t.title, t.description, t.code].filter(Boolean).join(" ").toLowerCase().includes(q))
  }, [tramites, query])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <section className="page-header bg-gradient-to-r from-purple-700 to-purple-600">
        <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: "Inicio", to: "/" },
              { label: "Unidades", to: "/unidades" },
              { label: unit?.name || "Cargando..." },
            ]}
          />

          <div className="mt-3 sm:mt-4 md:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 break-words">
                  {unit ? unit.name : "Cargando..."}
                </h1>
                {unit?.description && (
                  <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-3xl line-clamp-2 sm:line-clamp-3">
                    {unit.description.length > 200 ? unit.description.slice(0, 200) + "..." : unit.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate("/", { replace: true })}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:rounded-xl transition-all text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </div>

            {unit && (
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {unit.contact && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Responsable</p>
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{unit.contact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {unit.phones && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Teléfono</p>
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{unit.phones}</p>
                      </div>
                    </div>
                  </div>
                )}

                {unit.address && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 sm:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 mb-0.5">Ubicación</p>
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{unit.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-4 sm:-mt-5 md:-mt-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 md:p-6">
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar trámites de esta unidad..." />
        </div>
      </section>

      <section className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
            {query ? "Resultados de búsqueda" : "Trámites disponibles"}
          </h2>
          {filtered.length > 0 && (
            <p className="text-xs sm:text-sm text-slate-600">
              {filtered.length} {filtered.length === 1 ? "trámite encontrado" : "trámites encontrados"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl h-72 sm:h-96 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm px-4 sm:px-6 py-8 sm:py-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
              No se encontraron trámites
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {query
                ? `No hay trámites que coincidan con "${query}" en esta unidad.`
                : "Esta unidad no tiene trámites disponibles en este momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 auto-rows-max">
            {filtered.map((t) => (
              <TramiteCard key={t.id} tramite={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
