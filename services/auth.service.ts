// services/auth.service.ts
import { apiFetch } from '@/lib/api';
import { UserLogin, LoginResponse } from '@/types/auth';
import { ApiError } from '@/lib/errors/ApiErrors';

export const authService = {
  async login(credentials: UserLogin): Promise<LoginResponse> {
    try {
      return await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al iniciar sesión');
    }
  },

  async logout(): Promise<void> {
    try {
      return await apiFetch('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al cerrar sesión');
    }
  }
};