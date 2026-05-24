// app/(dashboard)/admin/roles/page.tsx
'use client';

import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { RolesTable } from '@/components/admin/RolesTable';
import RoleModal from '@/components/admin/RoleModal'; 
import { useRoles } from '@/hooks/roles/useRoles';


export default function RolesPage() {
  const { 
    roles, 
    permissions,
    loading, 
    isModalOpen, 
    openCreateModal, 
    closeModal, 
    openEditModal,
    handleCreateRole,
  } = useRoles();


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
        />
        
        <RoleModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSubmit={handleCreateRole} 
          availablePermissions={permissions} 
        />
      </div>
    </div>
  );
}