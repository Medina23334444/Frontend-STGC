// hooks/inventory/useItemForm.ts
import { useState, useEffect } from 'react';

import { CrearInventarioItemFormData, InventarioItem } from '@/types/inventory';
import { CreateItemSchema } from '@/schemas/inventory.schem';
import { TipoElemento, EstadoProducto, UnidadMedida } from '@/types/enums';

interface UseItemFormParams {
  isOpen: boolean;
  onSubmit: (data: CrearInventarioItemFormData) => Promise<InventarioItem>; 
  onClose: () => void;
}

const baseFormValues: CrearInventarioItemFormData = {
  sku: '',
  nombre: '',
  tipo: TipoElemento.INSUMO,            
  estado: EstadoProducto.DISPONIBLE,   
  unidad_medida: UnidadMedida.QUINTALES,
  precio: 0,
  descripcion: '',
};

export function useItemForm({ isOpen, onSubmit, onClose }: UseItemFormParams) {
  const [form, setForm] = useState<CrearInventarioItemFormData>(baseFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CrearInventarioItemFormData, string>>>({});

  useEffect(() => {
    if (!isOpen) {
      setForm(baseFormValues);
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen]);

  const updateField = <K extends keyof CrearInventarioItemFormData>(
    field: K, 
    value: CrearInventarioItemFormData[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = CreateItemSchema.safeParse(form);

    if (!validation.success) {
      const nextFieldErrors: Partial<Record<keyof CrearInventarioItemFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof CrearInventarioItemFormData | undefined;
        if (fieldName && !nextFieldErrors[fieldName]) {
          nextFieldErrors[fieldName] = issue.message;
        }
      });
      setFieldErrors(nextFieldErrors);
      setError(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await onSubmit(validation.data as CrearInventarioItemFormData);
      onClose();
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : 'Error al guardar el ítem.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitLabel = 'Crear Ítem';
  if (isSubmitting) submitLabel = 'Guardando...';

  return {
    form,
    isSubmitting,
    error,
    fieldErrors,
    submitLabel,
    updateField,
    handleSubmit,
  };
}