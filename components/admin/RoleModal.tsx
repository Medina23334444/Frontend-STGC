// components/admin/RoleModal.tsx
'use client';

import { useRoleModal } from './useRoleModal'; 
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
    apiError,
    currentPermissions,
    togglePermission,
    handleFormSubmit,
    handleCancel,
  } = useRoleModal(onSubmit, onClose, isOpen, initialData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </h2>

        {/* Alerta de Error de API o Validación */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit as Parameters<typeof handleSubmit>[0])} className="space-y-4">
          
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del Rol *
            </label>
            <input
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Ej: CAJERO"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              rows={3}
            />
          </div>

          {/* Permisos (Checkboxes) */}
          <div>
            <label htmlFor="permissions" className="block text-sm font-medium text-gray-700 mb-2">
              Permisos Asignados
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50">
              {availablePermissions.length === 0 ? (
                <p className="text-xs text-gray-500 text-center italic">
                  No hay permisos disponibles.
                </p>
              ) : (
                availablePermissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={currentPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-800">{perm.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}