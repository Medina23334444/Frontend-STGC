// hooks/roles/useRolesHandlers.ts
import { useCallback } from 'react';
import { RoleCreate, RoleUpdate } from '@/types/rol';
import { useRolesData } from './useRolesData';

export function useRolesHandlers() {
  const { createRole, updateRole, deleteRole } = useRolesData();

  const handleCreateRole = useCallback(async (datos: RoleCreate) => {
    try {
      await createRole(datos);
    } catch (error) {
      console.error('Error creando rol:', error);
      throw error;
    }
  }, [createRole]);

  const handleEditRole = useCallback(async (roleId: string, datos: RoleUpdate) => {
    try {
      await updateRole(roleId, datos);
    } catch (error) {
      console.error('Error editando rol:', error);
      throw error;
    }
  }, [updateRole]);

  const handleDeleteRole = useCallback(async (roleId: string) => {
    try {
      await deleteRole(roleId);
    } catch (error) {
      console.error('Error eliminando rol:', error);
      throw error;
    }
  }, [deleteRole]);

  return {
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
  };
}