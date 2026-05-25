// hooks/users/useUserModal.ts
import { useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, editUserSchema } from '@/schemas/user.schema';
import { User } from '@/types/user';

interface UseUserModalReturn {
  readonly register: ReturnType<typeof useForm<any>>['register'];
  readonly handleSubmit: ReturnType<typeof useForm<any>>['handleSubmit'];
  readonly errors: ReturnType<typeof useForm<any>>['formState']['errors'];
  readonly isSubmitting: boolean;
  readonly handleFormSubmit: (datos: any) => Promise<void>;
  readonly handleCancel: () => void;
  readonly setValue: ReturnType<typeof useForm<any>>['setValue'];
  readonly watch: ReturnType<typeof useForm<any>>['watch'];
  readonly isEditMode: boolean; // 4. Agregado a la interfaz
}

export function useUserModal(
  onSubmit: (datos: any) => Promise<void>,
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
  } = useForm<any>({
    resolver: zodResolver(isEditMode ? editUserSchema : registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      identifier: '',
      phone_number: '',
      role_name: 'CAPATAZ',
      status: 'ACTIVO',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        identifier: initialData.identifier || '',
        phone_number: initialData.phone_number || '',
        email: initialData.email || '',
        role_name: initialData.role?.name || 'CAPATAZ',
        status: initialData.status || 'ACTIVO',
      });
    } else {
      reset({
        first_name: '', last_name: '', identifier: '', phone_number: '',
        role_name: 'CAPATAZ', status: 'ACTIVO', email: '', password: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (datos: any) => {
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