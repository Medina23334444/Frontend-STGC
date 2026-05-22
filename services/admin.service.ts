// Antes: ✅ Ya está bien, solo actualizar tipos de retorno
// Después: Agregar mejor manejo de errores

// services/admin.service.ts
import { apiFetch } from '@/lib/api';
import { UserCreate, UserUpdate, User } from '@/types/user';
import { ApiError } from '@/lib/errors/ApiErrors';

export const adminService = {
  async getUsers(): Promise<User[]> {
    try {
      return await apiFetch('/admin/users');
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al obtener usuarios');
    }
  },

  async registerUser(userData: UserCreate): Promise<User> {
    try {
      return await apiFetch('/admin/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al registrar usuario');
    }
  },

  async updateUser(userId: string | number, updateData: UserUpdate): Promise<User> {
    try {
      return await apiFetch(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al actualizar usuario');
    }
  },
};