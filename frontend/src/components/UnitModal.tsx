import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Unit } from '../lib/types';

// =====================================================================
// COMPONENTES MODAL (Definiciones para hacer el archivo auto-contenido)
// =====================================================================

// Interfaces para los componentes internos del Modal
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode; // Arreglo TypeScript: Tipificación de 'children'
  ariaLabel: string;
  widthClass?: string;
}

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

interface ModalBodyProps {
  children: React.ReactNode; // Arreglo TypeScript: Tipificación de 'children'
}

interface ModalFooterProps {
  children: React.ReactNode; // Arreglo TypeScript: Tipificación de 'children'
}

// Componente Modal principal
const Modal = ({ open, onClose, children, ariaLabel, widthClass = 'max-w-2xl' }: ModalProps) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4 sm:p-6" 
      aria-labelledby={ariaLabel} 
      role="dialog" 
      aria-modal="true"
      onClick={onClose} // Cierra al hacer clic fuera
    >
      <div 
        className={`relative bg-white rounded-xl shadow-2xl transition-all duration-300 transform w-full mt-10 mb-auto ${widthClass}`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic interno cierre el modal
      >
        {children}
      </div>
    </div>
  );
};

// Componente ModalHeader
const ModalHeader = ({ title, subtitle, onClose }: ModalHeaderProps) => (
  <div className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t-xl">
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    <button
      type="button"
      className="text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
      onClick={onClose}
      aria-label="Close modal"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// Componente ModalBody
const ModalBody = ({ children }: ModalBodyProps) => (
  <div className="p-6 overflow-y-auto max-h-[80vh]">
    {children}
  </div>
);

// Componente ModalFooter
const ModalFooter = ({ children }: ModalFooterProps) => (
  <div className="p-5 border-t border-gray-200 rounded-b-xl flex justify-end">
    {children}
  </div>
);

// =====================================================================
// COMPONENTE PRINCIPAL UnitModal
// =====================================================================

type Props = {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
};

export default function UnitModal({ open, unit, onClose }: Props) {
  const navigate = useNavigate();

  if (!open || !unit) return null;

  // Colores institucionales rotativos
  const bgColors = ['#341A67', '#584291', '#009ED0'];
  const index = Number(unit.id);
  const bgColor = isNaN(index) ? bgColors[0] : bgColors[index % 3];

  const phones: string[] = Array.isArray(unit.phones)
    ? (unit.phones as any[]).map(String)
    : unit.phones
    ? [String(unit.phones)]
    : [];

  const handleVerTramites = () => {
    onClose();
    navigate(`/unidades/${unit.id}`, { replace: true });
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Unidad" widthClass="max-w-4xl">
      <ModalHeader
        title={unit.name}
        subtitle="Información detallada de la unidad administrativa"
        onClose={onClose}
      />

      <ModalBody>
        <div className="flex flex-col space-y-6">
          {/* SECCIÓN SUPERIOR: Panel Lateral (Color) y Descripción (Horizontal) */}
          {/* El contenedor grid asegura que las columnas tengan la misma altura por defecto */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"> {/* Añadido items-stretch aquí */}

            {/* COLUMNA IZQUIERDA: Panel de color fijo (1/3 del ancho) */}
            <div className="lg:col-span-1">
              {unit.cover_url && (
                <div 
                  // Aseguramos que ocupe toda la altura disponible en su celda del grid
                  className="p-6 h-full min-h-[200px] flex flex-col items-center justify-center rounded-xl shadow-lg text-white" 
                  style={{ backgroundColor: bgColor }}
                >
                  <img
                    src={unit.cover_url}
                    alt={unit.name}
                    className="max-w-[180px] h-auto object-contain mb-3"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: Descripción (2/3 del ancho) */}
            <div className="lg:col-span-2">
              {unit.description && (
                <div 
                  // Aseguramos que ocupe toda la altura disponible en su celda del grid
                  className="p-4 h-full bg-slate-50 rounded-xl border border-slate-200"
                >
                  <h4 className="font-semibold text-slate-900 mb-2">Descripción</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{unit.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN INFERIOR: Contacto y Detalles */}
          <hr className="border-t border-slate-200"/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"> 
            
            <div className="space-y-6">
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

            <div className="space-y-6">
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

                    <a href={unit.website}
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