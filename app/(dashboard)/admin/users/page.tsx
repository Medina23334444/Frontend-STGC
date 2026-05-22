// app/(dashboard)/admin/users/page.tsx
'use client';

import UserModal from '@/components/admin/UserModal';
import { useUsers } from '@/hooks/useUsers';
import { useUsersHandlers } from '@/hooks/useUsersHandlers'; // ✅ NUEVO
import { ValidationError } from '@/lib/errors/ApiErrors';

export default function AdminUsersPage() {
  const {
    // Data
    users,
    loading,
    error,
    fetchUsers,

    // Formatting
    getStatusBadge,
    getStatusDot,
    getStatusLabel,
    formatUserName,

    // Modals
    openCreateModal,
    openEditModal,
    isCreateModalOpen,
    closeCreateModal,
  } = useUsers();

  // ✅ NUEVO: Obtener handlers
  const { handleCreateUser } = useUsersHandlers();

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded border border-red-200">
        <p className="text-red-700 font-semibold">Error</p>
        <p className="text-red-600">{error.message}</p>

        {error instanceof ValidationError && (
          <ul className="mt-2 text-red-600 list-disc ml-5">
            {Object.entries(error.validationErrors).map(
              ([field, msgs]) => (
                <li key={field}>
                  {field}:{' '}
                  {Array.isArray(msgs)
                    ? msgs.join(', ')
                    : String(msgs)}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] rounded-full bg-sky-200/10 blur-[130px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Gestionar Personal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Administra los accesos y roles del equipo de trabajo.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">
              add
            </span>
            Nuevo Empleado
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">
                    Usuario / Email
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Rol
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Estado
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100/80">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Usuario */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase border border-slate-200">
                            {u.email.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">
                              {formatUserName(u)}
                            </p>
                            <p className="text-sm text-slate-500">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                          {u.role?.name || 'DESCONOCIDO'}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(
                            u.status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              u.status
                            )}`}
                          />
                          {getStatusLabel(u.status)}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openEditModal(u)}
                          className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
                        >
                          <span className="material-symbols-outlined text-sm">
                            edit
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Modal Crear Usuario - CON onSubmit correcto */}
        <UserModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSuccess={fetchUsers}
          onSubmit={handleCreateUser} // ✅ AQUÍ está el handler
        />
      </div>
    </div>
  );
}