/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 1. URL Consistency (prevents internal redirect loops)
  // Setting this to false makes Next.js automatically remove trailing slashes
  // from URLs, preventing Google from seeing /doctor/ and /doctor as two different pages.
  trailingSlash: false,

  images: {
    // remotePatterns is the modern and secure approach in Next.js 14+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medibusca.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // 2. Server-level redirects (force non-www as 308)
  async redirects() {
    return [
      {
        // If someone enters via www...
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.medibusca.com',
          },
        ],
        // ...redirect permanently to the main domain (308)
        destination: 'https://medibusca.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;