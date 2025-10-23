import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Unit } from '../lib/types';

type Props = {
  unit: Unit;
  /** Abre el modal de detalles */
  onOpen?: () => void;
};

export default function UnitCard({ unit, onOpen }: Props) {
  const navigate = useNavigate();

  const goTramites = () => navigate(`/unidades/${unit.id}`);

  return (
    <article className="card overflow-hidden">
      {/* Portada opcional */}
      {unit.cover_url ? (
        <div className="h-28 w-full overflow-hidden">
          <img
            src={unit.cover_url}
            alt={unit.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="card-content">
        <h3 className="section-title text-base">{unit.name}</h3>

        {unit.description ? (
          <p className="text-sm text-muted mt-1">
            {unit.description.length > 140
              ? unit.description.slice(0, 140) + '…'
              : unit.description}
          </p>
        ) : (
          <p className="text-sm text-muted mt-1">Sin descripción.</p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={onOpen}>
            Ver detalles
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={goTramites}>
            Ver trámites
          </button>
        </div>
      </div>
    </article>
  );
}
