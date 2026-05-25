import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.INVENTORY_SERVICE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('stgc_token')?.value;
}

export async function GET() {
  try {
    if (!BASE_URL) {
      throw new Error('La variable de entorno INVENTORY_SERVICE_URL no está configurada');
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/inventory/lotes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.detail || data?.error || 'Error al obtener lotes';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy GET /inventory/lotes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!BASE_URL) {
      throw new Error('La variable de entorno INVENTORY_SERVICE_URL no está configurada');
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const res = await fetch(`${BASE_URL}/inventory/lotes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.detail || data?.error || 'Error al crear lote';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error en proxy POST /inventory/lotes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}