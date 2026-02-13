import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, MapPin, Search, Phone, Stethoscope, BookOpen, HeartPulse, User, HelpCircle } from 'lucide-react';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES, SPECIALTY_DESCRIPTIONS, slugify, getStateForCity } from '../../lib/constants';
import SpecialtiesList from '../../components/SpecialtiesList';
import { Metadata } from 'next';
import { supabase } from '../../lib/supabase';

const FEATURED_SPECIALTIES = [
  'Ginecólogo', 
  'Cardiólogo', 
  'Pediatra', 
  'Dermatólogo', 
  'Dentista - Odontólogo', 
  'Traumatólogo',
  'Oftalmólogo',
  'Psicólogo'
];

const CITY_HUBS = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla'
];

export const metadata: Metadata = {
  title: "Especialidades Médicas en México - Directorio Completo | MediBusca",
  description: "Explora las diferentes especialidades médicas disponibles y aprende qué trata cada una. Encuentra especialistas en Ginecología, Cardiología, Pediatría y más en tu ciudad.",
};

export default async function SpecialtiesIndexPage() {
  
  // Fetch a few articles for the "Related Guides" section
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, category')
    .limit(3)
    .order('published_at', { ascending: false });

  // Merge and Deduplicate Specialties for Client List
  const allSpecialties = Array.from(new Set([...POPULAR_SPECIALTIES, ...COMMON_SPECIALTIES]));

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
        "name": "Especialidades",
        "item": "https://medibusca.com/especialidades"
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Especialidades Médicas Más Consultadas",
    "itemListElement": FEATURED_SPECIALTIES.map((spec, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": spec,
      "description": SPECIALTY_DESCRIPTIONS[spec] || `Especialista en ${spec}`,
      "url": `https://medibusca.com/especialidad/${slugify(spec)}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* 1️⃣ Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
                Especialidades Médicas en México
            </h1>
            <p className="text-xl text-[#86868b] max-w-3xl mx-auto font-normal leading-relaxed">
                Explora las diferentes especialidades médicas disponibles y aprende qué trata cada una. Esta información te ayudará a entender mejor tu salud y a encontrar el especialista adecuado en tu ciudad.
            </p>
        </div>

        {/* 2️⃣ Featured Specialties Grid */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-[#0071e3]" />
                Especialidades Más Consultadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURED_SPECIALTIES.map((spec) => (
                    <Link 
                        key={spec}
                        href={`/especialidad/${slugify(spec)}`}
                        className="
                            group flex flex-col p-6 bg-white border border-slate-200 rounded-[24px]
                            hover:border-[#0071e3] hover:shadow-lg transition-all duration-300
                            cursor-pointer h-full relative overflow-hidden
                        "
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0071e3]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        
                        <h3 className="font-bold text-lg text-[#1d1d1f] mb-3 group-hover:text-[#0071e3] transition-colors relative z-10">
                            {spec}
                        </h3>
                        <p className="text-sm text-[#86868b] leading-relaxed flex-1 relative z-10">
                            {SPECIALTY_DESCRIPTIONS[spec] || `Encuentra a los mejores especialistas en ${spec} verificados en México.`}
                        </p>
                        <div className="mt-4 flex items-center text-sm font-medium text-[#0071e3] relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            Ver doctores <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* 3️⃣ How to Choose (Educational) */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mb-20 shadow-sm animate-in fade-in slide-in-from-bottom-5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿Cómo Saber Qué Especialidad Necesitas?</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Entender qué hace cada especialista te ayuda a tomar decisiones informadas sobre tu salud. Antes de buscar un doctor, revisa esta guía para identificar la especialidad correcta según tus síntomas o necesidades médicas.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Link href="/especialidad/ginecologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 mt-1">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Ginecólogo</h4>
                            <p className="text-sm text-[#86868b]">Para salud femenina, embarazo y control hormonal.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/cardiologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-1">
                            <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Cardiólogo</h4>
                            <p className="text-sm text-[#86868b]">Para problemas del corazón, presión arterial y dolor de pecho.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/pediatra" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Pediatra</h4>
                            <p className="text-sm text-[#86868b]">Para el cuidado infantil, vacunas y enfermedades en niños.</p>
                        </div>
                    </Link>
                    
                    <Link href="/especialidad/dermatologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-1">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Dermatólogo</h4>
                            <p className="text-sm text-[#86868b]">Para acné, manchas, caída del cabello y problemas de la piel.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/traumatologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Traumatólogo</h4>
                            <p className="text-sm text-[#86868b]">Para fracturas, dolor de huesos, articulaciones y lesiones deportivas.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/medico-general" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-1">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Médico General</h4>
                            <p className="text-sm text-[#86868b]">Para chequeos anuales, malestares generales y primera opinión.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>

        {/* 4️⃣ Local Bridge */}
        <section className="mb-20 border-t border-slate-200 pt-16 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra Especialistas en Tu Ciudad</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Una vez que conozcas la especialidad que necesitas, explora nuestros listados de doctores en tu ciudad para recibir atención cercana y confiable.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CITY_HUBS.map((city) => {
                    const stateSlug = getStateForCity(city);
                    return (
                        <Link 
                            key={city}
                            href={`/doctores/${stateSlug}/${slugify(city)}`}
                            className="
                                group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl
                                hover:border-[#0071e3] hover:shadow-md transition-all
                            "
                        >
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-[#1d1d1f]">{city}</span>
                        </Link>
                    );
                })}
            </div>
        </section>

        {/* 5️⃣ Related Guides */}
        {articles && articles.length > 0 && (
            <section className="mb-20 animate-in fade-in slide-in-from-bottom-6">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-[#0071e3]" />
                    Aprende Más Sobre Cada Especialidad
                </h2>
                <p className="text-lg text-[#86868b] mb-8 max-w-3xl leading-relaxed">
                    Cada especialidad también cuenta con artículos y guías que te ayudan a comprender los problemas de salud que tratan y los tratamientos recomendados.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {articles.map((article: any) => (
                        <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all h-full flex flex-col justify-between group">
                                <div>
                                    <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wide mb-2 block">
                                        {article.category?.split(',')[0] || 'Guía Médica'}
                                    </span>
                                    <h3 className="font-bold text-lg text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">{article.title}</h3>
                                </div>
                                <span className="text-sm font-medium text-[#86868b] flex items-center gap-1 mt-4">
                                    Leer artículo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* 6️⃣ Full Search List */}
        <section className="pt-16 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">Explora todas las especialidades</h2>
            <SpecialtiesList specialties={allSpecialties} />
        </section>

      </div>
    </div>
  );
}
