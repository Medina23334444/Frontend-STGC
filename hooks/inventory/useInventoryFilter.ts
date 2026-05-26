// hooks/inventory/useInventoryFilters.ts
import { useState, useMemo, useEffect, useCallback } from 'react';
import { InventarioItem } from '@/types/inventory';
import { TipoElemento } from '@/types/enums';
import { useClientPagination } from '@/hooks/shared/useClientPagination';

interface UseInventoryFiltersParams {
  items: InventarioItem[];
}

export function useInventoryFilters({ items }: UseInventoryFiltersParams) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoElemento | 'TODOS'>('TODOS');

  const itemsFiltrados = useMemo(() => {
    if (!busqueda && filtroTipo === 'TODOS') {
      return items;
    }

    const busquedaLower = busqueda.toLowerCase();

    return items.filter((item) => {
      const coincideBusqueda = !busqueda || 
        item.nombre.toLowerCase().includes(busquedaLower) || 
        item.sku.toLowerCase().includes(busquedaLower);
      
      const coincideTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      
      return coincideBusqueda && coincideTipo;
    });
  }, [items, busqueda, filtroTipo]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
  } = useClientPagination({
    items: itemsFiltrados,
    pageSize: 8,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroTipo, setCurrentPage]);

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setFiltroTipo('TODOS');
  }, []);

  const contadores = useMemo(() => ({
    total: items.length,
    filtrados: itemsFiltrados.length,
    mostrados: paginatedItems.length,
  }), [items.length, itemsFiltrados.length, paginatedItems.length]);

  return {
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    
    itemsFiltrados: paginatedItems,
    itemsFiltradosCompletos: itemsFiltrados,
    
    currentPage,
    totalPages,
    setCurrentPage,
    
    limpiarFiltros,
    contadores,
    
    tieneFiltrosActivos: busqueda !== '' || filtroTipo !== 'TODOS',
    sinResultados: itemsFiltrados.length === 0 && items.length > 0,
  };
}