// components/admin/DeleteRoleConfirmModal.tsx
'use client';
import React, { useState } from 'react';

interface DeleteRoleConfirmModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => Promise<void>;
  readonly roleName: string;
}

export default function DeleteRoleConfirmModal({ isOpen, onClose, onConfirm, roleName }: DeleteRoleConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose(); 
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el rol. Es posible que tenga usuarios asociados.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm w-full cursor-default"
      />

      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl relative z-10 p-6 space-y-4 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Eliminar Rol</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              ¿Estás seguro de que deseas eliminar el rol <strong className="text-slate-800">{roleName}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {/* Mensaje de error de la API */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 mt-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition text-xs disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition active:scale-[0.97] text-xs flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}