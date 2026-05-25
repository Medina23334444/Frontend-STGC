import { useEffect, useState } from 'react';
import { CreateLoteSchema } from '@/schemas/lote.schema';
import { LoteCafe, LoteFormData } from '@/types/traceability';

interface UseLoteFormParams {
  readonly isOpen: boolean;
  readonly lote?: LoteCafe | null;
  readonly defaultValues?: Partial<LoteFormData>;
  readonly onSubmit: (data: LoteFormData) => Promise<void>;
  readonly onClose: () => void;
}

const baseFormValues: LoteFormData = {
  variedad: '',
  fase: 'PULPA',
  cantidad_producida: 0,
  costo_produccion: 0,
  unidad_medida: 'QUINTALES',
  calidad: 'ALTA',
};

export function useLoteForm({ isOpen, lote, defaultValues = {}, onSubmit, onClose }: UseLoteFormParams) {
  const [form, setForm] = useState<LoteFormData>(baseFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoteFormData, string>>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (lote) {
      setForm({
        variedad: lote.variedad,
        fase: lote.fase,
        cantidad_producida: lote.cantidad_producida,
        costo_produccion: lote.costo_produccion,
        unidad_medida: lote.unidad_medida,
        calidad: lote.calidad,
      });
      return;
    }

    setForm({ ...baseFormValues, ...defaultValues });
  }, [isOpen, lote, defaultValues]);

  const updateField = <K extends keyof LoteFormData>(field: K, value: LoteFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const setFase = (value: LoteFormData['fase']) => updateField('fase', value);
  const setUnidadMedida = (value: LoteFormData['unidad_medida']) => updateField('unidad_medida', value);
  const setCalidad = (value: LoteFormData['calidad']) => updateField('calidad', value);
  const setPositiveNumericField = (
    field: 'cantidad_producida' | 'costo_produccion',
    rawValue: string,
  ) => {
    const nextValue = rawValue === '' ? 1 : Math.max(1, Number(rawValue));
    updateField(field, nextValue as LoteFormData[typeof field]);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = CreateLoteSchema.safeParse(form);

    if (!validation.success) {
      const nextFieldErrors: Partial<Record<keyof LoteFormData, string>> = {};

      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoteFormData | undefined;
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
      await onSubmit(validation.data);
      onClose();
    } catch (submitError: any) {
      setError(submitError?.message || 'Error al guardar lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitLabel = 'Crear Lote';
  if (lote) submitLabel = 'Guardar cambios';
  if (isSubmitting) submitLabel = 'Guardando...';

  return {
    form,
    error,
    fieldErrors,
    isSubmitting,
    submitLabel,
    updateField,
    setFase,
    setUnidadMedida,
    setCalidad,
    setPositiveNumericField,
    handleSubmit,
  };
}