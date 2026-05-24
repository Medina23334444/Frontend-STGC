// components/admin/useRoleModal.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoleSchema, RoleCreateInput, RoleCreateOutput } from '@/schemas/roles.schema';
import { Role, RoleCreate } from '@/types/rol';
import { ApiError, ValidationError } from '@/lib/errors/ApiErrors';

interface UseRoleModalReturn {
  readonly register: ReturnType<typeof useForm<RoleCreateInput>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RoleCreateInput>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<RoleCreateInput>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly apiError: string | null;
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
  const [apiError, setApiError] = useState<string | null>(null);

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
    setApiError(null);
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

  // Lógica de checkboxes de permisos
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
        description: formData.description ?? null,
        permission_ids: formData.permission_ids ?? [],
        });
        onClose(); 
    } catch (error: any) {
        // Aquí manejas el error
        if (error.name === 'ValidationError') {
        // Si el servidor devolvió errores de validación (422), 
        // podrías mostrarlos usando setError de react-hook-form
        console.error('Errores de validación del servidor:', error.validationErrors);
        alert('Por favor, revisa los campos.');
        } else {
        // Para errores 500, 401, etc.
        alert(error.message || 'Ocurrió un error inesperado');
        }
    }
  };

  // Manejo de Cancelación
  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    apiError,
    currentPermissions,
    togglePermission,
    handleFormSubmit,
    handleCancel,
  };
}