// components/admin/UsersTable.tsx
import { User, UserStatus } from '@/types/user';
import { DataTable } from '@/components/shared/DataTable';
import { USER_STATUSES } from '@/lib/constants/userStatuses';

interface UsersTableProps {
  readonly users: User[];
  readonly loading: boolean;
  readonly formatUserName: (user: User) => string;
  readonly getStatusBadge: (status: UserStatus) => string;
  readonly onEdit: (user: User) => void;
  readonly onChangeStatusClick: (user: User, newStatus: UserStatus) => void;
}

export function UsersTable({
  users,
  loading,
  formatUserName,
  getStatusBadge,
  onEdit,
  onChangeStatusClick,
}: UsersTableProps) {
  return (
    <DataTable
      headers={['Usuario / Email', 'Rol', 'Estado', 'Acciones']}
      loading={loading}
      isEmpty={users.length === 0}
      emptyMessage="No hay usuarios registrados."
    >
      {users.map((user) => (
        <UsersTableRow
          key={user.id}
          user={user}
          formatUserName={formatUserName}
          getStatusBadge={getStatusBadge}
          onEdit={onEdit}
          onChangeStatusClick={onChangeStatusClick} 
        />
      ))}
    </DataTable>
  );
}

interface UsersTableRowProps {
  readonly user: User;
  readonly formatUserName: (user: User) => string;
  readonly getStatusBadge: (status: UserStatus) => string;
  readonly onEdit: (user: User) => void;
  readonly onChangeStatusClick: (user: User, newStatus: UserStatus) => void;
}

function UsersTableRow({
  user,
  formatUserName,
  getStatusBadge,
  onEdit,
  onChangeStatusClick,
}: UsersTableRowProps) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as UserStatus;
    if (newStatus !== user.status) {
      onChangeStatusClick(user, newStatus);
      e.target.value = user.status; 
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase border border-slate-200">
            {user.email.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-700">{formatUserName(user)}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
          {user.role?.name ?? 'DESCONOCIDO'}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <select
          value={user.status}
          onChange={handleSelectChange}
          className={`cursor-pointer outline-none inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${getStatusBadge(user.status)}`}
          style={{ textAlignLast: 'center' }}
        >
          {USER_STATUSES.map((status) => (
            <option 
              key={status.value} 
              value={status.value} 
              className="bg-white text-slate-700 font-medium"
            >
              {status.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
          title="Editar Usuario"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </td>
    </tr>
  );
}