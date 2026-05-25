// app/(dashboard)/inventory/page.tsx
'use client';

import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Pagination } from '@/components/shared/Pagination';
import InventoryMetrics from '@/components/inventory/InventoryMetrics';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryModal from '@/components/inventory/InventoryModal';
import { useInventory } from '@/hooks/inventory/useInventory';

export default function InventoryPage() {
  const {
    busqueda, setBusqueda, filtroFase, setFiltroFase,
    isModalOpen, setIsModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    loteAEliminar, loteEditando, defaultValoresModal,
    inventarioFiltrado, metricasTotales,
    currentPage, totalPages, setCurrentPage,
    handleAbrirCrear, handleAbrirEditar, handleEliminarLote,
    confirmarEliminacion, handleGuardarLote, getFaseEstilo,
  } = useInventory();

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <PageHeader
        title="Trazabilidad de Lotes"
        description="Control y seguimiento del café en la Finca Tierra Fértil."
        buttonLabel="Registrar Lote"
        onOpenCreate={handleAbrirCrear}
      />

      <div className="relative z-10 space-y-6">
        <InventoryMetrics 
          total={metricasTotales.total} 
          variedades={metricasTotales.variedades} 
        />

        <InventoryTable 
          lotes={inventarioFiltrado}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroFase={filtroFase}
          setFiltroFase={setFiltroFase}
          getFaseEstilo={getFaseEstilo}
          onEdit={handleAbrirEditar}
          onDelete={handleEliminarLote}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <InventoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lote={loteEditando}
        defaultValues={defaultValoresModal}
        onSubmit={handleGuardarLote}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar Lote"
        description={(
          <p>
            ¿Estás seguro de que deseas eliminar el lote <strong className="text-slate-800">{loteAEliminar?.codigo_trazabilidad || ''}</strong>?
            {' '}Esta acción no se puede deshacer y se borrará del inventario.
          </p>
        )}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        icon="warning"
        variant="danger"
      />
    </div>
  );
}