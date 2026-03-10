import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Block Bad Countries (If you implemented this earlier)
  const country = request.geo?.country || 'US';
  if (['CN', 'RU', 'IN'].includes(country)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 2. STOP CACHE BUSTING: Strip query parameters on dynamic SEO routes
  if (request.nextUrl.search) {
    // Clone the URL and remove all query parameters (?sort=..., ?ref=...)
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = '';
    
    // Redirect them to the clean, cached version of the page (301 Permanent)
    return NextResponse.redirect(cleanUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only apply this to your heavy SEO pages, NOT your API or search forms
    '/doctores/:path*',
    '/enfermedad/:path*',
    '/especialidad/:path*',
    '/medico/:path*'
  ],
};