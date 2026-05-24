'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoleSchema, RoleCreate, Role } from '@/schemas/roles.schema';
import { Permission } from '@/schemas/permission.schema';
import { ApiError, ValidationError } from '@/lib/errors/ApiErrors';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleCreate) => Promise<void>;
  availablePermissions: Permission[];
  initialData?: Role | null;
}

export default function RoleModal({ isOpen, onClose, onSubmit, availablePermissions, initialData }: RoleModalProps) {
  // ✅ Estado para manejar el error de la API en el modal
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: { name: '', description: '', permission_ids: [] }
  });

  const handleFormSubmit = async (data: RoleCreate) => {
    setApiError(null); // Limpiamos errores previos
    try {
      await onSubmit(data);
    } catch (error) {
      // ✅ Aquí ATRAPAMOS y formateamos el error usando tu arquitectura
      if (error instanceof ValidationError) {
        // Extraemos los mensajes de validación (ej: {"name": ["El nombre ya existe"]})
        const messages = Object.values(error.validationErrors).flat().join(', ');
        setApiError(`Error de validación: ${messages}`);
      } else if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Ocurrió un error inesperado al guardar el rol.');
      }
    }
  };

  useEffect(() => {
    setApiError(null); // Limpiar errores al abrir/cerrar
    if (isOpen && initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        permission_ids: initialData.permissions.map(p => p.id)
      });
    } else if (isOpen && !initialData) {
      reset({ name: '', description: '', permission_ids: [] });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const currentPermissions = watch('permission_ids') || [];
  
  const togglePermission = (id: string) => {
    const newPerms = currentPermissions.includes(id)
      ? currentPermissions.filter(pId => pId !== id)
      : [...currentPermissions, id];
    setValue('permission_ids', newPerms, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </h2>

        {/* ✅ Alerta visual si ocurre un ApiError */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* ... (El resto del formulario se mantiene exactamente igual) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Rol *</label>
            <input 
              {...register('name')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Ej: CAJERO"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea 
              {...register('description')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permisos Asignados</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50">
              {availablePermissions.map(perm => (
                <label key={perm.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                  <input 
                    type="checkbox"
                    checked={currentPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800">{perm.name}</span>
                </label>
              ))}
              {availablePermissions.length === 0 && (
                <p className="text-xs text-gray-500 text-center italic">No hay permisos disponibles para asignar.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}