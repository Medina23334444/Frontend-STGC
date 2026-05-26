// components/inventory/InventoryItemsTable.tsx
'use client';

import { InventarioItem } from '@/types/inventory';
import { TipoElemento } from '@/types/enums';
import { ESTADO_STYLES, ESTADO_LABELS, TIPO_STYLES, TIPO_LABELS, UNIDAD_LABELS, DEFAULT_ESTADO_STYLE, DEFAULT_TIPO_STYLE } from '@/schemas/inventory.schem';

// Iconos SVG ligeros (sin dependencia externa)
const SearchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

interface InventoryItemsTableProps {
  items: InventarioItem[];
  loading: boolean;
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroTipo: TipoElemento | 'TODOS';
  setFiltroTipo: (v: TipoElemento | 'TODOS') => void;
  tieneFiltrosActivos: boolean;
  sinResultados: boolean;
  contadores: { total: number; filtrados: number; mostrados: number };
  onRegistrarMovimiento: (item: InventarioItem) => void;
}

export default function InventoryItemsTable({
  items,
  loading,
  busqueda,
  setBusqueda,
  filtroTipo,
  setFiltroTipo,
  tieneFiltrosActivos,
  sinResultados,
  contadores,
  onRegistrarMovimiento,
}: InventoryItemsTableProps) {
  
  const getEstadoEstilo = (estado: string) => ESTADO_STYLES[estado] ?? DEFAULT_ESTADO_STYLE;
  const getTipoEstilo = (tipo: string) => TIPO_STYLES[tipo] ?? DEFAULT_TIPO_STYLE;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Barra de búsqueda y filtros */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoElemento | 'TODOS')}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="INSUMO">Insumos</option>
            <option value="PRODUCTO">Productos</option>
            <option value="CAFE_PROCESADO">Café Procesado</option>
          </select>

          {tieneFiltrosActivos && (
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {contadores.filtrados} de {contadores.total}
            </span>
          )}
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">SKU / Nombre</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Tipo</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Stock</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Precio U.</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Estado</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshIcon />
                    <span>Cargando inventario...</span>
                  </div>
                </td>
              </tr>
            ) : sinResultados ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="font-medium">No se encontraron resultados</span>
                    <span className="text-xs">Intenta con otros términos de búsqueda</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <span className="font-medium">No hay ítems registrados</span>
                    <span className="text-xs">Comienza añadiendo un nuevo ítem al inventario</span>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{item.nombre}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getTipoEstilo(item.tipo)}`}>
                      {TIPO_LABELS[item.tipo] ?? item.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {item.cantidad.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {UNIDAD_LABELS[item.unidad_medida] ?? item.unidad_medida}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium">
                      ${item.precio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoEstilo(item.estado)}`}>
                      {ESTADO_LABELS[item.estado] ?? item.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRegistrarMovimiento(item)}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <PlusIcon />
                      <span className="ml-1.5">Movimiento</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}