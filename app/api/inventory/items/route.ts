// app/api/inventory/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3001';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('stgc_token')?.value;
  console.log("Token capturado de la cookie:", token ? "SÍ EXISTE" : "NO HAY TOKEN (es null)");
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
    // 1. Analizar el cuerpo (body) de forma segura
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Cuerpo JSON inválido' }, { status: 400 });
    }

    // 2. Hacer la petición al backend
    const res = await fetch(`${BACKEND_URL}/inventario`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    // 3. Reenviar el código de estado exacto del backend en lugar de lanzar un 500
    if (!res.ok) {
      console.warn(`El backend devolvió el estado ${res.status}:`, data);
      return NextResponse.json(
        { error: data?.message || 'Error al crear ítem' }, 
        { status: res.status } 
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    // 4. ¡Registrar el fallo real en tu terminal de Next.js!
    console.error("ERROR CRÍTICO en POST /api/inventory/items:", error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Revisa los logs de la consola.' }, 
      { status: 500 }
    );
  }
}

