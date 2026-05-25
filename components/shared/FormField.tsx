// components/shared/FormField.tsx
export function FormField({ label, error, children }: Readonly<{ label: string; error?: string; children: React.ReactNode }>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}