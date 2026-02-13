import React from 'react';
import { supabase } from '../../lib/supabase';
import { Doctor, Article } from '../../types';
import { MapPin, Search, ShieldCheck, Activity, Building, BookOpen, ArrowRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STATE_TO_CITIES, slugify, COMMON_SPECIALTIES, ALL_DISEASES } from '../../lib/constants';
import CityDoctorList from '../../components/CityDoctorList';

const PAGE_SIZE = 8; // Reduced size for hub view
const POPULAR_SPECIALTIES_DISPLAY = 12;
const POPULAR_DISEASES_DISPLAY = 12;

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
  const stateSlug = params.state;
  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Logic: Check if State contains a City with the same slug (e.g. CDMX)
  const citiesInState = STATE_TO_CITIES[stateSlug] || [];
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);
  const title = selfNamedCity 
    ? `Información Médica en ${selfNamedCity} | MediBusca`
    : `Directorio Médico del Estado de ${stateName} | MediBusca`;

  return {
    title: title,
    description: `Guía médica completa de ${stateName}. Encuentra especialistas, clínicas, información sobre padecimientos comunes y artículos de salud locales.`,
  };
}

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateSlug = params.state;
  const citiesInState = STATE_TO_CITIES[stateSlug];

  if (!citiesInState) {
    notFound();
  }

  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);
  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const locationName = selfNamedCity || stateName;

  // Fetch a sample of doctors for the bottom section
  let doctors: Doctor[] = [];
  if (selfNamedCity) {
      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [selfNamedCity])
        .range(0, PAGE_SIZE - 1);
      doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];
  }

  // Fetch recent articles for the hub
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, category')
    .limit(3);

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, POPULAR_SPECIALTIES_DISPLAY);
  const displayedDiseases = ALL_DISEASES.slice(0, POPULAR_DISEASES_DISPLAY);

  // Schema Generation: HUB structure
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
        "item": "https://medibusca.com/buscar" 
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": locationName,
        "item": `https://medibusca.com/doctores/${stateSlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero / Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <nav className="text-sm font-medium text-[#86868b] mb-6 flex items-center animate-in fade-in slide-in-from-bottom-1">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#86868b]">Información Médica</span>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{locationName}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-2">
                Información Médica en {locationName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-3">
                Tu centro de salud local. Encuentra especialistas, tratamientos para padecimientos comunes y guías médicas relevantes para {locationName}.
            </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* Section 1: Top Specialties in Location */}
        <section className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <Stethoscope className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">Especialidades en {locationName}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {displayedSpecialties.map((spec) => (
                    <Link 
                        key={spec} 
                        // Link Logic: Specialty -> Location
                        href={`/doctores/${stateSlug}${selfNamedCity ? '' : '/'+slugify(locationName)}/${slugify(spec)}`}
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
            <div className="mt-4 text-center md:text-left">
                <Link href="/especialidades" className="text-[#0071e3] text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Ver todas las especialidades <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>

        {/* Section 2: Common Diseases in Location */}
        <section className="animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">Padecimientos comunes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDiseases.map((disease) => (
                    <Link 
                        key={disease}
                        // Link Logic: Disease -> Location (Uses Padecimientos route)
                        href={`/padecimientos/${slugify(disease)}/${selfNamedCity ? slugify(selfNamedCity) : ''}`}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#0071e3] transition-all group"
                    >
                        <span className="font-medium text-[#1d1d1f]">{disease}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                ))}
            </div>
            <div className="mt-4 text-center md:text-left">
                <Link href="/padecimientos" className="text-[#0071e3] text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Ver índice de padecimientos <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>

        {/* Section 3: Local Medical Guides / Encyclopedia */}
        <section className="animate-in fade-in slide-in-from-bottom-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">Guías médicas recomendadas</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {articles?.map((article: any) => (
                    <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wide mb-2 block">
                                    {article.category?.split(',')[0] || 'Salud'}
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

        {/* Section 4: Informational Text */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0071e3]" />
                Salud y Bienestar en {locationName}
            </h2>
            <div className="prose text-[#86868b] max-w-none columns-1 md:columns-2 gap-12">
                <p>
                    {locationName} cuenta con una amplia red de servicios de salud que abarca desde clínicas de atención primaria hasta hospitales de alta especialidad. En MediBusca, centralizamos esta información para facilitar tu acceso a la atención médica que necesitas.
                </p>
                <p>
                    Nuestro directorio incluye profesionales verificados en diversas áreas. Ya sea que busques un chequeo preventivo o tratamiento para una condición crónica, aquí encontrarás opciones confiables cerca de tu ubicación. Recuerda que la prevención es clave para mantener una buena calidad de vida.
                </p>
                <p>
                    Utiliza nuestras herramientas de búsqueda para filtrar por especialidad o padecimiento y contacta directamente a los consultorios sin intermediarios. Tu salud es lo más importante.
                </p>
            </div>
        </section>

        {/* Doctor List (Secondary Content) */}
        {selfNamedCity && (
            <div className="pt-12 border-t border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Doctores destacados en {locationName}</h3>
                    <Link href={`/doctores/${stateSlug}/${slugify(selfNamedCity)}/medico-general`} className="text-[#0071e3] text-sm font-medium hover:underline">
                        Ver médicos generales
                    </Link>
                </div>
                <CityDoctorList initialDoctors={doctors} city={selfNamedCity} />
            </div>
        )}

        {/* Other Cities in State (if not self-named city page) */}
        {!selfNamedCity && (
            <section className="pt-12 border-t border-slate-200">
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-6">Ciudades en {stateName}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {citiesInState.map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${stateSlug}/${slugify(city)}`}
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 hover:border-[#0071e3] transition-colors"
                        >
                            <MapPin className="w-4 h-4 text-[#86868b]" />
                            <span className="text-sm font-medium text-[#1d1d1f]">{city}</span>
                        </Link>
                    ))}
                </div>
            </section>
        )}

      </div>
    </div>
  );
}