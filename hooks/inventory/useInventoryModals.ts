// hooks/inventory/useInventoryModals.ts
import { useState, useCallback } from 'react';
import { InventarioItem } from '@/types/inventory';

export function useInventoryModals() {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);

  const abrirCrearItem = useCallback(() => {
    setIsItemModalOpen(true);
  }, []);

  const cerrarItemModal = useCallback(() => {
    setIsItemModalOpen(false);
  }, []);

  const abrirMovimiento = useCallback((item: InventarioItem) => {
    setSelectedItem(item);
    setIsMovementModalOpen(true);
  }, []);

  const cerrarMovimiento = useCallback(() => {
    setIsMovementModalOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  }, []);

  const cerrarTodos = useCallback(() => {
    setIsItemModalOpen(false);
    setIsMovementModalOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  }, []);

  return {
    isItemModalOpen,
    isMovementModalOpen,
    selectedItem,
    
    setIsItemModalOpen,
    setIsMovementModalOpen,
    
    abrirCrearItem,
    cerrarItemModal,
    abrirMovimiento,
    cerrarMovimiento,
    cerrarTodos,
  };
}