// hooks/inventory/useInventoryItems.ts
import { useState, useMemo, useEffect } from 'react';
import { useInventoryItemsData } from './useInventoryItemsData';
import { useInventoryItemsModals } from './useInventoryItemsModals';
import { useClientPagination } from '@/hooks/shared/useClientPagination';
import { CrearInventarioItemFormData, MovimientoFormData } from '@/types/inventory';
import { TipoElemento } from '@/types/enums';

export const useInventoryItems = () => {
  const { items, loading, createItem, registrarMovimiento } = useInventoryItemsData();
  const modals = useInventoryItemsModals();

  // Estados locales para filtros y búsquedas
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoElemento | 'TODOS'>('TODOS');

  // Submiters (Conectan los modales con React Query)
  const handleGuardarItem = async (data: CrearInventarioItemFormData) => {
    await createItem(data);
    modals.setIsItemModalOpen(false);
  };

  const handleGuardarMovimiento = async (data: MovimientoFormData) => {
    await registrarMovimiento(data);
    modals.setIsMovimientoModalOpen(false);
    modals.setItemSeleccionado(null);
  };

  // Filtrado
  const itemsFiltrados = useMemo(() => {
    return items.filter((item) => {
      const coincideBusqueda = 
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        item.sku.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      
      return coincideBusqueda && coincideTipo;
    });
  }, [busqueda, filtroTipo, items]);

  // Paginación
  const { currentPage, setCurrentPage, totalPages, paginatedItems } = useClientPagination({
    items: itemsFiltrados,
    pageSize: 8,
  });

  // Resetear página al filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroTipo, setCurrentPage]);

  // Estilos para los badges de Estado
  const getEstadoEstilo = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'AGOTADO': return 'bg-red-50 text-red-700 border-red-200/80';
      case 'STOCK_BAJO': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default: return 'bg-gray-50 text-gray-700 border-gray-200/80';
    }
  };

  return {
    busqueda, setBusqueda,
    filtroTipo, setFiltroTipo,
    
    // Modales y estados
    isItemModalOpen: modals.isItemModalOpen,
    setIsItemModalOpen: modals.setIsItemModalOpen,
    isMovimientoModalOpen: modals.isMovimientoModalOpen,
    setIsMovimientoModalOpen: modals.setIsMovimientoModalOpen,
    itemSeleccionado: modals.itemSeleccionado,
    
    // Datos y tablas
    itemsPaginados: paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
    cargando: loading,
    
    // Handlers
    handleAbrirCrearItem: modals.handleAbrirCrearItem,
    handleAbrirMovimiento: modals.handleAbrirMovimiento,
    handleGuardarItem,
    handleGuardarMovimiento,
    getEstadoEstilo,
  };
};