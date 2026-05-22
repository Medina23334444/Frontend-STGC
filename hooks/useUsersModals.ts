// hooks/useUsersModals.ts
import { useState, useCallback } from 'react';
import { User } from '@/types/user';

interface UseUsersModalsReturn {
  // Modal de creación
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  // Modal de edición
  isEditModalOpen: boolean;
  userToEdit: User | null;
  openEditModal: (user: User) => void;
  closeEditModal: () => void;

  // Modal de confirmación de eliminación
  isDeleteModalOpen: boolean;
  userToDelete: User | null;
  openDeleteModal: (user: User) => void;
  closeDeleteModal: () => void;
}

/**
 * Hook especializado en gestión de estado de modales
 * Responsabilidades:
 * - Abrir/cerrar modales
 * - Mantener el usuario seleccionado (edit/delete)
 */
export function useUsersModals(): UseUsersModalsReturn {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const openEditModal = useCallback((user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setUserToEdit(null);
    setIsEditModalOpen(false);
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  }, []);

  return {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    userToEdit,
    openEditModal,
    closeEditModal,
    isDeleteModalOpen,
    userToDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}