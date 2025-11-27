import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UnitCard from './UnitCard';
import type { Unit } from '../lib/types';

type Props = {
  units: Unit[];
  onOpenUnit: (unit: Unit) => void;
  autoPlayInterval?: number;
  itemsPerPage?: number;
};

export default function UnitsCarousel({ 
  units,
  onOpenUnit,
  autoPlayInterval = 5000, 
  itemsPerPage = 3 
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalPages = Math.ceil(units.length / itemsPerPage);

  // Auto-play
  useEffect(() => {
    if (isPaused || units.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoPlayInterval, totalPages, units.length, itemsPerPage]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (index: number) => {
    setCurrentIndex(index);
  };

  // Obtener unidades de la página actual
  const currentUnits = units.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (units.length === 0) return null;

  return (
    <div
      className="relative px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUnits.map((unit) => (
          <div
            key={unit.id}
            className="animate-fadeIn"
          >
            <UnitCard 
              unit={unit} 
              onOpen={() => onOpenUnit(unit)}
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      {units.length > itemsPerPage && (
        <>
          {/* Botón Anterior */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl hover:bg-white hover:border-[#341A67] transition-all flex items-center justify-center group"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-[#341A67]" />
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl hover:bg-white hover:border-[#341A67] transition-all flex items-center justify-center group"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[#341A67]" />
          </button>
        </>
      )}

      {/* Indicadores (dots) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#341A67]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Indicador de auto-play */}
      {!isPaused && units.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600">
            <div className="w-2 h-2 bg-[#47B4D8] rounded-full animate-pulse" />
            <span>Rotación automática</span>
          </div>
        </div>
      )}
    </div>
  );
}