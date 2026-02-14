
import React from 'react';
import Link from 'next/link';
import { Users, Target, ShieldCheck, Heart, Database, Search } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce al equipo detrás de MediBusca. Nuestra misión es democratizar el acceso a la información de salud en México con transparencia y tecnología.",
};

export default function AboutPage() {
  
  // Schema Markup
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Nosotros | MediBusca",
    "description": "Misión, visión y equipo de MediBusca.",
    "url": "https://medibusca.com/nosotros",
    "mainEntity": {
      "@type": "Organization",
      "name": "MediBusca",
      "foundingDate": "2023",
      "description": "Plataforma tecnológica de información médica."
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <Users className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Quiénes Somos</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium">
             Tecnología y datos al servicio de la salud en México.
           </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
        
        {/* Mission */}
        <section className="text-center animate-in fade-in slide-in-from-bottom-6">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-6">Nuestra Misión</h2>
            <p className="text-xl text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                Organizar la información médica de México para hacerla accesible, útil y transparente. Creemos que encontrar al doctor adecuado no debería ser un proceso confuso ni estresante.
            </p>
        </section>

        {/* The Problem & Solution */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1d1d1f]">El Desafío</h3>
                </div>
                <p className="text-[#86868b] leading-relaxed">
                    La información de salud en internet suele estar fragmentada, desactualizada o llena de tecnicismos. Los pacientes a menudo se enfrentan a directorios incompletos o sitios que priorizan la publicidad sobre la calidad.
                </p>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <Database className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Nuestra Solución</h3>
                </div>
                <p className="text-[#86868b] leading-relaxed">
                    MediBusca utiliza tecnología para recopilar, verificar y estandarizar datos de miles de especialistas. Creamos una plataforma centralizada donde la información es clara, gratuita y fácil de navegar.
                </p>
            </div>
        </section>

        {/* Our Values */}
        <section>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-10 text-center">Nuestros Valores</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-[#f5f5f7] p-8 rounded-[24px] text-center hover:scale-[1.02] transition-transform">
                    <ShieldCheck className="w-10 h-10 text-[#0071e3] mx-auto mb-4" />
                    <h3 className="font-bold text-[#1d1d1f] mb-3">Transparencia</h3>
                    <p className="text-sm text-[#86868b] leading-relaxed">
                        Nuestra información es imparcial. No cobramos a los pacientes y no aceptamos pagos para alterar rankings de búsqueda.
                    </p>
                </div>
                <div className="bg-[#f5f5f7] p-8 rounded-[24px] text-center hover:scale-[1.02] transition-transform">
                    <Target className="w-10 h-10 text-[#0071e3] mx-auto mb-4" />
                    <h3 className="font-bold text-[#1d1d1f] mb-3">Precisión</h3>
                    <p className="text-sm text-[#86868b] leading-relaxed">
                        Validamos las credenciales profesionales (Cédulas) contra registros oficiales para asegurar la legitimidad de los especialistas.
                    </p>
                </div>
                <div className="bg-[#f5f5f7] p-8 rounded-[24px] text-center hover:scale-[1.02] transition-transform">
                    <Heart className="w-10 h-10 text-[#0071e3] mx-auto mb-4" />
                    <h3 className="font-bold text-[#1d1d1f] mb-3">Empatía</h3>
                    <p className="text-sm text-[#86868b] leading-relaxed">
                        Diseñamos pensando en el paciente. Utilizamos un lenguaje claro y evitamos interfaces complicadas en momentos de necesidad.
                    </p>
                </div>
            </div>
        </section>

        {/* Team / Origin Story */}
        <section className="bg-[#1d1d1f] text-white rounded-[32px] p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold">Quiénes somos</h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        MediBusca nació de la necesidad personal de encontrar información médica confiable rápidamente. Somos un equipo multidisciplinario de ingenieros de software, analistas de datos y comunicadores apasionados por la salud digital.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        No somos una corporación farmacéutica ni una cadena de hospitales. Somos una startup tecnológica independiente comprometida con mejorar el ecosistema de salud en México.
                    </p>
                </div>
                <div className="shrink-0">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
                        <Users className="w-16 h-16 md:w-20 md:h-20 text-white" />
                    </div>
                </div>
            </div>
        </section>

        {/* Contact CTA */}
        <div className="text-center pt-8 border-t border-slate-200">
            <p className="text-[#86868b] mb-6 text-lg">¿Quieres saber más o colaborar con nosotros?</p>
            <Link 
                href="/contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-all shadow-lg"
            >
                Contáctanos
            </Link>
        </div>

      </div>
    </div>
  );
}
