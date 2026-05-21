import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

    if (!baseUrl) {
      throw new Error('La variable de entorno NEXT_PUBLIC_AUTH_SERVICE_URL no está configurada');
    }

    // 1. Extraer la cookie HttpOnly que Next.js guardó durante el login
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No tienes autorización. La sesión expiró.' }, { status: 401 });
    }

    // 2. Enviar petición al backend de Python inyectando el token como Bearer
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Aquí pasamos el token de forma segura
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Intentamos capturar el mensaje de error que envía el backend
      const errorData = await res.json().catch(() => null);
      
      // FastAPI 422 arroja 'detail' como un array de objetos
      let errorMessage = 'Error al conectar con el servidor de autenticación';
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          // Extraemos el campo y el mensaje del error de validación
          errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("Error en proxy de registro:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}