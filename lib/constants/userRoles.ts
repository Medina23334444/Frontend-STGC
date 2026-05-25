// lib/constants/userRoles.ts

export const ROLE_VALUES = [
  'ADMIN',
  'GERENTE_GENERAL',
  'GERENTE_OPERACIONES',
  'CAPATAZ',
  'SEMBRADOR',
  'RECOLECTOR',
  'CLASIFICADOR',
  'TECNICO_DESPULPADO',
  'ENCARGADO_SECADO',
  'TOSTADOR',
  'GESTOR_CALIDAD',
  'TECNICO_ALMACENAMIENTO',
  'CONTROLADOR_DESPACHO',
  'GESTOR_INVENTARIO',
  'PERSONAL_COCINA',
  'CAJERO_MESERO',
] as const;

export const USER_ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GERENTE_GENERAL', label: 'Gerente General' },
  { value: 'GERENTE_OPERACIONES', label: 'Gerente de Operaciones' },
  { value: 'CAPATAZ', label: 'Capataz' },
  { value: 'SEMBRADOR', label: 'Sembrador' },
  { value: 'RECOLECTOR', label: 'Recolector' },
  { value: 'CLASIFICADOR', label: 'Clasificador' },
  { value: 'TECNICO_DESPULPADO', label: 'Técnico de Despulpado' },
  { value: 'ENCARGADO_SECADO', label: 'Encargado de Secado' },
  { value: 'TOSTADOR', label: 'Tostador' },
  { value: 'GESTOR_CALIDAD', label: 'Gestor de Calidad' },
  { value: 'TECNICO_ALMACENAMIENTO', label: 'Técnico de Almacenamiento' },
  { value: 'CONTROLADOR_DESPACHO', label: 'Controlador de Despacho' },
  { value: 'GESTOR_INVENTARIO', label: 'Gestor de Inventario' },
  { value: 'PERSONAL_COCINA', label: 'Personal de Cocina' },
  { value: 'CAJERO_MESERO', label: 'Cajero / Mesero' },
] as const;

export type UserRole = typeof ROLE_VALUES[number];