
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, ShieldCheck, Activity, BookOpen, Stethoscope, ArrowRight, CheckCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_CITIES, COMMON_SPECIALTIES, ALL_DISEASES, slugify, ALL_CITIES as CITY_LIST } from '../../../lib/constants';
import CityDoctorList from '../../../components/CityDoctorList';

const PAGE_SIZE = 8;
const POPULAR_SPECIALTIES_DISPLAY = 12;
const POPULAR_DISEASES_DISPLAY = 12;

const getCanonicalCity = (slug: string) => {
  return CITY_LIST.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  return {
    title: `Información Médica en ${cityName} | MediBusca`,
    description: `Centro de información de salud de ${cityName}. Encuentra especialistas, guías de enfermedades y servicios médicos locales.`,
  };
}

export default async function CityHubPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);

  // Validate if city exists in our known list to prevent loose URLs
  if (!CITY_LIST.some(c => slugify(c) === citySlug)) {
      notFound();
  }

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, POPULAR_SPECIALTIES_DISPLAY);
  const displayedDiseases = ALL_DISEASES.slice(0, POPULAR_DISEASES_DISPLAY);

  // Fetch doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .range(0, PAGE_SIZE - 1);
  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Fetch articles
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, category')
    .limit(3);

  // Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://medibusca.com" },
      { "@type": "ListItem", "position": 2, "name": "Información Médica", "item": "https://medibusca.com/informacion-medica" },
      { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://medibusca.com/doctores/${citySlug}` }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <nav className="text-sm font-medium text-[#86868b] mb-6 flex items-center animate-in fade-in slide-in-from-bottom-1 flex-wrap">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href="/informacion-medica" className="hover:text-[#0071e3] transition-colors">Información Médica</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{cityName}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-2">
                Información Médica en {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-3">
                Bienvenido a la sección de Información Médica para {cityName}. Aquí encontrarás todo lo necesario para entender las especialidades médicas más relevantes, los padecimientos más comunes y guías completas de salud.
            </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Especialidades */}
        <section className="animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1d1d1f]">Especialidades Médicas Destacadas</h2>
                </div>
                <p className="text-[#86868b] max-w-3xl text-lg">
                    Explora cada especialidad para aprender qué trata, síntomas comunes y cuándo buscar atención profesional.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {displayedSpecialties.map((spec) => (
                    <Link 
                        key={spec}
                        href={`/doctores/${citySlug}/${slugify(spec)}`}
                        className="
                            flex flex-col items-center justify-center p-4 text-center
                            bg-white border border-slate-200 rounded-xl
                            hover:border-[#0071e3] hover:shadow-md transition-all group
                        "
                    >
                        <span className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#0071e3]">{spec}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-6 text-center md:text-left">
                <Link href="/especialidades" className="text-[#0071e3] text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Ver todas las especialidades <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>

        {/* Padecimientos */}
        <section className="animate-in fade-in slide-in-from-bottom-5">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1d1d1f]">Condiciones y Enfermedades Frecuentes</h2>
                </div>
                <p className="text-[#86868b] max-w-3xl text-lg">
                    Conoce los padecimientos más frecuentes y accede a información confiable sobre sus síntomas, prevención y tratamiento.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDiseases.map((disease) => (
                    <Link 
                        key={disease}
                        href={`/padecimientos/${slugify(disease)}/${citySlug}`}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#0071e3] transition-all group"
                    >
                        <span className="font-medium text-[#1d1d1f]">{disease}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                ))}
            </div>
        </section>

        {/* Guías */}
        <section className="animate-in fade-in slide-in-from-bottom-6">
             <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1d1d1f]">Guías de Salud y Artículos Informativos</h2>
                </div>
                <p className="text-[#86868b] max-w-3xl text-lg">
                    Profundiza en guías médicas completas para comprender mejor cada condición y tratamiento.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {articles?.map((article: any) => (
                    <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wide mb-2 block">
                                    {article.category?.split(',')[0] || 'Guía Médica'}
                                </span>
                                <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">{article.title}</h3>
                            </div>
                            <span className="text-sm text-[#86868b] flex items-center gap-1 mt-4">
                                Leer guía <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </Link>
                ))}
                <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Enciclopedia Médica</h3>
                    <p className="text-sm text-[#86868b] mb-4">Accede a cientos de artículos verificados.</p>
                    <Link href="/enciclopedia" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-[#1d1d1f] shadow-sm hover:text-[#0071e3] transition-colors">
                        Explorar todo
                    </Link>
                </div>
            </div>
        </section>

        {/* Consejos Locales */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 animate-in fade-in slide-in-from-bottom-7">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-[#0071e3]" />
                        Prevención y Bienestar en {cityName}
                    </h2>
                    <p className="text-[#86868b] leading-relaxed text-lg">
                        Encuentra recomendaciones sobre hábitos saludables, prevención de enfermedades y cuidados especiales según tu ciudad.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-[#1d1d1f] text-sm md:text-base">Ubica clínicas y hospitales de referencia en {cityName}.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-[#1d1d1f] text-sm md:text-base">Infórmate sobre programas de salud locales.</span>
                        </li>
                    </ul>
                </div>
                
                <div className="flex-1 space-y-6 bg-[#f5f5f7] p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-3">
                        <UserCheck className="w-6 h-6 text-[#0071e3]" />
                        Descubre Profesionales de la Salud
                    </h2>
                    <p className="text-[#86868b] leading-relaxed">
                        Tras informarte, puedes consultar a especialistas locales en {cityName}.
                    </p>
                    <div className="flex flex-col gap-3">
                        {['Dentista - Odontólogo', 'Ginecólogo', 'Pediatra'].map(spec => (
                            <Link 
                                key={spec}
                                href={`/doctores/${citySlug}/${slugify(spec)}`}
                                className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0071e3] transition-all group"
                            >
                                <span className="font-medium text-[#1d1d1f]">{spec}s en {cityName}</span>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3]" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Doctores List */}
        {doctors.length > 0 && (
            <div className="pt-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Doctores verificados recientes en {cityName}</h3>
                </div>
                <CityDoctorList initialDoctors={doctors} city={cityName} />
            </div>
        )}

      </div>
    </div>
  );
}
