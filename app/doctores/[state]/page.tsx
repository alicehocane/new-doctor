import React from 'react';
import { supabase } from '@/lib/supabase';
import { Doctor } from '@/types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STATE_TO_CITIES, slugify, COMMON_SPECIALTIES } from '@/lib/constants';
import CityDoctorList from '@/components/CityDoctorList';

const PAGE_SIZE = 12;
const INITIAL_SPECIALTIES_COUNT = 12;

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
  return {
    title: `Doctores en ${stateName} | MediBusca`,
    description: `Encuentra los mejores doctores y especialistas en el estado de ${stateName}. Revisa perfiles verificados y contacta directamente.`,
  };
}

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateSlug = params.state;
  const citiesInState = STATE_TO_CITIES[stateSlug];

  if (!citiesInState) {
    notFound();
  }

  // Logic: Check if State contains a City with the same slug (e.g. CDMX, Aguascalientes)
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);
  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch doctors if it's a self-named city state
  let doctors: Doctor[] = [];
  if (selfNamedCity) {
      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [selfNamedCity])
        .range(0, PAGE_SIZE - 1);
      doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];
  }

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

  // Schema Generation - UPDATED to use "Información Médica" as parent
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
        "item": "https://medibusca.com/buscar" // Linking to Search as the closest parent for "Medical Info"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": stateName,
        "item": `https://medibusca.com/doctores/${stateSlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#86868b]">Información Médica</span>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
            Doctores en {stateName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            {selfNamedCity 
                ? `Explora los mejores especialistas médicos en ${selfNamedCity} y sus alrededores.` 
                : `Explora las principales ciudades de ${stateName} para encontrar al especialista que necesitas.`}
            </p>
        </div>

        {/* If Self Named City (e.g. CDMX), show Doctor List */}
        {selfNamedCity && (
            <div className="mb-16">
                <CityDoctorList initialDoctors={doctors} city={selfNamedCity} />
                
                {/* Specialties Grid for the main city */}
                <div className="mt-12 pt-12 border-t border-slate-200">
                    <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6">Especialidades en {selfNamedCity}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayedSpecialties.map((spec) => (
                            <Link 
                                key={spec} 
                                // Here we link to /[state]/[specialty] which is handled by /[state]/[city]/page.tsx logic
                                href={`/doctores/${stateSlug}/${slugify(spec)}`}
                                className="
                                group flex flex-col items-center justify-center p-4
                                bg-white border border-slate-200 rounded-xl hover:border-[#0071e3] hover:text-[#0071e3]
                                transition-all duration-300 text-center cursor-pointer
                                "
                            >
                                <span className="text-sm font-medium">{spec}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Cities/Boroughs Grid */}
        <div className={selfNamedCity ? "pt-12 border-t border-slate-200" : ""}>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">
                {selfNamedCity ? `Otras zonas en ${stateName}` : `Ciudades en ${stateName}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
                {citiesInState
                    .filter(c => slugify(c) !== stateSlug) // Exclude the self-named city from this list to avoid redundancy
                    .map((city) => (
                    <Link 
                        key={city}
                        href={`/doctores/${stateSlug}/${slugify(city)}`}
                        className="
                            group flex items-center justify-between p-6 
                            bg-white border border-slate-200 rounded-2xl
                            hover:border-[#0071e3] hover:shadow-md transition-all duration-300
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-[#1d1d1f] text-lg">{city}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                ))}
            </div>
        </div>

        {/* Informational Section */}
        <section className="mt-20 pt-12 border-t border-slate-200/60">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Salud en {stateName}</h2>
                <p className="text-[#86868b] leading-relaxed text-lg">
                    MediBusca te conecta con una red verificada de profesionales de la salud en todo el estado de {stateName}. 
                    Nuestra misión es facilitar tu acceso a la atención médica sin intermediarios.
                </p>
            </div>
        </section>

      </div>
    </div>
  );
}