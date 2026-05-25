import { z } from 'zod';
import { CALIDAD_VALUES, FASE_VALUES, UNIDAD_MEDIDA_VALUES } from '@/lib/constants/lote';

const VARIEDAD_SCHEMA = z
  .string()
  .trim()
  .min(4, 'La variedad debe tener al menos 4 caracteres')
  .max(80, 'La variedad no puede superar los 80 caracteres');

const NUMERIC_SCHEMA = z
  .number()
  .refine(Number.isFinite, 'Debe ser un número válido')
  .positive('Debe ser mayor que 0');

const UUID_SCHEMA = z.string().check(z.uuid());

const LOTE_BASE_SCHEMA = {
  variedad: VARIEDAD_SCHEMA,
  fase: z.enum(FASE_VALUES),
  cantidad_producida: NUMERIC_SCHEMA,
  costo_produccion: NUMERIC_SCHEMA,
  unidad_medida: z.enum(UNIDAD_MEDIDA_VALUES),
  calidad: z.enum(CALIDAD_VALUES),
  lote_anterior_id: UUID_SCHEMA.nullable().optional(),
} as const;

export const LoteSchema = z.object({
  id: UUID_SCHEMA,
  ...LOTE_BASE_SCHEMA,
  codigo_trazabilidad: z
    .string()
    .trim()
    .min(1, 'El código de trazabilidad es obligatorio'),
  fecha_creacion: z.string().min(1, 'La fecha de creación es obligatoria'),
});

export const LoteArraySchema = z.array(LoteSchema);

export const CreateLoteSchema = z.object({
  ...LOTE_BASE_SCHEMA,
});

export const UpdateLoteSchema = z.object({
  ...LOTE_BASE_SCHEMA,
}).partial();

export type LoteInput = z.input<typeof CreateLoteSchema>;
export type LoteCreateInput = z.input<typeof CreateLoteSchema>;
export type LoteCreateOutput = z.output<typeof CreateLoteSchema>;
export type LoteOutput = z.infer<typeof LoteSchema>;
