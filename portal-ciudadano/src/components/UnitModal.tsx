import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './ui/Modal';
import type { Unit } from '../lib/types';

type Props = {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
};

export default function UnitModal({ open, unit, onClose }: Props) {
  if (!open || !unit) return null;

  // Normalizamos teléfonos: puede venir como string o arreglo
  const phones: string[] = Array.isArray(unit.phones)
    ? (unit.phones as any[]).map(String)
    : unit.phones
    ? [String(unit.phones)]
    : [];

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Unidad">
      {/* Contenedor con ancho máximo controlado desde aquí (no usamos props extra en Modal) */}
      <div className="w-full max-w-4xl">
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="text-xl font-semibold text-text-900">{unit.name}</h2>
          <p className="text-text-600 text-sm mt-1">
            Información detallada de la unidad administrativa
          </p>
        </div>

        {/* Imagen de cabecera si existe */}
        {unit.cover_url && (
          <div className="mt-4 px-4 sm:px-6">
            <img
              src={unit.cover_url}
              alt={unit.name}
              className="w-full h-44 md:h-56 rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        )}

        <section className="px-4 sm:px-6 mt-5">
          {unit.description && (
            <p className="text-sm text-text-700 leading-relaxed">{unit.description}</p>
          )}

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1 */}
            <div className="card">
              <div className="card-content space-y-3">
                <div>
                  <div className="text-xs text-text-500 font-medium uppercase">Responsable</div>
                  <div className="text-text-900">{unit.contact || '—'}</div>
                </div>

                <div>
                  <div className="text-xs text-text-500 font-medium uppercase">Ubicación</div>
                  <div className="text-text-900">{unit.address || '—'}</div>
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="card">
              <div className="card-content space-y-3">
                <div>
                  <div className="text-xs text-text-500 font-medium uppercase">Teléfono(s)</div>
                  <div className="text-text-900">{phones.length ? phones.join(' · ') : '—'}</div>
                </div>

                <div>
                  <div className="text-xs text-text-500 font-medium uppercase">Página web</div>
                  {unit.website ? (
                    <a
                      href={unit.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 underline hover:no-underline break-all"
                    >
                      {unit.website}
                    </a>
                  ) : (
                    <span className="text-text-900">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-4 sm:px-6 py-4 flex justify-end">
          <Link to={`/unidades/${unit.id}`} className="btn btn-primary" onClick={onClose}>
            Ver trámites
          </Link>
        </footer>
      </div>
    </Modal>
  );
}
