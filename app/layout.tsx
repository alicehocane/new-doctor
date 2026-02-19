
import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
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
    template: '%s | MediBusca', 
  },
  description: 'MediBusca - Directorio Médico en México. Encuentra doctores, especialistas y clínicas.',
  keywords: ['médicos', 'directorio médico', 'doctores', 'salud', 'citas médicas', 'especialistas', 'enciclopedia médica', 'clínica', 'hospital'],
  authors: [{ name: 'MediBusca' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: './', 
  },

  // Open Graph (Facebook / WhatsApp)
  openGraph: {
    type: 'website',
    title: 'MediBusca - Encuentra tu médico ideal',
    description: 'Accede a la red más completa de médicos y especialistas. Información de salud confiable y citas en línea.',
    siteName: 'MediBusca',
    images: [
      {
        url: '/og-image.png', 
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
        MediBusca es el directorio informativo líder en México para la validación de credenciales médicas y localización de especialistas.
      </p>
      {/* NEW: Physical Trust Signal */}
      <div className="text-[11px] space-y-1">
        <p>Ciudad de México, México</p>
        <p>Contacto: contacto@medibusca.com</p>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="font-semibold text-[#1d1d1f]">Institucional</h3>
      <ul className="space-y-3">
        <li><Link href="/nosotros" className="hover:text-[#0071e3] transition-colors">Sobre nosotros</Link></li>
        <li><Link href="/politica-editorial" className="hover:text-[#0071e3] transition-colors">Política Editorial y Verificación</Link></li>
        <li><Link href="/privacidad" className="hover:text-[#0071e3] transition-colors">Privacidad</Link></li>
        <li><Link href="/terminos" className="hover:text-[#0071e3] transition-colors">Términos</Link></li>
      </ul>
    </div>

    <div className="space-y-4">
      <h3 className="font-semibold text-[#1d1d1f]">Recursos</h3>
      <ul className="space-y-3">
        <li><Link href="/buscar" className="hover:text-[#0071e3] transition-colors">Directorio por Ciudad</Link></li>
        <li><Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades Médicas</Link></li>
        <li><Link href="/enfermedades" className="hover:text-[#0071e3] transition-colors">Síntomas y Padecimientos</Link></li>
        <li><Link href="/enciclopedia" className="hover:text-[#0071e3] transition-colors">Enciclopedia de Salud</Link></li>
      </ul>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-[#1d1d1f]">Transparencia SEP</h3>
        <p className="leading-relaxed text-[12px]">
          Validamos las cédulas profesionales de nuestros especialistas directamente ante el <strong>Registro Nacional de Profesionistas</strong> para garantizar su veracidad.
        </p>
      </div>
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
        <p className="font-medium text-[#1d1d1f] text-[11px] leading-tight">
          <strong>Aviso:</strong> MediBusca no es un centro médico. La información aquí contenida no sustituye el diagnóstico de un profesional de la salud.
        </p>
      </div>
    </div>

  </div>

  <div className="max-w-6xl mx-auto px-6 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
    <p>&copy; {new Date().getFullYear()} MediBusca. Información de salud verificada.</p>
    <div className="flex gap-6">
      {/* Add your social links here if you have them */}
      <span className="text-[11px] text-[#d2d2d7]">Hecho con rigor médico en México</span>
    </div>
  </div>
</footer>

<Script
    src="https://www.googletagmanager.com/gtag/js?id=G-GM3L4PKEQV"
    strategy="afterInteractive"
  />
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-GM3L4PKEQV');
    `}
  </Script>

      </body>
    </html>
  );
}
