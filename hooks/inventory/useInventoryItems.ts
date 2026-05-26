import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useClientPagination } from '@/hooks/shared/useClientPagination';
import { 
  InventarioItem, 
  CrearInventarioItemFormData, 
  MovimientoFormData, 
  MovimientoStock 
} from '@/types/inventory';
import { TipoElemento } from '@/types/enums';
import { inventoryService } from '@/services/inventory.service';
import { ApiError } from '@/lib/errors/ApiErrors';

export function useInventoryItems() {
  const queryClient = useQueryClient();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoElemento | 'TODOS'>('TODOS');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);

  const query = useQuery<InventarioItem[], ApiError>({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      try {
        return await inventoryService.getItems();
      } catch (err) {
        throw err instanceof ApiError 
          ? err 
          : new ApiError(500, 'Error al obtener ítems de inventario');
      }
    },
  });

  const itemsFiltrados = useMemo(() => {
    const items = query.data ?? [];
    return items.filter((item) => {
      const coincideBusqueda = 
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        item.sku.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      return coincideBusqueda && coincideTipo;
    });
  }, [busqueda, filtroTipo, query.data]);

  const { currentPage, setCurrentPage, totalPages, paginatedItems } = useClientPagination({
    items: itemsFiltrados,
    pageSize: 8,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroTipo, setCurrentPage]);

  const createItem = useCallback(async (data: CrearInventarioItemFormData): Promise<InventarioItem> => {
    const newItem = await inventoryService.createItem(data);
    queryClient.setQueryData<InventarioItem[]>(['inventory-items'], (current) => {
      if (!current) return [newItem];
      return [...current, newItem];
    });
    return newItem;
  }, [queryClient]);

  const registrarMovimiento = useCallback(async (data: MovimientoFormData): Promise<MovimientoStock> => {
    const movimiento = await inventoryService.registrarMovimiento(data);
    await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    return movimiento;
  }, [queryClient]);

  const handleAbrirCrearItem = useCallback(() => {
    setIsItemModalOpen(true);
  }, []);

  const handleAbrirMovimiento = useCallback((item: InventarioItem) => {
    setSelectedItem(item);
    setIsMovementModalOpen(true);
  }, []);

  const handleCerrarMovimiento = useCallback(() => {
    setIsMovementModalOpen(false);
    setSelectedItem(null);
  }, []);

  const getEstadoEstilo = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'AGOTADO': return 'bg-red-50 text-red-700 border-red-200/80';
      case 'STOCK_BAJO': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default: return 'bg-gray-50 text-gray-700 border-gray-200/80';
    }
  };

  return {
    items: paginatedItems,
    loading: query.isPending,
    error: query.error,
    
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    
    currentPage,
    totalPages,
    setCurrentPage,
    
    isItemModalOpen,
    setIsItemModalOpen,
    isMovementModalOpen,
    setIsMovementModalOpen,
    selectedItem,
    
    createItem,
    registrarMovimiento,
    
    handleAbrirCrearItem,
    handleAbrirMovimiento,
    handleCerrarMovimiento,
    getEstadoEstilo,
  };
}