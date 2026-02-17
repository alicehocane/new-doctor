
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, City } from '../../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight, Ambulance, Bus, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES as GLOBAL_POPULAR_SPECIALTIES } from '../../../lib/constants';
import CityDoctorList from '../../../components/CityDoctorList';

const PAGE_SIZE = 12;
const INITIAL_SPECIALTIES_COUNT = 12;

// --- Constants & Helpers ---

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
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

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const { data: cityData } = await supabase
    .from('cities')
    .select('name')
    .eq('slug', params.city)
    .single();

  const cityName = cityData?.name || params.city;

  return {
    title: `Doctores en ${cityName} - Directorio Médico Verificado`,
    description: `Encuentra los mejores doctores y hospitales en ${cityName}. Información sobre zonas médicas, emergencias y transporte. Contacta directamente sin comisiones.`,
  };
}

// --- Server Component ---

export default async function CityPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;

  // 1. Fetch City Data
  const { data: cityRecord, error: cityError } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single();

  if (cityError || !cityRecord) {
    notFound();
  }

  const city = cityRecord as City;
  
  // Parse health_data if string, else assume object
  let healthData = { overview: '', hospitals: [], transport: '' };
  if (typeof city.health_data === 'string') {
      try {
          healthData = JSON.parse(city.health_data);
      } catch (e) {
          console.error("Failed to parse health_data JSON", e);
      }
  } else if (typeof city.health_data === 'object' && city.health_data !== null) {
      healthData = city.health_data as any;
  }

  // Fetch initial batch of doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [city.name])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Fetch featured cities for footer links
  const { data: popularCitiesData } = await supabase
    .from('cities')
    .select('name, slug')
    .eq('is_featured', true)
    .neq('slug', citySlug)
    .limit(8);
  const popularCities = popularCitiesData as { name: string, slug: string }[] || [];

  // FAQs
  const faqs = [
    {
      question: `¿Cómo puedo contactar a un doctor en ${city.name} a través de MediBusca?`,
      answer: "Es muy sencillo. Solo elige un especialista, revisa su perfil verificado y utiliza el botón de 'Llamar' para comunicarte directamente con su consultorio. No necesitas crear una cuenta ni realizar pagos adicionales por el uso de la plataforma."
    },
    {
      question: "¿MediBusca cobra alguna comisión por agendar una cita?",
      answer: "No. MediBusca es una plataforma informativa 100% gratuita para los pacientes. La relación es directa entre tú y el doctor; nosotros solo facilitamos la conexión segura."
    },
    {
      question: `¿Qué tipos de especialistas médicos puedo encontrar en ${city.name}?`,
      answer: `Contamos con una extensa red que incluye cardiólogos, ginecólogos, pediatras, psicólogos y más, ubicados en las zonas médicas más importantes de ${city.name}.`
    }
  ];

  // Schema Generation
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
        "name": `Doctores en ${city.name}`,
        "item": `https://medibusca.com/doctores/${citySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Doctores en ${city.name} | MediBusca`,
    "description": `Encuentra los mejores doctores y especialistas en ${city.name} sin intermediarios. Revisa perfiles verificados y contacta directamente.`,
    "url": `https://medibusca.com/doctores/${citySlug}`,
    "contentLocation": {
        "@type": "City",
        "name": city.name
    },
    "audience": {
        "@type": "Patient",
        "geographicArea": {
            "@type": "Country",
            "name": "Mexico"
        }
    }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Doctores en ${city.name}`,
    "itemListElement": doctors.map((doc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://medibusca.com/medico/${doc.slug}`,
      "name": doc.full_name
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {doctors.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{city.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
            Doctores en {city.name}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Explora los mejores especialistas médicos verificados en {city.name}. Agenda tu cita hoy mismo.
            </p>
        </div>

        {/* Local Healthcare Overview - Populated from DB */}
        {healthData.overview && (
            <section className="bg-white rounded-[24px] p-8 border border-slate-200 mb-12 animate-in fade-in slide-in-from-bottom-3 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <HeartPulse className="w-6 h-6 text-[#0071e3]" />
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Infraestructura de Salud en {city.name}</h2>
                </div>
                <p className="text-[#86868b] leading-relaxed text-lg mb-0">
                    {healthData.overview}
                </p>
            </section>
        )}

        {/* Client Side List & Pagination */}
        <CityDoctorList initialDoctors={doctors} city={city.name} />

      </div>

      {/* Specialties in {City} */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Especialidades médicas en {city.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayedSpecialties.map((spec) => (
                    <Link 
                        key={spec} 
                        href={`/doctores/${citySlug}/${slugify(spec)}`}
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

            <div className="mt-10 text-center">
                <Link 
                    href="/especialidades"
                    className="
                        inline-flex items-center gap-2 px-6 py-2.5 
                        bg-white border border-slate-200 rounded-full 
                        text-sm font-medium text-[#1d1d1f] 
                        hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-[#0071e3]/5
                        transition-all duration-300 shadow-sm
                    "
                >
                    Ver todas las especialidades
                    <ChevronDown className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </section>

      {/* Essential City Information Section */}
      {(healthData.hospitals?.length > 0 || healthData.transport) && (
        <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-2">Guía Médica de {city.name}</h2>
                    <p className="text-[#86868b]">Información útil para pacientes y familiares</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Emergency Card */}
                    <div className="bg-white p-8 rounded-[24px] border border-slate-200/60 shadow-sm hover:border-[#0071e3]/30 transition-all">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                                <Ambulance className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1d1d1f]">Hospitales y Emergencias</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                                <span className="font-semibold text-red-800 text-sm">Emergencias Generales</span>
                                <span className="font-bold text-red-600 text-lg">911</span>
                            </div>
                            {healthData.hospitals && (
                                <div>
                                    <p className="text-sm font-semibold text-[#1d1d1f] mb-2 uppercase tracking-wide">Hospitales Principales:</p>
                                    <ul className="space-y-2">
                                        {healthData.hospitals.map((hospital: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-[#86868b]">
                                                <Building className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                                                {hospital}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-xs text-[#86868b] italic pt-2">
                                *Esta lista es informativa. En caso de emergencia grave acude al hospital más cercano.
                            </p>
                        </div>
                    </div>

                    {/* Transport Card */}
                    {healthData.transport && (
                        <div className="bg-white p-8 rounded-[24px] border border-slate-200/60 shadow-sm hover:border-[#0071e3]/30 transition-all">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center">
                                    <Bus className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1d1d1f]">Movilidad y Acceso</h3>
                            </div>
                            <p className="text-[#86868b] leading-relaxed mb-6">
                                {healthData.transport}
                            </p>
                            <div className="bg-[#f5f5f7] p-4 rounded-xl flex gap-3">
                                <Info className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                                <p className="text-sm text-[#86868b] leading-relaxed">
                                    Te recomendamos planificar tu ruta con anticipación, especialmente si tienes citas en horas pico. Muchas clínicas ofrecen estacionamiento o convenios cercanos.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
      )}

      {/* Informational Sections */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Encuentra Especialistas en {city.name} sin Costo</h2>
                </div>
                <div className="prose text-[#86868b] leading-relaxed">
                    <p className="font-medium text-[#1d1d1f] mb-3">
                        Sin intermediarios ni comisiones ocultas.
                    </p>
                    <p>
                        En MediBusca, nuestra misión es facilitar el acceso a la salud. No somos una plataforma de reservas ni cobramos por agendar. Ofrecemos un directorio verificado de doctores en {city.name} para que puedas contactarlos directamente por teléfono o a través de su perfil profesional. 
                    </p>
                    <p className="mt-4">
                        Información transparente, gratuita y actualizada para tu bienestar.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Cómo encontrar doctor en {city.name}</h2>
                </div>
                <ul className="space-y-4">
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f] Selecciona la especialidad">Selecciona la especialidad</h3>
                            <p className="text-sm text-[#86868b] mt-1">Usa nuestros filtros para encontrar cardiólogos, pediatras o cualquier especialista que necesites en {city.name}.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Revisa perfiles verificados</h3>
                            <p className="text-sm text-[#86868b] mt-1">Consulta la experiencia, cédulas profesionales y ubicaciones de consultorios de cada doctor.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Contacta directamente</h3>
                            <p className="text-sm text-[#86868b] mt-1">Llama directamente al consultorio desde MediBusca para agendar tu cita sin intermediarios.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8 justify-center">
                <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f]">Preguntas Frecuentes</h2>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#f5f5f7] p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-3">{faq.question}</h3>
                        <p className="text-[#86868b] leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SEO & Other Cities Footer */}
      <section className="bg-[#f5f5f7] py-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
            
            {/* Other Cities */}
            {popularCities.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#86868b]" />
                        Explora doctores en otras ciudades populares
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {popularCities.map((pc) => (
                            <Link 
                                key={pc.slug}
                                href={`/doctores/${pc.slug}`}
                                className="
                                    group flex items-center gap-2 px-5 py-2.5 
                                    bg-white border border-slate-200 rounded-full 
                                    text-[#1d1d1f] font-medium text-sm 
                                    hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-[#0071e3]/5
                                    transition-all duration-300
                                "
                            >
                                {pc.name}
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Searches SEO Text Links */}
            <div>
                 <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#86868b]" />
                    Búsquedas populares en {city.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    {GLOBAL_POPULAR_SPECIALTIES.map((spec, idx) => (
                        <Link 
                            key={idx}
                            href={`/doctores/${citySlug}/${slugify(spec)}`}
                            className="text-[13px] text-[#86868b] hover:text-[#0071e3] hover:underline truncate transition-colors"
                        >
                            {spec} en {city.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
