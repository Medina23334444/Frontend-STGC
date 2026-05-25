// services/inventory.service.ts
import { apiFetch } from '@/lib/api';
import { InventarioItem, MovimientoFormData } from '@/types/inventory';
import { LoteCafe, LoteFormData } from '@/types/traceability';

export const inventoryService = {
  async getAll(): Promise<LoteCafe[]> {
    return await apiFetch('/inventory/lotes');
  },
  
  async create(data: LoteFormData): Promise<LoteCafe> {
    return await apiFetch('/inventory/lotes', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },

  async update(id: string, data: Partial<LoteFormData>): Promise<LoteCafe> {
    return await apiFetch(`/inventory/lotes/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    });
  },

  async delete(id: string): Promise<void> {
    return await apiFetch(`/inventory/lotes/${id}`, { 
      method: 'DELETE'
    });
  },
  async registrarMovimiento(data: MovimientoFormData): Promise<any> {
    return await apiFetch('/inventory/movimientos', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },

  async getItemsFisicos(): Promise<InventarioItem[]> {
    return await apiFetch('/inventory/items'); 
  }
};