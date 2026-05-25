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
    formState: { errors, isSubmitting },
  } = useForm<RoleCreateInput, unknown, RoleCreateOutput>({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: '',
      description: null,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? null,
      });
    } else {
      reset({ name: '', description: null });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (formData: RoleCreateOutput) => {
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
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
    handleFormSubmit,
    handleCancel,
  };
}