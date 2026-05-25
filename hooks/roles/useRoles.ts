// hooks/roles/useRoles.ts
import { useState, useMemo, useEffect } from 'react'; 
import { useRolesData } from './useRolesData';
import { useRolesModals } from './useRolesModals'; 
import { useRolesFormatting } from './useRolesFormatting'; 
import { useRolesHandlers } from './useRolesHandlers';
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination';

export function useRoles() {
  const [currentPage, setCurrentPage] = useState(1);

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

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.roles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data.roles, currentPage]);

  const totalPages = Math.ceil(data.roles.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.roles.length]);

  return {
    roles: paginatedRoles,
    currentPage,
    setCurrentPage,
    totalPages,

    permissions: data.permissions,
    loading: data.loading,
    error: data.error,
    fetchAll: data.fetchAll,
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
    
    isModalOpen: modals.isModalOpen,
    roleToEdit: modals.roleToEdit,
    openCreateModal: modals.openCreateModal,
    openEditModal: modals.openEditModal,
    closeModal: modals.closeModal,

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