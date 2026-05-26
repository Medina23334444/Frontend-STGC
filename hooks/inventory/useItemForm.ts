// hooks/inventory/useItemForm.ts
import { useState, useEffect } from 'react';
import { CrearInventarioItemFormData } from '@/types/inventory';
// Opcional: import { CreateItemSchema } from '@/schemas/inventory.schema';

interface UseItemFormParams {
  isOpen: boolean;
  onSubmit: (data: CrearInventarioItemFormData) => Promise<void>;
  onClose: () => void;
}

const baseFormValues: CrearInventarioItemFormData = {
  sku: '',
  nombre: '',
  tipo: 'INSUMO',
  estado: 'DISPONIBLE',
  unidad_medida: 'QUINTALES',
  precio: 0,
  descripcion: '',
};

export function useItemForm({ isOpen, onSubmit, onClose }: UseItemFormParams) {
  const [form, setForm] = useState<CrearInventarioItemFormData>(baseFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setForm(baseFormValues); // Resetear al cerrar
      setError(null);
    }
  }, [isOpen]);

  const updateField = <K extends keyof CrearInventarioItemFormData>(field: K, value: CrearInventarioItemFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Aquí puedes agregar validación con Zod si creas el Schema
      await onSubmit(form);
      onClose();
    } catch (submitError: any) {
      setError(submitError?.message || 'Error al guardar el ítem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, isSubmitting, error, updateField, handleSubmit };
}