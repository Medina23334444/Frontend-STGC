import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await apiFetch(`${BACKEND_URL}/inventario/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: err.status || 500 }
    );
  }
}