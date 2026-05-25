import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.INVENTORY_SERVICE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('stgc_token')?.value;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!BASE_URL) {
      throw new Error('La variable de entorno INVENTORY_SERVICE_URL no está configurada');
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${BASE_URL}/inventory/lotes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.detail || data?.error || 'Error al actualizar lote';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy PUT /inventory/lotes/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!BASE_URL) {
      throw new Error('La variable de entorno INVENTORY_SERVICE_URL no está configurada');
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/inventory/lotes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const message = data?.detail || data?.error || 'Error al eliminar lote';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error en proxy DELETE /inventory/lotes/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}