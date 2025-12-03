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
  scrollSpeed = 350,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null)

  // Validación defensiva
  const safeTramites = Array.isArray(tramites) ? tramites : []
  
  // Duplicar items para efecto infinito
  const extendedTramites = [...safeTramites, ...safeTramites, ...safeTramites, ...safeTramites]

  // Calcular la duración de la animación
  useEffect(() => {
    if (trackRef.current && safeTramites.length > 0) {
      const totalWidth = trackRef.current.scrollWidth / 4
      const duration = totalWidth / scrollSpeed
      setAnimationDuration(duration)
    }
  }, [safeTramites.length, scrollSpeed])

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
          <div className="overflow-hidden mask-gradient-featured">
            <div
              ref={trackRef}
              className={`flex gap-5 py-2 carousel-track ${isPaused ? 'paused' : ''}`}
              style={{
                animationDuration: `${animationDuration}s`,
              }}
            >
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
          .carousel-track {
            animation: scroll-featured linear infinite;
          }

          .carousel-track.paused {
            animation-play-state: paused;
          }

          @keyframes scroll-featured {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-25%);
            }
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