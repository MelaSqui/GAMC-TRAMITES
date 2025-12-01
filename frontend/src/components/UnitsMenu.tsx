"use client"

import { useState, useRef, useEffect } from "react"
import type { Unit } from "../lib/types"

type Props = {
  units: Unit[]
  selectedUnit: Unit | null
  onSelectUnit: (unit: Unit | null) => void
}

export default function UnitsMenu({ units, selectedUnit, onSelectUnit }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (unit: Unit | null) => {
    onSelectUnit(unit)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm
          ${
            selectedUnit
              ? "bg-[#341A67] text-white hover:bg-[#4a2a8a] shadow-lg"
              : "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#341A67] hover:text-[#341A67] hover:shadow-md"
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="max-w-[200px] truncate text-sm">
          {selectedUnit ? selectedUnit.name : "Filtrar por Unidad"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Botón para quitar filtro */}
      {selectedUnit && (
        <button
          onClick={() => handleSelect(null)}
          className="ml-2 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-200 hover:border-red-300 shadow-sm"
          title="Quitar filtro"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Opción "Todas" */}
          <button
            onClick={() => handleSelect(null)}
            className={`
              w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors
              ${!selectedUnit ? "bg-gradient-to-r from-slate-100 to-slate-50 text-[#341A67] font-semibold" : "text-slate-700"}
            `}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-slate-600"
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
            </div>
            <span>Todas las unidades</span>
          </button>

          <div className="h-px bg-slate-200" />

          {/* Lista de unidades */}
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => handleSelect(unit)}
              className={`
                w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors group
                ${selectedUnit?.id === unit.id ? "bg-gradient-to-r from-[#341A67]/10 to-[#47B4D8]/10 text-[#341A67] font-semibold" : "text-slate-700"}
              `}
            >
              <div
                className={`
                w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm transition-all
                ${
                  selectedUnit?.id === unit.id
                    ? "bg-gradient-to-br from-[#341A67] to-[#4a2a8a] text-white scale-105"
                    : "bg-gradient-to-br from-[#47B4D8]/20 to-[#47B4D8]/10 text-[#47B4D8] group-hover:scale-105"
                }
              `}
              >
                {unit.code_prefix || unit.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{unit.name}</p>
                {unit.description && <p className="text-xs text-slate-500 truncate mt-0.5">{unit.description}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
