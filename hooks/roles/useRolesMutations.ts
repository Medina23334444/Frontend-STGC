// hooks/roles/useRolesMutations.ts
import { rolesService} from '@/services/rol.service';
import { createApiError } from '@/lib/errors/ApiErrors';
import { Role, RoleCreate } from '@/types/rol'; 

export function useRolesMutations(setRoles: React.Dispatch<React.SetStateAction<Role[]>>) {
  const createRole = async (data: RoleCreate) => {
    try {
      const newRole = await rolesService.create(data);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (err: any) {
      throw createApiError(err.statusCode || 500, err);
    }
  };

  return { createRole };
}