import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

    // 1. Enviar credenciales al backend de Python
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const data = await loginRes.json();
    const token = data.access_token;

    // 2. Obtener el perfil del usuario autenticado (/auth/me)
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!meRes.ok) throw new Error('Error al obtener perfil del usuario');
    
    const usuarioLogueado = await meRes.json();

    // 3. Empaquetar la info segura que irá al frontend
    const sessionUser = {
      id: usuarioLogueado.id,
      email: usuarioLogueado.email,
      role: usuarioLogueado.role, // Pasamos el objeto completo (con .name)
      status: usuarioLogueado.status,
      first_name: usuarioLogueado.first_name,
      last_name: usuarioLogueado.last_name,
    };

    // 4. Crear respuesta inyectando la cookie HttpOnly
    const response = NextResponse.json({ user: sessionUser }, { status: 200 });
    
    response.cookies.set({
      name: 'stgc_token',
      value: token,
      httpOnly: true, // ¡Clave de seguridad! El navegador la oculta de JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 día (ajusta según la configuración de tu backend)
    });

    return response;
  } catch (error) {
    console.error("Error en puente de login:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}