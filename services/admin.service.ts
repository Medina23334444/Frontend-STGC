// services/admin.service.ts
import { apiFetch } from '@/lib/api';
import { UserCreate, UserUpdate } from '@/types/user';

export const adminService = {
  /**
   * Obtiene la lista completa de usuarios a través del proxy BFF.
   * Requiere permisos de ADMIN o GERENTE_GENERAL.
   */
  getUsers: async () => {
    return apiFetch('/admin/users');
  },

  /**
   * Registra un nuevo usuario en el sistema.
   * @param userData Datos del formulario de registro (validados por Zod).
   */
  registerUser: async (userData: UserCreate) => {
    return apiFetch('/admin/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Actualiza el rol o estado de un usuario existente.
   * @param userId Identificador único del usuario.
   * @param updateData Parámetros modificables (role_name, status).
   */
  updateUser: async (userId: string | number, updateData: UserUpdate) => {
    return apiFetch(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }
};