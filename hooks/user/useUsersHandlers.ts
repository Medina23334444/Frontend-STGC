// hooks/user/useUsersHandlers.ts
import { useCallback } from 'react';
import { EditFormInputs, RegisterFormInputs } from '../../schemas/user.schema';
import { useUsersData } from './useUsersData';
import { toast } from 'sonner';
import { ApiError } from '@/lib/errors/ApiErrors';
import { UserStatus } from '@/types/user';

export function useUsersHandlers() {
  const { createUser, updateUser, deleteUser } = useUsersData();

  const handleCreateUser = useCallback(async (datos: RegisterFormInputs) => {
    try {
      await createUser(datos);
      toast.success('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creando usuario:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message); 
      } else {
        toast.error('Ocurrió un error al crear el usuario'); 
      }
      
      throw error;
    }
  }, [createUser]);

  const handleEditUser = useCallback(async (userId: string, datos: EditFormInputs) => {
    try {
      await updateUser(userId, datos);
      toast.success('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error editando usuario:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message); 
      } else {
        toast.error('Ocurrió un error al actualizar el usuario'); 
      }
      
      throw error;
    }
  }, [updateUser]);
  


  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message); 
      } else {
        toast.error('Ocurrió un error al eliminar el usuario'); 
      }
      
      throw error;
    }
  }, [deleteUser]);

  const handleStatusChange = useCallback(async (userId: string, newStatus: UserStatus) => {
    try {
      await updateUser(userId, { status: newStatus } as any);
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error al cambiar el estado'); 
      }
      throw error;
    }
  }, [updateUser]);

  return {
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    handleStatusChange,
  };
}