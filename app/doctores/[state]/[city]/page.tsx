import React from 'react';
import { supabase } from '@/lib/supabase';
import { Doctor } from '@/types';
import { MapPin, Search, ShieldCheck, Phone, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_CITIES, COMMON_SPECIALTIES, STATE_TO_CITIES, SPECIALTY_DESCRIPTIONS, slugify } from '@/lib/constants';
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

const getCanonicalSpecialty = (input: string) => {
    const targetSlug = slugify(input);
    const found = COMMON_SPECIALTIES.find(s => slugify(s) === targetSlug);
    if (found) return found;
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    );
};

export async function generateMetadata({ params }: { params: { state: string, city: string } }): Promise<Metadata> {
  const { state: stateSlug, city: paramSlug } = params;
  
  // Logic to determine if this is a City Page or a Specialty Page (hijacked)
  const citiesInState = STATE_TO_CITIES[stateSlug] || [];
  const matchedCity = citiesInState.find(c => slugify(c) === paramSlug);
  const matchedSpecialty = getCanonicalSpecialty(paramSlug);
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);

  if (matchedCity) {
      return {
        title: `Doctores en ${matchedCity}, ${stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | MediBusca`,
        description: `Encuentra doctores en ${matchedCity}. Especialistas verificados, teléfonos y ubicaciones.`,
      };
  } else if (matchedSpecialty && selfNamedCity) {
      const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return {
        title: `${matchedSpecialty}s en ${stateName} | MediBusca`,
        description: `Lista de los mejores ${matchedSpecialty.toLowerCase()}s en ${stateName}. Consulta opiniones, direcciones y teléfonos.`,
      };
  }
  
  return { title: 'MediBusca' };
}

export default async function CityOrSpecialtyPage({ params }: { params: { state: string, city: string } }) {
  const { state: stateSlug, city: paramSlug } = params;
  
  const citiesInState = STATE_TO_CITIES[stateSlug];
  if (!citiesInState) {
      notFound();
  }

  // 1. Is 'paramSlug' a City?
  const cityName = citiesInState.find(c => slugify(c) === paramSlug);

  if (cityName) {
      // REDIRECT Logic: If this city is the same as the state (e.g. CDMX), redirect to state page to avoid duplicate URL
      if (slugify(cityName) === stateSlug) {
          redirect(`/doctores/${stateSlug}`);
      }

      // Render Standard City Page
      const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [cityName])
        .range(0, PAGE_SIZE - 1);
      const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];
      const displayedSpecialties = COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

      // UPDATED BREADCRUMB: Topic -> Location
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://medibusca.com" },
          { "@type": "ListItem", "position": 2, "name": "Información Médica", "item": "https://medibusca.com/buscar" },
          { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://medibusca.com/doctores/${stateSlug}/${paramSlug}` }
        ]
      };

      return (
        <div className="min-h-screen bg-[#f5f5f7]">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            
            {/* UPDATED VISUAL BREADCRUMB */}
            <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1 flex-wrap">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#86868b]">Información Médica</span>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{cityName}</span>
            </nav>

            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Doctores en {cityName}</h1>
                <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">Especialistas médicos verificados en {cityName}, {stateName}.</p>
            </div>
            <CityDoctorList initialDoctors={doctors} city={cityName} />
            <section className="bg-white py-16 border-t border-slate-200 mt-12">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">Especialidades en {cityName}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {displayedSpecialties.map((spec) => (
                            <Link key={spec} href={`/doctores/${stateSlug}/${paramSlug}/${slugify(spec)}`} className="group flex flex-col items-center justify-center p-6 bg-[#f5f5f7] rounded-2xl hover:bg-[#0071e3] hover:text-white transition-all duration-300 text-center cursor-pointer min-h-[80px]">
                                <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-white transition-colors">{spec}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
          </div>
        </div>
      );
  }

  // 2. Is 'paramSlug' a Specialty? AND Does State have a self-named City?
  // e.g. /doctores/ciudad-de-mexico/cardiologo -> Should list Cardiologists in CDMX
  const specialtyName = getCanonicalSpecialty(paramSlug);
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);

  if (specialtyName && selfNamedCity) {
      // Render Specialty Page Logic
      const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const description = SPECIALTY_DESCRIPTIONS[specialtyName] || `Encuentra a los mejores especialistas en ${specialtyName} verificados en ${stateName}.`;

      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [selfNamedCity])
        .contains('specialties', [specialtyName])
        .range(0, PAGE_SIZE - 1);
      const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

      // UPDATED BREADCRUMB: Topic -> Location
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://medibusca.com" },
          { "@type": "ListItem", "position": 2, "name": "Especialidades", "item": "https://medibusca.com/especialidades" },
          { "@type": "ListItem", "position": 3, "name": specialtyName, "item": `https://medibusca.com/especialidad/${paramSlug}` },
          { "@type": "ListItem", "position": 4, "name": selfNamedCity, "item": `https://medibusca.com/doctores/${stateSlug}/${paramSlug}` }
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
                <Link href={`/especialidad/${paramSlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{specialtyName}</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{selfNamedCity}</span>
            </nav>

            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 capitalize tracking-tight">{specialtyName}s En {stateName}</h1>
                <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">{description}</p>
            </div>
            
            <CityDoctorList initialDoctors={doctors} city={selfNamedCity} specialty={specialtyName} />

            {/* Specialty Info Section */}
            <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mt-20 animate-in fade-in slide-in-from-bottom-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Especialistas en {stateName}</h2>
                        <p className="text-lg text-[#86868b]">Encuentra {specialtyName.toLowerCase()}s confiables en la zona de {selfNamedCity}.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100"><ShieldCheck className="w-8 h-8 text-[#0071e3] mb-3" /><h4 className="font-bold text-[#1d1d1f] mb-1">Verificados</h4><p className="text-sm text-[#86868b]">Cédulas profesionales validadas.</p></div>
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100"><Phone className="w-8 h-8 text-[#0071e3] mb-3" /><h4 className="font-bold text-[#1d1d1f] mb-1">Contacto Directo</h4><p className="text-sm text-[#86868b]">Llama sin intermediarios.</p></div>
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100"><CheckCircle className="w-8 h-8 text-[#0071e3] mb-3" /><h4 className="font-bold text-[#1d1d1f] mb-1">Sin Costo</h4><p className="text-sm text-[#86868b]">Uso gratuito de la plataforma.</p></div>
                    </div>
                </div>
            </section>
          </div>
        </div>
      );
  }

  // Not found if neither city nor specialty (or invalid state context)
  notFound();
}
