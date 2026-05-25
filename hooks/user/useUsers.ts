// hooks/user/useUsers.ts
import { useUsersData } from './useUsersData';
import { useUsersModals } from './useUsersModals';
import { useUsersFormatting } from './useUsersFormatting';
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination';
import { useClientPagination } from '@/hooks/shared/useClientPagination';

export function useUsers() {
  const data = useUsersData();
  const modals = useUsersModals();
  const formatting = useUsersFormatting();

  const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedUsers } = useClientPagination({
    items: data.users,
    pageSize: ITEMS_PER_PAGE,
  });

  return {
    users: paginatedUsers, 
    currentPage,
    setCurrentPage,
    totalPages,
    
    loading: data.loading,
    error: data.error,
    fetchUsers: data.fetchUsers,
    createUser: data.createUser,
    updateUser: data.updateUser,
    deleteUser: data.deleteUser,

    isCreateModalOpen: modals.isCreateModalOpen,
    openCreateModal: modals.openCreateModal,
    closeCreateModal: modals.closeCreateModal,
    isEditModalOpen: modals.isEditModalOpen,
    userToEdit: modals.userToEdit,
    openEditModal: modals.openEditModal,
    closeEditModal: modals.closeEditModal,
    isDeleteModalOpen: modals.isDeleteModalOpen,
    userToDelete: modals.userToDelete,
    openDeleteModal: modals.openDeleteModal,
    closeDeleteModal: modals.closeDeleteModal,
    isStatusModalOpen: modals.isStatusModalOpen,
    statusChangeData: modals.statusChangeData,
    openStatusModal: modals.openStatusModal,
    closeStatusModal: modals.closeStatusModal,

    getStatusBadge: formatting.getStatusBadge,
    getStatusLabel: formatting.getStatusLabel,
    formatUserName: formatting.formatUserName,
    formatUserEmail: formatting.formatUserEmail,
    getRoleLabel: formatting.getRoleLabel,
    getAllStatusOptions: formatting.getAllStatusOptions,
  };
}