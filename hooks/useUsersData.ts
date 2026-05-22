// hooks/useUsersData.ts
import { useState, useCallback } from 'react';
import { User, UserCreate, UserUpdate } from '@/types/user';
import { adminService } from '@/services/admin.service';
import { ApiError } from '../lib/errors/ApiErrors';

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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error desconocido');
      setError(apiError);
      console.error('Error fetching users:', apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user
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

  // Update user
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

  // Delete user
  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      // Si tu API no tiene endpoint delete, ignorar por ahora
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