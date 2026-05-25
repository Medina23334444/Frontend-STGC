// hooks/roles/useRoles.ts
import { useRolesData } from './useRolesData';
import { useRolesModals } from './useRolesModals'; 
import { useRolesFormatting } from './useRolesFormatting'; 
import { useRolesHandlers } from './useRolesHandlers';
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination';
import { useClientPagination } from '@/hooks/shared/useClientPagination';

export function useRoles() {
  const data = useRolesData();
  const modals = useRolesModals();
  const formatting = useRolesFormatting();
  const { handleCreateRole, handleEditRole, handleDeleteRole } = useRolesHandlers(
    data.createRole,
    data.updateRole,
    data.deleteRole,
  );

  const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedRoles } = useClientPagination({
    items: data.roles,
    pageSize: ITEMS_PER_PAGE,
  });

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