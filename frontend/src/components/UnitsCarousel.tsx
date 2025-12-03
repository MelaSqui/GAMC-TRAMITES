"use client"

import { useEffect, useState, useRef } from "react"
import UnitCard from "./UnitCard"
import type { Unit } from "../lib/types"

type Props = {
  units?: Unit[] | null
  onOpenUnit: (unit: Unit) => void
  scrollSpeed?: number
}

export default function UnitsCarousel({ units, onOpenUnit, scrollSpeed = 30 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationFrameRef = useRef<number>()

  const safeUnits = Array.isArray(units) ? units : []
  const extendedUnits = [...safeUnits, ...safeUnits]

  // Scroll infinito con requestAnimationFrame
  useEffect(() => {
    if (!containerRef.current || safeUnits.length === 0) return

    const container = containerRef.current
    const cardWidth = 380 + 24 // ancho aproximado de card + gap
    const totalWidth = cardWidth * safeUnits.length

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
  }, [safeUnits.length, scrollSpeed, isPaused])

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
      <div
        ref={containerRef}
        className="overflow-x-scroll scrollbar-hide mask-gradient-units"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="flex gap-6 py-2">
          {extendedUnits.map((unit, index) => (
            <div
              key={`${unit.id}-${index}`}
              className="flex-shrink-0 w-[calc((100vw-8rem)/3)] max-w-[480px] min-w-[320px] transform transition-all hover:drop-shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(unit)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <UnitCard unit={unit} onOpen={() => handleCardClick(unit)} />
            </div>
          ))}
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
