"use client"

import { useEffect, useState, useRef } from "react"
import TramiteCard from "./TramiteCard"
import TramiteModal from "./TramiteModal"
import type { Tramite } from "../lib/types"

interface FeaturedCarouselProps {
  tramites?: Tramite[] | null
  scrollSpeed?: number
}

export default function FeaturedCarousel({ tramites, scrollSpeed = 350 }: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState(0)
  const [openTramite, setOpenTramite] = useState<Tramite | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const safeTramites = Array.isArray(tramites) ? tramites : []
  const extendedTramites = [...safeTramites, ...safeTramites, ...safeTramites, ...safeTramites]

  useEffect(() => {
    if (trackRef.current && safeTramites.length > 0) {
      // Calculate based on a single card width to get accurate animation timing
      const firstCard = trackRef.current.querySelector('[data-carousel-item="true"]') as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth
        const gap = 20 // gap-5 in px
        const totalItemWidth = cardWidth + gap
        const fullCycle = totalItemWidth * safeTramites.length
        const duration = fullCycle / scrollSpeed
        setAnimationDuration(duration)
      }
    }
  }, [safeTramites.length, scrollSpeed])

  const handleCardClick = (tramite: Tramite) => {
    setOpenTramite(tramite)
  }

  const handleTouchStart = () => {
    setIsPaused(true)
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  if (safeTramites.length === 0) {
    return null
  }

  if (safeTramites.length <= 4) {
    return (
      <>
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                 Trámites Destacados
              </h2>
              <p className="text-sm sm:text-base text-white/90 drop-shadow mt-2">
                Los trámites más solicitados por la ciudadanía
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {safeTramites.map((tramite) => (
              <div
                key={tramite.id}
                onClick={() => handleCardClick(tramite)}
                className="cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 active:scale-95"
              >
                <TramiteCard tramite={tramite} />
              </div>
            ))}
          </div>
        </div>

        <TramiteModal open={!!openTramite} tramite={openTramite} onClose={() => setOpenTramite(null)} />
      </>
    )
  }

  return (
    <>
      <div className="mb-12 sm:mb-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-col sm:flex-row gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
               Trámites Destacados
            </h2>
            <p className="text-sm sm:text-base text-white/90 drop-shadow mt-2">
              Los trámites más solicitados por la ciudadanía
            </p>
          </div>


        </div>

        <div className="sm:hidden mb-4 text-center">
          <p className="text-xs text-white/90 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-full inline-block border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
            👆 Toca una tarjeta · Desliza para navegar
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="mask-gradient-featured">
            <div
              ref={trackRef}
              className={`flex gap-5 sm:gap-6 py-2 carousel-track ${isPaused ? "paused" : ""}`}
              style={{
                animationDuration: animationDuration > 0 ? `${animationDuration}s` : "0s",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {extendedTramites.map((tramite, index) => (
                <div
                  key={`featured-${tramite.id}-${index}`}
                  data-carousel-item="true"
                  className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] transform transition-all active:scale-95 hover:drop-shadow-2xl"
                  onClick={() => handleCardClick(tramite)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: "pointer" }}
                >
                  <TramiteCard tramite={tramite} />
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
              transform: translateX(calc(-25% - 5px));
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

          @media (max-width: 640px) {
            .mask-gradient-featured {
              -webkit-mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
              );
              mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
              );
            }
          }
        `}</style>
      </div>

      <TramiteModal open={!!openTramite} tramite={openTramite} onClose={() => setOpenTramite(null)} />
    </>
  )
}
