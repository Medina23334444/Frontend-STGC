// services/inventory.service.ts
import { apiFetch } from '@/lib/api';
import { 
  InventarioItem, 
  MovimientoFormData, 
  CrearInventarioItemFormData, 
  MovimientoStock 
} from '@/types/inventory';

export const inventoryService = {
  async getItems(): Promise<InventarioItem[]> {
    return await apiFetch('/inventory');
  },

  async getItemById(id: string): Promise<InventarioItem> {
    return await apiFetch(`/inventory/${id}`);
  },

  async createItem(data: CrearInventarioItemFormData): Promise<InventarioItem> {
    return await apiFetch('/inventory', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },

  async registrarMovimiento(data: MovimientoFormData): Promise<MovimientoStock> {
    return await apiFetch('/inventory/movements', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },
};