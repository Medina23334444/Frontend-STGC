// lib/api.ts

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  // Por defecto usa la URL de autenticación si no le pasamos otra en las opciones
  const BASE_URL = options.baseUrl || process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

  // Recuperamos el token guardado en el navegador (cuando el usuario inicia sesión)
  const token = typeof window !== 'undefined' ? localStorage.getItem('stgc_token') : null;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    // Inyecta de forma automática la cabecera "Bearer token" que tu backend espera
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si el backend te bloquea temporalmente por superar las peticiones (Rate Limit / slowapi)
  if (response.status === 429) {
    throw new Error('Demasiadas solicitudes. Por favor, frena un poco e intenta más tarde.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Ocurrió un error inesperado en el servidor.');
  }

  return response.json();
}