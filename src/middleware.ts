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

  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/admin')) {
    let target = '/account/profile';
    if (pathname.startsWith('/dashboard/profile')) target = '/account/profile';
    if (pathname.startsWith('/dashboard/orders')) target = '/account/orders';
    if (pathname.startsWith('/dashboard/settings')) target = '/account/preferences';
    if (pathname.startsWith('/dashboard/favorites')) target = '/account/preferences';
    const url = new URL(target + search, request.url);
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
