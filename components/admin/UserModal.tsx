// components/users/UserModal.tsx
'use client';
import { useUserModal } from '@/hooks/useUserModal'; 
import { RegisterFormInputs } from '@/schemas/user.schema';
import { USER_ROLES } from '@/lib/constants/userRoles';
import { USER_STATUSES } from '@/lib/constants/userStatuses';

interface UserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
  readonly onSubmit: (datos: RegisterFormInputs) => Promise<void>;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
}: UserModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    apiError,
    handleFormSubmit,
    handleCancel,
  } = useUserModal(onSubmit, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Registrar Nuevo Personal</h2>
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

          {apiError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-100 text-sm">
              <span className="material-symbols-outlined text-lg">error</span>
              <p>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Nombre
                </label>
                <input
                  id="first-name"
                  type="text"
                  {...register('first_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="Juan"
                />
                {errors.first_name && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.first_name.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Apellido
                </label>
                <input
                  id="last-name"
                  type="text"
                  {...register('last_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="Pérez"
                />
                {errors.last_name && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.last_name.message}</span>
                )}
              </div>
            </div>

            {/* Identificación y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 mb-1">
                  Identificación (Cédula)
                </label>
                <input
                  id="identifier"
                  type="text"
                  {...register('identifier')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="0999999999"
                />
                {errors.identifier && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.identifier.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="phone-number" className="block text-sm font-semibold text-slate-700 mb-1">
                  Teléfono
                </label>
                <input
                  id="phone-number"
                  type="text"
                  {...register('phone_number')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="09... / 02..."
                />
                {errors.phone_number && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.phone_number.message}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
                placeholder="usuario@stgc.com"
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                Contraseña Temporal *
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm transition-all ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block leading-snug">{errors.password.message}</span>
              )}
            </div>

            {/* Rol y Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="role-name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Rol de Sistema
                </label>
                <select
                  id="role-name"
                  {...register('role_name')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                >
                  {USER_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-1">
                  Estado Inicial
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                >
                  {USER_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
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
                {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}