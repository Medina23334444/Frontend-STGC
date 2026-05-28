import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.AUTH_SERVICE_URL;
    console.log('[auth/login] baseUrl=', baseUrl);
    const startTime = Date.now();
    const requestUrl = new URL(req.url);
    const useSecureCookie = requestUrl.protocol === 'https:';

    if (!baseUrl) {
      console.error('[auth/login] AUTH_SERVICE_URL not configured');
      return NextResponse.json({ error: 'Configuración de servidor inválida' }, { status: 500 });
    }

    // timeout para evitar que la petición quede pendiente indefinidamente
    const LOGIN_TIMEOUT_MS = 12000; // 12s
    const loginController = new AbortController();
    const loginTimeout = setTimeout(() => loginController.abort(), LOGIN_TIMEOUT_MS);
    let loginRes: Response;
    try {
      loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: loginController.signal,
      });
    } catch (fetchErr) {
      clearTimeout(loginTimeout);
      console.error('[auth/login] fetch /auth/login error:', fetchErr);
      if ((fetchErr as any)?.name === 'AbortError') {
        return NextResponse.json({ error: 'Tiempo de espera agotado contactando al servicio de autenticación' }, { status: 504 });
      }
      return NextResponse.json({ error: 'Error comunicando con el servicio de autenticación' }, { status: 502 });
    }
    clearTimeout(loginTimeout);

    if (!loginRes.ok) {
      const errorBody = await loginRes.json().catch(() => null);
      console.warn('[auth/login] login failed status=', loginRes.status, 'body=', errorBody);
      return NextResponse.json(
        { error: errorBody?.detail || errorBody?.message || 'Credenciales inválidas' },
        { status: loginRes.status }
      );
    }

    const data = await loginRes.json();
    const token = data.access_token;

    // 2. Obtener el perfil del usuario autenticado (/auth/me)
    const meController = new AbortController();
    const meTimeout = setTimeout(() => meController.abort(), LOGIN_TIMEOUT_MS);
    let meRes: Response;
    try {
      meRes = await fetch(`${baseUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: meController.signal,
      });
    } catch (fetchErr) {
      clearTimeout(meTimeout);
      console.error('[auth/login] fetch /auth/me error:', fetchErr);
      if ((fetchErr as any)?.name === 'AbortError') {
        return NextResponse.json({ error: 'Tiempo de espera agotado obteniendo perfil de usuario' }, { status: 504 });
      }
      return NextResponse.json({ error: 'Error comunicando con el servicio de autenticación' }, { status: 502 });
    }
    clearTimeout(meTimeout);

    if (!meRes.ok) {
      console.error('[auth/login] /auth/me returned status=', meRes.status);
      throw new Error('Error al obtener perfil del usuario');
    }

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

    const duration = Date.now() - startTime;
    console.log('[auth/login] success, durationMs=', duration);

    response.cookies.set({
      name: 'stgc_token',
      value: token,
      httpOnly: true, // ¡Clave de seguridad! El navegador la oculta de JavaScript
      secure: useSecureCookie,
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