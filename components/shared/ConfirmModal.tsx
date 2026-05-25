'use client';

import { useState, ReactNode } from 'react';

interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => Promise<void>;
  readonly title: string;
  readonly description: ReactNode; 
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly icon?: string;
  readonly variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon = 'warning',
  variant = 'danger',
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose(); 
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    danger: {
      iconBg: 'bg-red-50 border-red-100 text-red-500',
      btnBg: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      iconBg: 'bg-amber-50 border-amber-100 text-amber-500',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      iconBg: 'bg-sky-50 border-sky-100 text-sky-500',
      btnBg: 'bg-slate-900 hover:bg-slate-800 text-white',
    }
  };

  const currentStyle = styles[variant];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        disabled={isLoading}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm w-full cursor-default"
      />

      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl relative z-10 p-6 space-y-4 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${currentStyle.iconBg}`}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <div className="text-sm text-slate-500 mt-1 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 mt-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition text-sm disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 h-10 px-4 font-semibold rounded-lg shadow-sm transition active:scale-[0.97] text-sm flex items-center justify-center gap-2 disabled:opacity-70 ${currentStyle.btnBg}`}
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}