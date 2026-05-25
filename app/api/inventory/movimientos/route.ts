// app/api/inventory/movimientos/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.INVENTORY_SERVICE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('stgc_token')?.value;
}

export async function POST(request: NextRequest) {
  try {
    if (!BASE_URL) throw new Error('INVENTORY_SERVICE_URL no está configurada');

    const token = await getToken();
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`${BASE_URL}/inventario/movimientos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.detail || data?.error || 'Error al registrar el movimiento';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error en proxy POST /inventory/movimientos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}