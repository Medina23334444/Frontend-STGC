// components/shared/FormField.tsx
interface FormFieldProps {
  readonly label: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly children: React.ReactNode;
}

export function FormField({ label, error, helperText, children }: Readonly<FormFieldProps>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {children}
      {helperText && <span className="text-xs text-slate-400 mt-1 block">{helperText}</span>}
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}