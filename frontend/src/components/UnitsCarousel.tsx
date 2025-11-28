"use client"

import { useEffect, useState, useRef } from "react"
import UnitCard from "./UnitCard"
import type { Unit } from "../lib/types"

type Props = {
  units?: Unit[] | null
  onOpenUnit: (unit: Unit) => void
  scrollSpeed?: number
}

export default function UnitsCarousel({
  units,
  onOpenUnit,
  scrollSpeed = 50,
}: Props) {
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState(0)

  // Validación defensiva
  const safeUnits = Array.isArray(units) ? units : []
  
  // Duplicar items
  const extendedUnits = [...safeUnits, ...safeUnits, ...safeUnits, ...safeUnits]

  // Calcular la duración de la animación
  useEffect(() => {
    if (trackRef.current && safeUnits.length > 0) {
      const totalWidth = trackRef.current.scrollWidth / 4
      const duration = totalWidth / scrollSpeed
      setAnimationDuration(duration)
    }
  }, [safeUnits.length, scrollSpeed])

  // Si no hay unidades, no renderizar nada
  if (safeUnits.length === 0) {
    return null
  }

  // Si hay 3 o menos unidades, mostrar grid simple
  if (safeUnits.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeUnits.map((unit) => (
          <UnitCard key={unit.id} unit={unit} onOpen={() => onOpenUnit(unit)} />
        ))}
      </div>
    )
  }

  // ✅ NUEVA FUNCIÓN: Manejar click sin pausar el carrusel
  const handleCardClick = (unit: Unit) => {
    // Abrir modal sin pausar la animación
    onOpenUnit(unit)
  }

  return (
    <div className="relative w-full">
      {/* ❌ REMOVIDO: onMouseEnter y onMouseLeave para que NO se pause */}
      <div className="overflow-hidden mask-gradient">
        <div
          ref={trackRef}
          className="flex gap-6 py-2"
          style={{
            // ✅ SIEMPRE animando, sin pausa
            animation: `scroll-continuous ${animationDuration}s linear infinite`,
          }}
        >
          {extendedUnits.map((unit, index) => (
            <div
              key={`${unit.id}-${index}`}
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[320px] max-w-[420px]"
              onClick={() => handleCardClick(unit)}
              style={{ cursor: 'pointer' }}
            >
              <UnitCard unit={unit} onOpen={() => handleCardClick(unit)} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de movimiento continuo */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600">
          <div className="w-2 h-2 bg-[#47B4D8] rounded-full animate-pulse" />
          <span>Toque una tarjeta para ver detalles</span>
        </div>
      </div>

      <style>{`
        @keyframes scroll-continuous {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .mask-gradient {
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