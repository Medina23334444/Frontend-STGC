// hooks/rol/useRoles.ts
import { useRolesFetch } from './useRolesFetch';
import { useRolesMutations } from './useRolesMutations';
import { useRolesModals } from './useRolesModals'; 

export function useRoles() {
  const { roles, setRoles, permissions, fetchAll, loading, error } = useRolesFetch();
  const { createRole, updateRole, deleteRole } = useRolesMutations(setRoles);
  
  // ✅ Instanciamos los modales
  const { 
    isModalOpen, 
    roleToEdit, 
    openCreateModal, 
    openEditModal, 
    closeModal 
  } = useRolesModals();
  
  return {
    // Data
    roles,
    permissions,
    loading,
    error,
    
    // Acciones de Red
    fetchAll,
    createRole,
    updateRole,
    deleteRole,

    // Estado y Acciones de Modales
    isModalOpen,
    roleToEdit,
    openCreateModal,
    openEditModal,
    closeModal,
  }; 
}