// hooks/roles/useRolesModals.ts
import { useState, useCallback } from 'react';
import { Role } from '@/types/rol'; 

export function useRolesModals() {
  // Estados para Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

  // Estados para Eliminar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const openCreateModal = useCallback(() => {
    setRoleToEdit(null); 
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((role: Role) => {
    setRoleToEdit(role); 
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setRoleToEdit(null);
  }, []);

  const openDeleteModal = useCallback((role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  }, []);

  return {
    isModalOpen,
    roleToEdit,
    openCreateModal,
    openEditModal,
    closeModal,
    isDeleteModalOpen,
    roleToDelete,
    openDeleteModal,
    closeDeleteModal
  };
}