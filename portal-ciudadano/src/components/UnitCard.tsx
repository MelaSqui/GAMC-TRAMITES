// src/components/UnitCard.tsx
import type { Unit } from "../lib/types";

export default function UnitCard({ 
  unit, 
  onClick 
}: { 
  unit: Unit; 
  onClick: () => void;
}) {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ];
  const colorClass = colors[unit.id % colors.length];

  const initials = unit.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className="block group w-full text-left"
    >
      <div className="card hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          {unit.cover_url ? (
            <img
              src={unit.cover_url}
              alt={unit.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <span className="text-5xl font-bold text-white/90">
                {initials}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors text-center">
            {unit.name}
          </h3>
        </div>
      </div>
    </button>
  );
}