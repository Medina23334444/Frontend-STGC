// hooks/useUsersFormatting.ts
import { useMemo } from 'react';
import { User, UserStatus } from '@/types/user';
import {
  getUserStatusBadge,
  getUserStatusDot,
  getUserStatusLabel,
  USER_STATUS_CONFIG,
} from '@/lib/constants/userStatusStyles';
import { USER_ROLES } from '@/lib/constants/userRoles';

interface UseUsersFormattingReturn {
  getStatusBadge: (status: UserStatus) => string;
  getStatusDot: (status: UserStatus) => string;
  getStatusLabel: (status: UserStatus) => string;
  formatUserName: (user: User) => string;
  formatUserEmail: (email: string) => string;
  getRoleLabel: (role: string) => string;
  getAllStatusOptions: Array<{ value: UserStatus; label: string }>; 
}

/**
 * Hook especializado en formateo de datos para UI
 * Responsabilidades:
 * - Obtener estilos según estado
 * - Formatear nombres, emails
 * - Obtener labels de roles
 */
export function useUsersFormatting(): UseUsersFormattingReturn {
  const getStatusBadge = useMemo(() => getUserStatusBadge, []);
  const getStatusDot = useMemo(() => getUserStatusDot, []);
  const getStatusLabel = useMemo(() => getUserStatusLabel, []);

  const formatUserName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.last_name || 'Sin nombre';
  };

  const formatUserEmail = (email: string) => {
    return email.toLowerCase().trim();
  };

  const getRoleLabel = (role: string) => {
    return USER_ROLES.find(r => r.value === role)?.label || role;
  };

  const getAllStatusOptions = useMemo((): Array<{ value: UserStatus; label: string }> => {
    return Object.entries(USER_STATUS_CONFIG).map(([value, config]) => ({
      value: value as UserStatus,
      label: config.label,
    }));
  }, []);

  return {
    getStatusBadge,
    getStatusDot,
    getStatusLabel,
    formatUserName,
    formatUserEmail,
    getRoleLabel,
    getAllStatusOptions,
  };
}