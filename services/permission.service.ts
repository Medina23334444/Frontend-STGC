import { apiFetch } from '@/lib/api';
import { Permission } from '@/types/permission';

export const permissionsService = {
  async getAll(): Promise<Permission[]> {
    return await apiFetch('/roles/permissions');
  }
};