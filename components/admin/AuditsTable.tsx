import { AuditLog } from '@/types/audit';
import { DataTable } from '@/components/shared/DataTable';

interface AuditsTableProps {
  readonly audits: AuditLog[];
  readonly loading: boolean;
}

export function AuditsTable({ audits, loading }: AuditsTableProps) {
  return (
    <DataTable
      headers={['Usuario', 'Acción', 'Endpoint', 'IP', 'Fecha']}
      loading={loading}
      isEmpty={audits.length === 0}
      emptyMessage="No hay registros de auditoría."
    >
      {audits.map((audit) => (
        <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors">
          {/* 1. Columna del Usuario */}
          <td className="px-6 py-4 text-sm font-medium text-slate-700">
             {audit.user?.email || audit.user_id.split('-')[0]}
          </td>
          
          {/* 2. Columna de Acción (¡Esta era la que faltaba!) */}
          <td className="px-6 py-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
              {audit.action}
            </span>
          </td>

          {/* 3. Columna del Endpoint */}
          <td className="px-6 py-4 text-sm text-slate-500">
            {audit.endpoint ? (
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                {audit.endpoint}
              </code>
            ) : (
              <span className="text-slate-400 italic">N/A</span>
            )}
          </td>

          {/* 4. Columna de la IP */}
          <td className="px-6 py-4 text-sm text-slate-500">
            {audit.ip_address || <span className="text-slate-400 italic">Desconocida</span>}
          </td>

          {/* 5. Columna de la Fecha */}
          <td className="px-6 py-4 text-sm text-slate-500">
            {new Date(audit.created_at).toLocaleString()}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}