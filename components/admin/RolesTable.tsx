// components/admin/RolesTable.tsx
import { memo } from 'react';
import { Role } from '@/types/rol';
import { DataTable } from '@/components/shared/DataTable';
import { useRolesFormatting } from '@/hooks/roles/useRolesFormatting';

interface RolesTableProps {
  readonly roles: Role[];
  readonly loading: boolean;
  readonly onEdit: (role: Role) => void;
  readonly onDelete: (role: Role) => void; 
}

export function RolesTable({ roles, loading, onEdit, onDelete }: RolesTableProps) {
  return (
    <DataTable
      headers={['Nombre', 'Descripción', 'Acciones']}
      loading={loading}
      isEmpty={roles.length === 0}
      emptyMessage="No hay roles registrados."
    >
      {roles.map((role) => (
        <MemoizedRolesTableRow key={role.id} role={role} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </DataTable>
  );
}

interface RolesTableRowProps {
  readonly role: Role;
  readonly onEdit: (role: Role) => void;
  readonly onDelete: (role: Role) => void; 
}

function RolesTableRow({ role, onEdit, onDelete }: RolesTableRowProps) {
  const { 
    formatRoleName, 
    formatDescription, 
    getRoleBadgeClasses 
  } = useRolesFormatting();

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      {/* ... columnas anteriores iguales ... */}
      <td className="px-6 py-4">
        <div className={getRoleBadgeClasses()}>{formatRoleName(role.name)}</div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-500">{formatDescription(role.description)}</p>
      </td>

      {/* Botones de acción */}
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(role)}
            title="Editar Rol"
            className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(role)}
            title="Eliminar Rol"
            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors inline-block"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

const MemoizedRolesTableRow = memo(RolesTableRow);