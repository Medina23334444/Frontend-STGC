// components/DeleteConfirmModal.tsx
'use client';
import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  codigoLote: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, codigoLote }: DeleteConfirmModalProps) {
    if (!isOpen) return null; // Si no está abierto, no renderiza nada en el DOM    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Telón oscuro desenfocado */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></div>

      {/* Caja de Confirmación */}
      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl relative z-10 p-6 space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Encabezado y Mensaje */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-2xl">
              warning
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Eliminar Lote</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              ¿Estás seguro de que deseas eliminar el lote <strong className="text-slate-800">{codigoLote}</strong>? Esta acción no se puede deshacer y se borrará del inventario.
            </p>
          </div>
        </div>

        {/* Botonera inferior */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg transition text-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition active:scale-[0.97] text-xs cursor-pointer"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
    )
}