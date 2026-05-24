// hooks/roles/useRolesFetch.ts
import { useState, useCallback } from 'react';
import { rolesService } from '@/services/rol.service';
import { permissionsService } from '@/services/permission.service';
import { Role } from '@/types/rol';
import { Permission } from '@/types/permission';
import { ApiError, createApiError } from '@/lib/errors/ApiErrors';
import { RoleArraySchema } from '@/schemas/roles.schema';
import { PermissionArraySchema } from '@/schemas/permission.schema'; 
import { z } from 'zod';

export function useRolesFetch() {
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
      if (err instanceof ApiError) setError(err);
      else if (err instanceof z.ZodError) setError(new ApiError(422, 'Error de formato'));
      else setError(createApiError(500, { message: 'Error desconocido' }));
    }
    finally { setLoading(false); }
  }, []);

  return { roles, setRoles, permissions, fetchAll, loading, error };
}