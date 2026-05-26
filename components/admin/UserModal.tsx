// components/admin/UserModal.tsx
'use strict';
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

  const { register, handleSubmit, errors, isSubmitting, handleFormSubmit, handleCancel, setValue, watch, isEditMode } =
    useUserModal(onSubmit, onSuccess, onClose, initialData);

  const inputClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-sm";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">

        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? 'Editar Personal' : 'Registrar Nuevo Personal'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {!isEditMode && (
              <>
                {/* Fila 1: Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Nombre" error={errors.first_name?.message}>
                    <input {...register('first_name')} placeholder="Ej: Juan" className={inputClass} />
                  </FormField>
                  <FormField label="Apellido" error={errors.last_name?.message}>
                    <input {...register('last_name')} placeholder="Ej: Pérez" className={inputClass} />
                  </FormField>
                </div>

                <FormField label="Identificador (DNI/CI)" error={errors.identifier?.message}>
                  <input {...register('identifier')} placeholder="Ej: 1105585181" className={inputClass} />
                </FormField>

                <FormField label="Contraseña Temporal" error={errors.password?.message}>
                  <input 
                    {...register('password')} 
                    type="password" 
                    placeholder="Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números" 
                    className={inputClass} 
                  />
                </FormField>
              </>
            )}

            {isEditMode && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                En edición solo se pueden modificar correo, teléfono, rol y estado.
              </div>
            )}

            <FormField label="Correo Electrónico" error={errors.email?.message}>
              <input 
                {...register('email')} 
                placeholder="Ej: juan.perez@finca.com" 
                className={inputClass} 
              />
            </FormField>

            <FormField label="Número de Teléfono" error={errors.phone_number?.message}>
              <input {...register('phone_number')} placeholder="Ej: 0999999999" className={inputClass} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <RoleSelector watch={watch} setValue={setValue} error={errors.role_name} />
              <FormField label="Estado Inicial">
                <select {...register('status')} className={inputClass}>
                  {USER_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-50">
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}