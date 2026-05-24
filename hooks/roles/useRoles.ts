// hooks/rol/useRoles.ts
import { useRolesFetch } from './useRolesFetch';
import { useRolesMutations } from './useRolesMutations';
import { useRolesModals } from './useRolesModals'; 

export function useRoles() {
  const { roles, setRoles, permissions, fetchAll, loading, error } = useRolesFetch();
  const { createRole, updateRole, deleteRole } = useRolesMutations(setRoles);
  
  const { 
    isModalOpen, 
    roleToEdit, 
    openCreateModal, 
    openEditModal, 
    closeModal 
  } = useRolesModals();
  
  return {
    roles,
    permissions,
    loading,
    error,
    fetchAll,
    createRole,
    updateRole,
    deleteRole,
    isModalOpen,
    roleToEdit,
    openCreateModal,
    openEditModal,
    closeModal,
  }; 
}