// types/inventory.ts
import { EstadoProducto, TipoElemento, UnidadMedida, TipoMovimiento } from './enums';

export interface InventarioItem {
  id: string;
  sku: string;
  nombre: string;
  cantidad: number;
  tipo: TipoElemento;
  estado: EstadoProducto;
  unidad_medida: UnidadMedida;
  precio: number;
  descripcion?: string | null;
  fecha_caducidad?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MovimientoStock {
  id: string;
  item_id: string;
  cantidad: number;
  tipo: TipoMovimiento;
  fecha: string;
  motivo: string;
  lote_id?: string | null;
}

export interface MovimientoFormData {
  item_id: string;
  cantidad: number;
  tipo: TipoMovimiento;
  motivo: string;
  lote_id?: string | null;
}