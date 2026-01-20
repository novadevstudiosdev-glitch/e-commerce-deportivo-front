// ============================================
// MIDDLEWARE - AUTENTICACIÓN Y RUTAS PROTEGIDAS
// ============================================

// TODO: Configurar con NextAuth para proteger rutas
// Este es un placeholder para futuras implementaciones

export function middleware(request: any) {
  // TODO: Implementar lógica de middleware
  return;
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
