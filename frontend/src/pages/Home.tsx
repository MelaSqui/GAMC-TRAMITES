"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchTramitesPaginated, fetchFeaturedTramites, getUnits } from "../lib/api"
import type { Tramite, Unit } from "../lib/types"
import SearchInput from "../components/SearchInput"
import TramiteCard from "../components/TramiteCard"
import TramiteModal from "../components/TramiteModal"
import UnitModal from "../components/UnitModal"
import UnitsCarousel from "../components/UnitsCarousel"
import FeaturedCarousel from "../components/FeaturedCarousel"
import UnitsMenu from "../components/UnitsMenu"
import Pagination from "../components/Pagination"
import { BRAND_COLORS } from "../lib/theme-colors"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [featuredTramites, setFeaturedTramites] = useState<Tramite[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [query, setQuery] = useState("")
  const [openTramite, setOpenTramite] = useState<Tramite | null>(null)
  const [openUnit, setOpenUnit] = useState<Unit | null>(null)
  const [viewMode, setViewMode] = useState<"tramites" | "unidades">("tramites")

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationMeta, setPaginationMeta] = useState<any>(null)
  const [paginatedTramites, setPaginatedTramites] = useState<Tramite[]>([])
  const [loadingTramites, setLoadingTramites] = useState(false)

  const PER_PAGE = 4

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [unitList, featured] = await Promise.all([getUnits(), fetchFeaturedTramites()])
        if (!mounted) return
        setUnits(unitList)
        setFeaturedTramites(featured)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    setLoadingTramites(true)
    ;(async () => {
      try {
        const response = await fetchTramitesPaginated({
          unitId: selectedUnit?.id,
          q: query || undefined,
          page: currentPage,
          perPage: PER_PAGE,
        })
        if (!mounted) return
        setPaginatedTramites(response.data)
        setPaginationMeta(response.meta)
      } catch (error) {
        console.error("Error fetching paginated tramites:", error)
      } finally {
        if (mounted) setLoadingTramites(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [selectedUnit, currentPage, query])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedUnit, query])

  const filteredUnits = useMemo(() => {
    if (!query.trim()) return units
    const q = query.toLowerCase()
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.description?.toLowerCase().includes(q) ||
        u.contact?.toLowerCase().includes(q),
    )
  }, [units, query])

  const popularSearches = ["Vehículo", "Licencia", "Construcción", "Certificado", "Nacimiento", "Predial"]

  return (
    <div
      className="min-h-screen font-poppins w-full overflow-x-hidden"
      style={{
        backgroundColor: '#ffffffff',
      }}
    >
      {/* PREMIUM HERO - Enhanced with animations */}
      <section
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 font-poppins w-full"
        style={{
          background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryHover} 100%)`,
        }}
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: "url('/images/Portada_1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundAttachment: "fixed",
          }}
        ></div>

        {/* Overlay oscuro suave */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated background elements with staggered animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float"></div>
        </div>

        <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
            <div className="flex items-center justify-center animate-in fade-in zoom-in duration-700">
              <img
                src="/images/Logo_cocha_blanco.png"
                alt="Logo Alcaldía"
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="w-full space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg"
                style={{ color: '#E8DCFF' }}
              >
                Guía de Trámites y Servicios
              </h1>
              <p 
                className="text-base sm:text-lg font-medium mb-2"
                style={{ color: '#D8C7F7' }}
              >
                Alcaldía de Cochabamba
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Búsqueda - z-10 para que quede debajo del modal (z-9999) */}
      <section className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-6 sm:-mt-8 md:-mt-10 mb-8 sm:mb-10 md:mb-12 relative z-10">
        <div className="bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-200/80 p-5 sm:p-6 md:p-8 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
          <div className="flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-6">
            <div className="flex-1">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={
                  viewMode === "tramites"
                    ? " Buscar trámites... (ej: vehículo, licencia)"
                    : " Buscar unidades... (ej: subalcaldía)"
                }
              />
            </div>

            <button
              onClick={() => setViewMode(viewMode === "tramites" ? "unidades" : "tramites")}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: BRAND_COLORS.primary,
                background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryHover} 100%)`,
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>{viewMode === "tramites" ? "Ver unidades" : "Ver trámites"}</span>
            </button>
          </div>

          {!query && viewMode === "tramites" && (
            <div className="pt-4 sm:pt-5 border-t border-slate-200">
              <p className="text-xs sm:text-sm text-slate-600 font-bold mb-3 sm:mb-4 uppercase tracking-wide">
                Búsquedas populares:
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_COLORS.accent} 0%, ${BRAND_COLORS.accentHover} 100%)`,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Contenido principal - sin z-index alto */}
      <section className="relative w-full pb-16 sm:pb-20 md:pb-24">
        <div className="relative w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {viewMode === "tramites" ? (
            <>
              {featuredTramites.length > 0 && (
                <div className="mb-10 sm:mb-12 md:mb-16">
                  <FeaturedCarousel tramites={featuredTramites} />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="min-w-0">
                  <h2 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg"
                    style={{ color: '#341A67' }}
                  >
                    {selectedUnit ? `Trámites de ${selectedUnit.name}` : "Todos los Trámites"}
                  </h2>
                  {paginationMeta && (
                    <p 
                      className="text-xs sm:text-sm mt-2"
                      style={{ color: '#584291' }}
                    >
                      {paginationMeta.total} trámites {query ? "encontrados" : "disponibles"}
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-auto">
                  <UnitsMenu units={units} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />
                </div>
              </div>

              {/* Grid with responsive loading */}
              {loadingTramites ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.from({ length: PER_PAGE }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 h-80 sm:h-96 animate-pulse" />
                  ))}
                </div>
              ) : paginatedTramites.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 shadow-lg px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-slate-400 sm:w-8 sm:h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    {query
                      ? `No encontramos trámites que coincidan con "${query}"`
                      : selectedUnit
                        ? `No hay trámites disponibles en ${selectedUnit.name}`
                        : "No hay trámites disponibles"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-max">
                    {paginatedTramites.map((t) => (
                      <TramiteCard key={t.id} tramite={t} />
                    ))}
                  </div>

                  {paginationMeta && paginationMeta.last_page > 1 && (
                    <Pagination
                      currentPage={paginationMeta.current_page}
                      lastPage={paginationMeta.last_page}
                      total={paginationMeta.total}
                      perPage={paginationMeta.per_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="mb-8 sm:mb-10">
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg mb-2"
                  style={{ color: '#341A67' }}
                >
                  {query ? "Unidades encontradas" : "Unidades administrativas"}
                </h2>
                {filteredUnits.length > 0 && (
                  <p 
                    className="text-xs sm:text-sm"
                    style={{ color: '#584291' }}
                  >
                    {filteredUnits.length} {filteredUnits.length === 1 ? "unidad encontrada" : "unidades encontradas"}
                  </p>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-200 h-80 sm:h-96 animate-pulse" />
                  ))}
                </div>
              ) : !filteredUnits || filteredUnits.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200/80 shadow-lg px-4 sm:px-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <svg
                      width="40"
                      height="40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No se encontraron unidades</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {query ? `No encontramos unidades que coincidan con "${query}"` : "No hay unidades disponibles"}
                  </p>
                </div>
              ) : (
                <UnitsCarousel units={filteredUnits} onOpenUnit={(unit) => setOpenUnit(unit)} />
              )}
            </>
          )}
        </div>
      </section>

      <TramiteModal open={!!openTramite} tramite={openTramite} onClose={() => setOpenTramite(null)} />
      <UnitModal open={!!openUnit} unit={openUnit} onClose={() => setOpenUnit(null)} />
    </div>
  )
}