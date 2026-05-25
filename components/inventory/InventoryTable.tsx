// components/inventory/InventoryTable.tsx
import { LoteCafe } from '@/types/traceability';
import { FaseCafe } from '@/types/enums';

interface InventoryTableProps {
  lotes: LoteCafe[];
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroFase: FaseCafe | 'TODAS';
  setFiltroFase: (val: FaseCafe | 'TODAS') => void;
  getFaseEstilo: (fase: FaseCafe) => string;
  onEdit: (lote: LoteCafe) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({
  lotes, busqueda, setBusqueda, filtroFase, setFiltroFase, getFaseEstilo, onEdit, onDelete
}: Readonly<InventoryTableProps>) {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 w-full">
          <div className="relative flex-1 sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Buscar código o variedad..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition"
            />
          </div>
          <select 
            value={filtroFase}
            onChange={(e) => setFiltroFase(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition text-slate-600 font-medium cursor-pointer"
          >
            <option value="TODAS">Todas las Fases</option>
            <option value="PULPA">Pulpa</option>
            <option value="DESPULPADO">Despulpado</option>
            <option value="SECADO">Secado</option>
            <option value="TOSTADO">Tostado</option>
            <option value="MOLIDO">Molido</option>
          </select>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Trazabilidad</th>
                <th className="py-3 px-5">Variedad</th>
                <th className="py-3 px-5">Cantidad</th>
                <th className="py-3 px-5">Fase</th>
                <th className="py-3 px-5">Calidad</th>
                <th className="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {lotes.length > 0 ? (
                lotes.map((lote) => (
                  <tr key={lote.id} className="hover:bg-slate-50/40 transition-colors duration-100 border-b border-slate-100">
                    <td className="py-2.5 px-5 font-bold text-slate-900 tracking-tight">
                      {lote.codigo_trazabilidad ? lote.codigo_trazabilidad.split('-')[0] : 'N/A'}
                    </td>
                    <td className="py-2.5 px-5 font-semibold text-slate-500">{lote.variedad}</td>
                    <td className="py-2.5 px-5 font-black text-slate-900">
                      {lote.cantidad_producida} <span className="text-[10px] text-slate-400 font-normal">{lote.unidad_medida.toLowerCase()}</span>
                    </td>
                    <td className="py-2.5 px-5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getFaseEstilo(lote.fase)}`}>
                        {lote.fase}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-slate-500 font-medium">{lote.calidad}</td>
                    <td className="py-2.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(lote)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition" title="Editar lote">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => onDelete(lote.id)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 transition" title="Eliminar lote">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No se encontraron lotes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}