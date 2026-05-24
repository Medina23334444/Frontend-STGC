// schemas/user.schema.ts
import * as z from 'zod';

export const registerSchema = z.object({
  email: z.email({ error: 'Formato de correo inválido.' }).min(1, 'El correo es obligatorio.'),
  
  // ... resto de tu esquema ...
  password: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula.')
    .regex(/\d/, 'Debe contener al menos un número.')
    .regex(/[@$!%*?&]/, 'Debe contener un carácter especial (@$!%*?&).')
    .regex(/^[A-Za-z\d@$!%*?&]+$/, 'Contiene caracteres inválidos (solo letras, números y @$!%*?&).'),
  
  role_name: z.enum(['ADMIN', 'GERENTE_GENERAL', 'OPERADOR']), 
  status: z.enum(['ACTIVO', 'INACTIVO']),
  
  first_name: z.string()
    .min(3, 'Si lo ingresas, debe tener al menos 3 letras.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.')
    .or(z.literal('')), 

  last_name: z.string()
    .min(3, 'Si lo ingresas, debe tener al menos 3 letras.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.')
    .or(z.literal('')), 

  identifier: z.string()
    .regex(/^\d{10}$/, 'La cédula debe tener exactamente 10 números.')
    .or(z.literal('')), 

  phone_number: z.string()
    .regex(/^09\d{8}$/, 'Debe ser un celular válido (ej: 0999999999).')
    .or(z.literal('')), 
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;