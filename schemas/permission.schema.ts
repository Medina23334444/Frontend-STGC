// schemas/permission.schema.ts
import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const PermissionArraySchema = z.array(PermissionSchema);

// Exportación del tipo
export type Permission = z.infer<typeof PermissionSchema>;