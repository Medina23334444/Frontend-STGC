// lib/api.ts
interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  // 🔥 Por defecto, todas las peticiones irán a tu propio servidor Next.js (/api)
  const BASE_URL = options.baseUrl || '/api';

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // MAGIA BFF: Ya no inyectamos el Authorization Header.
  // El navegador adjunta la cookie HttpOnly automáticamente a todas las rutas '/api'

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 429) {
    throw new Error('Demasiadas solicitudes. Por favor, frena un poco e intenta más tarde.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.detail || 'Ocurrió un error inesperado en el servidor.');
  }

  return response.json();
}