import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { searchParams } = url;

  // 1. Lista expandida de parámetros protegidos (AdSense, Ads y Google Search)
  const protectedParams = [
    'google_vignette',
    'gclid',
    'srsltid', // Google Shopping / Organic tracking
    'fbclid',  // Solo si quieres mantener track de Facebook
    'adsense'
  ];

  const hasProtectedParams = protectedParams.some(param => searchParams.has(item));

  // 2. Limpieza de parámetros basura (UTMs, etc.)
  // Solo ejecutamos si hay parámetros y NINGUNO es de la lista protegida
  if (url.search && !hasProtectedParams) {
    url.search = '';
    
    // Usamos 308 (Permanent Redirect) para máxima autoridad SEO
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/doctores/:path*',
    '/enfermedad/:path*',
    '/especialidad/:path*',
    '/medico/:path*'
  ],
};