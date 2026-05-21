import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Destruimos la cookie para cerrar sesión
  response.cookies.delete('stgc_token');
  
  return response;
}