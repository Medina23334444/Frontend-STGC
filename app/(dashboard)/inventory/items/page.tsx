// pages/InventoryItemsPage.tsx
'use client';

import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { Pagination } from '@/components/shared/Pagination';
import InventoryItemsTable from '@/components/inventory/InventoryItemsTable';
import InventoryItemModal from '@/components/inventory/InventoryItemModal';
import InventoryMovementModal from '@/components/inventory/InventoryMovementModal';

import { useInventoryData } from '@/hooks/inventory/useInventoryData';
import { useInventoryFilters } from '@/hooks/inventory/useInventoryFilters';
import { useInventoryModals } from '@/hooks/inventory/useInventoryModals';

import { CrearInventarioItemFormData, MovimientoFormData } from '@/types/inventory';
import { toastFlash } from '@/lib/toastFlash';

export default function InventoryItemsPage() {
  // Datos y acciones del servidor
  const { items, isLoading, createItem, registrarMovimiento } = useInventoryData();
  
  // Filtrado y paginación en cliente
  const filters = useInventoryFilters({ items });
  
  // Estado de modales
  const modals = useInventoryModals();

  // --- Handlers ---

  const handleCreateItem = async (data: CrearInventarioItemFormData) => {
    await createItem(data);
    toastFlash('Ítem creado exitosamente', 'success');
  };

  const handleCreateMovement = async (data: MovimientoFormData) => {
    await registrarMovimiento(data);
    toastFlash('Movimiento registrado. Stock actualizado.', 'success');
  };

  // --- Render ---

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <PageHeader
        title="Inventario Físico"
        description="Gestión de insumos y productos terminados en bodega."
        buttonLabel="Añadir Ítem"
        onOpenCreate={modals.abrirCrearItem}
      />

      <div className="relative z-10 space-y-6">
        <InventoryItemsTable 
          items={filters.itemsFiltrados}
          loading={isLoading}
          busqueda={filters.busqueda}
          setBusqueda={filters.setBusqueda}
          filtroTipo={filters.filtroTipo}
          setFiltroTipo={filters.setFiltroTipo}
          tieneFiltrosActivos={filters.tieneFiltrosActivos}
          sinResultados={filters.sinResultados}
          contadores={filters.contadores}
          onRegistrarMovimiento={modals.abrirMovimiento}
        />

        {filters.totalPages > 1 && (
          <Pagination
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
          />
        )}
      </div>

      {/* Modal: Crear Ítem */}
      <InventoryItemModal
        isOpen={modals.isItemModalOpen}
        onClose={modals.cerrarItemModal}
        onSubmit={handleCreateItem}
      />

      {/* Modal: Registrar Movimiento */}
      <InventoryMovementModal
        isOpen={modals.isMovementModalOpen}
        item={modals.selectedItem}
        onClose={modals.cerrarMovimiento}
        onSubmit={handleCreateMovement}
      />
    </div>
  );
}