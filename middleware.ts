'use client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // 1. Define Protected Parameters
  // 'google_vignette' is essential for AdSense full-screen ads.
  // 'gclid' (Google Click ID) is essential if you ever run paid ads.
  const hasProtectedParams = 
    searchParams.has('google_vignette') || 
    searchParams.has('gclid');

  // 2. Execute Cleanup only for "trash" parameters (UTMs, fbclid, etc.)
  // We bypass the redirect if a protected parameter is detected.
  if (request.nextUrl.search && !hasProtectedParams) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = '';
    
    // We keep your 301 Permanent Redirect to consolidate SEO authority
    // while protecting the ad experience.
    return NextResponse.redirect(cleanUrl, 301);
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