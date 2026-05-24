// hooks/users/useUserModal.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormInputs } from '@/schemas/user.schema';


interface UseUserModalReturn {
  readonly register: ReturnType<typeof useForm<RegisterFormInputs>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RegisterFormInputs>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<RegisterFormInputs>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly handleFormSubmit: (datos: RegisterFormInputs) => Promise<void>;
  readonly handleCancel: () => void;
  readonly setValue: ReturnType<typeof useForm<RegisterFormInputs>>['setValue'];
  readonly watch: ReturnType<typeof useForm<RegisterFormInputs>>['watch'];
}

export function useUserModal(
  onSubmit: (datos: RegisterFormInputs) => Promise<void>,
  onSuccess: () => void,
  onClose: () => void,
): UseUserModalReturn {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      identifier: '',
      phone_number: '',
      role_name: 'CAPATAZ',
      status: 'ACTIVO',
    },
  });

  const handleFormSubmit = async (datos: RegisterFormInputs) => {
    try {
      await onSubmit(datos);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error en el formulario de usuario:', err);
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
    setValue,
    watch
  };
}