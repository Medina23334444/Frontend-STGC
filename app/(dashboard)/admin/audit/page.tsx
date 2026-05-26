'use client';

import { PageHeader } from '@/components/shared/PageHeader'; 
import { PageBackground } from '@/components/shared/PageBackground';
import { Pagination } from '@/components/shared/Pagination';
import { AuditsTable } from '@/components/admin/AuditsTable';
import { useAudits } from '@/hooks/audit/useAudits';

export default function AdminAuditsPage() {
  const {
    audits,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useAudits();

  if (error) return <div className="p-6 text-red-500">Error cargando auditorías: {error.message}</div>;

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <div className="relative z-10 space-y-6">
        <PageHeader 
          title="Logs de Auditoría"
          description="Monitorea las acciones realizadas por los usuarios en el sistema"
          // No necesitamos botón de crear porque los logs se generan automáticamente
        />

        <AuditsTable audits={audits} loading={loading} />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}