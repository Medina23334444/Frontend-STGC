// components/UserModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormInputs } from '@/schemas/user.schema';
import { USER_ROLES } from '@/lib/constants/userRoles'; // ← NUEVO
import { USER_STATUSES } from '@/lib/constants/userStatuses'; // ← NUEVO
import { ApiError } from '@/lib/errors/ApiErrors'; // ← NUEVO

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (datos: RegisterFormInputs) => Promise<void>; // ← NUEVO
  isSubmitting?: boolean; 
  error?: string;
}

export default function UserModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSubmit,
  isSubmitting = false,
  error = '',
}: UserModalProps) {
  const [errorGlobal, setErrorGlobal] = useState(error);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      identifier: '',
      phone_number: '',
      role_name: 'OPERADOR',
      status: 'ACTIVO',
    },
  });

  if (!isOpen) return null;

  const alEnviar = async (datos: RegisterFormInputs) => {
    setErrorGlobal('');
    try {
      await onSubmit(datos);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorGlobal(err.message);
      } else if (err instanceof Error) {
        setErrorGlobal(err.message);
      } else {
        setErrorGlobal('Error desconocido');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Registrar Nuevo Personal</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-1.5 rounded-full transition">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          {errorGlobal && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-100 text-sm">
              <span className="material-symbols-outlined text-lg">error</span>
              <p>{errorGlobal}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(alEnviar)} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  {...register('first_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="Juan"
                />
                {errors.first_name && <span className="text-xs text-red-500 mt-1 block">{errors.first_name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
                <input
                  type="text"
                  {...register('last_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="Pérez"
                />
                {errors.last_name && <span className="text-xs text-red-500 mt-1 block">{errors.last_name.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Identificación (Cédula)</label>
                <input
                  type="text"
                  {...register('identifier')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="0999999999"
                />
                {errors.identifier && <span className="text-xs text-red-500 mt-1 block">{errors.identifier.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  {...register('phone_number')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="09... / 02..."
                />
                {errors.phone_number && <span className="text-xs text-red-500 mt-1 block">{errors.phone_number.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                  errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
                placeholder="usuario@stgc.com"
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Temporal *</label>
              <input
                type="password"
                {...register('password')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                  errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500 mt-1 block leading-snug">{errors.password.message}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rol de Sistema</label>
                <select
                  {...register('role_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                >
                  {USER_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Estado Inicial</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                >
                  {USER_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { reset(); onClose(); }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting && <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></span>}
                {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}