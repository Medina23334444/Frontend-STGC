//components/inventory/InventoryModal.tsx
'use client';

import React from 'react';
import { FormField } from '@/components/shared/FormField';
import { useLoteForm } from '@/hooks/inventory/useLoteForm';
import { LoteCafe, LoteFormData } from '@/types/traceability';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lote?: LoteCafe | null;
  defaultValues?: Partial<LoteFormData>;
  onSubmit: (data: LoteFormData) => Promise<void>;
}

export default function InventoryModal({ isOpen, onClose, lote, defaultValues = {}, onSubmit }: Readonly<InventoryModalProps>) {
  const inputClass = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sm';
  const { form, fieldErrors, isSubmitting, submitLabel, updateField, setFase, setUnidadMedida, setCalidad, setPositiveNumericField, handleSubmit } = useLoteForm({
    isOpen,
    lote,
    defaultValues,
    onSubmit,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">{lote ? 'Editar Lote' : 'Registrar Nuevo Lote'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-1.5 rounded-full transition"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FormField
                label="Variedad"
                error={fieldErrors.variedad}
              >
                <input
                  id="inventory-variedad"
                  value={form.variedad}
                    onChange={(e) => updateField('variedad', e.target.value)}
                  placeholder="Ej: Caturra"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Fase"
                  error={fieldErrors.fase}
                >
                  <select
                    id="inventory-fase"
                    value={form.fase}
                    onChange={(e) => setFase(e.target.value as LoteFormData['fase'])}
                    className={inputClass}
                  >
                    <option value="PULPA">PULPA</option>
                    <option value="DESPULPADO">DESPULPADO</option>
                    <option value="SECADO">SECADO</option>
                    <option value="TOSTADO">TOSTADO</option>
                    <option value="MOLIDO">MOLIDO</option>
                  </select>
                </FormField>
              </div>
              <div>
                <FormField
                  label="Unidad de Medida"
                  error={fieldErrors.unidad_medida}
                >
                  <select
                    id="inventory-unidad"
                    value={form.unidad_medida}
                    onChange={(e) => setUnidadMedida(e.target.value as LoteFormData['unidad_medida'])}
                    className={inputClass}
                  >
                    <option value="QUINTALES">QUINTALES</option>
                    <option value="KILOS">KILOS</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Cantidad Producida"
                  error={fieldErrors.cantidad_producida}
                >
                  <input
                    id="inventory-cantidad"
                    type="number"
                    min={1}
                    step={1}
                    value={form.cantidad_producida}
                    onChange={(e) => setPositiveNumericField('cantidad_producida', e.target.value)}
                    className={inputClass}
                  />
                </FormField>
              </div>
              <div>
                <FormField
                  label="Costo de Producción"
                  error={fieldErrors.costo_produccion}
                >
                  <input
                    id="inventory-costo"
                    type="number"
                    min={1}
                    step={1}
                    value={form.costo_produccion}
                    onChange={(e) => setPositiveNumericField('costo_produccion', e.target.value)}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>

            <div>
              <FormField
                label="Calidad"
                error={fieldErrors.calidad}
              >
                <select
                  id="inventory-calidad"
                  value={form.calidad}
                  onChange={(e) => setCalidad(e.target.value as LoteFormData['calidad'])}
                  className={inputClass}
                >
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                )}
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
