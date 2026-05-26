// hooks/inventory/useInventoryData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  InventarioItem, 
  CrearInventarioItemFormData, 
  MovimientoFormData, 
  MovimientoStock 
} from '@/types/inventory';
import { inventoryService } from '@/services/inventory.service';
import { ApiError } from '@/lib/errors/ApiErrors';

export function useInventoryData() {
  const queryClient = useQueryClient();

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
    // Invalidamos para obtener las cantidades actualizadas del backend
    await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    return movimiento;
  }, [queryClient]);

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    items: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    
    createItem,
    registrarMovimiento,
    refetch,
  };
}