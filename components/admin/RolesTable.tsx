// components/admin/RolesTable.tsx
import { Role } from '@/types/rol';
import { DataTable } from '@/components/shared/DataTable';
import { useRolesFormatting } from '@/hooks/roles/useRolesFormatting';

interface RolesTableProps {
  readonly roles: Role[];
  readonly loading: boolean;
  readonly onEdit: (role: Role) => void;
}

export function RolesTable({ roles, loading, onEdit }: RolesTableProps) {
  return (
    <DataTable
      headers={['Nombre', 'Descripción', 'Permisos', 'Acciones']}
      loading={loading}
      isEmpty={roles.length === 0}
      emptyMessage="No hay roles registrados."
    >
      {roles.map((role) => (
        <RolesTableRow key={role.id} role={role} onEdit={onEdit} />
      ))}
    </DataTable>
  );
}

interface RolesTableRowProps {
  readonly role: Role;
  readonly onEdit: (role: Role) => void;
}

function RolesTableRow({ role, onEdit }: RolesTableRowProps) {
  const { 
    formatRoleName, 
    formatDescription, 
    getRoleBadgeClasses, 
    getPermissionBadgeClasses 
  } = useRolesFormatting();

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className={getRoleBadgeClasses()}>
          {formatRoleName(role.name)}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-500">{formatDescription(role.description)}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {role.permissions.length === 0 ? (
            <span className="text-xs text-slate-400 italic">Sin permisos</span>
          ) : (
            role.permissions.map((perm) => (
              <span key={perm.id} className={getPermissionBadgeClasses()}>
                {perm.name}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(role)}
          className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </td>
    </tr>
  );
}