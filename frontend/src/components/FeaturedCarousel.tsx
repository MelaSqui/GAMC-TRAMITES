"use client"

import { useEffect, useState, useRef } from "react"
import TramiteCard from "./TramiteCard"
import TramiteModal from "./TramiteModal"
import type { Tramite } from "../lib/types"

type Props = {
  tramites?: Tramite[] | null
  scrollSpeed?: number
}

export default function FeaturedCarousel({
  tramites,
  scrollSpeed = 30,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Validación defensiva
  const safeTramites = Array.isArray(tramites) ? tramites : []

  // Duplicar items múltiples veces para scroll infinito verdadero
  const extendedTramites = [...safeTramites, ...safeTramites]

  // Scroll infinito con requestAnimationFrame
  useEffect(() => {
    if (!containerRef.current || safeTramites.length === 0) return

    const container = containerRef.current
    const cardWidth = 340 + 20 // ancho de card + gap
    const totalWidth = cardWidth * safeTramites.length

    const scroll = () => {
      if (!isPaused && container) {
        // Incrementar la posición actual del scroll
        container.scrollLeft += scrollSpeed / 60 // 60fps

        // Cuando llegamos al final del primer conjunto, reseteamos sin que se note
        if (container.scrollLeft >= totalWidth) {
          container.scrollLeft = 0
        }
      }
      animationFrameRef.current = requestAnimationFrame(scroll)
    }

    animationFrameRef.current = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [safeTramites.length, scrollSpeed, isPaused])

  const handleOpenTramite = (tramite: Tramite) => {
    setSelectedTramite(tramite)
  }

  const handleCloseTramite = () => {
    setSelectedTramite(null)
  }

  // Si no hay trámites favoritos, no renderizar nada
  if (safeTramites.length === 0) {
    return null
  }

  // Si hay 4 o menos favoritos, mostrar grid simple
  if (safeTramites.length <= 4) {
    return (
      <>
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#341A67' }}>
                Trámites Destacados
              </h2>
              <p className="text-sm" style={{ color: '#584291' }}>
                Los trámites más solicitados por la ciudadanía
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeTramites.map((tramite) => (
              <div key={tramite.id} onClick={() => handleOpenTramite(tramite)} className="cursor-pointer">
                <TramiteCard 
                  tramite={tramite} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modal fuera del carrusel */}
        <TramiteModal 
          open={!!selectedTramite} 
          tramite={selectedTramite} 
          onClose={handleCloseTramite} 
        />
      </>
    )
  }

  return (
    <>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#341A67' }}>
              Trámites Destacados
            </h2>
            <p className="text-sm" style={{ color: '#584291' }}>
              Los trámites más solicitados por la ciudadanía
            </p>
          </div>
        </div>

        {/* Carrusel */}
        <div className="relative w-full">
          <div
            ref={containerRef}
            className="overflow-x-scroll scrollbar-hide mask-gradient-featured"
            style={{ scrollBehavior: 'auto' }}
          >
            <div className="flex gap-5 py-2">
              {extendedTramites.map((tramite, index) => (
                <div
                  key={`featured-${tramite.id}-${index}`}
                  className="flex-shrink-0 w-[300px] sm:w-[320px] lg:w-[340px] cursor-pointer"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() => handleOpenTramite(tramite)}
                >
                  <TramiteCard
                    tramite={tramite}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .mask-gradient-featured {
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 3%,
              black 97%,
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 3%,
              black 97%,
              transparent 100%
            );
          }
        `}</style>
      </div>

      {/* ✅ Modal FUERA del carrusel - se renderiza en el nivel superior */}
      <TramiteModal 
        open={!!selectedTramite} 
        tramite={selectedTramite} 
        onClose={handleCloseTramite} 
      />
    </>
  )
}