// hooks/roles/useRolesData.ts
import { useState, useCallback } from 'react';
import { rolesService } from '@/services/rol.service';
import { permissionsService } from '@/services/permission.service';
import { Role, RoleCreate, RoleUpdate } from '@/types/rol';
import { Permission } from '@/types/permission';
import { ApiError, createApiError } from '@/lib/errors/ApiErrors';
import { RoleArraySchema } from '@/schemas/roles.schema';
import { PermissionArraySchema } from '@/schemas/permission.schema'; 
import { z } from 'zod';

export function useRolesData() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        rolesService.getAll(),
        permissionsService.getAll()
      ]);
      setRoles(RoleArraySchema.parse(rolesData));
      setPermissions(PermissionArraySchema.parse(permsData));
    } catch (err) {
      console.error('Error en fetchAll:', err);
      if (err instanceof ApiError) setError(err);
      else if (err instanceof z.ZodError) setError(new ApiError(422, 'Error de formato'));
      else setError(createApiError(500, { message: 'Error desconocido' }));
    } finally { 
      setLoading(false); 
    }
  }, []);

  const createRole = useCallback(async (data: RoleCreate) => {
    try {
      const newRole = await rolesService.create(data);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, []);

  const updateRole = useCallback(async (id: string, data: RoleUpdate) => {
    try {
      const updatedRole = await rolesService.update(id, data);
      setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
      return updatedRole;
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await rolesService.delete(id);
      setRoles(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  }, []);

  return { roles, permissions, loading, error, fetchAll, createRole, updateRole, deleteRole };
}