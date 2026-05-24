// app/(dashboard)/admin/roles/page.tsx
'use client';

import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { RolesTable } from '@/components/admin/RolesTable';
import RoleModal from '@/components/admin/RoleModal'; 
import DeleteRoleConfirmModal from '@/components/admin/DeleteRoleConfirmModal'; // NUEVO
import { useRoles } from '@/hooks/roles/useRoles';
import { RoleCreate, RoleUpdate } from '@/types/rol'; // NUEVO

export default function RolesPage() {
  const { 
    roles, 
    permissions,
    loading, 
    isModalOpen, 
    roleToEdit,
    openCreateModal, 
    openEditModal,
    closeModal, 
    handleCreateRole,
    handleEditRole,
    isDeleteModalOpen,
    roleToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteRole,
  } = useRoles();

  // Función envoltorio para decidir si crear o actualizar
  const onSubmitRole = async (data: RoleCreate | RoleUpdate) => {
    if (roleToEdit) {
      // Estamos editando
      await handleEditRole(roleToEdit.id, data);
    } else {
      // Estamos creando
      await handleCreateRole(data);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />
      
      <div className="relative z-10 space-y-6">
        <PageHeader 
          title="Gestión de Roles"
          description="Administra los roles del sistema y sus permisos asignados."
          buttonLabel="Nuevo Rol"
          onOpenCreate={openCreateModal}
        />

        <RolesTable 
          roles={roles} 
          loading={loading} 
          onEdit={openEditModal} 
          onDelete={openDeleteModal} 
        />
        
        {/* Modal de Crear / Editar */}
        <RoleModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSubmit={onSubmitRole} 
          availablePermissions={permissions} 
          initialData={roleToEdit} // <--- MUY IMPORTANTE PARA LA EDICIÓN
        />

        {/* Modal de Eliminar */}
        <DeleteRoleConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={async () => {
            if (roleToDelete) {
              await handleDeleteRole(roleToDelete.id);
            }
          }}
          roleName={roleToDelete?.name || ''}
        />
      </div>
    </div>
  );
}