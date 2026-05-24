import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

const ROLE_NAME_REGEX = /^[A-Z0-9_]+$/;

export const RoleSchema = z.object({
  id: z.string().check(z.uuid()),
  name: z
    .string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(ROLE_NAME_REGEX, 'El nombre solo puede contener letras mayúsculas, números y guión bajo'),
  description: z.string().nullable().optional().default(null), 
  permissions: z.array(PermissionSchema).default([]),
});

export const RoleArraySchema = z.array(RoleSchema);

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(ROLE_NAME_REGEX, 'El nombre solo puede contener letras mayúsculas, números y guión bajo')
    .transform((val) => val.trim().toUpperCase()),
  description: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === '' || val.length >= 10,
      'La descripción debe tener al menos 10 caracteres'
    )
    .nullable()
    .optional()
    .default(null)
    .transform((val) => val || null),
  permission_ids: z
    .array(z.string().check(z.uuid('ID de permiso inválido'))) 
    .optional()
    .default([]),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();

export type RoleCreateInput = z.input<typeof CreateRoleSchema>;
export type RoleCreateOutput = z.output<typeof CreateRoleSchema>;