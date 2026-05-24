// hooks/roles/useRolesHandlers.ts
import { useCallback } from 'react';
import { RoleCreate, RoleUpdate } from '@/types/rol';
import { toast } from 'sonner';
import { ApiError } from '@/lib/errors/ApiErrors';

export function useRolesHandlers(
  createRole: (data: RoleCreate) => Promise<any>,
  updateRole: (id: string, data: RoleUpdate) => Promise<any>,
  deleteRole: (id: string) => Promise<void>,
) {
  
  const handleCreateRole = useCallback(async (datos: RoleCreate) => {
    try {
      await createRole(datos);
      toast.success('Rol creado exitosamente');
    } catch (error) {
      console.error('Error creando rol:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message); 
      } else {
        toast.error('Ocurrió un error al crear el rol'); 
      }
      
      throw error; 
    }
  }, [createRole]);

  const handleEditRole = useCallback(async (roleId: string, datos: RoleUpdate) => {
    try {
      await updateRole(roleId, datos);
      toast.success('Rol actualizado exitosamente');
    } catch (error) {
      console.error('Error editando rol:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error al actualizar el rol');
      }
      
      throw error;
    }
  }, [updateRole]);

  const handleDeleteRole = useCallback(async (roleId: string) => {
    try {
      await deleteRole(roleId);
      toast.success('Rol eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando rol:', error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error al eliminar el rol');
      }
      
      throw error;
    }
  }, [deleteRole]);

  return { handleCreateRole, handleEditRole, handleDeleteRole };
}