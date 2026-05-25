// app/api/inventory/items/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.INVENTORY_SERVICE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('stgc_token')?.value;
}

export async function GET() {
  try {
    if (!BASE_URL) throw new Error('INVENTORY_SERVICE_URL no configurada');

    const token = await getToken();
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    // Petición real a Rust: GET /inventario
    const res = await fetch(`${BASE_URL}/inventario`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) return NextResponse.json({ error: 'Error al obtener inventario' }, { status: res.status });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy GET /inventory/items:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();

    const mockCreatedItem = {
      id: crypto.randomUUID(),
      cantidad: 0, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body
    };
    await new Promise(resolve => setTimeout(resolve, 400));
    return NextResponse.json(mockCreatedItem, { status: 201 });
    // --- FIN MOCK ---

    /* CÓDIGO REAL (Descomentar cuando Rust implemente POST /inventario)
    if (!BASE_URL) throw new Error('INVENTORY_SERVICE_URL no configurada');
    const res = await fetch(`${BASE_URL}/inventario`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return NextResponse.json({ error: data?.error || 'Error al crear ítem' }, { status: res.status });
    return NextResponse.json(data, { status: 201 });
    */
  } catch (error) {
    console.error('Error en proxy POST /inventory/items:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}