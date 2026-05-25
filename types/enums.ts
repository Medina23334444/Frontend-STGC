// types/enums.ts

export type EstadoProducto = 
  | 'DISPONIBLE' 
  | 'AGOTADO' 
  | 'STOCK_BAJO' 
  | 'INACTIVO' 
  | 'EN_TRANSITO' 
  | 'BLOQUEADO' 
  | 'CADUCADO';

export type TipoElemento = 
  | 'INSUMO' 
  | 'PRODUCTO' 
  | 'CAFE_PROCESADO';

export type UnidadMedida = 
  | 'QUINTALES' 
  | 'ARROBAS' 
  | 'LIBRAS';

export type CalidadCafe = 
  | 'ALTA' 
  | 'MEDIA' 
  | 'BAJA';

export type FaseCafe = 
  | 'PULPA' 
  | 'DESPULPADO' 
  | 'SECADO' 
  | 'TOSTADO' 
  | 'MOLIDO';

export type TipoMovimiento = 
  | 'ENTRADA' 
  | 'SALIDA';