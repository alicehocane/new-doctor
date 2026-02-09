import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Scale, AlertCircle, FileText, Shield, Globe, Lock, Info, Mail, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  // SEO
  useEffect(() => {
    document.title = "Términos y Condiciones | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Términos y condiciones de uso de la plataforma MediBusca. Información legal, responsabilidades y uso del sitio.");
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <Scale className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Términos y Condiciones</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
             Bienvenido a MediBusca.
           </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-6">
        
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-[17px]">
          <p className="font-medium text-[#1d1d1f] mb-8 text-lg">
            Al acceder y utilizar este sitio web, aceptas cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te recomendamos no utilizar el sitio.
          </p>

          {/* Qué es MediBusca */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              Qué es MediBusca
            </h2>
            <p>
              MediBusca es una plataforma informativa de salud. Ofrecemos información sobre médicos, especialidades, enfermedades y síntomas con fines educativos.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 flex gap-3">
               <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-amber-900 m-0">
                 MediBusca no brinda atención médica, no realiza diagnósticos y no ofrece tratamientos.
               </p>
            </div>
          </section>

          {/* Uso del sitio */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Uso del sitio</h2>
            <p className="mb-4">Al utilizar MediBusca, el usuario se compromete a:</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                Usar el sitio de forma responsable y legal
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                No utilizar el contenido con fines engañosos o dañinos
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                No copiar, reproducir o distribuir el contenido sin autorización
              </li>
            </ul>
            <p className="text-sm text-[#86868b]">
              El uso indebido del sitio puede dar lugar a la suspensión del acceso.
            </p>
          </section>

          {/* Contenido médico */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#86868b]" />
              Contenido médico
            </h2>
            <p className="mb-4">La información médica publicada en MediBusca es solo educativa. El contenido:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-[#1d1d1f]">
              <li>No sustituye la consulta médica profesional</li>
              <li>No debe usarse para autodiagnóstico</li>
              <li>No reemplaza el criterio de un médico calificado</li>
            </ul>
            <p className="font-medium text-[#1d1d1f]">
              Siempre consulta a un profesional de la salud ante cualquier problema médico.
            </p>
          </section>

          {/* Perfiles de médicos y contacto */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Perfiles de médicos y contacto</h2>
            <p className="mb-4">
              MediBusca muestra perfiles informativos de médicos y especialistas.
            </p>
            <p className="mb-4">
              El contacto con médicos, cuando está disponible, se realiza directamente entre el usuario y el profesional. MediBusca no interviene en consultas, diagnósticos, pagos ni tratamientos.
            </p>
            <p className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              No garantizamos la disponibilidad ni los resultados de la atención médica.
            </p>
          </section>

          {/* Responsabilidad del usuario */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#86868b]" />
              Responsabilidad del usuario
            </h2>
            <p className="mb-4">
              El uso del contenido y de la información disponible en MediBusca es responsabilidad exclusiva del usuario.
            </p>
            <p className="mb-2">MediBusca no se hace responsable por:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Decisiones tomadas con base en la información del sitio</li>
              <li>Resultados médicos o de salud</li>
              <li>Daños directos o indirectos derivados del uso del sitio</li>
            </ul>
          </section>

          {/* Propiedad intelectual */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Propiedad intelectual</h2>
            <p>
              Todos los textos, logotipos, diseños y contenidos del sitio son propiedad de MediBusca o se utilizan con autorización. Está prohibida su reproducción total o parcial sin permiso previo por escrito.
            </p>
          </section>

          {/* Enlaces externos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#86868b]" />
              Enlaces externos
            </h2>
            <p className="mb-4">
              El sitio puede contener enlaces a páginas de terceros.
            </p>
            <p>
              MediBusca no es responsable del contenido, servicios ni políticas de esos sitios externos. El acceso a enlaces externos es bajo responsabilidad del usuario.
            </p>
          </section>

          {/* Privacidad */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#86868b]" />
              Privacidad
            </h2>
            <p>
              El uso del sitio también está sujeto a nuestra <Link href="/privacidad" className="text-[#0071e3] hover:underline font-medium">Política de Privacidad</Link>, donde se explica cómo se maneja la información del usuario.
            </p>
          </section>

          {/* Legal Misc */}
          <section className="mb-12 grid md:grid-cols-2 gap-8">
            <div>
               <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">Cambios en los términos</h2>
               <p className="text-sm">
                 MediBusca puede modificar estos Términos y Condiciones en cualquier momento. Las actualizaciones se publicarán en esta página y entrarán en vigor desde su publicación.
               </p>
            </div>
            <div>
               <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">Ley aplicable</h2>
               <p className="text-sm">
                 Estos Términos y Condiciones se rigen por las leyes aplicables según la jurisdicción correspondiente.
               </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#86868b]" />
              Contacto
            </h2>
            <p>
              Para cualquier duda relacionada con estos Términos y Condiciones, puedes contactarnos a través de la sección de <Link href="/contacto" className="text-[#0071e3] hover:underline font-medium">Contacto</Link> de MediBusca.
            </p>
          </section>

          {/* Aviso Final */}
          <div className="bg-[#1d1d1f] text-white p-8 rounded-[24px]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Aviso final
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              El uso de MediBusca implica la aceptación completa de estos Términos y Condiciones.
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Si no estás de acuerdo, te recomendamos no utilizar el sitio.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}