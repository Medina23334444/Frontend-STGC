// hooks/users/useUserModal.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormInputs } from '@/schemas/user.schema';
import { ApiError } from '@/lib/errors/ApiErrors';

interface UseUserModalReturn {
  readonly register: ReturnType<typeof useForm<RegisterFormInputs>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RegisterFormInputs>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<RegisterFormInputs>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly apiError: string | null;
  readonly handleFormSubmit: (datos: RegisterFormInputs) => Promise<void>;
  readonly handleCancel: () => void;
}

export function useUserModal(
  onSubmit: (datos: RegisterFormInputs) => Promise<void>,
  onSuccess: () => void,
  onClose: () => void,
): UseUserModalReturn {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      identifier: '',
      phone_number: '',
      role_name: 'OPERADOR',
      status: 'ACTIVO',
    },
  });

  const handleFormSubmit = async (datos: RegisterFormInputs) => {
    setApiError(null);
    try {
      await onSubmit(datos);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError('Error desconocido');
      }
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
    apiError,
    handleFormSubmit,
    handleCancel,
  };
}