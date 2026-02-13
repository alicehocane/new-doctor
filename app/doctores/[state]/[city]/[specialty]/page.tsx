import React from 'react';
import { supabase } from '../../../../../lib/supabase';
import { Doctor } from '../../../../../types';
import { CheckCircle, Phone, ShieldCheck, HelpCircle, ArrowRight, Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES, SPECIALTY_DESCRIPTIONS, STATE_TO_CITIES, slugify } from '../../../../../lib/constants';
import CityDoctorList from '../../../../../components/CityDoctorList';

const PAGE_SIZE = 12;

const getCanonicalSpecialty = (input: string) => {
    const targetSlug = slugify(input);
    const found = COMMON_SPECIALTIES.find(s => slugify(s) === targetSlug);
    if (found) return found;
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    ) || input;
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export async function generateMetadata({ params }: { params: { state: string, city: string, specialty: string } }): Promise<Metadata> {
  const cityName = params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName = params.state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);

  return {
    title: `${searchTerm}s en ${cityName}, ${stateName} | MediBusca`,
    description: `Lista de los mejores ${searchTerm.toLowerCase()}s en ${cityName}, ${stateName}. Consulta opiniones, direcciones y teléfonos.`,
  };
}

export default async function CitySpecialtyPage({ params }: { params: { state: string, city: string, specialty: string } }) {
  const { state: stateSlug, city: citySlug, specialty: specialtySlug } = params;
  
  // Validate State/City
  const citiesInState = STATE_TO_CITIES[stateSlug];
  if (!citiesInState) notFound();
  
  const cityName = citiesInState.find(c => slugify(c) === citySlug);
  if (!cityName) notFound();

  // REDIRECT Logic: If citySlug == stateSlug, redirect to flattened URL
  // e.g. /doctores/ciudad-de-mexico/ciudad-de-mexico/cardiologo -> /doctores/ciudad-de-mexico/cardiologo
  if (citySlug === stateSlug) {
      redirect(`/doctores/${stateSlug}/${specialtySlug}`);
  }

  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const decodedSpecialty = decodeURIComponent(specialtySlug);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en ${cityName}.`;
  
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .contains('specialties', [searchTerm])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  const isKnownSpecialty = COMMON_SPECIALTIES.includes(searchTerm);
  if (doctors.length === 0 && !isKnownSpecialty) {
    notFound();
  }

  // UPDATED BREADCRUMB: Topic -> Location
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": searchTerm,
        "item": `https://medibusca.com/especialidad/${specialtySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": cityName,
        "item": `https://medibusca.com/doctores/${stateSlug}/${citySlug}/${specialtySlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* UPDATED VISUAL BREADCRUMB */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/especialidad/${specialtySlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{searchTerm}</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 capitalize tracking-tight">
            {searchTerm}s En {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            {description}
            </p>
        </div>

        <CityDoctorList initialDoctors={doctors} city={cityName} specialty={searchTerm} />

        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                También disponible en ciudades cercanas
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
                {citiesInState
                    .filter(c => slugify(c) !== citySlug)
                    .slice(0, 8)
                    .map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${stateSlug}/${slugify(city)}/${specialtySlug}`}
                            className="
                                inline-flex items-center gap-2.5 px-6 py-4
                                bg-[#e8e8ed] rounded-full
                                text-[#1d1d1f] font-medium text-[15px]
                                hover:bg-[#d2d2d7] hover:shadow-sm transition-all group
                            "
                        >
                        {searchTerm} en {city}
                        </Link>
                    ))
                }
            </div>
        </section>
      </div>
    </div>
  );
}