import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener la lista de usuarios');
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error en proxy GET /users:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
