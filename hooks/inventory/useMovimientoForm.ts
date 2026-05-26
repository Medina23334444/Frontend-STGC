// hooks/inventory/useMovimientoForm.ts
import { useState, useEffect } from 'react';
import { MovimientoFormData, InventarioItem } from '@/types/inventory';

interface UseMovimientoFormParams {
  isOpen: boolean;
  item: InventarioItem | null;
  onSubmit: (data: MovimientoFormData) => Promise<void>;
  onClose: () => void;
}

export function useMovimientoForm({ isOpen, item, onSubmit, onClose }: UseMovimientoFormParams) {
  const [form, setForm] = useState<MovimientoFormData>({
    item_id: '',
    cantidad: 1,
    tipo: 'ENTRADA',
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setForm({
        item_id: item.id,
        cantidad: 1,
        tipo: 'ENTRADA',
        motivo: '',
      });
      setError(null);
    }
  }, [isOpen, item]);

  const updateField = <K extends keyof MovimientoFormData>(field: K, value: MovimientoFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(form);
      onClose();
    } catch (submitError: any) {
      setError(submitError?.message || 'Error al registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, isSubmitting, error, updateField, handleSubmit };
}