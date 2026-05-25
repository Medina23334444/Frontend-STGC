// hooks/useUsersData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UserCreate, UserUpdate } from '@/types/user';
import { adminService } from '@/services/admin.service';
import { ApiError } from '@/lib/errors/ApiErrors';
import { z } from 'zod';

const UserArraySchema = z.array(
  z.object({
    id: z.string(),
    email: z.string().check(z.email()),
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
  const queryClient = useQueryClient();

  const query = useQuery<User[], ApiError>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const rawData = await adminService.getUsers();
        return UserArraySchema.parse(rawData) as User[];
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError(500, 'Error al obtener usuarios');
        throw apiError;
      }
    },
  });

  const fetchUsers = useCallback(async () => {
    await query.refetch();
  }, [query.refetch]);

  const updateCachedUsers = useCallback((updater: (currentUsers: User[]) => User[]) => {
    queryClient.setQueryData<User[]>(['users'], (currentUsers) => {
      if (!currentUsers) return currentUsers;
      return updater(currentUsers);
    });
  }, [queryClient]);

  const createUser = useCallback(async (userData: UserCreate): Promise<User> => {
    try {
      const newUser = await adminService.registerUser(userData);
      updateCachedUsers((currentUsers) => [...currentUsers, newUser]);
      return newUser;
    } catch (err: unknown) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al crear usuario');
      throw apiError;
    }
  }, [updateCachedUsers]);

  const updateUser = useCallback(async (userId: string, updateData: UserUpdate): Promise<User> => {
    try {
      const updatedUser = await adminService.updateUser(userId, updateData);
      updateCachedUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? updatedUser : user))
      );
      return updatedUser;
    } catch (err: unknown) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al actualizar usuario');
      throw apiError;
    }
  }, [updateCachedUsers]);

  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      updateCachedUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    } catch (err: unknown) {
      const apiError = err instanceof ApiError ? err : new ApiError(0, 'Error al eliminar usuario');
      throw apiError;
    }
  }, [updateCachedUsers]);

  return {
    users: query.data ?? [],
    loading: query.isPending,
    error: query.error ?? null,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}