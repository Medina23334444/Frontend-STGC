// hooks/inventory/useInventoryModals.ts
import { useState, useCallback } from 'react';
import { LoteCafe, LoteFormData } from '@/types/traceability';

export function useInventoryModals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loteAEliminar, setLoteAEliminar] = useState<LoteCafe | null>(null);
  const [loteEditando, setLoteEditando] = useState<LoteCafe | null>(null);
  const [defaultValoresModal, setDefaultValoresModal] = useState<Partial<LoteFormData>>({});

  const handleAbrirCrear = useCallback(() => {
    setLoteEditando(null);
    setDefaultValoresModal({
      variedad: '',
      fase: 'PULPA', 
      cantidad_producida: 0,
      costo_produccion: 0,
      unidad_medida: 'QUINTALES', 
      calidad: 'ALTA'
    });
    setIsModalOpen(true);
  }, []);

  const handleAbrirEditar = useCallback((lote: LoteCafe) => {
    setLoteEditando(lote);
    setDefaultValoresModal({
      variedad: lote.variedad,
      fase: lote.fase,
      cantidad_producida: lote.cantidad_producida,
      costo_produccion: lote.costo_produccion,
      unidad_medida: lote.unidad_medida,
      calidad: lote.calidad,
    });
    setIsModalOpen(true);
  }, []);

  const abrirEliminar = useCallback((lote: LoteCafe) => {
    setLoteAEliminar(lote);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEliminarLote = useCallback((id: string, inventario: LoteCafe[]) => {
    const lote = inventario.find(item => item.id === id);
    if (lote) {
      abrirEliminar(lote);
    }
  }, [abrirEliminar]);

  return {
    isModalOpen, setIsModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    loteAEliminar, setLoteAEliminar,
    loteEditando, setLoteEditando,
    defaultValoresModal,
    handleAbrirCrear,
    handleAbrirEditar,
    handleEliminarLote,
    abrirEliminar
  };
}