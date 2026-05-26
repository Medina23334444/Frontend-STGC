// hooks/inventory/useInventoryItemsData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { InventarioItem, CrearInventarioItemFormData, MovimientoFormData, MovimientoStock } from '@/types/inventory';
import { inventoryItemsService } from '@/services/inventory.service';
import { ApiError } from '@/lib/errors/ApiErrors';

export function useInventoryItemsData() {
  const queryClient = useQueryClient();

  const query = useQuery<InventarioItem[], ApiError>({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      try {
        return await inventoryItemsService.getItemsFisicos();
      } catch (err) {
        throw err instanceof ApiError ? err : new ApiError(500, 'Error al obtener ítems de inventario');
      }
    },
  });

  const fetchItems = useCallback(async () => {
    await query.refetch();
  }, [query.refetch]);

  const updateCached = useCallback((updater: (current: InventarioItem[]) => InventarioItem[]) => {
    queryClient.setQueryData<InventarioItem[]>(['inventory-items'], (current) => {
      if (!current) return updater([]);
      return updater(current);
    });
  }, [queryClient]);

  const createItem = useCallback(async (data: CrearInventarioItemFormData): Promise<InventarioItem> => {
    const newItem = await inventoryItemsService.createItem(data);
    updateCached((current) => [...current, newItem]);
    return newItem;
  }, [updateCached]);

  const registrarMovimiento = useCallback(async (data: MovimientoFormData): Promise<MovimientoStock> => {
    const movimiento = await inventoryItemsService.registrarMovimiento(data);
    // Volvemos a obtener el inventario para que se actualicen las cantidades (stock) correctamente
    await fetchItems(); 
    return movimiento;
  }, [fetchItems]);

  return {
    items: query.data ?? [],
    loading: query.isPending,
    error: query.error ?? null,
    fetchItems,
    createItem,
    registrarMovimiento,
  };
}