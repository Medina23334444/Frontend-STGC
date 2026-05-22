import { Permission } from './permission';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RoleCreate {
  name: string;
  description?: string;
  permission_ids?: string[];
}

export interface RoleUpdate {
  name: string;
  description?: string;
  permission_ids?: string[];
}