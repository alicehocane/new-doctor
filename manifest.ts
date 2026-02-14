import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediBusca',
    short_name: 'MediBusca',
    description: 'Directorio Médico en México',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f7',
    theme_color: '#f5f5f7',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}