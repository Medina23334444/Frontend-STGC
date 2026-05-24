// app/api/admin/roles/permissions/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.AUTH_SERVICE_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/roles/permissions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Error al obtener permisos');

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy GET /roles/permissions:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}