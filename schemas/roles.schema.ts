import { z } from 'zod';
import { PermissionSchema } from './permission.schema';

export const RoleSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'El nombre es obligatorio').max(50),
  description: z.string().nullable().optional().default(null), 
  permissions: z.array(PermissionSchema).default([]),
});

export const RoleArraySchema = z.array(RoleSchema);

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50),
  description: z.string().max(255).nullable().optional().default(null), 
  permission_ids: z.array(z.string()).optional().default([]),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();

export type Role = z.infer<typeof RoleSchema>;
export type RoleCreate = z.infer<typeof CreateRoleSchema>;
export type RoleUpdate = z.infer<typeof UpdateRoleSchema>;

// ✅ Agrega estos dos
export type RoleCreateInput  = z.input<typeof CreateRoleSchema>;
export type RoleCreateOutput = z.output<typeof CreateRoleSchema>;