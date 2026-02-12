import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { Stethoscope, Search, BookOpen, AlertCircle, Info, ShieldCheck } from 'lucide-react';
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
    title: `${searchTerm}s en México | MediBusca`,
    description: `Encuentra a los mejores ${searchTerm.toLowerCase()}s verificados en México. Información sobre padecimientos, tratamientos y contacto directo.`,
  };
}

// --- Server Component ---

export default async function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en México.`;
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || ['Diagnóstico general', 'Tratamiento especializado', 'Seguimiento de padecimientos', 'Consultas preventivas'];

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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Doctores especialistas en ${searchTerm}`,
    "description": `Lista de ${searchTerm}s verificados en México.`,
    "itemListElement": doctors.map((doc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://medibusca.com/medico/${doc.slug}`,
      "name": doc.full_name
    }))
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSpecialtySchema) }} />
      {doctors.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{searchTerm}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 capitalize tracking-tight">
            {searchTerm}s En México
          </h1>
          <div className="space-y-1">
             <p className="text-xl md:text-2xl text-[#86868b] font-normal">
               Encuentra al mejor {searchTerm}.
             </p>
             <p className="text-[#86868b] text-base md:text-lg max-w-3xl font-normal leading-relaxed">
               {description}
             </p>
          </div>
        </div>

        {/* Interactive Doctor List */}
        <SpecialtyDoctorList initialDoctors={doctors} specialty={searchTerm} />

        {/* NEW: SEO / Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-20 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Intro */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        Doctores y Especialistas en {searchTerm} | MediBusca
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto">
                        La {searchTerm.toLowerCase()} se enfoca en el diagnóstico y manejo de condiciones en este campo médico. MediBusca lista doctores que ejercen de manera independiente, permitiendo a los pacientes conectar directamente con especialistas para recibir orientación y tratamiento.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* What they do */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">¿Qué hace un {searchTerm}?</h3>
                        </div>
                        <p className="text-[#86868b] leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Conditions Managed */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Padecimientos Tratados</h3>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {conditions.map((condition, i) => (
                                <li key={i} className="flex items-center gap-2 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                    {condition}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* When to consult & Find Doctors */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            <Info className="w-5 h-5 text-[#86868b]" />
                            ¿Cuándo consultar a un especialista?
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                            Los pacientes deben considerar contactar a un especialista si los síntomas persisten, si requieren una segunda opinión experta o si han sido derivados por un médico general para un tratamiento específico.
                        </p>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             <Stethoscope className="w-5 h-5 text-[#86868b]" />
                             Encuentra especialistas en {searchTerm}
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                             Explora los perfiles de doctores en MediBusca, revisa la información de sus clínicas y conecta directamente con ellos para agendar una consulta o resolver tus dudas.
                        </p>
                     </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900/80">
                        <strong>Aviso Legal:</strong> El contenido mostrado es únicamente informativo y no sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busque el consejo de su médico u otro proveedor de salud calificado.
                    </div>
                </div>

            </div>
        </section>

        {/* SEO Cities Links */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Encuentra {searchTerm}s en las principales ciudades de México
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES
                    .slice(0, 8) 
                    .map((city) => {
                        const stateSlug = getStateForCity(city);
                        return (
                            <Link 
                                key={city}
                                href={`/doctores/${stateSlug}/${slugify(city)}/${slugify(searchTerm)}`}
                                className="
                                    inline-flex items-center gap-2.5 px-6 py-4
                                    bg-[#e8e8ed] rounded-full
                                    text-[#1d1d1f] font-medium text-[15px]
                                    hover:bg-[#d2d2d7] transition-all group
                                "
                            >
                                {searchTerm} en {city}
                            </Link>
                        );
                    })
                }
            </div>
        </section>

        {/* Other Popular Specialties in Cities */}
        <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30 pb-12">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                Búsquedas populares en otras ciudades
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
                {POPULAR_CITIES.slice(0, 6).flatMap((city, cIdx) => 
                    POPULAR_SPECIALTIES.slice((cIdx % 3), (cIdx % 3) + 3).map(spec => ({
                        city,
                        spec
                    }))
                )
                .slice(0, 10) 
                .map((item, idx) => {
                    const stateSlug = getStateForCity(item.city);
                    return (
                        <Link 
                            key={idx}
                            href={`/doctores/${stateSlug}/${slugify(item.city)}/${slugify(item.spec)}`}
                            className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                        >
                            <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                            <span>{item.spec} en {item.city}</span>
                        </Link>
                    );
                })}
            </div>
        </section>

      </div>
    </div>
  );
}