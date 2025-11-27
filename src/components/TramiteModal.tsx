import React, { useMemo, useState } from 'react';
import type { Tramite } from '../lib/types';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  tramite?: Tramite | null;
};

export default function TramiteModal({ open, onClose, tramite }: Props) {
  const [tab, setTab] = useState<'req' | 'steps'>('req');

  const pills = useMemo(() => {
    if (!tramite) return [];
    const items = [];

    if (tramite.code) {
      items.push({ label: tramite.code, tone: 'gray' as const });
    }

    if (tramite.cost != null && tramite.cost !== 0) {
      const costNum = Number(tramite.cost);
      items.push({
        label: `Costo: Bs. ${costNum.toFixed(2)}`,
        tone: 'sky' as const,
      });
    }

    if (tramite.estimated_time) {
      items.push({
        label: `Tiempo: ${tramite.estimated_time}`,
        tone: 'purple' as const,
      });
    }

    if (tramite.unit?.name) {
      items.push({
        label: `Unidad: ${tramite.unit.name}`,
        tone: 'cyan' as const,
      });
    }

    return items;
  }, [tramite]);

  if (!open || !tramite) return null;

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Trámite" widthClass="max-w-5xl">
      <ModalHeader
        title={tramite.title}
        subtitle="Información completa del trámite"
        onClose={onClose}
      />

      <ModalBody>
        {/* Badge de categoría */}
        {tramite.code && (
          <div className="mb-4">
            <span className="badge badge-purple">{tramite.code}</span>
          </div>
        )}

        {/* Descripción */}
        {tramite.description && (
          <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-700 leading-relaxed">{tramite.description}</p>
          </div>
        )}

        {/* Pills de información */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {tramite.cost != null && tramite.cost !== 0 && (
            <div className="info-pill info-pill-sky">
              <div className="text-xs text-sky-700 mb-1">Costo</div>
              <div className="text-lg font-bold text-sky-900">
                Bs. {Number(tramite.cost).toFixed(2)}
              </div>
            </div>
          )}

          {tramite.estimated_time && (
            <div className="info-pill info-pill-purple">
              <div className="text-xs text-purple-700 mb-1">Tiempo</div>
              <div className="text-lg font-bold text-purple-900">
                {tramite.estimated_time}
              </div>
            </div>
          )}

          {tramite.unit?.name && (
            <div className="info-pill info-pill-cyan">
              <div className="text-xs text-cyan-700 mb-1">Unidad</div>
              <div className="text-sm font-semibold text-cyan-900">
                {tramite.unit.name}
              </div>
            </div>
          )}
        </div>

        {/* Información de contacto */}
        {tramite.unit && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">Información de Contacto</h4>
                <div className="space-y-2 text-sm">
                  {tramite.unit.contact && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span><strong>Responsable:</strong> {tramite.unit.contact}</span>
                    </div>
                  )}
                  {tramite.unit.phones && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span><strong>Contacto:</strong> {tramite.unit.phones}</span>
                    </div>
                  )}
                  {tramite.unit.address && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span><strong>Ubicación:</strong> {tramite.unit.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 p-1 flex gap-1 mb-5">
          <button
            onClick={() => setTab('req')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'req'
                ? 'bg-[var(--c-primary)] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Requisitos
            </span>
          </button>
          <button
            onClick={() => setTab('steps')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'steps'
                ? 'bg-[var(--c-primary)] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Pasos
            </span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          {tab === 'req' ? (
            <section className="rounded-xl border border-slate-200 p-5 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Requisitos Necesarios</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Documentos y condiciones que debes cumplir para realizar este trámite
              </p>
              {tramite.requirements_html ? (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: tramite.requirements_html }}
                />
              ) : (
                <p className="text-slate-500 text-sm">No hay requisitos definidos.</p>
              )}
            </section>
          ) : (
            <section className="rounded-xl border border-slate-200 p-5 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Pasos del Proceso</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Procedimiento paso a paso para completar el trámite
              </p>
              {tramite.steps_html ? (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: tramite.steps_html }}
                />
              ) : (
                <p className="text-slate-500 text-sm">No hay pasos definidos.</p>
              )}
            </section>
          )}
        </div>

        {/* Información importante */}
        <div className="mt-6 space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 text-sm mb-1">Nota importante</h4>
                <p className="text-sm text-purple-800">
                  Asegúrate de tener todos los documentos originales y copias antes de iniciar el trámite.
                  Los tiempos de procesamiento pueden variar según la carga de trabajo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-900 text-sm mb-2">Consejos</h4>
                <ul className="text-sm text-cyan-800 space-y-1">
                  <li>• Llega temprano para evitar filas</li>
                  <li>• Verifica que todos los documentos estén vigentes</li>
                  <li>• Mantén copias de todos los documentos entregados</li>
                  <li>• Solicita comprobante de recepción de documentos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          className="btn btn-primary"
        >
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
}
