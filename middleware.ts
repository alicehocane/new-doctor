import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of 2-letter ISO country codes you want to block
// CN = China, RU = Russia, IN = India
const BLOCKED_COUNTRIES = ['CN', 'RU', 'IN', 'PK'];

export function middleware(request: NextRequest) {
  // Vercel populates request.geo.country automatically
  const country = request.geo?.country || 'US';

  if (BLOCKED_COUNTRIES.includes(country)) {
    // Instantly return a 403 Forbidden error. 
    // This costs 0 CPU and almost 0 Bandwidth.
    return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}

// Only run this middleware on your heavy pages (saves even more CPU)
export const config = {
  matcher: [
    '/doctores/:path*',
    '/enfermedad/:path*',
    '/medico/:path*',
    '/especialidad/:path*'
  ],
};