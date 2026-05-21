// services/auth.service.ts
import { apiFetch } from '@/lib/api';
import { UserLogin, TokenResponse } from '@/types/auth';

export const authService = {
  /**
   * Envía las credenciales al endpoint de Login JSON de FastAPI.
   * @param credentials Objeto con email y password.
   * @returns Promesa con el access_token y token_type.
   */
  async login(credentials: UserLogin): Promise<TokenResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
};