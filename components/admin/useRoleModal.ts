// components/admin/useRoleModal.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoleSchema, RoleCreateInput, RoleCreateOutput } from '@/schemas/roles.schema';
import { Role, RoleCreate } from '@/types/rol';
import { ApiError, ValidationError } from '@/lib/errors/ApiErrors';

interface UseRoleModalReturn {
    
  readonly register: ReturnType<typeof useForm<RoleCreateInput>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RoleCreateInput, unknown, RoleCreateOutput>>['handleSubmit'];
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

  // Efecto para inicializar o resetear el formulario cuando el modal se abre
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

  const currentPermissions = watch('permission_ids') ?? [];

  const togglePermission = (id: string) => {
    const next = currentPermissions.includes(id)
      ? currentPermissions.filter((pId) => pId !== id)
      : [...currentPermissions, id];
    setValue('permission_ids', next, { shouldValidate: true });
  };

  // Manejo del Submit y Errores
  const handleFormSubmit = async (formData: RoleCreateOutput) => {
    setApiError(null);
    try {
      // formData ya viene limpio, validado y con los defaults aplicados por Zod
      await onSubmit({
        name: formData.name,
        description: formData.description, // Ya es string | null, nunca undefined
        permission_ids: formData.permission_ids, // Ya es string[], nunca undefined
      });
      
      reset();
      onClose();
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = Object.values(error.validationErrors)
        .flat()
        .map(e => typeof e === 'string' ? e : JSON.stringify(e))
        .join(', ');
        setApiError(`Error de validación: ${messages}`);
      } else if (error instanceof ApiError) {
        setApiError(error.message);
      } else if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Ocurrió un error inesperado al guardar el rol.');
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