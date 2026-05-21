import { useState, useMemo } from 'react';
import { LoteCafe, LoteFormData } from '@/types/inventory';

export const useInventory = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loteAEliminar, setLoteAEliminar] = useState<LoteCafe | null>(null);
  const [inventario, setInventario] = useState<LoteCafe[]>([
    { id: '1', codigoLote: 'LOT-2026-001', tipoCafe: 'Pergamino', pesoKg: '1250', estado: 'Bodega', fechaIngreso: '2026-05-10' },
    { id: '2', codigoLote: 'LOT-2026-002', tipoCafe: 'Café Oro', pesoKg: '2100', estado: 'En Proceso', fechaIngreso: '2026-05-12' },
    { id: '3', codigoLote: 'LOT-2026-003', tipoCafe: 'Cereza', pesoKg: '900', estado: 'Secado', fechaIngreso: '2026-05-15' },
    { id: '4', codigoLote: 'LOT-2026-004', tipoCafe: 'Pasilla', pesoKg: '450', estado: 'Despachado', fechaIngreso: '2026-05-16' },
  ]);

  const [loteEditando, setLoteEditando] = useState<LoteCafe | null>(null);
  const [defaultValoresModal, setDefaultValoresModal] = useState<Partial<LoteFormData>>({});

  const handleAbrirCrear = () => {
    setLoteEditando(null);
    setDefaultValoresModal({
      codigoLote: '',
      tipoCafe: 'Pergamino',
      pesoKg: '',
      estado: 'Bodega',
      fechaIngreso: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleAbrirEditar = (lote: LoteCafe) => {
    setLoteEditando(lote);
    setDefaultValoresModal({
      codigoLote: lote.codigoLote,
      tipoCafe: lote.tipoCafe,
      pesoKg: lote.pesoKg,
      estado: lote.estado,
      fechaIngreso: lote.fechaIngreso,
    });
    setIsModalOpen(true);
  };

  const handleEliminarLote = (id: string, codigoLote: string) => {
    const lote = inventario.find(item => item.id === id);
    if (lote) {
      setLoteAEliminar(lote);
      setIsDeleteModalOpen(true);
    } else {
      alert('No se encontró el lote a eliminar.');
    }
  };

  const confirmarEliminacion = () => {
    if (loteAEliminar) {
      setInventario((prev) => prev.filter(item => item.id !== loteAEliminar.id));
      setIsDeleteModalOpen(false);
      setLoteAEliminar(null);
    }
  };

  const handleGuardarLote = (data: LoteFormData) => {
    if (loteEditando) {
      const updatedInventario = inventario.map((l) =>
        l.id === loteEditando.id ? { ...l, ...data, id: loteEditando.id } : l
      );
      setInventario(updatedInventario);
    } else {
      const nuevoLote: LoteCafe = {
        id: new Date().getTime().toString(),
        ...data,
      };
      setInventario([...inventario, nuevoLote]);
    }
    setIsModalOpen(false);
    setLoteEditando(null);
  };

  const getEstadoEstilo = (estado: LoteCafe['estado']) => {
    switch (estado) {
      case 'Bodega': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'En Proceso': return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Secado': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Despachado': return 'bg-slate-100 text-slate-700 border-slate-300/80';
    }
  };

  const metricasTotales = useMemo(() => {
    const total = inventario.reduce((acc, item) => acc + parseFloat(item.pesoKg), 0);
    const tipos = new Set(inventario.map(item => item.tipoCafe)).size;
    const activos = inventario.filter(item => item.estado !== 'Despachado').length;
    return { total, tipos, activos };
  }, [inventario]);

  const inventarioFiltrado = useMemo(() => {
    return inventario.filter((lote) => {
      const coincideBusqueda = lote.codigoLote.toLowerCase().includes(busqueda.toLowerCase()) || 
                               lote.tipoCafe.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = filtroEstado === 'TODOS' || lote.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }, [busqueda, filtroEstado, inventario]);

  return {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    loteAEliminar,
    loteEditando,
    defaultValoresModal,
    inventarioFiltrado,
    metricasTotales,
    handleAbrirCrear,
    handleAbrirEditar,
    handleEliminarLote,
    confirmarEliminacion,
    handleGuardarLote,
    getEstadoEstilo,
  };
};
