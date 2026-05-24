// hooks/useUsersHandlers.ts
import { useCallback } from 'react';
import { RegisterFormInputs } from '../../schemas/user.schema';
import { useUsersData } from './useUsersData';

export function useUsersHandlers() {
  const { createUser, updateUser, deleteUser } = useUsersData();

  const handleCreateUser = useCallback(async (datos: RegisterFormInputs) => {
    try {
      await createUser(datos);
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }, [createUser]);

  const handleEditUser = useCallback(async (userId: string, datos: RegisterFormInputs) => {
    try {
      await updateUser(userId, datos);
    } catch (error) {
      console.error('Error editando usuario:', error);
      throw error;
    }
  }, [updateUser]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }, [deleteUser]);

  return {
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  };
}