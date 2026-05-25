// hooks/user/useUsersModals.ts
import { useState, useCallback } from 'react';
import { User, UserStatus } from '@/types/user';

interface UseUsersModalsReturn {
  readonly isCreateModalOpen: boolean;
  readonly openCreateModal: () => void;
  readonly closeCreateModal: () => void;
  readonly isEditModalOpen: boolean;
  readonly userToEdit: User | null;
  readonly openEditModal: (user: User) => void;
  readonly closeEditModal: () => void;
  readonly isDeleteModalOpen: boolean;
  readonly userToDelete: User | null;
  readonly openDeleteModal: (user: User) => void;
  readonly closeDeleteModal: () => void;
  readonly isStatusModalOpen: boolean;
  readonly statusChangeData: { user: User; newStatus: UserStatus } | null;
  readonly openStatusModal: (user: User, newStatus: UserStatus) => void;
  readonly closeStatusModal: () => void;
}

export function useUsersModals(): UseUsersModalsReturn {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState<{ user: User; newStatus: UserStatus } | null>(null);

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

  const openStatusModal = useCallback((user: User, newStatus: UserStatus) => {
    setStatusChangeData({ user, newStatus });
    setIsStatusModalOpen(true);
  }, []);

  const closeStatusModal = useCallback(() => {
    setStatusChangeData(null);
    setIsStatusModalOpen(false);
  }, []);

  return {
    isCreateModalOpen, openCreateModal, closeCreateModal,
    isEditModalOpen, userToEdit, openEditModal, closeEditModal,
    isDeleteModalOpen, userToDelete, openDeleteModal, closeDeleteModal,
    
    isStatusModalOpen, statusChangeData, openStatusModal, closeStatusModal,
  };
}