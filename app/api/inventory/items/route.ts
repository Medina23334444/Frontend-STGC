// app/api/inventory/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('stgc_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/inventario`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || 'Error al obtener inventario');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/inventario`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || 'Error al crear ítem');
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}