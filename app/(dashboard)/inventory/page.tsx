// app/(dashboard)/inventory/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { PageBackground } from '@/components/shared/PageBackground';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Pagination } from '@/components/shared/Pagination';
import InventoryMetrics from '@/components/inventory/InventoryMetrics';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryModal from '@/components/inventory/InventoryModal';
import { useInventoryData } from '@/hooks/inventory/useInventoryData';
import { InventarioItem } from '@/types/inventory';

export default function InventoryPage() {
  const { items, isLoading } = useInventoryData();

  // Estados locales para UI
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<InventarioItem | null>(null);
  const [itemAEliminar, setItemAEliminar] = useState<InventarioItem | null>(null);

  // Filtros aplicados al array de items
  const inventarioFiltrado = useMemo(() => {
    return items.filter((item) => {
      const matchBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            item.sku.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      return matchBusqueda && matchTipo;
    });
  }, [items, busqueda, filtroTipo]);

  // Paginación
  const totalPages = Math.ceil(inventarioFiltrado.length / itemsPerPage);
  const itemsPaginados = inventarioFiltrado.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAbrirCrear = () => {
    setItemEditando(null);
    setIsModalOpen(true);
  };

  const handleAbrirEditar = (item: InventarioItem) => {
    setItemEditando(item);
    setIsModalOpen(true);
  };

  const handleAbrirEliminar = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setItemAEliminar(item);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmarEliminacion = async () => {
    if (!itemAEliminar) return;
    // Aquí invocarías la función de eliminar de tu service / hook
    // await deleteItem(itemAEliminar.id);
    setIsDeleteModalOpen(false);
    setItemAEliminar(null);
  };

  const handleGuardarItem = async (data: any) => {
    // La lógica de guardado recae ahora en el modal que consume `useInventoryData` 
    // o puedes pasarle createItem / updateItem por props.
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-6 relative z-10 flex-1">
      <PageBackground />

      <PageHeader
        title="Gestión de Inventario"
        description="Control de stock de insumos, productos y café procesado de Tierra Fértil."
        buttonLabel="Registrar Ítem"
        onOpenCreate={handleAbrirCrear}
      />

      <div className="relative z-10 space-y-6">
        {/* Asumiendo que adaptaste InventoryMetrics para recibir datos generales del inventario */}
        <InventoryMetrics 
          total={items.length} 
          variedades={[]} // Adapta esto a tus métricas reales de inventario
        />

        {isLoading ? (
          <div className="text-center text-slate-500 py-10">Cargando inventario...</div>
        ) : (
          <InventoryTable 
            items={itemsPaginados}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            onEdit={handleAbrirEditar}
            onDelete={handleAbrirEliminar}
          />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {isModalOpen && (
        <InventoryModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={itemEditando}
          onSubmit={handleGuardarItem}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar Ítem"
        description={(
          <p>
            ¿Estás seguro de que deseas eliminar el ítem <strong className="text-slate-800">{itemAEliminar?.sku || ''}</strong>?
            {' '}Esta acción no se puede deshacer.
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