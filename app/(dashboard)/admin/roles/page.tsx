// app/(dashboard)/admin/roles/page.tsx
'use client';

import { useEffect } from 'react';
import { useRoles } from '@/hooks/roles/useRoles';
import RoleModal from '@/components/admin/RoleModal';
import { RoleCreate } from '@/schemas/roles.schema';


export default function RolesPage() {
  const { 
    // Data
    roles, permissions, loading, error, fetchAll, 
    // Mutaciones
    createRole, // Asumiendo que agregaste updateRole en useRolesMutations
    // Modales
    isModalOpen, roleToEdit, openCreateModal, openEditModal, closeModal 
  } = useRoles();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Manejador que decide si crea o edita según si existe roleToEdit
  const handleSubmit = async (data: RoleCreate) => {
    if (roleToEdit) {
      // await updateRole(roleToEdit.id, data); // Descomenta cuando tengas updateRole
      console.log('Editando rol', roleToEdit.id, data);
    } else {
      await createRole(data);
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-bold">Error al cargar los datos</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      {/* Background decoration igual al de usuarios */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] rounded-full bg-sky-200/10 blur-[130px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Roles</h1>
            <p className="text-sm text-slate-500 mt-1">Administra los roles y permisos del sistema.</p>
          </div>
          <button 
            onClick={openCreateModal} // ✅ Conectado
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nuevo Rol
          </button>
        </div>

        {/* Tabla de Roles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Rol</th>
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Permisos Asignados</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No hay roles registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-700">{role.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{role.description || '-'}</td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {role.permissions.map((perm) => (
                            <span 
                              key={perm.id} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                              title={perm.description || perm.name}
                            >
                              {perm.name}
                            </span>
                          ))}
                          {role.permissions.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Sin permisos</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openEditModal({
                            ...role,
                            description: role.description ?? null,
                            permissions: role.permissions.map(p => ({ ...p, description: p.description ?? null })),
                          })} // ✅ Conectado
                          className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Modal Inyectado (Decoupled) */}
        <RoleModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          initialData={roleToEdit}
          availablePermissions={permissions}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}