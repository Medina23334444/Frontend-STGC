// app/api/inventory/movimientos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BASE_URL = process.env.INVENTORY_SERVICE_URL;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;
    const body = await request.json();

    const payload = {
      ...body,
      id: crypto.randomUUID(), 
      fecha: new Date().toISOString(), 
    };

    const res = await fetch(`${BASE_URL}/inventario/movimientos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
    
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text }; 
    }

    if (!res.ok) {
      console.warn(`El backend devolvió ${res.status}:`, data);
      return NextResponse.json(
        { error: data?.message || 'Error al registrar movimiento' }, 
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("ERROR CRÍTICO Next.js:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}