import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Stethoscope, Activity, BookOpen, MapPin, Heart, ShieldCheck, ArrowRight, ChevronRight, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { COMMON_SPECIALTIES, ALL_DISEASES, POPULAR_CITIES, slugify, ALL_CITIES } from '../../lib/constants';

export const metadata: Metadata = {
  title: "Información Médica Confiable y Actualizada | MediBusca",
  description: "Tu fuente confiable de información médica en México. Explora guías sobre especialidades, enfermedades, consejos de salud y encuentra doctores en tu ciudad.",
};

const TOP_SPECIALTIES = [
  'Ginecólogo', 'Cardiólogo', 'Pediatra', 'Dentista - Odontólogo', 
  'Dermatólogo', 'Psicólogo', 'Traumatólogo', 'Oftalmólogo'
];

const TOP_DISEASES = [
  'Ansiedad', 'Diabetes', 'Hipertensión', 'Dolor de espalda', 
  'Gastritis', 'Migraña', 'Acné', 'Obesidad'
];

export default async function MedicalInfoHub() {
  
  // Fetch a few recent articles for the Encyclopedia section
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, category, excerpt')
    .limit(3)
    .order('published_at', { ascending: false });

  // Schema Markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://medibusca.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Información Médica",
        "item": "https://medibusca.com/informacion-medica"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* 1️⃣ Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-6 leading-[1.1]">
                Información Médica <br className="hidden md:block"/> Confiable y Actualizada
            </h1>
            <p className="text-xl text-[#86868b] max-w-3xl mx-auto font-medium leading-relaxed">
                Bienvenido a MediBusca, tu fuente confiable de información médica en México. Explora nuestras guías sobre especialidades, enfermedades y consejos de salud, y encuentra fácilmente doctores en tu ciudad si necesitas atención especializada.
            </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* 2️⃣ Especialidades Médicas */}
        <section className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        Especialidades Médicas
                    </h2>
                    <p className="text-[#86868b] mt-3 max-w-2xl text-lg">
                        Descubre qué trata cada especialidad y cómo puede ayudarte a mantener tu salud. Haz clic para aprender más y ver doctores disponibles.
                    </p>
                </div>
                <Link href="/especialidades" className="text-[#0071e3] font-medium hover:underline flex items-center gap-1 shrink-0">
                    Ver todas <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TOP_SPECIALTIES.map((spec) => (
                    <Link 
                        key={spec} 
                        href={`/especialidad/${slugify(spec)}`}
                        className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0071e3] hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
                    >
                        <span className="font-bold text-[#1d1d1f] text-lg group-hover:text-[#0071e3] transition-colors">
                            {spec}
                        </span>
                        <span className="text-sm text-[#86868b] flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                            Ver información <ChevronRight className="w-3 h-3" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>

        {/* 3️⃣ Padecimientos y Condiciones */}
        <section className="animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Activity className="w-5 h-5" />
                        </div>
                        Padecimientos Comunes
                    </h2>
                    <p className="text-[#86868b] mt-3 max-w-2xl text-lg">
                        Aprende sobre los síntomas, causas y tratamientos de los padecimientos más frecuentes para identificar problemas de salud a tiempo.
                    </p>
                </div>
                <Link href="/padecimientos" className="text-[#0071e3] font-medium hover:underline flex items-center gap-1 shrink-0">
                    Ver índice A-Z <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {TOP_DISEASES.map((disease) => (
                    <Link 
                        key={disease} 
                        href={`/padecimientos/${slugify(disease)}`}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:bg-[#f5f5f7] transition-colors group"
                    >
                        <span className="font-medium text-[#1d1d1f]">{disease}</span>
                        <Activity className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                ))}
            </div>
        </section>

        {/* 4️⃣ Enciclopedia Médica */}
        <section className="animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-[#1d1d1f] rounded-[32px] p-8 md:p-12 text-white overflow-hidden relative">
                {/* Background decorative blob */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071e3] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold">Enciclopedia y Guías Médicas</h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Explora artículos detallados sobre enfermedades, tratamientos y prevención. Cada guía te ofrece información confiable respaldada por profesionales.
                        </p>
                    </div>
                    <Link href="/enciclopedia" className="bg-white text-[#1d1d1f] px-6 py-3 rounded-full font-medium hover:bg-slate-100 transition-colors inline-flex items-center gap-2 shrink-0">
                        Ir a la Enciclopedia <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                    {articles && articles.map((article: any) => (
                        <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full flex flex-col">
                                <span className="text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-3 block">
                                    {article.category?.split(',')[0] || 'Guía Médica'}
                                </span>
                                <h3 className="text-lg font-bold mb-3 leading-snug">
                                    {article.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                                    {article.excerpt}
                                </p>
                                <span className="text-sm font-medium text-white flex items-center gap-1 mt-auto">
                                    Leer artículo <ChevronRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    ))}
                    {(!articles || articles.length === 0) && (
                        <div className="col-span-3 text-center py-10 text-slate-400 italic">
                            Cargando artículos recientes...
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 5️⃣ City Hubs */}
        <section className="animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <MapPin className="w-5 h-5" />
                </div>
                Información Médica Localizada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POPULAR_CITIES.slice(0, 6).map((city) => {
                    return (
                        <Link 
                            key={city} 
                            href={`/doctores/${stateSlug}/${slugify(city)}`}
                            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group"
                        >
                            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">
                                {city}
                            </h3>
                            <p className="text-[#86868b] text-sm mb-4 leading-relaxed">
                                Accede a listados de doctores, clínicas y servicios de salud disponibles en {city}.
                            </p>
                            <span className="text-sm font-medium text-[#0071e3] flex items-center gap-1">
                                Ver información local <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>

        {/* 6️⃣ Health Tips & Prevention */}
        <section className="bg-blue-50 rounded-[32px] p-8 md:p-16 border border-blue-100 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#0071e3] shadow-sm">
                    <Heart className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1f]">Consejos de Salud y Prevención</h2>
                <p className="text-lg text-[#1d1d1f]/70 leading-relaxed">
                    Mantén un estilo de vida saludable con recomendaciones sobre prevención, alimentación, ejercicio y cuidado general. Esta sección complementa la información médica para que tomes decisiones informadas.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6 text-left mt-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" /> Prevención
                        </h4>
                        <p className="text-sm text-[#86868b]">Realiza chequeos anuales y mantén tu esquema de vacunación al día. La detección temprana es clave.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-amber-500" /> Señales de Alerta
                        </h4>
                        <p className="text-sm text-[#86868b]">No ignores síntomas persistentes. Si tienes dolor constante o cambios repentinos, consulta a un médico.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* 7️⃣ CTA */}
        <section className="text-center py-12 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿Buscas un especialista en tu ciudad?</h2>
            <p className="text-[#86868b] text-lg mb-8 max-w-2xl mx-auto">
                Comienza tu búsqueda ahora y encuentra doctores certificados según tu necesidad médica.
            </p>
            <Link 
                href="/buscar" 
                className="bg-[#0071e3] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0077ED] transition-all shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center gap-2"
            >
                Buscar un especialista <Search className="w-5 h-5" />
            </Link>
        </section>

      </div>
    </div>
  );
}

// Icon helper for CTA button
function Search({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    )
}
