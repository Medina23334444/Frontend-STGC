// schemas/inventory.schem.ts
import { z } from 'zod';
import { TipoElemento, EstadoProducto, UnidadMedida, TipoMovimiento } from '@/types/enums';

export const CreateItemSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.enum(TipoElemento, { error: () => ({ message: 'Tipo no válido' }) }),
  estado: z.enum(EstadoProducto, { error: () => ({ message: 'Estado no válido' }) }),
  unidad_medida: z.enum(UnidadMedida, { error: () => ({ message: 'Unidad no válida' }) }),
  precio: z.number().min(0, 'El precio no puede ser negativo'),
  descripcion: z.string().nullable().optional(),
  fecha_caducidad: z.string().nullable().optional(),
});

export const RegistrarMovimientoSchema = z.object({
  item_id: z.string().min(1, 'El ID del ítem es requerido'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  tipo: z.enum(TipoMovimiento),
  motivo: z.string().min(1, 'El motivo es requerido'),
  lote_id: z.string().nullable().optional(),
});

// --- Estilos para badges (Usando los valores reales del Enum como llaves) ---
export const ESTADO_STYLES: Record<string, string> = {
  [EstadoProducto.DISPONIBLE]: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  [EstadoProducto.AGOTADO]: 'bg-red-50 text-red-700 border-red-200/80',
  [EstadoProducto.STOCK_BAJO]: 'bg-amber-50 text-amber-700 border-amber-200/80',
  [EstadoProducto.INACTIVO]: 'bg-gray-50 text-gray-700 border-gray-200/80',
  [EstadoProducto.EN_TRANSITO]: 'bg-blue-50 text-blue-700 border-blue-200/80',
  [EstadoProducto.BLOQUEADO]: 'bg-purple-50 text-purple-700 border-purple-200/80',
  [EstadoProducto.CADUCADO]: 'bg-rose-50 text-rose-700 border-rose-200/80',
};

export const TIPO_STYLES: Record<string, string> = {
  [TipoElemento.INSUMO]: 'bg-slate-100 text-slate-700',
  [TipoElemento.PRODUCTO]: 'bg-sky-100 text-sky-700',
  [TipoElemento.CAFE_PROCESADO]: 'bg-amber-100 text-amber-800',
};

export const ESTADO_LABELS: Record<string, string> = {
  [EstadoProducto.DISPONIBLE]: 'Disponible',
  [EstadoProducto.AGOTADO]: 'Agotado',
  [EstadoProducto.STOCK_BAJO]: 'Stock Bajo',
  [EstadoProducto.INACTIVO]: 'Inactivo',
  [EstadoProducto.EN_TRANSITO]: 'En Tránsito',
  [EstadoProducto.BLOQUEADO]: 'Bloqueado',
  [EstadoProducto.CADUCADO]: 'Caducado',
};

export const TIPO_LABELS: Record<string, string> = {
  [TipoElemento.INSUMO]: 'Insumo',
  [TipoElemento.PRODUCTO]: 'Producto',
  [TipoElemento.CAFE_PROCESADO]: 'Café Procesado',
};

export const UNIDAD_LABELS: Record<string, string> = {
  [UnidadMedida.QUINTALES]: 'Quintales',
  [UnidadMedida.ARROBAS]: 'Arrobas',
  [UnidadMedida.LIBRAS]: 'Libras',
  [UnidadMedida.LITROS]: 'Litros',
  [UnidadMedida.UNIDADES]: 'Unidades',
  [UnidadMedida.KILOS]: 'Kilos',
};

export const DEFAULT_ESTADO_STYLE = 'bg-gray-50 text-gray-700 border-gray-200/80';
export const DEFAULT_TIPO_STYLE = 'bg-slate-100 text-slate-700';

// Exportando Opciones con los valores exactos del Enum
export const TIPO_OPTIONS = [
  { value: TipoElemento.INSUMO, label: 'Insumo' },
  { value: TipoElemento.PRODUCTO, label: 'Producto' },
  { value: TipoElemento.CAFE_PROCESADO, label: 'Café Procesado' },
];

export const ESTADO_OPTIONS = [
  { value: EstadoProducto.DISPONIBLE, label: 'Disponible' },
  { value: EstadoProducto.STOCK_BAJO, label: 'Stock Bajo' },
  { value: EstadoProducto.AGOTADO, label: 'Agotado' },
  { value: EstadoProducto.INACTIVO, label: 'Inactivo' },
];

export const UNIDAD_OPTIONS = [
  { value: UnidadMedida.QUINTALES, label: 'Quintales' },
  { value: UnidadMedida.ARROBAS, label: 'Arrobas' },
  { value: UnidadMedida.LIBRAS, label: 'Libras' },
  { value: UnidadMedida.LITROS, label: 'Litros' },
  { value: UnidadMedida.UNIDADES, label: 'Unidades' },
  { value: UnidadMedida.KILOS, label: 'Kilos' },
];

export const MOVIMIENTO_OPTIONS = [
  { value: TipoMovimiento.ENTRADA, label: '📥 Entrada (+)' },
  { value: TipoMovimiento.SALIDA, label: '📤 Salida (-)' },
];