// hooks/inventory/useInventoryData.ts
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoteCafe, LoteFormData } from '@/types/traceability';
import { inventoryService } from '@/services/inventory.service';
import { ApiError } from '@/lib/errors/ApiErrors';

export function useInventoryData() {
  const queryClient = useQueryClient();

  const query = useQuery<LoteCafe[], ApiError>({
    queryKey: ['inventory-lotes'],
    queryFn: async () => {
      try {
        return await inventoryService.getAll();
      } catch (err) {
        throw err instanceof ApiError ? err : new ApiError(500, 'Error al obtener lotes');
      }
    },
  });

  const fetchInventario = useCallback(async () => {
    await query.refetch();
  }, [query.refetch]);

  const updateCached = useCallback((updater: (current: LoteCafe[]) => LoteCafe[]) => {
    queryClient.setQueryData<LoteCafe[]>(['inventory-lotes'], (current) => {
      if (!current) return updater([]);
      return updater(current);
    });
  }, [queryClient]);

  const createLote = useCallback(async (data: LoteFormData): Promise<LoteCafe> => {
    const newLote = await inventoryService.create(data);
    updateCached((current) => [...current, newLote]);
    return newLote;
  }, [updateCached]);

  const updateLote = useCallback(async (id: string, data: Partial<LoteFormData>): Promise<LoteCafe> => {
    const updatedLote = await inventoryService.update(id, data);
    updateCached((current) => current.map((lote) => (lote.id === id ? updatedLote : lote)));
    return updatedLote;
  }, [updateCached]);

  const deleteLote = useCallback(async (id: string): Promise<void> => {
    await inventoryService.delete(id);
    updateCached((current) => current.filter((lote) => lote.id !== id));
  }, [updateCached]);

  return {
    inventario: query.data ?? [],
    loading: query.isPending,
    error: query.error ?? null,
    fetchInventario,
    createLote,
    updateLote,
    deleteLote,
  };
}