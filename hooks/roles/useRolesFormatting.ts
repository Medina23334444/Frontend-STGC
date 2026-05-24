// hooks/roles/useRolesFormatting.ts
import { useCallback } from 'react';

export function useRolesFormatting() {
  
  const formatRoleName = useCallback((name: string) => {
    return name.toUpperCase();
  }, []);

  const formatDescription = useCallback((description?: string | null) => {
    return description && description.trim() !== '' ? description : '—';
  }, []);

  const getRoleBadgeClasses = useCallback(() => {
    return "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200";
  }, []);

  const getPermissionBadgeClasses = useCallback(() => {
    return "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200";
  }, []);

  return {
    formatRoleName,
    formatDescription,
    getRoleBadgeClasses,
    getPermissionBadgeClasses,
  };
}