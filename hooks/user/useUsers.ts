// hooks/users/useUsers.ts
import { useEffect } from 'react';
import { useUsersData } from './useUsersData';
import { useUsersModals } from './useUsersModals';
import { useUsersFormatting } from './useUsersFormatting';

export function useUsers() {
  const data = useUsersData();
  const modals = useUsersModals();
  const formatting = useUsersFormatting();

  useEffect(() => {
    data.fetchUsers();
  }, [data.fetchUsers]);

  return {
    // Data
    users: data.users,
    loading: data.loading,
    error: data.error,
    fetchUsers: data.fetchUsers,
    createUser: data.createUser,
    updateUser: data.updateUser,
    deleteUser: data.deleteUser,

    // Modals
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

    // Formatting
    getStatusBadge: formatting.getStatusBadge,
    getStatusDot: formatting.getStatusDot,
    getStatusLabel: formatting.getStatusLabel,
    formatUserName: formatting.formatUserName,
    formatUserEmail: formatting.formatUserEmail,
    getRoleLabel: formatting.getRoleLabel,
    getAllStatusOptions: formatting.getAllStatusOptions,
  };
}