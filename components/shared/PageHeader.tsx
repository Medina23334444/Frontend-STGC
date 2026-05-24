interface PageHeaderProps {
  readonly title: string;
  readonly description: string;
  readonly buttonLabel: string;
  readonly onOpenCreate: () => void;
}

export function PageHeader({ title, description, buttonLabel, onOpenCreate }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onOpenCreate}
        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        {buttonLabel}
      </button>
    </div>
  );
}