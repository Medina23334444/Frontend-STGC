// types/traceability.ts
import { FaseCafe, UnidadMedida, CalidadCafe } from './enums';

export interface LoteCafe {
  id: string;
  variedad: string;
  fase: FaseCafe;
  cantidad_producida: number;
  costo_produccion: number;
  unidad_medida: UnidadMedida;
  calidad: CalidadCafe;
  codigo_trazabilidad: string;
  lote_anterior_id?: string | null; 
  fecha_creacion: string; 
}

export interface LoteFormData {
  variedad: string;
  fase: FaseCafe;
  cantidad_producida: number;
  costo_produccion: number;
  unidad_medida: UnidadMedida;
  calidad: CalidadCafe;
  lote_anterior_id?: string | null;
}