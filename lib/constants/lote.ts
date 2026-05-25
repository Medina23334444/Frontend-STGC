import { CalidadCafe, FaseCafe, UnidadMedida } from '@/types/enums';

export const FASE_VALUES: [FaseCafe, ...FaseCafe[]] = ['PULPA', 'DESPULPADO', 'SECADO', 'TOSTADO', 'MOLIDO'];
export const UNIDAD_MEDIDA_VALUES: [UnidadMedida, ...UnidadMedida[]] = ['QUINTALES', 'ARROBAS', 'LIBRAS'];
export const CALIDAD_VALUES: [CalidadCafe, ...CalidadCafe[]] = ['ALTA', 'MEDIA', 'BAJA'];
