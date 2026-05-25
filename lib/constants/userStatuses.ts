// lib/constants/userStatuses.ts

export const STATUS_VALUES = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE'] as const;

export const USER_STATUSES = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
  { value: 'PENDIENTE', label: 'Pendiente' },
] as const;

export type UserStatusOption = typeof USER_STATUSES[number]['value'];