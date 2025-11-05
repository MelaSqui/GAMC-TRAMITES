import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import type { Unit } from '../lib/types';

type Props = {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
};

export default function UnitModal({ open, unit, onClose }: Props) {
  const navigate = useNavigate();

  if (!open || !unit) return null;

  const phones: string[] = Array.isArray(unit.phones)
    ? (unit.phones as any[]).map(String)
    : unit.phones
    ? [String(unit.phones)]
    : [];

  const handleVerTramites = () => {
    onClose();
    navigate(`/unidades/${unit.id}`);
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Unidad" widthClass="max-w-3xl">
      <ModalHeader
        title={unit.name}
        subtitle="Información detallada de la unidad administrativa"
        onClose={onClose}
      />

      <ModalBody>
        {unit.cover_url && (
          <div className="mb-5 -mx-6 -mt-4">
            <img
              src={unit.cover_url}
              alt={unit.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {unit.description && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Descripción</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{unit.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {unit.contact && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">Responsable</p>
                  <p className="text-sm font-semibold text-slate-900">{unit.contact}</p>
                </div>
              </div>
            )}

            {unit.address && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">Ubicación</p>
                  <p className="text-sm text-slate-900">{unit.address}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {phones.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">Teléfono(s)</p>
                  <p className="text-sm text-slate-900">{phones.join(' · ')}</p>
                </div>
              </div>
            )}

            {unit.website && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">Página Web</p>
                  <a
                    href={unit.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--c-primary)] hover:text-[var(--c-primary-dark)] underline break-all"
                  >
                    {unit.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={handleVerTramites}
          className="btn btn-primary w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Ver Trámites
        </button>
      </ModalFooter>
    </Modal>
  );
}