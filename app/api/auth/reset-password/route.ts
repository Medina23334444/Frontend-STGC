import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.AUTH_SERVICE_URL; 
    
    const res = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Token inválido o expirado' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en puente de reset-password:", error);
    return NextResponse.json({ error: 'Error interno del servidor Next.js' }, { status: 500 });
  }
}