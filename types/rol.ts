// types/rol.ts
import { Permission } from './permission';

export interface Role {
  id: string;
  name: string;
  description?: string | null; 
  permissions: Permission[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreate {
  name: string;
  description?: string | null;
  permission_ids?: string[];
}

export interface RoleUpdate {
  name: string;
  description?: string | null;
  permission_ids?: string[];
}