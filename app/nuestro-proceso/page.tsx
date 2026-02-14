
import React from 'react';
import Link from 'next/link';
import { Database, ShieldCheck, MonitorCheck, FileCheck, CheckCircle, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestro Proceso de Verificación Médica | MediBusca',
  description: 'Conoce cómo MediBusca recopila, verifica y publica la información de médicos y especialistas en México. Transparencia y seguridad para el paciente.',
};

export default function VerificationProcessPage() {
  
  // Schema Markup
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Proceso de Verificación Médica | MediBusca",
    "description": "Explicación del proceso de validación de credenciales médicas en MediBusca.",
    "url": "https://medibusca.com/nuestro-proceso"
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <ShieldCheck className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Nuestro Proceso de Integración de Datos</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium">
             Transparencia y rigor en la información médica que publicamos.
           </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Intro */}
        <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-6">
            <p className="text-xl text-[#1d1d1f] leading-relaxed">
                En MediBusca, entendemos que la confianza es lo más importante cuando se trata de salud. Por eso, hemos diseñado un proceso de verificación para asegurar que la información mostrada en nuestro <strong className="text-[#0071e3]">directorio informativo gratuito</strong> sea fiable y útil para los pacientes.
            </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 relative before:absolute before:left-[27px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200 before:-z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3">1. Recopilación de Datos</h3>
                    <p className="text-[#86868b] leading-relaxed">
                        Obtenemos información de bases de datos públicas, registros oficiales y colaboraciones directas con profesionales de la salud. Filtramos los datos para asegurar que estén completos y actualizados.
                    </p>
                </div>
                <div className="relative z-10 order-1 md:order-2 flex-shrink-0">
                    <div className="w-14 h-14 bg-[#0071e3] rounded-full flex items-center justify-center text-white border-4 border-white shadow-md">
                        <Database className="w-6 h-6" />
                    </div>
                </div>
                <div className="md:w-1/2 order-3 hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="md:w-1/2 hidden md:block order-1"></div>
                <div className="relative z-10 order-1 md:order-2 flex-shrink-0">
                    <div className="w-14 h-14 bg-white border-4 border-[#0071e3] rounded-full flex items-center justify-center text-[#0071e3] shadow-md">
                        <FileCheck className="w-6 h-6" />
                    </div>
                </div>
                <div className="md:w-1/2 order-2 md:order-3">
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3">2. Validación de Credenciales</h3>
                    <p className="text-[#86868b] leading-relaxed">
                        Este es nuestro paso más crítico. Contrastamos manualmente las cédulas profesionales con el <strong className="text-[#1d1d1f]">Registro Nacional de Profesionistas (SEP)</strong>. Verificamos que la licenciatura y, en su caso, la especialidad, estén debidamente registradas.
                    </p>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3">3. Publicación Informativa</h3>
                    <p className="text-[#86868b] leading-relaxed">
                        Una vez validado, el perfil se publica en el directorio. Presentamos la información de contacto directa de la clínica de forma gratuita, sin cobrar comisiones por citas ni ocultar teléfonos.
                    </p>
                </div>
                <div className="relative z-10 order-1 md:order-2 flex-shrink-0">
                    <div className="w-14 h-14 bg-[#1d1d1f] rounded-full flex items-center justify-center text-white border-4 border-white shadow-md">
                        <MonitorCheck className="w-6 h-6" />
                    </div>
                </div>
                <div className="md:w-1/2 order-3 hidden md:block"></div>
            </div>

        </div>

        {/* Informational Pivot / Disclaimer */}
        <div className="mt-24 bg-[#f5f5f7] rounded-[24px] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-start gap-4">
                <Info className="w-8 h-8 text-[#0071e3] shrink-0 mt-1" />
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Transparencia y Responsabilidad</h3>
                    <p className="text-[#86868b] leading-relaxed">
                        Nuestra labor es transcribir, organizar y verificar datos públicos para su comodidad. Sin embargo, MediBusca es una herramienta informativa, no una autoridad regulatoria.
                    </p>
                    <p className="text-[#1d1d1f] font-medium leading-relaxed">
                        Recomendamos siempre validar físicamente las credenciales del médico (título y cédula) durante su primera visita al consultorio antes de someterse a cualquier tratamiento.
                    </p>
                </div>
            </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
            <Link 
                href="/buscar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-colors shadow-lg"
            >
                <CheckCircle className="w-5 h-5" />
                Buscar médicos verificados ahora
            </Link>
        </div>

      </div>
    </div>
  );
}
