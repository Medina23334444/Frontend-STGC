// hooks/roles/useRoleModal.ts
import {useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoleSchema, RoleCreateInput, RoleCreateOutput } from '@/schemas/roles.schema';
import { Role, RoleCreate } from '@/types/rol';


interface UseRoleModalReturn {
    
  readonly register: ReturnType<typeof useForm<RoleCreateInput>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RoleCreateInput, unknown, RoleCreateOutput>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<RoleCreateInput>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly currentPermissions: string[];
  readonly togglePermission: (id: string) => void;
  readonly handleFormSubmit: (formData: RoleCreateOutput) => Promise<void>;
  readonly handleCancel: () => void;
}

export function useRoleModal(
  onSubmit: (data: RoleCreate) => Promise<void>,
  onClose: () => void,
  isOpen: boolean,
  initialData?: Role | null
): UseRoleModalReturn {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleCreateInput, unknown, RoleCreateOutput>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: '',
      description: null,
      permission_ids: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? null,
        permission_ids: initialData.permissions.map((p) => p.id),
      });
    } else {
      reset({ name: '', description: null, permission_ids: [] });
    }
  }, [isOpen, initialData, reset]);

  const currentPermissions = watch('permission_ids') ?? [];

  const togglePermission = (id: string) => {
    const next = currentPermissions.includes(id)
      ? currentPermissions.filter((pId) => pId !== id)
      : [...currentPermissions, id];
    setValue('permission_ids', next, { shouldValidate: true });
  };

  const handleFormSubmit = async (formData: RoleCreateOutput) => {
    try {

      await onSubmit({
        name: formData.name,
        description: formData.description, 
        permission_ids: formData.permission_ids, 
      });
      
      reset();
      onClose();
    } catch (error) {
     console.error("Error en el formulario:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    currentPermissions,
    togglePermission,
    handleFormSubmit,
    handleCancel,
  };
}