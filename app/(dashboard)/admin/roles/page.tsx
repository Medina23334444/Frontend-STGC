// app/(dashboard)/admin/roles/page.tsx
'use client';

import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { RolesTable } from '@/components/admin/RolesTable';
import RoleModal from '@/components/admin/RoleModal'; 
import { useRoles } from '@/hooks/roles/useRoles';
import { RoleCreate, RoleUpdate } from '@/types/rol'; 
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Pagination } from '@/components/shared/Pagination';


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
    currentPage,
    setCurrentPage,
    totalPages,
  } = useRoles();

  const onSubmitRole = async (data: RoleCreate | RoleUpdate) => {
    if (roleToEdit) {
      await handleEditRole(roleToEdit.id, data);
    } else {
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

         <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />


        
        {/* Modal de Crear / Editar */}
        <RoleModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSubmit={onSubmitRole} 
          availablePermissions={permissions} 
          initialData={roleToEdit} 
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          variant="danger" // Color rojo
          icon="delete"
          title="Eliminar Rol"
          description={
            <p>
              ¿Estás seguro de que deseas eliminar el rol <strong className="text-slate-800">{roleToDelete?.name}</strong>? Esta acción no se puede deshacer.
            </p>
          }
          confirmText="Sí, eliminar"
          onConfirm={async () => {
            if (roleToDelete) {
              await handleDeleteRole(roleToDelete.id);
            }
          }}
        />
      </div>
    </div>
  );
}