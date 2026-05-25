'use client';
import { JSX } from 'react';
import { useUserModal } from '@/hooks/user/useUserModal';
import { USER_STATUSES } from '@/lib/constants/userStatuses';
import { User } from '@/types/user';
import { FormField } from '../shared/FormField'; 
import { RoleSelector } from './RoleSelector';

interface UserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
  readonly initialData?: User | null;
  readonly onSubmit: (datos: any) => Promise<void>;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
  initialData
}: UserModalProps): JSX.Element | null {
  
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleFormSubmit,
    handleCancel,
    setValue,
    watch,
    isEditMode
  } = useUserModal(onSubmit, onSuccess, onClose, initialData);

  let submitLabel: string;
  if (isSubmitting) {
    submitLabel = 'Guardando...';
  } else if (isEditMode) {
    submitLabel = 'Guardar Cambios';
  } else {
    submitLabel = 'Guardar Empleado';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? 'Editar Personal' : 'Registrar Nuevo Personal'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nombre" error={errors.first_name?.message as string}>
                <input {...register('first_name')} className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none" />
              </FormField>
              <FormField label="Apellido" error={errors.last_name?.message as string}>
                <input {...register('last_name')} className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none" />
              </FormField>
            </div>

            <FormField label="Correo Electrónico" error={errors.email?.message as string}>
              <input {...register('email')} disabled={isEditMode} className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </FormField>

            {!isEditMode && (
              <FormField label="Contraseña Temporal" error={errors.password?.message as string}>
                <input {...register('password')} type="password" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
              </FormField>
            )}

            <div className="grid grid-cols-2 gap-4">
              <RoleSelector watch={watch} setValue={setValue} error={errors.role_name} />
              
              <FormField label="Estado Inicial">
                <select {...register('status')} className="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                  {USER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </FormField>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={handleCancel} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancelar
              </button>
               <button type="submit" disabled={isSubmitting} className="px-5 py-2 font-semibold text-white bg-slate-900 rounded-xl">
                {submitLabel}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}