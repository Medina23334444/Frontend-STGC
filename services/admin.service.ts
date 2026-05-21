// services/admin.service.ts
import { UserCreate, UserUpdate } from '@/types/user';

export const adminService = {
  /**
   * Obtiene la lista completa de usuarios (requiere token ADMIN o GERENTE)
   */
  getUsers: async () => {
    const res = await fetch('/api/admin/users');
    if (!res.ok) {
      throw new Error('Error al cargar la lista de personal');
    }
    return await res.json();
  },

  /**
   * Registra un nuevo usuario a través del proxy de Next.js

   * @param userData Datos del formulario de registro
   */
  registerUser: async (userData: UserCreate) => {
    const res = await fetch('/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error || 'Error al registrar al usuario');
    }

    return await res.json();
  },

  /**
   * Actualiza un usuario existente a través del proxy de Next.js
   * @param userId El ID del usuario a modificar
   * @param updateData Los datos a actualizar (role_name, status)
   */
  updateUser: async (userId: string | number, updateData: UserUpdate) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error || 'Error al actualizar al usuario');
    }

    return await res.json();
  }
};
