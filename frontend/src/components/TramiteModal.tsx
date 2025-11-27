import React, { useState } from 'react';
import type { Tramite } from '../lib/types';
import Modal, { ModalBody } from './Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  tramite?: Tramite | null;
};

export default function TramiteModal({ open, onClose, tramite }: Props) {
  const [tab, setTab] = useState<'req' | 'steps' | 'normativas'>('req');

  if (!open || !tramite) return null;

  // Formatear teléfonos
  const phones: string[] = tramite.unit?.phones
    ? Array.isArray(tramite.unit.phones)
      ? tramite.unit.phones.map(String)
      : [String(tramite.unit.phones)]
    : [];

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
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ModalBody className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
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
                    {tramite.unit.contact && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Responsable</p>
                          <p className="text-sm text-slate-700">{tramite.unit.contact}</p>
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
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Teléfonos</p>
                          {phones.map((phone, idx) => (
                            <p key={idx} className="text-sm text-slate-700">{phone}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-3 bg-[#341A67] text-white text-sm font-semibold rounded-xl hover:bg-[#4a2a8a] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}