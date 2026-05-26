// types/enums.ts

export enum TipoElemento {
  INSUMO = 'INSUMO',
  PRODUCTO = 'PRODUCTO',
  CAFE_PROCESADO = 'CAFE_PROCESADO',
}

export enum EstadoProducto {
  DISPONIBLE = 'DISPONIBLE',
  AGOTADO = 'AGOTADO',
  STOCK_BAJO = 'STOCK_BAJO',
  INACTIVO = 'INACTIVO',
  EN_TRANSITO = 'EN_TRANSITO',
  BLOQUEADO = 'BLOQUEADO',
  CADUCADO = 'CADUCADO',
}

export enum UnidadMedida {
  QUINTALES = 'QUINTALES',
  ARROBAS = 'ARROBAS',
  LIBRAS = 'LIBRAS',
  LITROS = 'LITROS',
  UNIDADES = 'UNIDADES',
  KILOS = 'KILOS',
}

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}