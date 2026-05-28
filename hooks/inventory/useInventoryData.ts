// hooks/inventory/useInventoryData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  InventarioItem, 
  CrearInventarioItemFormData, 
  MovimientoFormData 
} from '@/types/inventory';
import { inventoryService } from '@/services/inventory.service';
import { toast } from 'sonner';

export function useInventoryData() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: inventoryService.getItems,
  });

  const createItem = useCallback(async (data: CrearInventarioItemFormData) => {
    try {
      const newItem = await inventoryService.createItem(data);
      queryClient.setQueryData<InventarioItem[]>(['inventory-items'], (current) => {
        if (!current) return [newItem];
        return [...current, newItem];
      });
      toast.success('Ítem creado exitosamente');
      return newItem;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear el ítem.';
      toast.error(message);
      throw err;
    }
  }, [queryClient]);

  const registrarMovimiento = useCallback(async (data: MovimientoFormData) => {
    try {
      const movimiento = await inventoryService.registrarMovimiento(data);
      await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Movimiento registrado exitosamente');
      return movimiento;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar movimiento.';
      toast.error(message);
      throw err;
    }
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