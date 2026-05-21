// app/(dashboard)/inventory/page.tsx
'use client';

import InventoryModal from '@/components/inventory/InventoryModal'; // Importamos el formulario modular
import DeleteConfirmModal from '@/components/inventory/DeleteConfirmModal'; // Modal de confirmación para eliminar
import { useInventory } from '@/hooks/useInventory';

export default function InventoryPage() {
  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    loteAEliminar,
    loteEditando,
    defaultValoresModal,
    inventarioFiltrado,
    metricasTotales,
    handleAbrirCrear,
    handleAbrirEditar,
    handleEliminarLote,
    confirmarEliminacion,
    handleGuardarLote,
    getEstadoEstilo,
  } = useInventory();


  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] rounded-full bg-sky-200/10 blur-[130px]"></div>
      </div>

      <div className="relative z-10 space-y-6">
        <header className="border-b border-slate-200/60 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Inventario</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Control de existencias y cargamentos de café en la Finca Tierra Fértil.</p>
        </header>

        {/* Rejilla de Resumen Rápido */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total en Stock</p>
              <p className="text-xl font-black text-slate-900">{metricasTotales.total.toLocaleString()} kg</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">weight</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Variedades Básicas</p>
              <p className="text-xl font-black text-slate-900">{metricasTotales.tipos} Tipos</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">coffee_maker</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-sky-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lotes Activos</p>
              <p className="text-xl font-black text-slate-900">{String(metricasTotales.activos).padStart(2, '0')} Unidades</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">layers</span>
            </div>
          </div>
        </section>

        {/* Barra de Utilidades */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Buscar lote o tipo..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition"
              />
            </div>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-400 transition text-slate-600 font-medium cursor-pointer"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="Bodega">En Bodega</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Secado">En Secado</option>
              <option value="Despachado">Despachados</option>
            </select>
          </div>

          <button 
            onClick={handleAbrirCrear}
            className="h-9 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition duration-150 active:scale-[0.98] cursor-pointer text-xs w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Registrar Movimiento</span>
          </button>
        </div>

        {/* Tabla Optimizada */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Código de Lote</th>
                  <th className="py-3 px-5">Tipo de Café</th>
                  <th className="py-3 px-5">Cantidad</th>
                  <th className="py-3 px-5">Fecha Ingreso</th>
                  <th className="py-3 px-5">Estado</th>
                  <th className="py-3 px-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {inventarioFiltrado.length > 0 ? (
                  inventarioFiltrado.map((lote) => (
                    <tr key={lote.id} className="hover:bg-slate-50/40 transition-colors duration-100 border-b border-slate-100">
                      <td className="py-2.5 px-5 font-bold text-slate-900 tracking-tight">{lote.codigoLote}</td>
                      <td className="py-2.5 px-5 font-semibold text-slate-500">{lote.tipoCafe}</td>
                      <td className="py-2.5 px-5 font-black text-slate-900">{lote.pesoKg.toLocaleString()} kg</td>
                      <td className="py-2.5 px-5 text-slate-500 font-medium">{lote.fechaIngreso}</td>
                      <td className="py-2.5 px-5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getEstadoEstilo(lote.estado)}`}>
                          {lote.estado}
                        </span>
                      </td>
                      <td className="py-2.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleAbrirEditar(lote)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition" title="Editar lote de café">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={() => handleEliminarLote(lote.id, lote.codigoLote)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 transition" title="Eliminar registro críticamente">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">No se encontraron lotes con los filtros seleccionados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 🚀 EL INYECTOR MODULAR: Mandamos los estados como Props */}
      <InventoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lote={loteEditando}
        defaultValues={defaultValoresModal}
        onSubmit={handleGuardarLote}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmarEliminacion}
        codigoLote={loteAEliminar?.codigoLote || ''}
      />
    </div>
  );
}