// app/api/inventory/movimientos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/inventario/movimientos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body),
    });
    
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || 'Error al registrar movimiento');
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}