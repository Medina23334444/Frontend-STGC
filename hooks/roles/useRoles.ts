// hooks/roles/useRoles.ts
import { useRolesFetch } from './useRolesFetch';
import { useRolesMutations } from './useRolesMutations';

export function useRoles() {
  const { roles, setRoles, ...fetchProps } = useRolesFetch();
  const mutations = useRolesMutations(setRoles);
  return { roles, ...fetchProps, ...mutations };
}