//app/api/auth/recover-password/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.AUTH_SERVICE_URL; 
    
    // 💡 Nota que aquí llamamos a /auth/password-recovery según tu endpoints.py del backend
    const res = await fetch(`${baseUrl}/auth/password-recovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Error al procesar la solicitud' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en puente de recover-password:", error);
    return NextResponse.json({ error: 'Error interno del servidor Next.js' }, { status: 500 });
  }
}