// hooks/roles/useRolesModals.ts
import { useState, useCallback } from 'react';
import { Role } from '@/schemas/roles.schema'; 

export function useRolesModals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

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

  return {
    isModalOpen,
    roleToEdit,
    openCreateModal,
    openEditModal,
    closeModal
  };
}