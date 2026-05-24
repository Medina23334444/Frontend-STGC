// hooks/roles/useRoles.ts
import { useEffect } from 'react';
import { useRolesData } from './useRolesData';
import { useRolesModals } from './useRolesModals'; 
import { useRolesFormatting } from './useRolesFormatting'; 
import { useRolesHandlers } from './useRolesHandlers';

export function useRoles() {
  const data = useRolesData();
  const modals = useRolesModals();
  const formatting = useRolesFormatting();
  const { handleCreateRole, handleEditRole, handleDeleteRole } = useRolesHandlers(
    data.createRole,
    data.updateRole,
    data.deleteRole,
  );

  const { fetchAll } = data;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    roles: data.roles,
    permissions: data.permissions,
    loading: data.loading,
    error: data.error,
    fetchAll: data.fetchAll,
    handleCreateRole,
    handleEditRole,      // ¡Asegúrate de exportarlo!
    handleDeleteRole,    // ¡Asegúrate de exportarlo!
    
    // Modales de Creación/Edición
    isModalOpen: modals.isModalOpen,
    roleToEdit: modals.roleToEdit,
    openCreateModal: modals.openCreateModal,
    openEditModal: modals.openEditModal,
    closeModal: modals.closeModal,

    // Modales de Eliminación (Nuevos)
    isDeleteModalOpen: modals.isDeleteModalOpen,
    roleToDelete: modals.roleToDelete,
    openDeleteModal: modals.openDeleteModal,
    closeDeleteModal: modals.closeDeleteModal,

    formatRoleName: formatting.formatRoleName,
    formatDescription: formatting.formatDescription,
    getRoleBadgeClasses: formatting.getRoleBadgeClasses,
    getPermissionBadgeClasses: formatting.getPermissionBadgeClasses,
  };
}