import { apiFetch } from '@/lib/api';
import { Role, RoleCreate, RoleUpdate } from '@/types/rol';

export const rolesService = {
  async getAll(): Promise<Role[]> {
    return await apiFetch('/roles/');
  },
  async create(data: RoleCreate): Promise<Role> {
    return await apiFetch('/roles/', { method: 'POST', body: JSON.stringify(data) });
  },
  async update(id: string, data: RoleUpdate): Promise<Role> {
    return await apiFetch(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async delete(id: string): Promise<void> {
    return await apiFetch(`/roles/${id}`, { method: 'DELETE' });
  }
};