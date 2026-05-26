// hooks/inventory/useInventoryData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  InventarioItem, 
  CrearInventarioItemFormData, 
  MovimientoFormData 
} from '@/types/inventory';
import { inventoryService } from '@/services/inventory.service';

export function useInventoryData() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: inventoryService.getItems,
  });

  const createItem = useCallback(async (data: CrearInventarioItemFormData) => {
    const newItem = await inventoryService.createItem(data);
    queryClient.setQueryData<InventarioItem[]>(['inventory-items'], (current) => {
      if (!current) return [newItem];
      return [...current, newItem];
    });
    return newItem;
  }, [queryClient]);

  const registrarMovimiento = useCallback(async (data: MovimientoFormData) => {
    const movimiento = await inventoryService.registrarMovimiento(data);
    // Invalidar para forzar refetch y actualizar stock
    await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    return movimiento;
  }, [queryClient]);

  return {
    items,
    isLoading,
    isError,
    error,
    createItem,
    registrarMovimiento,
    refetch,
  };
}