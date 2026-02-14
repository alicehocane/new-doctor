import React from 'react';
import Link from 'next/link';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import SiteHeader from '../components/SiteHeader';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// 1. Viewport Configuration (Replaces <meta name="viewport" ... />)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f5f5f7',
};

// 2. SEO Metadata (Replaces all <meta> and <link> tags)
export const metadata: Metadata = {
  // Base URL is required for OpenGraph images and Canonical links to work correctly
  metadataBase: new URL('https://medibusca.com'),

  title: {
    default: 'MediBusca',
    template: '%s | MediBusca', // Keeps "MediBusca" appended on other pages
  },
  description: 'MediBusca - Directorio Médico en México. Encuentra doctores, especialistas y clínicas.',
  keywords: ['médicos', 'directorio médico', 'doctores', 'salud', 'citas médicas', 'especialistas', 'enciclopedia médica', 'clínica', 'hospital'],
  authors: [{ name: 'MediBusca' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/', // This auto-generates the canonical link based on metadataBase
  },

  // Open Graph (Facebook / WhatsApp)
  openGraph: {
    type: 'website',
    url: 'https://medibusca.com/',
    title: 'MediBusca - Encuentra tu médico ideal',
    description: 'Accede a la red más completa de médicos y especialistas. Información de salud confiable y citas en línea.',
    siteName: 'MediBusca',
    images: [
      {
        url: '/og-image.png', // Ensure this image exists in your public/ folder
        width: 1200,
        height: 630,
        alt: 'MediBusca Preview',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'MediBusca - Directorio Médico',
    description: 'Accede a la red más completa de médicos y especialistas.',
    images: ['/og-image.png'],
  },

  // Favicons (Ensure these files are in your public/ folder)
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-[#f5f5f7] antialiased selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
        
        <SiteHeader />

        {/* Spacer for sticky header */}
        <div className="h-[48px] md:h-[52px]"></div>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#f5f5f7] border-t border-slate-200 text-[#86868b] py-16 mt-auto text-[13px]">
           <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
             
             <div className="space-y-4">
               <Link href="/" className="text-[17px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors block">MediBusca</Link>
               <p className="leading-relaxed">
                 MediBusca es una plataforma informativa de salud. Ayudamos a las personas a encontrar médicos, especialidades y contenido médico claro y confiable.
               </p>
               <div className="bg-white border border-slate-200 p-3 rounded-lg">
                 <p className="font-medium text-[#1d1d1f] text-xs">
                   No brindamos atención médica ni realizamos diagnósticos o tratamientos.
                 </p>
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="font-semibold text-[#1d1d1f]">Enlaces importantes</h3>
               <ul className="space-y-3">
                 <li><Link href="/nosotros" className="hover:text-[#0071e3] hover:underline transition-colors">Sobre nosotros</Link></li>
                 <li><Link href="/privacidad" className="hover:text-[#0071e3] hover:underline transition-colors">Política de privacidad</Link></li>
                 <li><Link href="/terminos" className="hover:text-[#0071e3] hover:underline transition-colors">Términos y condiciones</Link></li>
                 <li><Link href="/contacto" className="hover:text-[#0071e3] hover:underline transition-colors">Contacto</Link></li>
               </ul>
             </div>

             <div className="space-y-4">
               <h3 className="font-semibold text-[#1d1d1f]">Para pacientes</h3>
               <ul className="space-y-3">
                 <li><Link href="/buscar" className="hover:text-[#0071e3] hover:underline transition-colors">Buscar médicos por ciudad</Link></li>
                 <li><Link href="/especialidades" className="hover:text-[#0071e3] hover:underline transition-colors">Buscar por especialidad</Link></li>
                 <li><Link href="/enfermedades" className="hover:text-[#0071e3] hover:underline transition-colors">Explorar enfermedades y síntomas</Link></li>
                 <li><Link href="/buscar" className="hover:text-[#0071e3] hover:underline transition-colors">Conectar con doctores</Link></li>
               </ul>
             </div>

             <div className="space-y-6">
               <div className="space-y-2">
                 <h3 className="font-semibold text-[#1d1d1f]">Compromiso con la información</h3>
                 <p className="leading-relaxed text-xs">
                   El contenido de MediBusca es educativo y no reemplaza la consulta médica profesional. Siempre consulta a un médico calificado ante cualquier problema de salud.
                 </p>
               </div>
               <div className="space-y-2">
                 <h3 className="font-semibold text-[#1d1d1f]">Transparencia y confianza</h3>
                 <p className="leading-relaxed text-xs">
                   MediBusca respeta la privacidad de los usuarios y no solicita información médica personal. La información publicada se revisa con fines educativos y puede actualizarse con el tiempo.
                 </p>
               </div>
             </div>

           </div>

           <div className="max-w-6xl mx-auto px-6 border-t border-slate-200 pt-8">
             <p>&copy; {new Date().getFullYear()} MediBusca. Todos los derechos reservados.</p>
           </div>
        </footer>
      </body>
    </html>
  );
}