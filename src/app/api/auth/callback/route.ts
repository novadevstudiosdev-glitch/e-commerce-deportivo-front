import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/callback?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!token) {
      return NextResponse.redirect(new URL('/auth/callback?error=No token provided', request.url));
    }

    // Redirigir al callback page con el token limpio
    return NextResponse.redirect(
      new URL(`/auth/callback?token=${encodeURIComponent(token)}`, request.url)
    );
  } catch (error) {
    console.error('Error en /api/auth/callback:', error);
    return NextResponse.redirect(
      new URL('/auth/callback?error=Internal server error', request.url)
    );
  }
}
