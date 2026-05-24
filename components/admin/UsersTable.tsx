// components/users/UsersTable.tsx
import { User, UserStatus} from '@/types/user';
interface UsersTableProps {
  readonly users: User[];
  readonly loading: boolean;
  readonly formatUserName: (user: User) => string;
  readonly getStatusBadge: (status: UserStatus) => string; 
  readonly getStatusDot: (status: UserStatus) => string;   
  readonly getStatusLabel: (status: UserStatus) => string; 
  readonly onEdit: (user: User) => void;
}



export function UsersTable({
  users,
  loading,
  formatUserName,
  getStatusBadge,
  getStatusDot,
  getStatusLabel,
  onEdit,
}: UsersTableProps) {
  
  const renderTableBody = () => {
    if (loading) {
      return <UsersTableLoading />;
    }

    if (users.length === 0) {
      return <UsersTableEmpty />;
    }

    return users.map((u) => (
      <UsersTableRow
        key={u.id}
        user={u}
        formatUserName={formatUserName}
        getStatusBadge={getStatusBadge}
        getStatusDot={getStatusDot}
        getStatusLabel={getStatusLabel}
        onEdit={onEdit}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Usuario / Email</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold text-center">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          {/* Se usa la función auxiliar aquí */}
          <tbody className="divide-y divide-slate-100/80">
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTableLoading() {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto" />
      </td>
    </tr>
  );
}

function UsersTableEmpty() {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
        No hay usuarios registrados.
      </td>
    </tr>
  );
}

interface UsersTableRowProps {
  readonly user: User;
  readonly formatUserName: (user: User) => string;
  readonly getStatusBadge: (status: UserStatus) => string;
  readonly getStatusDot: (status: UserStatus) => string;
  readonly getStatusLabel: (status: UserStatus) => string;
  readonly onEdit: (user: User) => void;
}

function UsersTableRow({
  user,
  formatUserName,
  getStatusBadge,
  getStatusDot,
  getStatusLabel,
  onEdit,
}: UsersTableRowProps) {
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
        <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(user.status)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(user.status)}`} />
          {getStatusLabel(user.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="text-slate-400 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors inline-block"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </td>
    </tr>
  );
}