// components/inventory/InventoryMetrics.tsx
import React from 'react';

interface InventoryMetricsProps {
  total: number;
  variedades: number;
}

export default function InventoryMetrics({ total, variedades }: Readonly<InventoryMetricsProps>) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Producido</p>
          <p className="text-xl font-black text-slate-900">
            {total.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">weight</span>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Variedades Registradas</p>
          <p className="text-xl font-black text-slate-900">{variedades} Tipos</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">coffee_maker</span>
        </div>
      </div>
    </section>
  );
}