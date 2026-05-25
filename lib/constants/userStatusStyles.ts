// lib/constants/userStatusStyles.ts
import { UserStatus } from '@/types/user';

export const USER_STATUS_CONFIG: Record<UserStatus, {
  badge: string;
  dot: string;
  label: string;
}> = {
  'ACTIVO': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Activo',
  },
  'INACTIVO': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Inactivo',
  },
  'SUSPENDIDO': {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
    label: 'Suspendido',
  },
  'PENDIENTE': {
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Pendiente',
  },
};

export const getUserStatusStyle = (status: UserStatus) => USER_STATUS_CONFIG[status];
export const getUserStatusBadge = (status: UserStatus) => USER_STATUS_CONFIG[status].badge;
export const getUserStatusDot = (status: UserStatus) => USER_STATUS_CONFIG[status].dot;
export const getUserStatusLabel = (status: UserStatus) => USER_STATUS_CONFIG[status].label;