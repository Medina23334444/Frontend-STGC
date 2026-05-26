// app/api/admin/audits/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.AUTH_SERVICE_URL;
    const apiKey = process.env.SECRET_KEY; 

    if (!baseUrl) {
      return NextResponse.json({ error: 'Falta AUTH_SERVICE_URL' }, { status: 500 });
    }

    const backendUrl = `${baseUrl}/internal/audit`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Asegúrate de enviar la variable correctamente
        'X-Internal-Api-Key': apiKey || '' 
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error del backend: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}