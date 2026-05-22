import * as z from 'zod';

export const LoteSchema = z.object({
  codigoLote: z
    .string()
    .min(1, 'El código de lote es obligatorio.'),
  pesoKg: z
    .string()
    .min(1, 'El peso en kg es obligatorio.')
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: 'El peso debe ser un número positivo.',
    }),
  tipoCafe: z.enum(['Pergamino', 'Café Oro', 'Cereza', 'Pasilla']),
  estado: z.enum(['Secado', 'Bodega', 'En Proceso', 'Despachado']),
  fechaIngreso: z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, {
    message: 'Ingresa una fecha de ingreso válida.',
  })
});

export type LoteFormData = z.infer<typeof LoteSchema>;
export type LoteCafe = LoteFormData & { id: string };
