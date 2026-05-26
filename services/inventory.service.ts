import { apiFetch } from '@/lib/api';
import { InventarioItem, MovimientoFormData, CrearInventarioItemFormData, MovimientoStock } from '@/types/inventory';

export const inventoryItemsService = {
  // GET /inventario -> Obtener todos los ítems
  async getItemsFisicos(): Promise<InventarioItem[]> {
    return await apiFetch('/inventory/items'); 
  },
  
  // GET /inventario/{id} -> Detalle de un ítem
  async getItemById(id: string): Promise<InventarioItem> {
    return await apiFetch(`/inventory/items/${id}`);
  },

  // POST /inventario -> Crear nuevo ítem
  async createItem(data: CrearInventarioItemFormData): Promise<InventarioItem> {
    return await apiFetch('/inventory/items', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  },

  // POST /inventario/movimientos -> Registrar movimiento de stock
  async registrarMovimiento(data: MovimientoFormData): Promise<MovimientoStock> {
    return await apiFetch('/inventory/movimientos', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }
};