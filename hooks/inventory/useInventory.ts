// hooks/inventory/useInventory.ts
import { useEffect, useMemo, useState } from 'react';
import { useInventoryData } from './useInventoryData';
import { useInventoryModals } from './useInventoryModals';
import { useClientPagination } from '@/hooks/shared/useClientPagination';
import { LoteFormData } from '@/types/traceability';
import { FaseCafe } from '@/types/enums';

export const useInventory = () => {
  const { inventario, loading, createLote, updateLote, deleteLote } = useInventoryData();
  const modals = useInventoryModals();

  const [busqueda, setBusqueda] = useState('');
  const [filtroFase, setFiltroFase] = useState<FaseCafe | 'TODAS'>('TODAS');

  const confirmarEliminacion = async () => {
    if (modals.loteAEliminar) {
      try {
        await deleteLote(modals.loteAEliminar.id);
        modals.setIsDeleteModalOpen(false);
        modals.setLoteAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const handleGuardarLote = async (data: LoteFormData) => {
    try {
      if (modals.loteEditando) {
        await updateLote(modals.loteEditando.id, data);
      } else {
        await createLote(data);
      }
      modals.setIsModalOpen(false);
      modals.setLoteEditando(null);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Estilos visuales basados en la fase real del backend
  const getFaseEstilo = (fase: FaseCafe) => {
    switch (fase) {
      case 'PULPA': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'DESPULPADO': return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'SECADO': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'TOSTADO': return 'bg-orange-50 text-orange-700 border-orange-200/80';
      case 'MOLIDO': return 'bg-stone-50 text-stone-700 border-stone-300/80';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const metricasTotales = useMemo(() => {
    const total = inventario.reduce((acc, item) => acc + (item.cantidad_producida || 0), 0);
    const variedades = new Set(inventario.map(item => item.variedad)).size;
    return { total, variedades };
  }, [inventario]);

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter((lote) => {
      const codigoStr = lote.codigo_trazabilidad?.toString().toLowerCase() || '';
      const coincideBusqueda = codigoStr.includes(busqueda.toLowerCase()) || 
                               lote.variedad.toLowerCase().includes(busqueda.toLowerCase());
      const coincideFase = filtroFase === 'TODAS' || lote.fase === filtroFase;
      
      return coincideBusqueda && coincideFase;
    });
  }, [busqueda, filtroFase, inventario]);

  const { currentPage, setCurrentPage, totalPages, paginatedItems } = useClientPagination({
    items: inventarioFiltrado,
    pageSize: 8,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroFase, setCurrentPage]);

  return {
    busqueda, setBusqueda,
    filtroFase, setFiltroFase,
    isModalOpen: modals.isModalOpen, setIsModalOpen: modals.setIsModalOpen,
    isDeleteModalOpen: modals.isDeleteModalOpen, setIsDeleteModalOpen: modals.setIsDeleteModalOpen,
    loteAEliminar: modals.loteAEliminar,
    loteEditando: modals.loteEditando,
    defaultValoresModal: modals.defaultValoresModal,
    inventarioFiltrado: paginatedItems,
    inventarioFiltradoCompleto: inventarioFiltrado,
    metricasTotales,
    currentPage,
    totalPages,
    setCurrentPage,
    cargando: loading,
    handleAbrirCrear: modals.handleAbrirCrear,
    handleAbrirEditar: modals.handleAbrirEditar,
    handleEliminarLote: (id: string) => {
      const lote = inventario.find(item => item.id === id);
      if (lote) modals.abrirEliminar(lote);
    },
    confirmarEliminacion,
    handleGuardarLote,
    getFaseEstilo,
  };
};