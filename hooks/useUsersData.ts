// hooks/useUsersData.ts
import { useState, useCallback } from 'react';
import { User, UserCreate, UserUpdate } from '@/types/user';
import { adminService } from '@/services/admin.service';
import { ApiError } from '@/lib/errors/ApiErrors';
import { z } from 'zod';

const UserArraySchema = z.array(
  z.object({
    id: z.string(),
    email: z.string().email(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    identifier: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    role: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
    }).optional(),
    status: z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE']),
    suspended_from: z.string().nullable().optional(),
    suspended_until: z.string().nullable().optional(),
  })
);

interface UseUsersDataReturn {
  users: User[];
  loading: boolean;
  error: ApiError | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: UserCreate) => Promise<User>;
  updateUser: (userId: string, updateData: UserUpdate) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
}

/**
 * Hook especializado en gestión de datos de usuarios
 * Responsabilidades:
 * - Fetch de lista de usuarios
 * - CRUD operations
 * - Error handling
 * - Loading states
 */
export function useUsersData(): UseUsersDataReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await adminService.getUsers();
      // Zod valida y devuelve el tipo correcto
      const validUsers = UserArraySchema.parse(rawData);
      setUsers(validUsers as User[]); // Ahora es seguro
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(500, 'Error al obtener usuarios');
      setError(apiError);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: UserCreate): Promise<User> => {
    try {
      const newUser = await adminService.registerUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al crear usuario');
      setError(apiError);
      throw apiError;
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updateData: UserUpdate): Promise<User> => {
    try {
      const updatedUser = await adminService.updateUser(userId, updateData);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al actualizar usuario');
      setError(apiError);
      throw apiError;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al eliminar usuario');
      setError(apiError);
      throw apiError;
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}