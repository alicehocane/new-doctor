
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { CheckCircle, ArrowRight, MapPin, Activity, Stethoscope, BookOpen, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { COMMON_SPECIALTIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS, STATE_TO_CITIES, slugify, getStateForCity, ALL_CITIES } from '../../../lib/constants';
import CityDoctorList from '../../../components/CityDoctorList';

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

const getCanonicalCity = (slug: string) => {
  return ALL_CITIES.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export async function generateMetadata({ params }: { params: { city: string, specialty: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);

  return {
    title: `${searchTerm}s en ${cityName} - Directorio y Guía | MediBusca`,
    description: `Encuentra ${searchTerm.toLowerCase()}s en ${cityName}. Información sobre qué tratan, padecimientos comunes y lista de especialistas verificados en ${cityName}.`,
  };
}

export default async function CitySpecialtyPage({ params }: { params: { city: string, specialty: string } }) {
  const { city: citySlug, specialty: specialtySlug } = params;
  
  const cityName = getCanonicalCity(citySlug);
  
  // Validate if city exists in our known list (optional, but good for SEO to avoid infinite generated pages)
  const isKnownCity = ALL_CITIES.some(c => slugify(c) === citySlug);
  if (!isKnownCity) {
      // If strict validation is required, uncomment:
      // notFound();
  }

  // Derive state for "Nearby Cities" logic
  const stateSlug = getStateForCity(cityName);
  const citiesInState = STATE_TO_CITIES[stateSlug] || [];

  const decodedSpecialty = decodeURIComponent(specialtySlug);
  const specialtyName = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[specialtyName] || `Especialistas dedicados al diagnóstico y tratamiento de condiciones relacionadas con ${specialtyName}.`;
  const relatedConditions = SPECIALTY_CONDITIONS[specialtyName] || [];

  // Fetch Doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .contains('specialties', [specialtyName])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  const isKnownSpecialty = COMMON_SPECIALTIES.includes(specialtyName);
  if (doctors.length === 0 && !isKnownSpecialty) {
    notFound();
  }

  // BREADCRUMB: Inicio > Especialidades > [Specialty] > [City]
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://medibusca.com" },
      { "@type": "ListItem", "position": 2, "name": "Especialidades", "item": "https://medibusca.com/especialidades" },
      { "@type": "ListItem", "position": 3, "name": specialtyName, "item": `https://medibusca.com/especialidad/${specialtySlug}` },
      { "@type": "ListItem", "position": 4, "name": cityName, "item": `https://medibusca.com/doctores/${citySlug}/${specialtySlug}` }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${specialtyName}s en ${cityName}`,
    "description": `Guía completa sobre ${specialtyName}s en ${cityName}. Funciones, enfermedades que tratan y especialistas disponibles.`,
    "specialty": {
        "@type": "MedicalSpecialty",
        "name": specialtyName
    },
    "contentLocation": {
        "@type": "City",
        "name": cityName
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            
            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href={`/especialidad/${specialtySlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{specialtyName}</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{cityName}</span>
            </nav>

            <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                    {specialtyName}s en {cityName}
                </h1>
                <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
                    Aquí encontrarás información sobre {specialtyName.toLowerCase()}s en {cityName}, junto con consejos y recursos médicos. Antes de elegir un especialista, te recomendamos aprender sobre la especialidad y los padecimientos que trata.
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* 2️⃣ Section: Sobre la Especialidad */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0">
                    <Stethoscope className="w-8 h-8" />
                </div>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-3">¿Qué hace un {specialtyName}?</h2>
                        <p className="text-lg text-[#86868b] leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-[#1d1d1f] font-medium">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>Consultas de diagnóstico, control y seguimiento especializado.</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#1d1d1f] font-medium">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>Detección temprana y prevención de enfermedades del área.</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#1d1d1f] font-medium">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>Tratamientos médicos o intervenciones según sea necesario.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* 3️⃣ Section: Padecimientos Comunes */}
        {relatedConditions.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <Activity className="w-7 h-7 text-[#0071e3]" />
                        Problemas de Salud que Atiende
                    </h2>
                    <p className="text-lg text-[#86868b] max-w-3xl">
                        Conoce los síntomas, prevención y tratamiento recomendado para cada condición antes de consultar a un especialista en {cityName}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedConditions.slice(0, 9).map((condition) => (
                        <Link 
                            key={condition}
                            href={`/padecimientos/${slugify(condition)}/${citySlug}`}
                            className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-[#0071e3] hover:shadow-sm transition-all group"
                        >
                            <span className="font-medium text-[#1d1d1f]">{condition}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* 4️⃣ Section: Doctor Listings */}
        <section className="pt-8 animate-in fade-in slide-in-from-bottom-5">
            <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4">
                    {specialtyName}s Disponibles en {cityName}
                </h2>
                <p className="text-lg text-[#86868b] leading-relaxed max-w-4xl">
                    A continuación, encontrarás {specialtyName.toLowerCase()}s certificados en {cityName}. Infórmate primero sobre la especialidad y sus padecimientos, luego elige un especialista que se adapte a tus necesidades.
                </p>
            </div>

            <CityDoctorList initialDoctors={doctors} city={cityName} specialty={specialtyName} />
        </section>

        {/* 5️⃣ Section: Recursos Adicionales */}
        <section className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-6">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Más Información Médica</h2>
            <p className="text-[#86868b] mb-8 max-w-2xl mx-auto text-lg">
                Aprovecha nuestros recursos educativos para tomar decisiones informadas sobre tu salud.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={`/especialidad/${specialtySlug}`} className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" /> Guía de {specialtyName}
                </Link>
                <Link href="/padecimientos" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> Padecimientos Comunes
                </Link>
                <Link href="/enciclopedia" className="bg-[#0071e3] text-white px-6 py-4 rounded-full font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    <Info className="w-5 h-5" /> Enciclopedia Médica
                </Link>
            </div>
        </section>

        {/* Nearby Cities Links - Using Derived State */}
        {citiesInState.length > 1 && (
            <section className="pt-12 border-t border-slate-200/60 mt-8">
                <h3 className="text-sm font-bold text-[#86868b] uppercase tracking-wide mb-6">
                    {specialtyName}s en ciudades cercanas
                </h3>
                <div className="flex flex-wrap gap-3">
                    {citiesInState
                        .filter(c => slugify(c) !== citySlug)
                        .slice(0, 10)
                        .map((city) => (
                            <Link 
                                key={city}
                                href={`/doctores/${slugify(city)}/${specialtySlug}`}
                                className="text-sm text-[#0071e3] hover:underline bg-white px-3 py-1.5 rounded-md border border-slate-100"
                            >
                                {city}
                            </Link>
                        ))
                    }
                </div>
            </section>
        )}

      </div>
    </div>
  );
}
