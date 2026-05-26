// components/inventory/InventoryTable.tsx
import { InventarioItem } from '@/types/inventory';
import { ESTADO_STYLES, TIPO_STYLES, ESTADO_LABELS, TIPO_LABELS } from '@/schemas/inventory.schem';

interface InventoryTableProps {
  items: InventarioItem[];
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroTipo: string;
  setFiltroTipo: (val: string) => void;
  onEdit: (item: InventarioItem) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({
  items, busqueda, setBusqueda, filtroTipo, setFiltroTipo, onEdit, onDelete
}: Readonly<InventoryTableProps>) {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 w-full">
          <div className="relative flex-1 sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Buscar SKU o nombre..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition"
            />
          </div>
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition text-slate-600 font-medium cursor-pointer"
          >
            <option value="TODOS">Todos los Tipos</option>
            <option value="INSUMO">Insumos</option>
            <option value="PRODUCTO">Productos</option>
            <option value="CAFE_PROCESADO">Café Procesado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">SKU</th>
                <th className="py-3 px-5">Nombre</th>
                <th className="py-3 px-5">Tipo</th>
                <th className="py-3 px-5">Stock</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors duration-100">
                    <td className="py-2.5 px-5 font-bold text-slate-900">{item.sku}</td>
                    <td className="py-2.5 px-5 font-semibold text-slate-500">{item.nombre}</td>
                    <td className="py-2.5 px-5">
                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${TIPO_STYLES[item.tipo] || ''}`}>
                        {TIPO_LABELS[item.tipo]}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 font-black text-slate-900">
                      {item.cantidad} <span className="text-[10px] text-slate-400 font-normal">{item.unidad_medida.toLowerCase()}</span>
                    </td>
                    <td className="py-2.5 px-5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ESTADO_STYLES[item.estado] || ''}`}>
                        {ESTADO_LABELS[item.estado]}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition" title="Editar">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 transition" title="Eliminar">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No se encontraron ítems en el inventario.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}