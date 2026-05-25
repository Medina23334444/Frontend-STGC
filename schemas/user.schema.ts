// schemas/user.schema.ts
import * as z from 'zod';
import { STATUS_VALUES } from '@/lib/constants/userStatuses';
import { ROLE_VALUES } from '@/lib/constants/userRoles';

export const registerSchema = z.object({
  email: z.email({ error: 'Formato de correo inválido.' }).min(1, 'El correo es obligatorio.'),
  password: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula.')
    .regex(/\d/, 'Debe contener al menos un número.')
    .regex(/[@$!%*?&]/, 'Debe contener un carácter especial (@$!%*?&).')
    .regex(/^[A-Za-z\d@$!%*?&]+$/, 'Contiene caracteres inválidos (solo letras, números y @$!%*?&).'),
  
  role_name: z.enum(ROLE_VALUES),
  status: z.enum(STATUS_VALUES),
  
  first_name: z.string()
    .min(3, 'Si lo ingresas, debe tener al menos 3 letras.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.')
    .or(z.literal('').transform(() => null)) 
    .nullable()
    .optional(),

  last_name: z.string()
    .min(3, 'Si lo ingresas, debe tener al menos 3 letras.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.')
    .or(z.literal('').transform(() => null)) 
    .nullable()
    .optional(),
    
  identifier: z.string()
    .regex(/^\d{10}$/, 'La cédula debe tener exactamente 10 números.')
    .or(z.literal('').transform(() => null)) 
    .nullable()
    .optional(),

  phone_number: z.string()
    .regex(/^09\d{8}$/, 'Debe ser un celular válido (ej: 0999999999).')
    .or(z.literal('').transform(() => null)) 
    .nullable()
    .optional(),
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;