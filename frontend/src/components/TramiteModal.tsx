import React, { useState } from 'react';
import type { Tramite } from '../lib/types';
import Modal, { ModalBody } from './Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  tramite?: Tramite | null;
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

// Icono de WhatsApp
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function TramiteModal({ open, onClose, tramite }: Props) {
  const [tab, setTab] = useState<'req' | 'steps' | 'normativas'>('req');

  // Función para imprimir
  const handlePrint = () => {
    if (!tramite) return;
    const printContent = generatePrintContent(tramite);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Función para guardar como PDF
  const handleDownloadPDF = () => {
    if (!tramite) return;
    const printContent = generatePrintContent(tramite, true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Función para compartir
  const handleShare = async () => {
    if (!tramite) return;
    
    // Generar link directo al trámite
    const tramiteUrl = `${window.location.origin}/tramite/${tramite.id}`;
    
    const shareData = {
      title: tramite.title,
      text: `Trámite: ${tramite.title}\nUnidad: ${tramite.unit?.name || 'No especificada'}\nCosto: ${tramite.cost ? `Bs. ${Number(tramite.cost).toFixed(2)}` : 'Gratuito'}`,
      url: tramiteUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      // Fallback: copiar link al portapapeles
      try {
        await navigator.clipboard.writeText(tramiteUrl);
        alert('Link copiado al portapapeles');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!open || !tramite) return null;

  // Formatear teléfonos
  const phones: string[] = tramite.unit?.phones
    ? Array.isArray(tramite.unit.phones)
      ? tramite.unit.phones.map(String)
      : [String(tramite.unit.phones)]
    : [];

  // Lógica de WhatsApp: SOLO si tiene whatsapp_phone configurado
  const rawWhatsappPhone = tramite.unit?.whatsapp_phone;
  const whatsappPhone = rawWhatsappPhone ? String(rawWhatsappPhone).trim() : '';
  const isWhatsappAvailable = !!whatsappPhone;
  const whatsappUrl = isWhatsappAvailable ? getWhatsappUrl(whatsappPhone) : '#';

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Trámite" widthClass="max-w-5xl">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-[#341A67] via-[#4a2a8a] to-[#47B4D8] px-6 py-6 rounded-t-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {tramite.title}
            </h2>
            {tramite.description && (
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                {tramite.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {tramite.code && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                {tramite.code}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Cerrar"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ModalBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 p-0">
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2 p-6 border-r border-slate-100">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                onClick={() => setTab('req')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'req'
                    ? 'bg-white text-[#341A67] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Requisitos
              </button>
              <button
                onClick={() => setTab('steps')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  tab === 'steps'
                    ? 'bg-white text-[#341A67] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pasos
              </button>
              {tramite.normativas_html && (
                <button
                  onClick={() => setTab('normativas')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                    tab === 'normativas'
                      ? 'bg-white text-[#341A67] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Legal
                </button>
              )}
            </div>

            {/* Contenido de tabs */}
            <div className="min-h-[300px] max-h-[400px] overflow-y-auto pr-2">
              {tab === 'req' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#47B4D8]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#47B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Requisitos Necesarios</h3>
                      <p className="text-xs text-slate-500">Documentos y condiciones para este trámite</p>
                    </div>
                  </div>
                  
                  {tramite.requirements_html ? (
                    <div 
                      className="prose prose-sm prose-slate max-w-none prose-li:marker:text-[#47B4D8]"
                      dangerouslySetInnerHTML={{ __html: tramite.requirements_html }}
                    />
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No hay requisitos definidos</p>
                    </div>
                  )}
                </div>
              )}

              {tab === 'steps' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#341A67]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#341A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Pasos a Seguir</h3>
                      <p className="text-xs text-slate-500">Procedimiento para completar el trámite</p>
                    </div>
                  </div>
                  
                  {tramite.steps_html ? (
                    <div 
                      className="prose prose-sm prose-slate max-w-none prose-li:marker:text-[#341A67]"
                      dangerouslySetInnerHTML={{ __html: tramite.steps_html }}
                    />
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <p className="text-sm">No hay pasos definidos</p>
                    </div>
                  )}
                </div>
              )}

              {tab === 'normativas' && tramite.normativas_html && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Normativa Legal</h3>
                      <p className="text-xs text-slate-500">Base legal del trámite</p>
                    </div>
                  </div>
                  
                  <div 
                    className="prose prose-sm prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: tramite.normativas_html }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Sidebar */}
          <div className="p-6 bg-slate-50/50">
            {/* Información Rápida */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#47B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Rápida
              </h4>
              
              <div className="space-y-3">
                {/* Tiempo estimado */}
                {tramite.estimated_time && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-[#47B4D8]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#47B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Tiempo estimado</p>
                      <p className="text-sm font-bold text-slate-900">{tramite.estimated_time}</p>
                    </div>
                  </div>
                )}

                {/* Costo */}
                {tramite.cost != null && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Costo</p>
                      <p className="text-sm font-bold text-slate-900">
                        {Number(tramite.cost) === 0 ? 'Gratuito' : `Bs. ${Number(tramite.cost).toFixed(0)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Unidad Responsable */}
            {tramite.unit && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#341A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Unidad Responsable
                </h4>

                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  {/* Nombre */}
                  <div>
                    <p className="font-bold text-slate-900">{tramite.unit.name}</p>
                    {tramite.unit.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tramite.unit.description}</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    {/* Responsable */}
                    {tramite.unit.contact_name && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Responsable</p>
                          <p className="text-sm text-slate-700">{tramite.unit.contact_name}</p>
                        </div>
                      </div>
                    )}

                    {/* Dirección */}
                    {tramite.unit.address && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Dirección</p>
                          <p className="text-sm text-slate-700">{tramite.unit.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Teléfonos */}
                    {phones.length > 0 && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Teléfonos</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {phones.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone}`}
                                className="text-sm text-slate-700 hover:text-[#47B4D8] hover:underline cursor-pointer transition-colors"
                              >
                                {phone}
                              </a>
                            ))}
                            {/* Icono de WhatsApp */}
                            {isWhatsappAvailable && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366] hover:bg-[#20BA5A] transition-all hover:scale-110 shadow-md"
                                title={`Enviar mensaje por WhatsApp: ${whatsappPhone}`}
                                aria-label="Contactar por WhatsApp"
                              >
                                <WhatsappIcon />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-6 space-y-2">
              {/* Fila de botones: Imprimir, PDF, Compartir */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handlePrint}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                  title="Imprimir"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="text-[10px] font-medium text-slate-600">Imprimir</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-[#47B4D8]/10 border border-[#47B4D8]/30 rounded-xl hover:bg-[#47B4D8]/20 transition-all"
                  title="Guardar PDF"
                >
                  <svg className="w-5 h-5 text-[#47B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[10px] font-medium text-[#47B4D8]">PDF</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-[#341A67]/10 border border-[#341A67]/30 rounded-xl hover:bg-[#341A67]/20 transition-all"
                  title="Compartir"
                >
                  <svg className="w-5 h-5 text-[#341A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-[10px] font-medium text-[#341A67]">Compartir</span>
                </button>
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-[#341A67] text-white text-sm font-semibold rounded-xl hover:bg-[#4a2a8a] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

// Generar contenido HTML para imprimir (mismo estilo que PrintModal con logos)
function generatePrintContent(tramite: Tramite, forPDF: boolean = false): string {
  const date = new Date().toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  // Formatear teléfonos para impresión
  const phones: string[] = tramite.unit?.phones
    ? Array.isArray(tramite.unit.phones)
      ? tramite.unit.phones.map(String)
      : [String(tramite.unit.phones)]
    : [];

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${tramite.title} - GAMC</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: 8.5in 14in;
          margin: 1.5cm 2cm;
        }

        :root {
          --header-h: 110px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          color: #000;
          background: #fff;
          padding-top: 140px;
        }

        /* Cabecera fija con logos simétricos usando Grid */
        .doc-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: 110px 1fr 110px;
          align-items: center;
          height: var(--header-h);
          padding: 0 20px;
          background: #fff;
          z-index: 10;
        }

        /* logos pegados a los extremos */
        .doc-header .logo {
          height: 90px;
          width: auto;
          object-fit: contain;
        }

        .doc-header .logo.left {
          justify-self: start;
          margin-left: -10px; /* Mueve hacia la izquierda */
        }

        .doc-header .logo.right {
          justify-self: end;
          margin-right: -10px; /* Mueve hacia la derecha */
        }

        .doc-header .spacer {
          /* Columna central vacía */
        }

        /* Títulos centrados debajo de la cabecera */
        .header {
          text-align: center;
          margin: 0 0 30px;
          padding: 0 20px;
        }
        
        .header h1 {
          color: #47b4d8;
          font-size: 18px;
          margin-bottom: 6px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .header h2 {
          color: #47b4d8;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header .tramite-title {
          color: #341A67;
          font-size: 16px;
          font-weight: 700;
          margin-top: 15px;
          text-transform: uppercase;
        }

        .header .code {
          display: inline-block;
          background: #341A67;
          color: white;
          padding: 4px 14px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 10px;
        }

        /* Contenedor de la tabla/contenido */
        .content-container {
          padding: 0 20px;
        }

        /* Info cards en grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 20px 0;
          align-items: start;
        }

        .info-card {
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid;
          min-height: 60px;
        }

        .info-card.cost { background: #dcfce7; border-color: #86efac; }
        .info-card.time { background: #f3e8ff; border-color: #c4b5fd; }
        .info-card.unit { background: #cffafe; border-color: #67e8f9; }

        .info-label {
          font-size: 8px;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 3px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        /* Sección de contacto */
        .contact-section {
          background: #f8fafc;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #47b4d8;
        }

        .contact-title {
          font-weight: 700;
          color: #341A67;
          margin-bottom: 10px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-item {
          font-size: 11px;
          margin-bottom: 5px;
          color: #475569;
        }

        .contact-item strong { color: #1e293b; }

        /* Secciones de contenido */
        .section {
          margin: 25px 0;
          page-break-inside: avoid;
        }

        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #341A67;
          border-bottom: 2px solid #47b4d8;
          padding-bottom: 8px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-content {
          padding: 15px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .section-content ul { padding-left: 20px; margin: 0; }
        .section-content li { margin-bottom: 6px; font-size: 10px; line-height: 1.5; }
        .section-content p { font-size: 10px; line-height: 1.6; margin-bottom: 6px; }

        /* Footer */
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          font-size: 9px;
          color: #94a3b8;
        }

        .footer p { margin-bottom: 3px; }
        .footer .disclaimer { font-style: italic; margin-top: 8px; }

        /* Responsivo para móvil */
        @media screen and (max-width: 600px) {
          body {
            padding: 10px;
            padding-top: 100px;
          }

          .doc-header {
            grid-template-columns: 70px 1fr 70px;
            height: 80px;
            padding: 0 10px;
          }

          .doc-header .logo {
            height: 60px;
          }

          .header h1 {
            font-size: 14px;
            letter-spacing: 1px;
          }

          .header h2 {
            font-size: 11px;
          }

          .header .tramite-title {
            font-size: 13px;
          }

          .header .code {
            font-size: 10px;
            padding: 3px 10px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .info-card {
            padding: 10px;
            min-height: auto;
          }

          .info-value {
            font-size: 12px;
            -webkit-line-clamp: 2;
          }

          .contact-section {
            padding: 12px 15px;
          }

          .contact-title {
            font-size: 11px;
          }

          .contact-item {
            font-size: 10px;
          }

          .section-title {
            font-size: 11px;
          }

          .section-content {
            padding: 12px;
          }

          .section-content li,
          .section-content p {
            font-size: 10px;
          }

          .footer {
            font-size: 8px;
          }

          .content-container {
            padding: 0 10px;
          }
        }

        ${forPDF ? `
        .pdf-instructions {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          padding: 12px 15px;
          border-radius: 8px;
          margin: 20px;
          font-size: 12px;
          text-align: center;
        }
        @media print { .pdf-instructions { display: none; } }
        ` : ''}

        @media print {
          body { padding-top: 0; background: white; }
          .doc-header { position: static; margin-bottom: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${forPDF ? `
      <div class="pdf-instructions">
        <strong>📄 Para guardar como PDF:</strong> Presiona <strong>Ctrl+P</strong> (o Cmd+P en Mac), selecciona <strong>"Guardar como PDF"</strong> y haz clic en Guardar.
      </div>
      ` : ''}

      <div class="doc-header">
        <img src="${window.location.origin}/images/escudo-cochabamba.png" alt="Escudo Cochabamba" class="logo left" onerror="this.style.display='none'" />
        <div class="spacer"></div>
        <img src="${window.location.origin}/images/yo-amo-cocha.png" alt="Yo ❤️ Cocha" class="logo right" onerror="this.style.display='none'" />
      </div>
      
      <div class="header">
        <h1>GUÍA DE TRÁMITES Y SERVICIOS</h1>
        <h2>${date}</h2>
        <p class="tramite-title">${tramite.title}</p>
        ${tramite.code ? `<span class="code">${tramite.code}</span>` : ''}
      </div>

      <div class="content-container">
        ${tramite.description ? `
        <div class="contact-section" style="border-left-color: #341A67;">
          <p style="font-size: 11px; color: #475569; line-height: 1.6; margin: 0;">${tramite.description}</p>
        </div>
        ` : ''}

        <div class="info-grid">
          <div class="info-card cost">
            <div class="info-label">Costo</div>
            <div class="info-value">${tramite.cost && Number(tramite.cost) !== 0 ? `Bs. ${Number(tramite.cost).toFixed(2)}` : 'Gratuito'}</div>
          </div>
          <div class="info-card time">
            <div class="info-label">Tiempo Estimado</div>
            <div class="info-value">${tramite.estimated_time || 'No especificado'}</div>
          </div>
          <div class="info-card unit">
            <div class="info-label">Unidad Responsable</div>
            <div class="info-value">${tramite.unit?.name || 'No especificada'}</div>
          </div>
        </div>

        ${tramite.unit ? `
        <div class="contact-section">
          <div class="contact-title">INFORMACIÓN DE CONTACTO</div>
          ${tramite.unit.contact ? `<div class="contact-item"><strong>Responsable:</strong> ${tramite.unit.contact}</div>` : ''}
          ${phones.length > 0 ? `<div class="contact-item"><strong>Teléfono:</strong> ${phones.join(', ')}</div>` : ''}
          ${tramite.unit.address ? `<div class="contact-item"><strong>Dirección:</strong> ${tramite.unit.address}</div>` : ''}
        </div>
        ` : ''}

        <div class="section">
          <h3 class="section-title">REQUISITOS NECESARIOS</h3>
          <div class="section-content">
            ${tramite.requirements_html || '<p>No hay requisitos definidos para este trámite.</p>'}
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">PASOS DEL PROCESO</h3>
          <div class="section-content">
            ${tramite.steps_html || '<p>No hay pasos definidos para este trámite.</p>'}
          </div>
        </div>

        ${tramite.normativas_html ? `
        <div class="section">
          <h3 class="section-title">NORMATIVA LEGAL</h3>
          <div class="section-content">
            ${tramite.normativas_html}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p><strong>GOBIERNO AUTÓNOMO MUNICIPAL DE COCHABAMBA</strong></p>
          <p>Portal Ciudadano - Guía de Trámites y Servicios</p>
          <p class="disclaimer">Este documento es solo informativo. Para información oficial, visite las oficinas correspondientes.</p>
        </div>
      </div>

      ${!forPDF ? `
      <script>
        window.onload = function() { window.print(); }
      </script>
      ` : ''}
    </body>
    </html>
  `;
}