// types/user.ts

export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'PENDIENTE';

export interface UserCreate {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  identifier?: string | null;
  phone_number?: string | null;
  password?: string;
  role_name: string;
  status?: UserStatus;
}

export interface UserUpdate {
  email?: string;
  role_name?: string | null;
  status?: UserStatus | null;
  phone_number?: string | null;
  password?: string;
}

export interface RoleOut {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  identifier?: string | null;
  phone_number?: string | null;
  role: RoleOut;
  status: UserStatus;
  suspended_from?: string | null;
  suspended_until?: string | null;
}