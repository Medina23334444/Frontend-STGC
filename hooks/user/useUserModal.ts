// hooks/users/useUserModal.ts
import { useEffect, useMemo } from 'react';
import { useForm, UseFormRegister, UseFormHandleSubmit, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editUserSchema,
  registerSchema,
  EditFormInputs,
  RegisterFormInputs,
} from '@/schemas/user.schema';
import { User } from '@/types/user';

type FormInputs = Omit<RegisterFormInputs, 'password'> & { password?: string };

interface UseUserModalReturn {
  readonly register: UseFormRegister<FormInputs>;
  readonly handleSubmit: UseFormHandleSubmit<FormInputs>;
  readonly errors: FieldErrors<FormInputs>;
  readonly isSubmitting: boolean;
  readonly handleFormSubmit: (data: FormInputs) => Promise<void>;
  readonly handleCancel: () => void;
  readonly setValue: UseFormSetValue<FormInputs>;
  readonly watch: UseFormWatch<FormInputs>;
  readonly isEditMode: boolean;
}

const EDIT_DEFAULTS: EditFormInputs = {
  phone_number: '',
  email: '',
  role_name: 'CAPATAZ',
  status: 'ACTIVO',
  password: '',
};

const REGISTER_DEFAULTS: RegisterFormInputs = {
  first_name: '',
  last_name: '',
  identifier: '',
  phone_number: '',
  role_name: 'CAPATAZ',
  status: 'ACTIVO',
  email: '',
  password: '',
};

export function useUserModal(
  onSubmit: (data: FormInputs) => Promise<void>,
  onSuccess: () => void,
  onClose: () => void,
  initialData?: User | null,
): UseUserModalReturn {
  const isEditMode = !!initialData;

  const resolver = useMemo(
    () => zodResolver(isEditMode ? editUserSchema : registerSchema),
    [isEditMode],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormInputs>({
    resolver,
    defaultValues: isEditMode ? EDIT_DEFAULTS : REGISTER_DEFAULTS,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        phone_number: initialData.phone_number ?? '',
        email: initialData.email ?? '',
        role_name: (initialData.role?.name ?? 'CAPATAZ') as EditFormInputs['role_name'],
        status: initialData.status ?? 'ACTIVO',
        password: '',
      });
    } else {
      reset(REGISTER_DEFAULTS);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: FormInputs) => {
    try {
      await onSubmit(data);
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
    isEditMode,
  };
}