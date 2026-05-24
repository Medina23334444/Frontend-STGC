// app/api/admin/roles/permissions/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const baseUrl = process.env.AUTH_SERVICE_URL;

    if (!baseUrl) {
      throw new Error('La variable de entorno AUTH_SERVICE_URL no está configurada');
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No tienes autorización. La sesión expiró.' }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/roles/permissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      let errorMessage = 'Error al actualizar el permiso';
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en proxy PUT /roles/permissions/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const baseUrl = process.env.AUTH_SERVICE_URL;

    if (!baseUrl) {
      throw new Error('La variable de entorno AUTH_SERVICE_URL no está configurada');
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('stgc_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No tienes autorización. La sesión expiró.' }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/roles/permissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      let errorMessage = 'Error al eliminar el permiso';
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error en proxy DELETE /roles/permissions/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}