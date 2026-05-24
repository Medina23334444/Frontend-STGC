// lib/errors/ApiErrors.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Sesión expirada. Por favor, inicia sesión nuevamente.') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'No tienes permisos para acceder a este recurso.') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'El recurso solicitado no existe.') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(public validationErrors: Record<string, string[]> = {}) {
    super(422, 'Error de validación.');
    this.name = 'ValidationError';
  }
}

/**
 * Error interno del servidor (500)
 */
export class ServerError extends ApiError {
  constructor(message = 'Error interno del servidor. Intenta más tarde.') {
    super(500, message);
    this.name = 'ServerError';
  }
}


export class NetworkError extends ApiError {
  constructor(message = 'Error de conexión. Verifica tu internet.') {
    super(0, message);
    this.name = 'NetworkError';
  }
}

export function createApiError(status: number, data?: any): ApiError {
  switch (status) {
    case 401:
      return new UnauthorizedError(data?.message);
    case 403:
      return new ForbiddenError(data?.message);
    case 404:
      return new NotFoundError(data?.message);
    case 422:
      return new ValidationError(data?.errors || {});
    case 429:
      return new ApiError(429, 'Demasiadas solicitudes. Intenta más tarde.');
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(data?.message);
    default:
      return new ApiError(status, data?.message || 'Error desconocido.');
  }
}