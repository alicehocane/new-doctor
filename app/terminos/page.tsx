import React from 'react';
import Link from 'next/link';
import { Scale, AlertCircle, FileText, Shield, Globe, Lock, Info, Mail, CheckCircle, Gavel } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Términos y Condiciones | MediBusca",
  description: "Términos y condiciones de uso de la plataforma MediBusca. Información legal, responsabilidades y uso del sitio.",
};

export default function TermsPage() {
  
  // Schema Markup
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Términos y Condiciones | MediBusca",
    "description": "Términos y condiciones de uso de la plataforma MediBusca.",
    "url": "https://medibusca.com/terminos"
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <Scale className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Términos y Condiciones</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium">
             Bienvenido a MediBusca. Por favor lee con atención.
           </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-6">
        
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-[17px]">
          <p className="font-medium text-[#1d1d1f] mb-8 text-lg border-b border-slate-100 pb-8">
            Al acceder y utilizar este sitio web (en adelante, "la Plataforma"), aceptas cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te recomendamos no utilizar el sitio.
          </p>

          {/* 1. Naturaleza del Servicio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              1. Naturaleza del Servicio
            </h2>
            <p>
              MediBusca es un directorio y plataforma informativa de salud. Nuestra función se limita a:
            </p>
            <ul className="list-none pl-0 space-y-3 mt-4">
               <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2.5 shrink-0"></div>
                  <span>Organizar información pública sobre médicos y especialistas.</span>
               </li>
               <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2.5 shrink-0"></div>
                  <span>Proveer contenido educativo sobre enfermedades y síntomas.</span>
               </li>
               <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2.5 shrink-0"></div>
                  <span>Facilitar los datos de contacto de consultorios médicos.</span>
               </li>
            </ul>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6 flex gap-4">
               <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
               <div>
                   <h4 className="font-bold text-amber-900 mb-1">Aviso Importante</h4>
                   <p className="text-sm font-medium text-amber-900/80 m-0 leading-relaxed">
                     MediBusca <strong>no es un proveedor de atención médica</strong>. No realizamos consultas, no emitimos diagnósticos, no recetamos medicamentos y no ofrecemos tratamientos médicos de ninguna índole.
                   </p>
               </div>
            </div>
          </section>

          {/* 2. Uso del Sitio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">2. Uso del Sitio</h2>
            <p className="mb-4">Al utilizar MediBusca, el usuario se compromete a:</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-3 bg-[#f5f5f7] p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-[#1d1d1f]">Usar el sitio legalmente</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f5f5f7] p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-[#1d1d1f]">Proveer datos veraces</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f5f5f7] p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-[#1d1d1f]">No extraer datos masivamente</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f5f5f7] p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-[#1d1d1f]">Respetar derechos de autor</span>
              </div>
            </div>
            <p className="text-sm text-[#86868b]">
              El incumplimiento de estas normas puede resultar en la suspensión del acceso a la plataforma.
            </p>
          </section>

          {/* 3. Contenido Educativo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#86868b]" />
              3. Contenido Educativo e Informativo
            </h2>
            <p className="mb-4">
                Todo el contenido disponible en la sección de "Enciclopedia", "Padecimientos" y perfiles médicos tiene fines exclusivamente educativos.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-[#1d1d1f]">
              <li>La información <strong>no sustituye</strong> la consulta médica profesional.</li>
              <li>El usuario <strong>no debe</strong> utilizar la información para autodiagnóstico o automedicación.</li>
              <li>MediBusca no garantiza la exactitud absoluta de la información, ya que la medicina es una ciencia en constante cambio.</li>
            </ul>
          </section>

          {/* 4. Relación con los Profesionales */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">4. Relación con Profesionales de la Salud</h2>
            <p className="mb-4">
              MediBusca actúa como un intermediario informativo.
            </p>
            <div className="space-y-4">
                <p>
                  <strong>Contacto Directo:</strong> El contacto a través de los botones de "Llamar" o "WhatsApp" se realiza directamente entre el usuario y el consultorio del médico. MediBusca no escucha, graba ni interviene en estas comunicaciones.
                </p>
                <p>
                  <strong>Independencia:</strong> Los médicos listados son profesionales independientes. MediBusca no emplea a los médicos y no es responsable de la calidad de la atención, los diagnósticos erróneos o cualquier negligencia médica que pudiera ocurrir fuera de la plataforma.
                </p>
            </div>
          </section>

          {/* 5. Limitación de Responsabilidad */}
          <section className="mb-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#0071e3]" />
              5. Limitación de Responsabilidad
            </h2>
            <p className="mb-4">
              En la medida máxima permitida por la ley, MediBusca y sus administradores no serán responsables por:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-0 text-[#1d1d1f]">
              <li>Decisiones de salud tomadas por el usuario basadas en el contenido del sitio.</li>
              <li>Resultados insatisfactorios de tratamientos médicos recibidos por doctores listados.</li>
              <li>Interrupciones técnicas, errores o virus informáticos en el sitio web.</li>
              <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso de la plataforma.</li>
            </ul>
          </section>

          {/* 6. Enlaces a Terceros */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#86868b]" />
              6. Enlaces a Terceros
            </h2>
            <p className="mb-4">
              La plataforma puede contener enlaces a sitios web externos (como mapas, sitios de clínicas, etc.). MediBusca no controla ni avala el contenido de dichos sitios y no se hace responsable de sus prácticas de privacidad o términos de uso.
            </p>
          </section>

          {/* 7. Modificaciones */}
          <section className="mb-12">
             <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
               <Gavel className="w-5 h-5 text-[#86868b]" />
               7. Modificaciones y Ley Aplicable
             </h2>
             <p className="mb-4">
               MediBusca se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación.
             </p>
             <p>
               Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa relacionada con el uso del sitio se someterá a la jurisdicción de los tribunales competentes en la Ciudad de México.
             </p>
          </section>

          {/* Contacto */}
          <section className="mb-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#86868b]" />
              ¿Dudas sobre los términos?
            </h2>
            <p className="text-base">
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos en:
            </p>
            <div className="mt-2">
                <Link href="/contacto" className="text-[#0071e3] hover:underline font-medium inline-flex items-center gap-1">
                    Ir a formulario de contacto
                </Link>
            </div>
          </section>

          {/* Aviso Final */}
          <div className="bg-[#1d1d1f] text-white p-8 rounded-[24px]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Aceptación
            </h3>
            <p className="text-slate-300 leading-relaxed mb-0 text-sm">
              Al continuar navegando en MediBusca, reconoces que has leído, entendido y aceptado estos Términos y Condiciones, así como nuestra <Link href="/privacidad" className="text-white underline hover:text-slate-200">Política de Privacidad</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}