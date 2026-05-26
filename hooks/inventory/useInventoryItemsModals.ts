// hooks/inventory/useInventoryItemsModals.ts
import { useState, useCallback } from 'react';
import { InventarioItem } from '@/types/inventory';

export function useInventoryItemsModals() {
  // Modal para Crear Ítem
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  // Modal para Movimientos de Stock
  const [isMovimientoModalOpen, setIsMovimientoModalOpen] = useState(false);
  
  // Ítem seleccionado para registrarle un movimiento
  const [itemSeleccionado, setItemSeleccionado] = useState<InventarioItem | null>(null);

  const handleAbrirCrearItem = useCallback(() => {
    setIsItemModalOpen(true);
  }, []);

  const handleAbrirMovimiento = useCallback((item: InventarioItem) => {
    setItemSeleccionado(item);
    setIsMovimientoModalOpen(true);
  }, []);

  return {
    isItemModalOpen, setIsItemModalOpen,
    isMovimientoModalOpen, setIsMovimientoModalOpen,
    itemSeleccionado, setItemSeleccionado,
    handleAbrirCrearItem,
    handleAbrirMovimiento
  };
}