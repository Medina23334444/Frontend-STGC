]// hooks/rol/useRoles.ts
import { useRolesFetch } from './useRolesFetch';
import { useRolesMutations } from './useRolesMutations';

export function useRoles() {
  const { roles, setRoles, permissions, fetchAll, loading, error } = useRolesFetch();
  const { createRole, updateRole, deleteRole } = useRolesMutations(setRoles);
  
  return {
    // Data
    roles,
    permissions,
    loading,
    error,
    
    // Acciones
    fetchAll,
    createRole,
    updateRole,
    deleteRole,
  };
}