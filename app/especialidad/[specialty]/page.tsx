
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { Stethoscope, Search, BookOpen, AlertCircle, Info, ShieldCheck, CheckCircle, Activity, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS, slugify, getStateForCity } from '../../../lib/constants';
import SpecialtyDoctorList from '../../../components/SpecialtyDoctorList';

const PAGE_SIZE = 12;

const getCanonicalSpecialty = (input: string) => {
    // Try to find exact match by slug
    const targetSlug = slugify(input);
    const found = COMMON_SPECIALTIES.find(s => slugify(s) === targetSlug);
    
    if (found) return found;

    // Fallback: match normalized string
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const foundFallback = COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    );
    return foundFallback || input;
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

// --- Metadata ---

export async function generateMetadata({ params }: { params: { specialty: string } }): Promise<Metadata> {
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  return {
    title: `Todo sobre ${searchTerm} - Funciones, Padecimientos y Especialistas | MediBusca`,
    description: `Descubre qué hace un ${searchTerm}, qué enfermedades trata y consejos de prevención. Encuentra a los mejores especialistas verificados en México.`,
  };
}

// --- Server Component ---

export default async function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en México.`;
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || ['Diagnóstico general', 'Tratamiento especializado', 'Seguimiento de padecimientos', 'Consultas preventivas', 'Evaluación de síntomas', 'Manejo de enfermedades crónicas'];

  // 1. Fetch Initial Data Server-Side
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('specialties', [searchTerm])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Logic to prevent Thin Content indexing
  // If no doctors are found AND the specialty is not in our known list, return 404.
  const isKnownSpecialty = COMMON_SPECIALTIES.includes(searchTerm);
  if (doctors.length === 0 && !isKnownSpecialty) {
    notFound();
  }

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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": searchTerm,
        "item": `https://medibusca.com/especialidad/${params.specialty}`
      }
    ]
  };

  const medicalSpecialtySchema = {
    "@context": "https://schema.org",
    "@type": "MedicalSpecialty",
    "name": searchTerm,
    "description": description,
    "url": `https://medibusca.com/especialidad/${params.specialty}`
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Todo sobre ${searchTerm}`,
    "description": `Guía completa sobre la especialidad de ${searchTerm}: funciones, enfermedades que trata y prevención.`,
    "audience": {
        "@type": "Patient",
        "geographicArea": {
            "@type": "Country",
            "name": "Mexico"
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSpecialtySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* 1️⃣ Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            
            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center justify-center animate-in fade-in slide-in-from-bottom-1">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] capitalize">{searchTerm}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-2">
                Todo sobre {searchTerm}
            </h1>
            <p className="text-xl text-[#86868b] leading-relaxed max-w-3xl mx-auto font-normal animate-in fade-in slide-in-from-bottom-3">
                La {searchTerm.toLowerCase()} es una especialidad médica fundamental. En esta página encontrarás información sobre los servicios que brinda un {searchTerm.toLowerCase()}, los padecimientos más comunes que trata, consejos de prevención y cómo encontrar especialistas en tu ciudad.
            </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* 2️⃣ Section: ¿Qué Hace un Especialista? */}
        <section className="animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-6 flex-col md:flex-row">
                    <div className="w-16 h-16 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿Qué hace un {searchTerm}?</h2>
                        <h3 className="text-lg font-semibold text-[#86868b] mb-4 uppercase tracking-wide text-[13px]">Funciones y Alcance de la Especialidad</h3>
                        <p className="text-lg text-[#1d1d1f]/80 leading-relaxed mb-6">
                            {description} Los especialistas en esta área se encargan de la prevención, diagnóstico y tratamiento de enfermedades específicas, ofreciendo un seguimiento integral para mejorar la calidad de vida del paciente.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Consultas de diagnóstico y control
                            </li>
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Detección temprana de enfermedades
                            </li>
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Tratamiento y seguimiento especializado
                            </li>
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Asesoramiento preventivo
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* 3️⃣ Section: Padecimientos Comunes */}
        <section className="animate-in fade-in slide-in-from-bottom-5">
             <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-3 flex items-center gap-3 justify-center md:justify-start">
                    <Activity className="w-7 h-7 text-[#0071e3]" />
                    Problemas de Salud que Atiende
                </h2>
                <p className="text-lg text-[#86868b]">Los {searchTerm.toLowerCase()}s diagnostican y tratan una amplia variedad de condiciones, entre las más frecuentes:</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conditions.map((cond, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#0071e3] transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#0071e3] shrink-0"></div>
                        <span className="font-medium text-[#1d1d1f]">{cond}</span>
                    </div>
                ))}
                {/* Generic placeholders if generic fallback is used */}
                {conditions.length < 4 && (
                    <div className="flex items-center gap-3 p-4 bg-[#f5f5f7] border border-transparent rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#d2d2d7] shrink-0"></div>
                        <span className="text-[#86868b]">Otras condiciones relacionadas</span>
                    </div>
                )}
             </div>
        </section>

        {/* 4️⃣ Section: Prevención y Cuidados */}
        <section className="bg-blue-50 rounded-[32px] p-8 md:p-12 border border-blue-100 animate-in fade-in slide-in-from-bottom-6">
            <div className="max-w-3xl">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-[#0071e3]" />
                    Prevención y Cuidados
                </h2>
                <p className="text-lg text-[#1d1d1f]/80 leading-relaxed mb-8">
                    La prevención es clave para la salud relacionada con {searchTerm.toLowerCase()}. Seguir recomendaciones básicas puede evitar complicaciones futuras.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#0071e3]" /> Revisiones Periódicas
                        </h4>
                        <p className="text-sm text-[#86868b] leading-relaxed">
                            Se recomienda visitar al {searchTerm.toLowerCase()} al menos una vez al año para chequeos de rutina, incluso si no hay síntomas.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#0071e3]" /> Estilo de Vida
                        </h4>
                        <p className="text-sm text-[#86868b] leading-relaxed">
                            Mantener hábitos saludables, una alimentación equilibrada y actividad física regular son fundamentales para apoyar el tratamiento.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 5️⃣ Section: Local Doctor Listings */}
        <section className="pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-7">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra {searchTerm}s en tu Ciudad</h2>
                <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
                    Una vez informado sobre la especialidad, puedes consultar {searchTerm.toLowerCase()}s en tu ciudad. Esta sección conecta a los usuarios con especialistas locales verificados.
                </p>
            </div>
            
            <SpecialtyDoctorList initialDoctors={doctors} specialty={searchTerm} />
            
            {/* City Links */}
            <div className="mt-12 text-center">
                <p className="text-sm font-semibold text-[#86868b] uppercase tracking-wide mb-4">Búsquedas Frecuentes</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {POPULAR_CITIES.slice(0, 8).map((city) => {
                        const stateSlug = getStateForCity(city);
                        return (
                            <Link 
                                key={city}
                                href={`/doctores/${stateSlug}/${slugify(city)}/${slugify(searchTerm)}`}
                                className="
                                    flex items-center gap-2 px-5 py-3 
                                    bg-white border border-slate-200 rounded-full 
                                    text-[14px] font-medium text-[#1d1d1f] 
                                    hover:border-[#0071e3] hover:text-[#0071e3] hover:shadow-sm transition-all
                                "
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                {searchTerm} en {city}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* 6️⃣ Section: Recursos Adicionales */}
        <section className="bg-[#f5f5f7] rounded-3xl p-8 md:p-12 text-center border border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Más Información y Guías Médicas</h2>
            <p className="text-[#86868b] mb-8 max-w-2xl mx-auto text-lg">
                Para profundizar en temas específicos, consulta nuestras guías médicas y artículos de enciclopedia que detallan síntomas, prevención y tratamientos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/padecimientos" className="bg-white border border-slate-200 px-8 py-4 rounded-full font-medium text-[#1d1d1f] hover:shadow-md transition-all flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-[#0071e3]" /> Guía de Padecimientos
                </Link>
                <Link href="/enciclopedia" className="bg-[#0071e3] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0077ED] transition-all flex items-center gap-2 text-lg shadow-lg shadow-blue-500/20">
                    <BookOpen className="w-5 h-5" /> Enciclopedia Médica
                </Link>
            </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 animate-in fade-in slide-in-from-bottom-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900/80">
                <strong>Aviso Legal:</strong> El contenido mostrado es únicamente informativo y educativo. No sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busque el consejo de su médico u otro proveedor de salud calificado.
            </div>
        </div>

      </div>
    </div>
  );
}
