import * as z from 'zod';

const emailField = z
  .email({ error: 'Por favor, ingresa un correo electrónico válido.' })
  .min(1, 'El correo electrónico es obligatorio.');

const passwordField = z
  .string()
  .min(8, 'Debe tener al menos 8 caracteres.')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula.')
  .regex(/\d/, 'Debe contener al menos un número.')
  .regex(/[@$!%*?&]/, 'Debe contener un carácter especial (@$!%*?&).')
  .regex(/^[A-Za-z\d@$!%*?&]+$/, 'Contiene caracteres inválidos.');

export const recoverSchema = z.object({
  email: emailField,
});
export type RecoverFormInputs = z.infer<typeof recoverSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});
export type LoginFormInputs = z.infer<typeof loginSchema>;

export const resetSchema = z.object({
  password: passwordField,
  confirmPassword: z.string().min(1, 'Confirmar contraseña es obligatorio.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});
export type ResetFormInputs = z.infer<typeof resetSchema>;