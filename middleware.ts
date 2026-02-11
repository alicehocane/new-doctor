import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 1. FAIL-SAFE: If keys are missing in this branch/preview, just skip auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // This part often crashes if the connection is unstable
    await supabase.auth.getUser()
  } catch (e) {
    // If it fails, we still let the user see the page
    console.error("Middleware Error:", e);
  }

  return response
}

export const config = {
  matcher: [
    /* * Added extra safety: ignore EVERYTHING with a dot (files) 
     * to prevent the 401 site.webmanifest error
     */
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap.xml|.*\\..*$).*)',
  ],
}