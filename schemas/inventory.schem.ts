// schemas/inventory.schema.ts
import { z } from 'zod';

export const CreateItemSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.enum(['INSUMO', 'PRODUCTO', 'CAFE_PROCESADO']),
  estado: z.enum(['DISPONIBLE', 'AGOTADO', 'STOCK_BAJO', 'INACTIVO', 'EN_TRANSITO', 'BLOQUEADO', 'CADUCADO']),
  unidad_medida: z.enum(['QUINTALES', 'ARROBAS', 'LIBRAS', 'LITROS', 'UNIDADES', 'KILOS']),
  precio: z.number().min(0, 'El precio no puede ser negativo'),
  descripcion: z.string().nullable().optional(),
  fecha_caducidad: z.string().nullable().optional(),
});

export const RegistrarMovimientoSchema = z.object({
  item_id: z.string().min(1, 'El ID del ítem es requerido'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  tipo: z.enum(['ENTRADA', 'SALIDA']),
  motivo: z.string().min(1, 'El motivo es requerido'),
  lote_id: z.string().nullable().optional(),
});

// --- Estilos para badges ---

export const ESTADO_STYLES: Record<string, string> = {
  DISPONIBLE: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  AGOTADO: 'bg-red-50 text-red-700 border-red-200/80',
  STOCK_BAJO: 'bg-amber-50 text-amber-700 border-amber-200/80',
  INACTIVO: 'bg-gray-50 text-gray-700 border-gray-200/80',
  EN_TRANSITO: 'bg-blue-50 text-blue-700 border-blue-200/80',
  BLOQUEADO: 'bg-purple-50 text-purple-700 border-purple-200/80',
  CADUCADO: 'bg-rose-50 text-rose-700 border-rose-200/80',
} as const;

export const TIPO_STYLES: Record<string, string> = {
  INSUMO: 'bg-slate-100 text-slate-700',
  PRODUCTO: 'bg-sky-100 text-sky-700',
  CAFE_PROCESADO: 'bg-amber-100 text-amber-800',
} as const;

export const DEFAULT_ESTADO_STYLE = 'bg-gray-50 text-gray-700 border-gray-200/80';
export const DEFAULT_TIPO_STYLE = 'bg-slate-100 text-slate-700';


export const ESTADO_LABELS: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  AGOTADO: 'Agotado',
  STOCK_BAJO: 'Stock Bajo',
  INACTIVO: 'Inactivo',
  EN_TRANSITO: 'En Tránsito',
  BLOQUEADO: 'Bloqueado',
  CADUCADO: 'Caducado',
} as const;

export const TIPO_LABELS: Record<string, string> = {
  INSUMO: 'Insumo',
  PRODUCTO: 'Producto',
  CAFE_PROCESADO: 'Café Procesado',
} as const;

export const UNIDAD_LABELS: Record<string, string> = {
  QUINTALES: 'Quintales',
  ARROBAS: 'Arrobas',
  LIBRAS: 'Libras',
  LITROS: 'Litros',
  UNIDADES: 'Unidades',
  KILOS: 'Kilos',
} as const;


export const TIPO_OPTIONS = [
  { value: 'INSUMO', label: 'Insumo' },
  { value: 'PRODUCTO', label: 'Producto' },
  { value: 'CAFE_PROCESADO', label: 'Café Procesado' },
] as const;

export const ESTADO_OPTIONS = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'STOCK_BAJO', label: 'Stock Bajo' },
  { value: 'AGOTADO', label: 'Agotado' },
  { value: 'INACTIVO', label: 'Inactivo' },
] as const;

export const UNIDAD_OPTIONS = [
  { value: 'QUINTALES', label: 'Quintales' },
  { value: 'ARROBAS', label: 'Arrobas' },
  { value: 'LIBRAS', label: 'Libras' },
  { value: 'LITROS', label: 'Litros' },
  { value: 'UNIDADES', label: 'Unidades' },
  { value: 'KILOS', label: 'Kilos' },
] as const;

export const MOVIMIENTO_OPTIONS = [
  { value: 'ENTRADA', label: '📥 Entrada (+)' },
  { value: 'SALIDA', label: '📤 Salida (-)' },
] as const;