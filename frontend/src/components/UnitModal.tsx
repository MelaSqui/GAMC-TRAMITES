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
  children: React.ReactNode;
  ariaLabel: string;
  widthClass?: string;
}

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

interface ModalBodyProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
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
      onClick={onClose}
    >
      <div 
        className={`relative bg-white rounded-xl shadow-2xl transition-all duration-300 transform w-full mt-10 mb-auto ${widthClass}`}
        onClick={(e) => e.stopPropagation()}
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

// SVG de WhatsApp
const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.04 2.21A10.79 10.79 0 0 0 1.25 13.01v4.5l1.83.6c.09.03.18.04.28.04a7.9 7.9 0 0 0 12.09-.76l.01-.01A10.84 10.84 0 0 0 12.04 2.21ZM17.15 13.79c-.06-.11-.22-.17-.45-.27l-1.37-.67c-.24-.1-.4-.15-.56.16-.17.31-.63.93-.78 1.1-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2.02-1.24a8.43 8.43 0 0 1-1.35-1.12c-.22-.27-.02-.42.17-.61.16-.17.34-.4.48-.6.14-.2.18-.34.11-.47-.07-.12-.25-.6-.33-.78-.07-.18-.16-.15-.29-.15h-.54c-.15 0-.36.05-.56.24-.2.18-.75.74-.75 1.8A3.07 3.07 0 0 0 7.8 15.3c.09.07.72 1.2 1.83 1.63.49.19.98.29 1.47.29 1.13 0 2.15-.36 2.9-.9.46-.35.84-.8 1.14-1.3.17-.28.18-.52.12-.66Z"/>
  </svg>
);

// Función para limpiar y generar la URL de WhatsApp
const getWhatsappUrl = (phone: string): string => {
  // Limpiar el número (eliminar espacios, guiones, etc.)
  let cleanPhone = phone.replace(/[^\d+]/g, '');

  // Si el número no tiene código de país, agregar +591 (Bolivia)
  if (!cleanPhone.startsWith('591') && !cleanPhone.startsWith('+591')) {
    cleanPhone = '591' + cleanPhone;
  }

  // Eliminar el símbolo + si existe (WhatsApp no lo necesita en la URL)
  cleanPhone = cleanPhone.replace('+', '');

  return `https://wa.me/${cleanPhone}`;
};

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

  // Lógica de WhatsApp
  const rawWhatsappPhone = unit.whatsapp_phone;
  const whatsappPhone = rawWhatsappPhone ? String(rawWhatsappPhone).trim() : '';
  const isWhatsappAvailable = !!whatsappPhone;
  const whatsappUrl = isWhatsappAvailable ? getWhatsappUrl(whatsappPhone) : '#';

  const handleVerTramites = () => {
    onClose();
    // Navegar al home con el estado de la unidad seleccionada
    navigate('/', {
      state: {
        selectedUnit: unit,
        viewMode: 'tramites'
      },
      replace: true
    });
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* COLUMNA IZQUIERDA: Panel de color fijo (1/3 del ancho) */}
            <div className="lg:col-span-1">
              {unit.cover_url && (
                <div 
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
                    <div className="flex flex-wrap gap-2">
                      {phones.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone}`}
                          className="text-sm text-slate-900 hover:text-[#47B4D8] hover:underline cursor-pointer transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ WHATSAPP */}
              {isWhatsappAvailable && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <WhatsappIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium mb-1">WhatsApp</p>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline break-all"
                    >
                      {whatsappPhone}
                    </a>
                  </div>
                </div>
              )}

              {unit.website && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium mb-1">Página Web</p>
                    <a 
                      href={unit.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
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