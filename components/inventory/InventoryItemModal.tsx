// components/inventory/InventoryItemModal.tsx
'use client';

import { FormField } from '@/components/shared/FormField';
import { useItemForm } from '@/hooks/inventory/useItemForm';
import { CrearInventarioItemFormData } from '@/types/inventory';
import { TIPO_OPTIONS, ESTADO_OPTIONS, UNIDAD_OPTIONS } from '@/schemas/inventory.schem';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearInventarioItemFormData) => Promise<void>;
}

const inputClass = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm';

export default function InventoryItemModal({ isOpen, onClose, onSubmit }: InventoryItemModalProps) {
  const { 
    form, 
    isSubmitting, 
    error, 
    fieldErrors, 
    submitLabel, 
    updateField, 
    handleSubmit 
  } = useItemForm({ isOpen, onSubmit, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Registrar Nuevo Ítem</h2>
            <p className="text-xs text-slate-400 mt-0.5">Añade un producto o insumo al inventario</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-1.5 rounded-full transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error general */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* SKU y Nombre */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="SKU" required error={fieldErrors.sku}>
                <input
                  id="item-sku"
                  type="text"
                  placeholder="Ej: INS-001"
                  value={form.sku}
                  onChange={(e) => updateField('sku', e.target.value)}
                  className={inputClass}
                />
              </FormField>
              
              <FormField label="Nombre" required error={fieldErrors.nombre}>
                <input
                  id="item-nombre"
                  type="text"
                  placeholder="Ej: Fertilizante NPK"
                  value={form.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Tipo y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo" error={fieldErrors.tipo}>
                <select
                  id="item-tipo"
                  value={form.tipo}
                  onChange={(e) => updateField('tipo', e.target.value as CrearInventarioItemFormData['tipo'])}
                  className={inputClass}
                >
                  {TIPO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Estado" error={fieldErrors.estado}>
                <select
                  id="item-estado"
                  value={form.estado}
                  onChange={(e) => updateField('estado', e.target.value as CrearInventarioItemFormData['estado'])}
                  className={inputClass}
                >
                  {ESTADO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Unidad y Precio */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Unidad de Medida" error={fieldErrors.unidad_medida}>
                <select
                  id="item-unidad"
                  value={form.unidad_medida}
                  onChange={(e) => updateField('unidad_medida', e.target.value as CrearInventarioItemFormData['unidad_medida'])}
                  className={inputClass}
                >
                  {UNIDAD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Precio Unitario ($)" required error={fieldErrors.precio}>
                <input
                  id="item-precio"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.precio || ''}
                  onChange={(e) => updateField('precio', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Descripción */}
            <FormField label="Descripción (Opcional)" error={fieldErrors.descripcion}>
              <textarea
                id="item-descripcion"
                rows={3}
                placeholder="Notas adicionales sobre el ítem..."
                value={form.descripcion || ''}
                onChange={(e) => updateField('descripcion', e.target.value || null)}
                className={inputClass + ' resize-none'}
              />
            </FormField>

            {/* Acciones */}
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
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
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