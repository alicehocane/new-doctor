export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico, site.webmanifest, robots.txt, sitemap.xml
     * 4. Any file with an extension (e.g. .png, .jpg, .svg)
     */
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|robots.txt|sitemap.xml|.*\\..*$).*)',
  ],
}