
import React from 'react';
import Link from 'next/link';
import { MapPin, Stethoscope, ChevronRight, Activity, ArrowUpRight, Check, Search, Heart, BookOpen, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { Metadata } from 'next';
import { ALL_DISEASES, slugify } from '../lib/constants';
import HomeSearch from '../components/HomeSearch';
import { supabase } from '../lib/supabase';

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla'
];

export const metadata: Metadata = {
  title: "MediBusca - Encuentra información médica confiable en México",
  description: "Tu guía de salud en México. Encuentra doctores verificados, clínicas, información sobre padecimientos y artículos médicos confiables.",
};

export default async function HomePage() {
  
  // Fetch Featured Articles
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .limit(3)
    .order('published_at', { ascending: false });

  // Schema Markup
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MediBusca",
    "url": "https://medibusca.com",
    "logo": "https://medibusca.com/icon-512.png",
    "description": "Plataforma informativa de salud y directorio médico en México.",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contacto@medibusca.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MediBusca",
    "url": "https://medibusca.com",
    "description": "Encuentra información médica confiable en México. Doctores, padecimientos y guías de salud.",
    "publisher": {
        "@type": "Organization",
        "name": "MediBusca",
        "logo": {
            "@type": "ImageObject",
            "url": "https://medibusca.com/icon-512.png"
        }
    }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 md:py-28 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#1d1d1f] leading-[1.1]">
            Encuentra información médica <br className="hidden md:block" /> confiable en México.
          </h1>
          <p className="text-lg md:text-2xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed">
            Tu guía completa de doctores, padecimientos y salud.
          </p>
          
          {/* Client Side Search Component */}
          <HomeSearch />
          
        </div>
      </section>

      {/* Hub Navigation Cards */}
      <section className="py-8 px-4 md:px-6 w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/especialidades" className="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1d1d1f] text-lg">Especialidades</h3>
                        <p className="text-sm text-[#86868b]">Explora por área médica</p>
                    </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
            </Link>

            <Link href="/padecimientos" className="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1d1d1f] text-lg">Padecimientos</h3>
                        <p className="text-sm text-[#86868b]">Busca por enfermedad</p>
                    </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
            </Link>

            <Link href="/enciclopedia" className="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1d1d1f] text-lg">Enciclopedia</h3>
                        <p className="text-sm text-[#86868b]">Guías y artículos</p>
                    </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-colors" />
            </Link>
        </div>
      </section>

      {/* Cities Section - Horizontal Snap Scroll on Mobile */}
      <section className="py-12 md:py-24 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 md:mb-12 tracking-tight">
            Ciudades destacadas.
          </h2>
          
          {/* Scroll Container */}
          <div className="
            flex md:grid md:grid-cols-4 gap-4 
            overflow-x-auto snap-x snap-mandatory no-scrollbar 
            -mx-4 px-4 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {FEATURED_CITIES.map((city) => {
              const citySlug = slugify(city);
              return (
                <Link 
                  key={city} 
                  // UPDATED: Using direct city routing (no state)
                  href={`/doctores/${citySlug}`}
                  className="
                    snap-center shrink-0 w-[260px] md:w-auto
                    group p-6 md:p-8 bg-[#f5f5f7] rounded-[24px] 
                    transition-all duration-300 hover:bg-[#ededf0] hover:scale-[1.02] 
                    flex flex-col justify-between h-[180px] md:h-[220px] cursor-pointer
                  "
                >
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-[#0071e3] mb-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] leading-tight">{city}</h3>
                    <div className="flex items-center gap-1 text-[#0071e3] text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Ver doctores <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {articles && articles.length > 0 && (
        <section className="py-12 md:py-24 bg-[#f5f5f7] w-full">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                    Guías Médicas Destacadas
                    </h2>
                    <Link href="/enciclopedia" className="text-[#0071e3] hover:underline text-[15px] font-medium hidden md:block">
                    Ver todas
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {articles.map((article: any) => (
                        <Link key={article.id} href={`/enciclopedia/${article.slug}`}>
                            <div className="group h-full bg-white rounded-[24px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col border border-slate-200/50">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] text-xs font-bold uppercase tracking-wider rounded-full">
                                        {article.category?.split(',')[0] || 'Salud'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-[#1d1d1f] mb-3 group-hover:text-[#0071e3] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-[#86868b] text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center text-[#0071e3] font-medium text-sm mt-auto">
                                    Leer artículo <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="mt-8 md:hidden text-center">
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium text-sm">
                    Ir a la Enciclopedia
                    </Link>
                </div>
            </div>
        </section>
      )}

      {/* Specialties Section - Bento Grid style */}
      <section className="py-12 md:py-24 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Explora por <span className="text-[#6e6e73]">especialidad.</span>
            </h2>
            <Link href="/especialidades" className="text-[#0071e3] hover:underline text-[15px] font-medium hidden md:block">
               Ver todas
            </Link>
          </div>
          
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="
             flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4
             overflow-x-auto snap-x snap-mandatory no-scrollbar
             -mx-4 px-4 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {['Dentista - Odontólogo', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista' , 'Cirujano general', 'Radiólogo', 'Ortopedista', 'Traumatólogo', 'Oftalmólogo', 'Cardiólogo'].map((spec) => (
              <Link 
                key={spec} 
                href={`/especialidad/${slugify(spec)}`}
                className="
                  snap-center shrink-0 w-[140px] md:w-auto aspect-square
                  flex flex-col items-center justify-center gap-3
                  p-4 bg-[#f5f5f7] rounded-[24px] 
                  hover:bg-[#ededf0] hover:scale-[1.02] transition-all duration-300 cursor-pointer
                "
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] shadow-sm">
                   <Stethoscope className="w-5 h-5 md:w-6 md:h-6 stroke-1" />
                </div>
                <span className="font-semibold text-[#1d1d1f] text-sm md:text-[15px] text-center leading-tight">{spec}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-4 md:hidden text-center">
            <Link href="/especialidades" className="text-[#0071e3] font-medium text-sm">
              Ver todas las especialidades
            </Link>
          </div>
        </div>
      </section>

      {/* Common Diseases/Symptoms Section */}
      <section className="py-12 md:py-24 bg-[#f5f5f7] w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 md:mb-12 tracking-tight">
            Busca por <span className="text-[#6e6e73]">enfermedad o síntoma.</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {ALL_DISEASES.slice(0, 36).map((disease) => (
               <Link 
                  key={disease}
                  href={`/padecimientos/${slugify(disease)}`}
                  className="
                    group flex items-center justify-between p-4 px-6
                    bg-white rounded-xl md:rounded-2xl hover:bg-[#0071e3] hover:text-white
                    transition-all duration-300 cursor-pointer border border-transparent shadow-sm hover:shadow-md
                  "
               >
                 <span className="font-medium text-sm md:text-[15px] truncate">{disease}</span>
                 <ArrowUpRight className="w-4 h-4 text-[#6e6e73] group-hover:text-white transition-colors shrink-0" />
               </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/padecimientos" className="text-[#0071e3] hover:underline text-[15px] font-medium">
               Ver todos los padecimientos
            </Link>
          </div>
        </div>
      </section>

      {/* SEO / Informational Content Section */}
      <section className="py-12 md:py-24 bg-white w-full border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-10 md:space-y-20">
          
          {/* Main Intro */}
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
              Por qué elegir MediBusca
            </h2>
            <p className="text-base md:text-lg text-[#6e6e73] leading-relaxed max-w-3xl mx-auto">
              MediBusca es una plataforma informativa de salud que ayuda a las personas a encontrar médicos, especialidades y contenido médico claro. Nuestro objetivo es facilitar el primer paso cuando surge una duda de salud.
            </p>
            
            <div className="bg-[#f5f5f7] rounded-2xl p-6 inline-block text-left max-w-2xl mx-4 md:mx-0">
                <p className="text-[#6e6e73] text-sm font-medium leading-relaxed">
                  <span className="text-[#1d1d1f] font-bold block mb-1">Nota Importante:</span>
                  No ofrecemos tratamientos médicos ni consultas en línea. MediBusca existe para orientar, informar y conectar a los pacientes con profesionales de la salud reales.
                </p>
            </div>
          </div>

          {/* Grid 1: What It Does & Who It's For */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Qué hace MediBusca</h3>
              </div>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                Buscar un médico puede ser confuso. Muchas personas no saben qué especialista necesitan o por dónde empezar. MediBusca organiza la información médica para que el proceso sea más simple y claro.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Buscar médicos por ciudad
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Explorar especialidades médicas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Conocer enfermedades y síntomas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Contactar médicos cuando el contacto está disponible
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Pensado para pacientes y familias</h3>
              </div>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                MediBusca está creado para personas comunes. No necesitas conocimientos médicos para usar la plataforma. Explicamos los temas de salud con palabras sencillas.
              </p>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                Organizamos a los médicos por especialidad para ayudarte a entender quién puede atender tu caso. Nuestro objetivo es ahorrar tiempo y reducir la confusión cuando aparece un problema de salud.
              </p>
            </div>
          </div>

          {/* Footer Disclaimer & Links */}
          <div className="bg-[#1d1d1f] text-white rounded-3xl p-8 md:p-12 text-center space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Aviso médico importante</h3>
              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
                La información publicada en MediBusca es solo educativa. No sustituye la consulta, el diagnóstico ni el tratamiento médico profesional. Siempre consulta a un médico calificado ante cualquier problema de salud. En caso de emergencia, llama a los servicios de emergencia de tu país.
              </p>
            </div>
            
            <div className="border-t border-slate-700 pt-8">
              <h4 className="text-lg font-bold mb-6">Empieza a explorar MediBusca</h4>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Link href="/buscar" className="bg-white text-[#1d1d1f] px-6 py-3 rounded-full font-semibold hover:bg-slate-200 transition-colors">
                  Busca médicos por ciudad
                </Link>
                <Link href="/especialidades" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Explora especialidades
                </Link>
                <Link href="/padecimientos" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Infórmate sobre enfermedades
                </Link>
              </div>
              <p className="text-slate-400 text-sm mt-8">
                MediBusca te ayuda a tomar decisiones informadas sobre tu salud.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
