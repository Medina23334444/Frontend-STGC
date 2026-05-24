// components/admin/RoleModal.tsx
'use client';

import { useRoleModal } from '@/hooks/roles/useRoleModal'; 
import { Permission } from '@/schemas/permission.schema';
import { RoleCreate, Role } from '@/types/rol';

interface RoleModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: RoleCreate) => Promise<void>;
  readonly availablePermissions: Permission[];
  readonly initialData?: Role | null;
}

export default function RoleModal({
  isOpen,
  onClose,
  onSubmit,
  availablePermissions,
  initialData,
}: RoleModalProps) {
  
  const {
  register,
  handleSubmit,
  errors,
  isSubmitting,
  currentPermissions,
  togglePermission,
  handleFormSubmit,
} = useRoleModal(onSubmit, onClose, isOpen, initialData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-1.5 rounded-full transition"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar">

          <form onSubmit={handleSubmit(handleFormSubmit as Parameters<typeof handleSubmit>[0])} className="space-y-3">

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                Nombre del Rol *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
                placeholder="Ej: CAJERO"
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all resize-none ${
                    errors.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                  }`}
                  placeholder="Describe las responsabilidades del rol..."
                  rows={3}
                />
                {errors.description ? (
                  <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>
                ) : (
                  <span className="text-xs text-slate-400 mt-1 block">
                    Mínimo 10 caracteres si desea agregar una descripción.
                  </span>
                )}
            </div>

            {/* Permisos */}
            <div>
              <label htmlFor="permissions" className="block text-sm font-semibold text-slate-700 mb-1">
                Permisos Asignados
              </label>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
                {availablePermissions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center italic py-3">
                    No hay permisos disponibles.
                  </p>
                ) : (
                  availablePermissions.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={currentPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-slate-700">{perm.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
              <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" >
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
                {isSubmitting ? 'Guardando...' : 'Guardar Rol'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}