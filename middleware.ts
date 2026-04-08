import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. VIP PASS: If the URL has our secret admin preview, let it through untouched!
  if (request.nextUrl.searchParams.get('preview') === 'admin-preview') {
    return NextResponse.next();
  }

  // STOP CACHE BUSTING: Strip query parameters on dynamic SEO routes
  // This prevents Cloudflare from creating duplicate caches for URLs with tracking tags
  if (request.nextUrl.search && request.nextUrl.search !== '') {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = '';
    
    // Redirect them to the clean, cached version of the page (301 Permanent)
    return NextResponse.redirect(cleanUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only apply this to your heavy SEO pages. 
    // Ensure you don't use ?page= or ?filter= on these routes!
    '/doctores/:path*',
    '/enfermedad/:path*',
    '/especialidad/:path*',
    '/medico/:path*'
  ],
};