import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política de Privacidad | MediBusca",
  description: "Política de Privacidad de MediBusca. Conoce cómo protegemos tu información y el uso de datos en nuestra plataforma informativa de salud.",
};

export default function PrivacyPage() {
  
  // Schema Markup
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Política de Privacidad",
    "description": "Política de Privacidad de MediBusca. Conoce cómo protegemos tu información y el uso de datos en nuestra plataforma informativa de salud.",
    "url": "https://medibusca.com/privacidad"
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <ShieldCheck className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Política de Privacidad</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium">
             En MediBusca, la privacidad de los usuarios es una prioridad.
           </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-6">
        
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-[17px]">
          <p className="font-medium text-[#1d1d1f] mb-8 text-lg border-b border-slate-100 pb-8">
            Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información cuando visitas nuestro sitio web. Al utilizar MediBusca, aceptas las prácticas descritas en esta política.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              Qué es MediBusca
            </h2>
            <p>
              MediBusca es una plataforma informativa de salud. Ofrecemos información sobre médicos, especialidades, enfermedades y síntomas con fines educativos.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 flex gap-3">
              <Eye className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-blue-900 m-0">
                Nuestra plataforma es de acceso libre y no requiere registro obligatorio para consultar la información básica.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Información que recopilamos</h2>
            <p className="mb-4">
              MediBusca no solicita información médica personal sensible. Podemos recopilar información técnica básica de forma automática para el funcionamiento del sitio, como:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 list-none pl-0">
              {['Dirección IP', 'Tipo de navegador', 'Tipo de dispositivo', 'Páginas visitadas', 'Tiempo de navegación'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm bg-[#f5f5f7] p-2 rounded-lg text-[#1d1d1f]">
                  <CheckCircle className="w-4 h-4 text-green-600" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#86868b]">
              Estos datos se usan exclusivamente para análisis estadístico y mejora del rendimiento.
            </p>
          </section>

          <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-red-600">
              <Lock className="w-6 h-6" />
              Información que NO recopilamos
            </h2>
            <p className="mb-4 text-[#1d1d1f]">Para tu seguridad, es importante aclarar qué datos NO procesamos:</p>
            <ul className="space-y-3 mb-0 list-none pl-0">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0"></div>
                <span><strong>No solicitamos historial médico:</strong> No almacenamos expedientes ni diagnósticos clínicos.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0"></div>
                <span><strong>No realizamos consultas:</strong> La comunicación es directa con los doctores externos.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0"></div>
                <span><strong>No almacenamos datos financieros:</strong> No procesamos pagos por servicios médicos.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Uso de Cookies</h2>
            <p className="mb-4">
              MediBusca puede utilizar cookies y tecnologías similares para mejorar la experiencia de navegación.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-[#1d1d1f]">
              <li><strong>Cookies esenciales:</strong> Necesarias para que el sitio funcione correctamente.</li>
              <li><strong>Cookies analíticas:</strong> Nos ayudan a entender qué secciones son más útiles para los usuarios.</li>
            </ul>
            <p className="text-sm text-[#86868b]">
              Puedes desactivar las cookies en la configuración de tu navegador en cualquier momento, aunque esto podría afectar algunas funcionalidades.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#86868b]" />
              Enlaces a terceros
            </h2>
            <p className="mb-4">
              Nuestro sitio incluye enlaces a perfiles de médicos, mapas de ubicación y otros recursos externos.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-amber-900 m-0">
                 MediBusca no controla ni es responsable de las políticas de privacidad de sitios externos. Te recomendamos leer sus propias políticas antes de compartir información personal con ellos.
               </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Seguridad</h2>
            <p className="mb-4">
              Implementamos medidas de seguridad estándar para proteger la información contra acceso no autorizado, alteración o destrucción. Utilizamos conexiones seguras (HTTPS) para cifrar la navegación.
            </p>
          </section>

          <section className="mb-12 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Contacto y Derechos ARCO</h2>
            <p>
              Si tienes dudas sobre el tratamiento de tus datos o deseas ejercer tus derechos de acceso, rectificación, cancelación u oposición, contáctanos:
            </p>
            <div className="mt-4">
               <Link href="/contacto" className="inline-flex items-center gap-2 text-[#0071e3] font-semibold hover:underline">
                  Ir a formulario de contacto <ExternalLink className="w-4 h-4" />
               </Link>
            </div>
          </section>

          <div className="bg-[#1d1d1f] text-white p-8 rounded-[24px]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Actualizaciones
            </h3>
            <p className="text-slate-300 leading-relaxed mb-0 text-sm">
              Esta política puede actualizarse periódicamente. La última revisión fue realizada en <strong>Octubre 2023</strong>. Te recomendamos revisar esta página regularmente para estar informado sobre cambios.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}