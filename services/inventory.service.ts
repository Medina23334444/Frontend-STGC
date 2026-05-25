// services/inventory.service.ts
import { apiFetch } from '@/lib/api';
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
  }
};