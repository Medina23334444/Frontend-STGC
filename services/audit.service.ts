import { apiFetch } from '@/lib/api';
import { AuditLog } from '@/types/audit';
import { ApiError } from '@/lib/errors/ApiErrors';

export const auditService = {
  async getAudits(): Promise<AuditLog[]> {
    try {
      return await apiFetch('/admin/audits'); 
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Error al obtener los registros de auditoría');
    }
  },
};