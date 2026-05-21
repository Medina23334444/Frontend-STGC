// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'ACTIVO': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'INACTIVO': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getStatusDot = (status: string) => {
    const styles: Record<string, string> = {
      'ACTIVO': 'bg-emerald-500',
      'INACTIVO': 'bg-rose-500',
    };
    return styles[status] || 'bg-slate-500';
  };

  return {
    users,
    loading,
    isModalOpen,
    setIsModalOpen,
    fetchUsers,
    getStatusBadge,
    getStatusDot,
  };
}