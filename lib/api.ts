// lib/api.ts
import { ApiError, createApiError, NetworkError } from '@/lib/errors/ApiErrors';

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const BASE_URL = options.baseUrl || '/api';

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Obtener el body como JSON primero
    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // Si no es JSON válido, continuar sin data
    }

    // Manejar respuestas no exitosas
    if (!response.ok) {
      throw createApiError(response.status, data);
    }

    return data;
  } catch (error) {
    // Si ya es un ApiError, relanzarlo
    if (error instanceof Error && error.name?.includes('Error')) {
      throw error;
    }

    // Si es error de red
    if (error instanceof TypeError) {
      throw new NetworkError();
    }

    // Error desconocido
    throw new ApiError(0, 'Error desconocido.');
  }
}