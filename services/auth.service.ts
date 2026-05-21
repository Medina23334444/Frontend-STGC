// services/auth.service.ts
import { apiFetch } from '@/lib/api';
import { UserLogin, LoginResponse } from '@/types/auth';

export const authService = {
  /**
   * Envía las credenciales a nuestro puente BFF en Next.js (/api/auth/login)
   */
  async login(credentials: UserLogin): Promise<LoginResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Destruye la sesión llamando a nuestro puente BFF
   */
  async logout(): Promise<void> {
    return apiFetch('/auth/logout', {
      method: 'POST',
    });
  }
};