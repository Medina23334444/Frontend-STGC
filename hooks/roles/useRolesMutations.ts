// hooks/rol/useRolesMutations.ts
import { useCallback } from 'react';
import { rolesService } from '@/services/rol.service';
import { createApiError } from '@/lib/errors/ApiErrors';
import { Role, RoleCreate, RoleUpdate } from '@/types/rol'; 

export function useRolesMutations(setRoles: React.Dispatch<React.SetStateAction<Role[]>>) {
  const createRole = useCallback(async (data: RoleCreate) => {
    try {
      const newRole = await rolesService.create(data);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, [setRoles]);
  const updateRole = useCallback(async (id: string, data: RoleUpdate) => {
    try {
      const updatedRole = await rolesService.update(id, data);
      setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
      return updatedRole;
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, [setRoles]);
  const deleteRole = useCallback(async (id: string) => {
    try {
      await rolesService.delete(id);
      setRoles(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, [setRoles]);

  return { createRole, updateRole, deleteRole };
}