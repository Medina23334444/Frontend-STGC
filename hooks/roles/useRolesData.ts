// hooks/roles/useRolesData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '@/services/rol.service';
import { permissionsService } from '@/services/permission.service';
import { Role, RoleCreate, RoleUpdate } from '@/types/rol';
import { Permission } from '@/types/permission';
import { ApiError, createApiError } from '@/lib/errors/ApiErrors';
import { RoleArraySchema } from '@/schemas/roles.schema';
import { PermissionArraySchema } from '@/schemas/permission.schema'; 
import { z } from 'zod';

const rolesDataQueryKey = ['roles-data'] as const;

type RolesDataQuery = {
  roles: Role[];
  permissions: Permission[];
};

function normalizeQueryError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof z.ZodError) return new ApiError(422, 'Error de formato');
  return createApiError(500, { message: 'Error desconocido' });
}

export function useRolesData() {
  const queryClient = useQueryClient();

  const query = useQuery<RolesDataQuery, ApiError>({
    queryKey: rolesDataQueryKey,
    queryFn: async () => {
      try {
        const [rolesData, permsData] = await Promise.all([
          rolesService.getAll(),
          permissionsService.getAll(),
        ]);

        return {
          roles: RoleArraySchema.parse(rolesData),
          permissions: PermissionArraySchema.parse(permsData),
        };
      } catch (error) {
        throw normalizeQueryError(error);
      }
    },
  });

  const fetchAll = useCallback(async () => {
    await query.refetch();
  }, [query.refetch]);

  const updateCachedRoles = useCallback((updater: (currentRoles: Role[]) => Role[]) => {
    queryClient.setQueryData<RolesDataQuery>(rolesDataQueryKey, (current) => {
      if (!current) return current;
      return {
        ...current,
        roles: updater(current.roles),
      };
    });
  }, [queryClient]);

  const createRole = useCallback(async (data: RoleCreate) => {
    try {
      const newRole = await rolesService.create(data);
      updateCachedRoles((currentRoles) => [...currentRoles, newRole]);
      return newRole;
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const statusCode = typeof err === 'object' && err !== null && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500;
      throw createApiError(statusCode, err);
    }
  }, [updateCachedRoles]);

  const updateRole = useCallback(async (id: string, data: RoleUpdate) => {
    try {
      const updatedRole = await rolesService.update(id, data);
      updateCachedRoles((currentRoles) => currentRoles.map((role) => (role.id === id ? updatedRole : role)));
      return updatedRole;
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const statusCode = typeof err === 'object' && err !== null && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500;
      throw createApiError(statusCode, err);
    }
  }, [updateCachedRoles]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await rolesService.delete(id);
      updateCachedRoles((currentRoles) => currentRoles.filter((role) => role.id !== id));
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const statusCode = typeof err === 'object' && err !== null && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500;
      throw createApiError(statusCode, err);
    }
  }, [updateCachedRoles]);

  return {
    roles: query.data?.roles ?? [],
    permissions: query.data?.permissions ?? [],
    loading: query.isPending,
    error: query.error ?? null,
    fetchAll,
    createRole,
    updateRole,
    deleteRole,
  };
}