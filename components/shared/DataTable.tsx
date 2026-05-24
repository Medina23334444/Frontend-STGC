interface DataTableProps {
  readonly headers: string[];
  readonly loading: boolean;
  readonly isEmpty: boolean;
  readonly emptyMessage: string;
  readonly children: React.ReactNode;
}

function renderBody(
  loading: boolean,
  isEmpty: boolean,
  colSpan: number,
  emptyMessage: string,
  children: React.ReactNode
) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-6 py-12 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto" />
        </td>
      </tr>
    );
  }

  if (isEmpty) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-6 py-12 text-center text-slate-500">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return children;
}

export function DataTable({ headers, loading, isEmpty, emptyMessage, children }: DataTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              {headers.map((h) => (
                <th key={h} className="px-6 py-4 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {renderBody(loading, isEmpty, headers.length, emptyMessage, children)}
          </tbody>
        </table>
      </div>
    </div>
  );
}