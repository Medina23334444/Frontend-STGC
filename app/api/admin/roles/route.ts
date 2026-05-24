// app/api/admin/roles/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.AUTH_SERVICE_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/roles/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Error al obtener roles');

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy GET /roles:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const res = await fetch(`${BASE_URL}/roles/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Error al crear rol');

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error en proxy POST /roles:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}