'use client';

import { ReactNode, useEffect, useState } from 'react';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalShellProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children?: ReactNode;
  readonly primaryAction?: {
    label: string;
    onClick: () => Promise<void> | void;
  };
  readonly secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  readonly renderFooter?: () => ReactNode;
  readonly showFooter?: boolean;
  readonly closeOnBackdrop?: boolean;
  readonly size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function ModalShell({
  isOpen,
  onClose,
  title = 'Modal',
  children,
  primaryAction,
  secondaryAction,
  renderFooter,
  showFooter = false,
  closeOnBackdrop = true,
  size = 'md',
}: ModalShellProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrimaryAction = async () => {
    if (!primaryAction) return;

    setIsLoading(true);
    setError(null);

    try {
      await primaryAction.onClick();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al procesar la solicitud.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  let footer: ReactNode = null;

  if (renderFooter) {
    footer = renderFooter();
  } else if (showFooter) {
    footer = (
      <div className="flex justify-end gap-3 border-t border-slate-100 p-4">
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            {secondaryAction.label}
          </button>
        )}

        {primaryAction && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-70"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {isLoading ? 'Procesando...' : primaryAction.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6">
      {closeOnBackdrop && (
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute inset-0 h-full w-full bg-black/60"
        />
      )}

      <dialog
        aria-modal="true"
        aria-labelledby="modal-shell-title"
        open
        className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ${sizeClasses[size]}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
          <h2 id="modal-shell-title" className="text-lg font-bold text-slate-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {children}
        </div>

        {error && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {footer}
      </dialog>
    </div>
  );
}