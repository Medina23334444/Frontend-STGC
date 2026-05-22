// schemas/role.schema.ts
import { z } from 'zod';
import { PermissionSchema } from './permission.schema'; 

export const RoleSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'El nombre es obligatorio').max(50),
  description: z.string().nullable().optional(),
  permissions: z.array(PermissionSchema).default([]), 
  isActive: z.boolean().default(true).optional(),
  createdAt: z.coerce.date().optional(), 
  updatedAt: z.coerce.date().optional(),
});

export const RoleArraySchema = z.array(RoleSchema);

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50),
  description: z.string().max(255).optional(),
  permission_ids: z.array(z.string()).optional(), 
});

export const UpdateRoleSchema = CreateRoleSchema.partial();
export type Role = z.infer<typeof RoleSchema>;
export type RoleCreate = z.infer<typeof CreateRoleSchema>;
export type RoleUpdate = z.infer<typeof UpdateRoleSchema>;