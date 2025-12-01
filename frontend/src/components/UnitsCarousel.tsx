"use client"

import { useEffect, useState, useRef } from "react"
import UnitCard from "./UnitCard"
import type { Unit } from "../lib/types"

type Props = {
  units?: Unit[] | null
  onOpenUnit: (unit: Unit) => void
  scrollSpeed?: number
}

export default function UnitsCarousel({ units, onOpenUnit, scrollSpeed = 800 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const safeUnits = Array.isArray(units) ? units : []
  const extendedUnits = [...safeUnits, ...safeUnits, ...safeUnits, ...safeUnits]

  useEffect(() => {
    if (trackRef.current && safeUnits.length > 0) {
      const totalWidth = trackRef.current.scrollWidth / 4
      const duration = totalWidth / scrollSpeed
      setAnimationDuration(duration)
    }
  }, [safeUnits.length, scrollSpeed])

  const handleCardClick = (unit: Unit) => {
    onOpenUnit(unit)
  }

  if (safeUnits.length === 0) {
    return null
  }

  if (safeUnits.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {safeUnits.map((unit) => (
          <div key={unit.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <UnitCard unit={unit} onOpen={() => onOpenUnit(unit)} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden mask-gradient-units">
        <div
          ref={trackRef}
          className={`flex gap-6 py-2 carousel-track-units ${isPaused ? "paused" : ""}`}
          style={{
            animationDuration: `${animationDuration}s`,
          }}
        >
          {extendedUnits.map((unit, index) => (
            <div
              key={`${unit.id}-${index}`}
              className="flex-shrink-0 w-[calc((100vw-8rem)/3)] max-w-[480px] min-w-[320px] transform transition-all hover:drop-shadow-2xl"
              onClick={() => handleCardClick(unit)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{ cursor: "pointer" }}
            >
              <UnitCard unit={unit} onOpen={() => handleCardClick(unit)} />
            </div>
          ))}
        </div>
      </div>

      

      <style>{`
        .carousel-track-units {
          animation: scroll-units linear infinite;
        }

        .carousel-track-units.paused {
          animation-play-state: paused;
        }

        @keyframes scroll-units {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .mask-gradient-units {
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
      `}</style>
    </div>
  )
}
