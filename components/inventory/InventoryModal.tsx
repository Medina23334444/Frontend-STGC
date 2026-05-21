import { LoteCafe, LoteSchema, LoteFormData } from '@/types/inventory';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoteFormData) => void;
  lote: LoteCafe | null;
  defaultValues: Partial<LoteFormData>;
}

export default function InventoryModal({ isOpen, onClose, onSubmit, lote, defaultValues }: InventoryModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoteFormData>({
    resolver: zodResolver(LoteSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Telón oscuro desenfocado */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></div>

      {/* Caja del Formulario */}
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl relative z-10 p-6 space-y-4 animate-in zoom-in-95 duration-200"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-800 text-xl">
              {lote ? 'edit' : 'add_box'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lote ? `Editar Lote: ${lote.codigoLote}` : 'Registrar Nuevo Movimiento'}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Campo 1: Código de Lote */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Código del Lote</label>
          <input 
            type="text"
            placeholder="Ej: LOT-2026-005"
            {...register('codigoLote')}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 font-semibold tracking-wide text-slate-900 transition"
          />
          {errors.codigoLote && <p className="text-red-500 text-xs mt-1">{errors.codigoLote.message}</p>}
        </div>

        {/* Campos 2 y 3: Tipo & Cantidad */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tipo de Café</label>
            <select 
              {...register('tipoCafe')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700 transition cursor-pointer"
            >
              <option value="Pergamino">Pergamino</option>
              <option value="Café Oro">Café Oro</option>
              <option value="Cereza">Cereza</option>
              <option value="Pasilla">Pasilla</option>
            </select>
            {errors.tipoCafe && <p className="text-red-500 text-xs mt-1">{errors.tipoCafe.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cantidad (kg)</label>
            <input 
              type="number"
              min="1"
              placeholder="Ej: 850"
              {...register('pesoKg')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 font-bold text-slate-900 transition"
            />
            {errors.pesoKg && <p className="text-red-500 text-xs mt-1">{errors.pesoKg.message}</p>}
          </div>
        </div>

        {/* Campos 4 y 5: Estado & Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estado Actual</label>
            <select 
              {...register('estado')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700 transition cursor-pointer"
            >
              <option value="Bodega">En Bodega</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Secado">En Secado</option>
              <option value="Despachado">Despachado</option>
            </select>
            {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha de Ingreso</label>
            <input 
              type="date"
              {...register('fechaIngreso')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-600 transition"
            />
            {errors.fechaIngreso && <p className="text-red-500 text-xs mt-1">{errors.fechaIngreso.message}</p>}
          </div>
        </div>

        {/* Botonera inferior */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button"
            onClick={onClose}
            className="h-8 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition text-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="h-8 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition active:scale-[0.97] text-xs cursor-pointer"
          >
            {lote ? 'Guardar Cambios' : 'Registrar Movimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}