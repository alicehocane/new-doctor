import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_CITIES, COMMON_SPECIALTIES, STATE_TO_CITIES, slugify } from '../../../../lib/constants';
import CityDoctorList from '../../../../components/CityDoctorList';

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

export async function generateMetadata({ params }: { params: { state: string, city: string } }): Promise<Metadata> {
  const cityName = params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName = params.state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `Doctores en ${cityName}, ${stateName} | MediBusca`,
    description: `Encuentra doctores en ${cityName}, ${stateName}. Especialistas verificados, teléfonos y ubicaciones.`,
  };
}

export default async function CityPage({ params }: { params: { state: string, city: string } }) {
  const citySlug = params.city;
  const stateSlug = params.state;
  
  // Validate State/City relationship
  const citiesInState = STATE_TO_CITIES[stateSlug];
  if (!citiesInState) {
      notFound();
  }
  
  // Find real city name from list (case sensitive matching usually needed for DB)
  const cityName = citiesInState.find(c => slugify(c) === citySlug);
  
  if (!cityName) {
      notFound();
  }

  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch doctors for the city
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

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
        "name": stateName,
        "item": `https://medibusca.com/doctores/${stateSlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cityName,
        "item": `https://medibusca.com/doctores/${stateSlug}/${citySlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1 flex-wrap">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/doctores/${stateSlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{stateName}</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
            Doctores en {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Especialistas médicos verificados en {cityName}, {stateName}. Agenda tu cita directamente.
            </p>
        </div>

        {/* Client Side List */}
        <CityDoctorList initialDoctors={doctors} city={cityName} />

      </div>

      {/* Specialties in City */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Especialidades en {cityName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayedSpecialties.map((spec) => (
                    <Link 
                        key={spec} 
                        href={`/doctores/${stateSlug}/${citySlug}/${slugify(spec)}`}
                        className="
                           group flex flex-col items-center justify-center p-6
                           bg-[#f5f5f7] rounded-2xl hover:bg-[#0071e3] hover:text-white
                           transition-all duration-300 text-center cursor-pointer min-h-[80px]
                        "
                    >
                        <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-white transition-colors">
                            {spec}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}