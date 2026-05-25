export interface Role {
  id: string;
  name: string;
  description?: string | null; 
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreate {
  name: string;
  description?: string | null;
}

export interface RoleUpdate {
  name: string;
  description?: string | null;
}