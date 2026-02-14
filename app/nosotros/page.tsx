import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Search, Users, BookOpen, Info, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sobre MediBusca - Información que orienta y conecta",
  description: "MediBusca es una plataforma informativa de salud creada para ayudar a las personas a encontrar médicos, especialidades y contenido médico claro y confiable.",
};

export default function AboutPage() {
  
  // Schema Markup
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MediBusca",
    "url": "https://medibusca.com",
    "logo": "https://medibusca.com/icon-512.png",
    "description": "Plataforma informativa de salud y directorio médico en México.",
    "sameAs": [
      "https://facebook.com/medibusca",
      "https://twitter.com/medibusca"
    ]
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": organizationSchema,
    "name": "Sobre MediBusca",
    "description": "Información sobre la misión, visión y valores de MediBusca.",
    "url": "https://medibusca.com/nosotros"
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />

      {/* Hero Section */}
      <div className="py-20 md:py-28 px-6 bg-[#f5f5f7] border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight">
            Sobre MediBusca
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed max-w-3xl mx-auto">
            Información que orienta, conecta y ayuda a tomar decisiones saludables.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-24">
        
        {/* Intro & Mission */}
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
          <div className="prose prose-lg max-w-none text-[#1d1d1f]/80 leading-relaxed">
            <p className="text-lg md:text-xl font-medium text-[#1d1d1f]">
              MediBusca es una plataforma informativa de salud creada para ayudar a las personas a encontrar médicos, especialidades y contenido médico claro y confiable. Nacimos con una idea simple: facilitar el acceso a la información médica y ayudar a los pacientes a dar el primer paso correcto.
            </p>
            <p>
              Sabemos que cuando surge un problema de salud, la incertidumbre es grande. Muchas personas no saben a qué médico acudir ni dónde buscar información confiable. MediBusca existe para reducir esa confusión.
            </p>
          </div>

          <div className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-16 h-16 bg-[#0071e3]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#0071e3]">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f]">Nuestra misión</h2>
                <p className="text-lg text-[#86868b] leading-relaxed">
                  Nuestra misión es orientar a los pacientes con información médica clara y conectarles con profesionales de la salud reales.
                </p>
                <p className="text-lg text-[#86868b] leading-relaxed">
                  No buscamos reemplazar al médico. Buscamos ayudar a las personas a entender mejor su situación y a encontrar al especialista adecuado. Creemos que la información médica debe ser accesible, comprensible y responsable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Functionality & Help */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] border border-slate-200">
                 <Search className="w-6 h-6" />
               </div>
               <h2 className="text-2xl font-bold text-[#1d1d1f]">Qué hace MediBusca</h2>
            </div>
            <p className="text-[#86868b] leading-relaxed">
              MediBusca organiza información médica en un solo lugar para que los usuarios puedan tomar decisiones más informadas. En nuestra plataforma puedes:
            </p>
            <ul className="space-y-4">
              {[
                "Buscar médicos por ciudad",
                "Explorar especialidades médicas",
                "Conocer enfermedades y síntomas",
                "Acceder a opciones de contacto directo con médicos"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#1d1d1f] font-medium bg-[#f5f5f7] p-3 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-slate-50 border-l-4 border-[#0071e3] p-4 rounded-r-lg">
                <p className="text-sm text-[#86868b] italic">
                MediBusca no realiza consultas médicas, no ofrece diagnósticos y no brinda tratamientos.
                </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] border border-slate-200">
                 <Users className="w-6 h-6" />
               </div>
               <h2 className="text-2xl font-bold text-[#1d1d1f]">Cómo ayudamos</h2>
            </div>
            <p className="text-[#86868b] leading-relaxed">
              MediBusca está diseñada para personas sin conocimientos médicos.
            </p>
            <p className="text-[#86868b] leading-relaxed">
              Explicamos temas de salud con palabras sencillas. Clasificamos médicos y especialidades de forma clara. Presentamos la información de manera ordenada para que el usuario pueda avanzar paso a paso.
            </p>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-[#1d1d1f] leading-relaxed font-semibold">
                "Nuestro objetivo es ahorrar tiempo, reducir dudas y ayudar a las personas a sentirse más seguras antes de contactar a un profesional de la salud."
                </p>
            </div>
          </div>
        </section>

        {/* Responsibility & Connection */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <BookOpen className="w-5 h-5" />
                </div>
                Información médica responsable
              </h3>
              <p className="text-[#86868b] leading-relaxed">
                Toda la información médica publicada en MediBusca tiene fines educativos. Cada artículo busca explicar:
              </p>
              <ul className="space-y-3 text-[#86868b]">
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1d1d1f]"></div> Qué es una enfermedad</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1d1d1f]"></div> Cuáles son los síntomas más comunes</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1d1d1f]"></div> Cuándo es importante acudir al médico</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1d1d1f]"></div> Qué tipo de especialista puede ayudar</li>
              </ul>
              <p className="text-sm font-medium text-[#1d1d1f] pt-2">
                El contenido no sustituye la consulta médica profesional. Siempre recomendamos acudir a un médico calificado.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <FileText className="w-5 h-5" />
                </div>
                Conexión directa con profesionales
              </h3>
              <p className="text-[#86868b] leading-relaxed">
                Algunos perfiles de médicos en MediBusca incluyen información de contacto. Cuando esta opción está disponible, el usuario puede comunicarse directamente con el médico o su consultorio.
              </p>
              <div className="p-4 bg-[#f5f5f7] rounded-xl border border-slate-200">
                  <p className="text-[#86868b] text-sm leading-relaxed">
                    <strong>Nota:</strong> MediBusca no interviene en la comunicación ni en la atención médica. La relación médico paciente es directa y privada.
                  </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust, Ethics & Audience */}
        <section className="space-y-16 animate-in fade-in slide-in-from-bottom-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-6">Nuestro compromiso con la confianza</h2>
            <p className="text-lg text-[#86868b] mb-8">
              La confianza es esencial en temas de salud. Por eso MediBusca sigue principios claros.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['No vendemos servicios médicos', 'No promocionamos tratamientos', 'No ofrecemos diagnósticos', 'No solicitamos información médica personal'].map((item, i) => (
                <span key={i} className="px-5 py-2.5 bg-white shadow-sm rounded-full text-sm font-medium text-[#1d1d1f] border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-sm text-[#86868b] mt-8">
              Respetamos la privacidad del usuario y usamos la información solo para mejorar la experiencia del sitio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-16">
             <div className="space-y-6">
               <h3 className="text-2xl font-bold text-[#1d1d1f]">Para quién es MediBusca</h3>
               <p className="text-[#86868b] text-lg">MediBusca es útil para:</p>
               <ul className="space-y-4">
                 <li className="flex items-start gap-4 text-[#86868b]">
                   <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                   <div>
                        <span className="text-[#1d1d1f] font-medium block">Pacientes</span>
                        que buscan orientación inicial.
                   </div>
                 </li>
                 <li className="flex items-start gap-4 text-[#86868b]">
                   <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                   <div>
                        <span className="text-[#1d1d1f] font-medium block">Familias</span>
                        que necesitan encontrar especialistas para sus seres queridos.
                   </div>
                 </li>
                 <li className="flex items-start gap-4 text-[#86868b]">
                   <CheckCircle className="w-6 h-6 text-green-600 shrink-0" /> 
                   <div>
                       <span className="text-[#1d1d1f] font-medium block">Personas informadas</span>
                       que desean investigar antes de acudir al médico.
                   </div>
                 </li>
               </ul>
               <p className="text-sm text-[#0071e3] font-medium inline-block bg-[#0071e3]/10 px-4 py-2 rounded-full">
                   No es necesario crear una cuenta para usar la plataforma.
               </p>
             </div>

             <div className="space-y-6">
               <h3 className="text-2xl font-bold text-[#1d1d1f]">Ética y responsabilidad médica</h3>
               <p className="text-[#86868b] text-lg">La salud es un tema serio. Por eso MediBusca mantiene un enfoque ético y responsable.</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5f5f7] p-5 rounded-2xl text-center hover:bg-[#e8e8ed] transition-colors">
                    <ShieldCheck className="w-8 h-8 text-[#1d1d1f] mx-auto mb-3" />
                    <span className="text-sm font-semibold text-[#1d1d1f]">Sin alarmas</span>
                    <p className="text-xs text-[#86868b] mt-1">No generamos pánico innecesario.</p>
                  </div>
                  <div className="bg-[#f5f5f7] p-5 rounded-2xl text-center hover:bg-[#e8e8ed] transition-colors">
                    <Info className="w-8 h-8 text-[#1d1d1f] mx-auto mb-3" />
                    <span className="text-sm font-semibold text-[#1d1d1f]">Sin promesas</span>
                    <p className="text-xs text-[#86868b] mt-1">No garantizamos curas milagrosas.</p>
                  </div>
                  <div className="bg-[#f5f5f7] p-5 rounded-2xl text-center hover:bg-[#e8e8ed] transition-colors">
                    <Users className="w-8 h-8 text-[#1d1d1f] mx-auto mb-3" />
                    <span className="text-sm font-semibold text-[#1d1d1f]">Complementario</span>
                    <p className="text-xs text-[#86868b] mt-1">No sustituye al doctor.</p>
                  </div>
                  <div className="bg-[#f5f5f7] p-5 rounded-2xl text-center hover:bg-[#e8e8ed] transition-colors">
                    <CheckCircle className="w-8 h-8 text-[#1d1d1f] mx-auto mb-3" />
                    <span className="text-sm font-semibold text-[#1d1d1f]">Informado</span>
                    <p className="text-xs text-[#86868b] mt-1">Promueve decisiones conscientes.</p>
                  </div>
               </div>
             </div>
          </div>

        </section>

        {/* Goals & Disclaimer Footer */}
        <section className="space-y-12 border-t border-slate-200 pt-16 animate-in fade-in slide-in-from-bottom-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-[#1d1d1f]">Nuestro objetivo a largo plazo</h3>
            <p className="text-lg text-[#86868b] leading-relaxed">
              MediBusca trabaja para convertirse en un punto de referencia confiable en información médica. Seguimos mejorando el contenido, la organización del sitio y la experiencia del usuario. La información médica evoluciona y nuestro compromiso es mantenernos actualizados y responsables.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center md:text-left md:flex md:items-start md:gap-6">
             <div className="mb-4 md:mb-0 shrink-0 flex justify-center md:block">
               <AlertCircle className="w-8 h-8 text-amber-600 mt-1" />
             </div>
             <div>
               <h4 className="text-lg font-bold text-amber-900 mb-2">Aviso médico importante</h4>
               <p className="text-amber-800 leading-relaxed text-[15px]">
                 MediBusca proporciona información médica con fines educativos únicamente. No reemplaza la consulta, el diagnóstico ni el tratamiento médico profesional. Siempre consulta a un médico calificado ante cualquier problema de salud.
               </p>
             </div>
          </div>

          <div className="text-center pt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-4 tracking-tight">MediBusca, información que orienta</h2>
            <p className="text-xl text-[#86868b] mb-10 max-w-2xl mx-auto">
              MediBusca existe para informar, orientar y conectar. Creemos que una buena decisión en salud empieza con información clara.
            </p>
            <div className="flex justify-center">
              <Link href="/buscar" className="bg-[#0071e3] text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-[#0077ED] transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Comenzar a buscar
              </Link>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}