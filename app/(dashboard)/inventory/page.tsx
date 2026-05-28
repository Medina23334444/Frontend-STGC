// app/(dashboard)/inventory/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { Pagination } from '@/components/shared/Pagination';
import InventoryItemsTable from '@/components/inventory/InventoryItemsTable';
import InventoryItemModal from '@/components/inventory/InventoryItemModal';
import InventoryMovementModal from '@/components/inventory/InventoryMovementModal';
import { useInventoryData } from '@/hooks/inventory/useInventoryData';
import { InventarioItem } from '@/types/inventory';
import { TipoElemento } from '@/types/enums';

export default function InventoryPage() {
  const { items, isLoading, createItem, registrarMovimiento } = useInventoryData();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoElemento | 'TODOS'>('TODOS');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<InventarioItem | null>(null);

  const inventarioFiltrado = useMemo(() => {
    return items.filter((item) => {
      const matchBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            item.sku.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      return matchBusqueda && matchTipo;
    });
  }, [items, busqueda, filtroTipo]);

  const totalPages = Math.ceil(inventarioFiltrado.length / itemsPerPage);
  const itemsPaginados = inventarioFiltrado.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <PageHeader
        title="Gestión de Inventario"
        description="Control de stock de insumos, productos y café procesado."
        buttonLabel="Registrar Ítem"
        onOpenCreate={() => setIsItemModalOpen(true)}
      />

      <div className="relative z-10 space-y-6">
        
        <InventoryItemsTable 
          items={itemsPaginados}
          loading={isLoading}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
          tieneFiltrosActivos={busqueda !== '' || filtroTipo !== 'TODOS'}
          sinResultados={inventarioFiltrado.length === 0 && (busqueda !== '' || filtroTipo !== 'TODOS')}
          contadores={{ 
            total: items.length, 
            filtrados: inventarioFiltrado.length, 
            mostrados: itemsPaginados.length 
          }}
          onRegistrarMovimiento={(item) => {
            setItemSeleccionado(item);
            setIsMovementModalOpen(true);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <InventoryItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={createItem}
      />

      <InventoryMovementModal
        isOpen={isMovementModalOpen}
        item={itemSeleccionado}
        onClose={() => {
          setIsMovementModalOpen(false);
          setItemSeleccionado(null);
        }}
        onSubmit={registrarMovimiento}
      />
    </div>
  );
}