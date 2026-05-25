// hooks/users/useUserModal.ts
import { useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema, registerSchema, EditFormInputs, RegisterFormInputs } from '@/schemas/user.schema';
import { User } from '@/types/user';

interface UseUserModalReturn {
  readonly register: ReturnType<typeof useForm<RegisterFormInputs | EditFormInputs>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<RegisterFormInputs | EditFormInputs>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<RegisterFormInputs | EditFormInputs>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly handleFormSubmit: (datos: RegisterFormInputs | EditFormInputs) => Promise<void>;
  readonly handleCancel: () => void;
  readonly setValue: ReturnType<typeof useForm<RegisterFormInputs | EditFormInputs>>['setValue'];
  readonly watch: ReturnType<typeof useForm<RegisterFormInputs | EditFormInputs>>['watch'];
  readonly isEditMode: boolean; // 4. Agregado a la interfaz
}

export function useUserModal(
  onSubmit: (datos: RegisterFormInputs | EditFormInputs) => Promise<void>,
  onSuccess: () => void,
  onClose: () => void,
  initialData?: User | null
): UseUserModalReturn {

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RegisterFormInputs | EditFormInputs>({
    resolver: zodResolver(isEditMode ? editUserSchema : registerSchema),
    defaultValues: {
      phone_number: '',
      role_name: 'CAPATAZ',
      status: 'ACTIVO',
      email: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        phone_number: initialData.phone_number || '',
        email: initialData.email || '',
        role_name: initialData.role?.name || 'CAPATAZ',
        status: initialData.status || 'ACTIVO',
        password: '',
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        identifier: '',
        phone_number: '',
        role_name: 'CAPATAZ',
        status: 'ACTIVO',
        email: '',
        password: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (datos: RegisterFormInputs | EditFormInputs) => {
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
    watch,
    isEditMode 
  };
}