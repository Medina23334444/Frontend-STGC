// lib/constants/userRoles.ts
export const USER_ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GERENTE_GENERAL', label: 'Gerente' },
  { value: 'OPERADOR', label: 'Operador' },
] as const;

export type UserRole = typeof USER_ROLES[number]['value'];