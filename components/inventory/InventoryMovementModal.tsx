// components/inventory/InventoryMovementModal.tsx
'use client';

import { FormField } from '@/components/shared/FormField';
import { useMovimientoForm } from '@/hooks/inventory/useMovimientoForm';
import { InventarioItem, MovimientoFormData } from '@/types/inventory';
import { MOVIMIENTO_OPTIONS } from '@/schemas/inventory.schem';

interface InventoryMovementModalProps {
  isOpen: boolean;
  item: InventarioItem | null;
  onClose: () => void;
  onSubmit: (data: MovimientoFormData) => Promise<void>;
}

const inputClass = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm';

export default function InventoryMovementModal({ isOpen, item, onClose, onSubmit }: InventoryMovementModalProps) {
  const { 
    form, 
    isSubmitting, 
    error, 
    fieldErrors, 
    submitLabel, 
    updateField, 
    handleSubmit 
  } = useMovimientoForm({ isOpen, item, onSubmit, onClose });

  if (!isOpen || !item) return null;

  const isEntrada = form.tipo === 'ENTRADA';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Registrar Movimiento</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ítem: <span className="text-slate-600 font-medium">{item.nombre}</span>
            </p>
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

        {/* Info del ítem */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500">Stock actual:</span>
          <span className="font-bold text-slate-800 text-base">
            {item.cantidad} <span className="text-xs text-slate-400 font-normal">{item.unidad_medida.toLowerCase()}</span>
          </span>
        </div>

        {/* Form */}
        <div className="p-5 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error general */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Tipo y Cantidad */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo de Movimiento" error={fieldErrors.tipo}>
                <select
                  id="mov-tipo"
                  value={form.tipo}
                  onChange={(e) => updateField('tipo', e.target.value as MovimientoFormData['tipo'])}
                  className={inputClass}
                >
                  {MOVIMIENTO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Cantidad" required error={fieldErrors.cantidad}>
                <input
                  id="mov-cantidad"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.cantidad}
                  onChange={(e) => updateField('cantidad', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Preview del resultado */}
            {form.cantidad > 0 && (
              <div className={`p-3 rounded-lg border text-sm ${
                isEntrada 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <span className="font-medium">
                  {isEntrada ? '↑ Nuevo stock: ' : '↓ Nuevo stock: '}
                  {isEntrada 
                    ? (item.cantidad + form.cantidad).toLocaleString()
                    : Math.max(0, item.cantidad - form.cantidad).toLocaleString()
                  }
                  {item.unidad_medida.toLowerCase()}
                </span>
                {!isEntrada && form.cantidad > item.cantidad && (
                  <p className="text-xs mt-1 opacity-80">⚠️ La cantidad excede el stock actual</p>
                )}
              </div>
            )}

            {/* Motivo */}
            <FormField label="Motivo del movimiento" required error={fieldErrors.motivo}>
              <input
                id="mov-motivo"
                type="text"
                placeholder="Ej: Compra de insumos, Merma, Uso en producción..."
                value={form.motivo}
                onChange={(e) => updateField('motivo', e.target.value)}
                className={inputClass}
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
                className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-70 flex items-center gap-2 shadow-md ${
                  isEntrada 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
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