import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Unit } from '../lib/types';

type Props = {
  unit: Unit;
  onOpen?: () => void;
};

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

// ✅ Icono oficial de WhatsApp
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function UnitCard({ unit, onOpen }: Props) {
  const navigate = useNavigate();

  // === LÓGICA DE WHATSAPP ===
  const rawWhatsappPhone = unit.whatsapp_phone;
  const whatsappPhone = rawWhatsappPhone ? String(rawWhatsappPhone).trim() : '';
  const isWhatsappAvailable = !!whatsappPhone;
  const whatsappUrl = isWhatsappAvailable ? getWhatsappUrl(whatsappPhone) : '#'; 

  // --- PREPARACIÓN DE TELÉFONOS FIJOS ---
  const phones: string[] = Array.isArray(unit.phones)
    ? (unit.phones as any[]).map(String)
    : unit.phones
    ? [String(unit.phones)]
    : [];

  // --- LÓGICA DE DISEÑO ---
  const badge = unit.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // 🎨 Colores institucionales (oscuro → claro)
  const bgColors = ['#341A67', '#584291', '#009ED0'];
  const index = Number(unit.id);
  const bgColor = isNaN(index) ? bgColors[0] : bgColors[index % 3];

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
      
      {/* Imagen / Fondo */}
      <div className="relative h-56 w-full overflow-hidden">
        {unit.cover_url ? (
          <div className="h-full w-full flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: bgColor }}>
            <img
              src={unit.cover_url}
              alt={unit.name}
              className="max-w-[150px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
            <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/30" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Badge superior izquierdo */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold bg-white text-primary-600 shadow-lg backdrop-blur-sm border border-white/20">
            {badge}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col gap-4">
        
        {/* Título y descripción */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
            {unit.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {unit.description || 'Unidad administrativa del GAMC'}
          </p>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col gap-3 py-3 border-t border-slate-100">
          
          {/* Ubicación */}
          {unit.address && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 text-slate-400 mt-0.5">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm text-slate-600 flex-1">{unit.address}</span>
            </div>
          )}

          {/* Teléfono(s) fijo(s) CON ICONO DE WHATSAPP AL LADO */}
          {phones.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 text-slate-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-600 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {phones.map((phone, index) => (
                    <span 
                      key={index} 
                      className={`inline-flex items-center ${index < phones.length - 1 ? 'border-r border-slate-300 pr-3' : ''}`}
                    >
                      <a 
                        href={`tel:${phone}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {phone}
                      </a>
                    </span>
                  ))}
                </div>
                
                {/* ✅ ICONO OFICIAL DE WHATSAPP - MÁS SEPARADO */}
                {isWhatsappAvailable && (
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20BA5A] transition-all hover:scale-110 shadow-md ml-3"
                    title={`Enviar mensaje por WhatsApp: ${whatsappPhone}`}
                    aria-label="Contactar por WhatsApp"
                  >
                    <WhatsappIcon />
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Sitio web */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-slate-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            {unit.website ? (
              <a 
                href={unit.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline truncate"
              >
                Sitio web disponible
              </a>
            ) : (
              <span className="text-sm text-slate-500">Sitio web no disponible</span>
            )}
          </div>
        </div>

        {/* Botón Ver Detalles */}
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all group/btn border border-primary-200"
        >
          <span>Ver detalles</span>
          <svg 
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}