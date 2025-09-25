// src/components/UnitCard.tsx
import { Link } from 'react-router-dom';
import type { Unit } from '../lib/types';

type Props = { unit: Unit };

export default function UnitCard({ unit }: Props) {
  return (
    <Link
      to={`/units/${unit.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {unit.name}
            {unit.code_prefix ? <span className="ml-2 text-slate-400 text-sm">({unit.code_prefix})</span> : null}
          </h3>
          {unit.description ? (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{unit.description}</p>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          {unit.tramites_count ?? 0} trámites
        </span>
      </div>
    </Link>
  );
}
