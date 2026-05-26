// hooks/audit/useAudits.ts
import { useState, useEffect, useCallback } from 'react';
import { auditService } from '@/services/audit.service';
import { AuditLog } from '@/types/audit';
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination';
import { useClientPagination } from '@/hooks/shared/useClientPagination';

export function useAudits() {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAudits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await auditService.getAudits();
      
      const sortedData = data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAudits(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar las auditorías'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const { 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    paginatedItems: paginatedAudits 
  } = useClientPagination({
    items: audits,
    pageSize: ITEMS_PER_PAGE, 
  });

  return {
    audits: paginatedAudits, 
    
    loading,
    error,
    
    currentPage,
    setCurrentPage,
    totalPages,
    
    fetchAudits,
  };
}