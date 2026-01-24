// ============================================
// MIDDLEWARE - AUTENTICACIÓN Y RUTAS PROTEGIDAS
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  let { pathname, search } = request.nextUrl;

  // Normalizar URLs con doble barra (//path -> /path)
  if (pathname.includes('//')) {
    const normalizedPath = pathname.replace(/\/+/g, '/');
    const url = new URL(normalizedPath + search, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
