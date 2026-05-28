// hooks/inventory/useMovimientoForm.ts
import { useState, useEffect } from 'react';
import { MovimientoFormData, InventarioItem } from '@/types/inventory';
import { RegistrarMovimientoSchema } from '@/schemas/inventory.schem';
import { TipoMovimiento } from '@/types/enums'; 

interface UseMovimientoFormParams {
  isOpen: boolean;
  item: InventarioItem | null;
  onSubmit: (data: MovimientoFormData) => Promise<any>; 
  onClose: () => void;
}

export function useMovimientoForm({ isOpen, item, onSubmit, onClose }: UseMovimientoFormParams) {
  const [form, setForm] = useState<MovimientoFormData>({
    item_id: '',
    cantidad: 1,
    tipo: TipoMovimiento.ENTRADA, 
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof MovimientoFormData, string>>>({});

  useEffect(() => {
    if (isOpen && item) {
      setForm({
        item_id: item.id,
        cantidad: 1,
        tipo: TipoMovimiento.ENTRADA, 
        motivo: '',
      });
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, item]);

  const updateField = <K extends keyof MovimientoFormData>(
    field: K, 
    value: MovimientoFormData[K]
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

    const validation = RegistrarMovimientoSchema.safeParse(form);

    if (!validation.success) {
      const nextFieldErrors: Partial<Record<keyof MovimientoFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof MovimientoFormData | undefined;
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
      await onSubmit(validation.data as MovimientoFormData);
      onClose();
    } catch (submitError: unknown) {
      const message = submitError instanceof Error 
        ? submitError.message 
        : 'Error al registrar el movimiento.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitLabel = 'Confirmar Movimiento';
  if (isSubmitting) submitLabel = 'Registrando...';

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