import React, { useMemo, useState } from 'react';
import type { Tramite } from '../lib/types';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  tramite?: Tramite | null;
};

export default function TramiteModal({ open, onClose, tramite }: Props) {
  // Los hooks SIEMPRE se llaman
  const [tab, setTab] = useState<'req' | 'steps'>('req');

  const pills = useMemo(() => {
    if (!tramite) return [];
    return [
      tramite.code && { label: tramite.code, tone: 'slate' as const },
      (tramite.cost ?? '') !== '' && {
        label: `Costo\nBs. ${Number(tramite.cost).toFixed(2)}`,
        tone: 'sky' as const,
      },
      tramite.estimated_time && {
        label: `Tiempo\n${tramite.estimated_time}`,
        tone: 'violet' as const,
      },
      tramite.unit?.name && {
        label: `Unidad\n${tramite.unit.name}`,
        tone: 'cyan' as const,
      },
    ].filter(Boolean) as { label: string; tone: 'slate' | 'sky' | 'violet' | 'cyan' }[];
  }, [tramite]);

  // recien acá cortamos el render si no hay datos
  if (!open || !tramite) return null;

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Detalle de Trámite" widthClass="max-w-5xl">
      <ModalHeader
        title={tramite.title}
        subtitle="Información completa del trámite"
        onClose={onClose}
      />

      <ModalBody>
        {/* Cabecera con “pills” */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {pills.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 shadow-inner border ${
                p.tone === 'sky'
                  ? 'bg-sky-100/70 border-sky-200'
                  : p.tone === 'violet'
                  ? 'bg-violet-100/70 border-violet-200'
                  : p.tone === 'cyan'
                  ? 'bg-cyan-100/70 border-cyan-200'
                  : 'bg-slate-100/70 border-slate-200'
              }`}
            >
              <div className="whitespace-pre-line font-semibold text-slate-800">{p.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur rounded-xl border p-1 flex gap-1 mb-4">
          <button
            onClick={() => setTab('req')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tab === 'req' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Requisitos
          </button>
          <button
            onClick={() => setTab('steps')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tab === 'steps' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Pasos
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {tab === 'req' ? (
            <section className="rounded-xl border p-4 bg-white">
              <h3 className="font-semibold text-slate-800 mb-2">Requisitos necesarios</h3>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: tramite.requirements_html || '' }}
              />
            </section>
          ) : (
            <section className="rounded-xl border p-4 bg-white">
              <h3 className="font-semibold text-slate-800 mb-2">Pasos del proceso</h3>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: tramite.steps_html || '' }}
              />
            </section>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
        >
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
}
