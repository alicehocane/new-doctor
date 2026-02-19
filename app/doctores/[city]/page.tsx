
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight, Ambulance, Bus, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, POPULAR_SPECIALTIES as GLOBAL_POPULAR_SPECIALTIES, ALL_CITIES, COMMON_SPECIALTIES, CITY_HEALTH_DATA, POPULAR_SPECIALTIES } from '../../../lib/constants';
import CityDoctorList from '../../../components/CityDoctorList';

const PAGE_SIZE = 12;
const INITIAL_SPECIALTIES_COUNT = 12;

// --- Constants & Helpers ---

const CITY_MEDICAL_ZONES: Record<string, { title: string, description: string }[]> = {
  'acapulco': [
    { title: 'Avenida Cuauhtémoc', description: 'Corredor principal con una alta concentración de clínicas privadas y hospitales generales.' },
    { title: 'Costera Miguel Alemán', description: 'Zona con servicios médicos orientados al turismo y especialidades diversas.' }
  ],
  'aguascalientes': [
    { title: 'Norte - Prol. Zaragoza', description: 'Zona de crecimiento médico con hospitales modernos y consultorios de especialidad.' },
    { title: 'Centro Histórico', description: 'Área con presencia de clínicas tradicionales y servicios médicos de primer nivel.' }
  ]
};

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const getCanonicalCity = (slug: string) => {
  return ALL_CITIES.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getCityHealthData = (citySlug: string, cityName: string) => {
  const data = CITY_HEALTH_DATA[citySlug];
  if (data) return data;
  
  // Generic Template for cities without specific data
  return {
    overview: `La ciudad de ${cityName} cuenta con una red de servicios médicos en crecimiento, compuesta por hospitales públicos, clínicas privadas y consultorios de especialidad. Los pacientes pueden encontrar atención para diversas condiciones de salud sin necesidad de trasladarse a otras regiones.`,
    hospitals: [`Hospital General de ${cityName}`, 'Clínica de Especialidades Médicas', 'Cruz Roja Mexicana'],
    transport: `El acceso a los servicios médicos en ${cityName} es generalmente sencillo a través del transporte público local y taxis. Se recomienda verificar la disponibilidad de estacionamiento si se acude en vehículo propio a la zona centro.`
  };
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
  const cityName = getCanonicalCity(params.city);
  return {
    title: `Doctores en ${cityName} - Directorio Médico Verificado`,
    description: `Encuentra los mejores doctores y hospitales en ${cityName}. Información sobre zonas médicas, emergencias y transporte. Contacta directamente sin comisiones.`,
  };
}

// --- Server Component ---

export default async function CityPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);
  const medicalZones = CITY_MEDICAL_ZONES[citySlug] || [];
  const healthData = getCityHealthData(citySlug, cityName);

  // Fetch initial batch of doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Logic to prevent Thin Content indexing
  const isKnownCity = ALL_CITIES.includes(cityName);
  if (doctors.length === 0 && !isKnownCity) {
    notFound();
  }

  // FAQs
  const faqs = [
   {
    question: `¿Cómo puedo contactar a un doctor en ${cityName} a través de MediBusca?`,
    answer: "Es muy sencillo. Solo elige un especialista, revisa su perfil verificado y utiliza la información de contacto disponible (como teléfono o WhatsApp) para comunicarte directamente con su consultorio. No necesitas crear una cuenta ni realizar pagos por usar la plataforma."
    },
    {
    question: "¿MediBusca cobra alguna comisión o gestiona citas médicas?",
    answer: "No. MediBusca es una plataforma informativa gratuita para los pacientes. No gestionamos citas ni cobramos comisiones; la comunicación y atención se realizan directamente entre tú y el doctor."
    },
    {
    question: `¿Qué tipos de especialistas médicos puedo encontrar en ${cityName}?`,
    answer: `Puedes encontrar una amplia variedad de especialistas como cardiólogos, ginecólogos, pediatras, psicólogos y muchos más. También ofrecemos información sobre especialidades y enfermedades para ayudarte a identificar al doctor adecuado en ${cityName}.`
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
        "name": `Doctores en ${cityName}`,
        "item": `https://medibusca.com/doctores/${citySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Doctores en ${cityName} | MediBusca`,
    "description": `Encuentra los mejores doctores y especialistas en ${cityName} sin intermediarios. Revisa perfiles verificados y contacta directamente.`,
    "url": `https://medibusca.com/doctores/${citySlug}`,
    "contentLocation": {
        "@type": "City",
        "name": cityName
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
    "name": `Doctores en ${cityName}`,
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
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
            Doctores en {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Explora los mejores especialistas médicos verificados en {cityName}. Accede a información sobre especialidades y enfermedades y descubre doctores recomendados.
            </p>
        </div>

        {/* Local Healthcare Overview - Added Section */}
        <section className="bg-white rounded-[24px] p-8 border border-slate-200 mb-12 animate-in fade-in slide-in-from-bottom-3 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <HeartPulse className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-xl font-bold text-[#1d1d1f]">Infraestructura de Salud en {cityName}</h2>
            </div>
            <p className="text-[#86868b] leading-relaxed text-lg mb-0">
                {healthData.overview}
            </p>
        </section>

        {/* Client Side List & Pagination */}
        <CityDoctorList initialDoctors={doctors} city={cityName} />

      </div>

      {/* Specialties in {City} */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Especialidades médicas en {cityName}
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

      {/* Essential City Information Section - Added */}
      <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-2">Guía Médica de {cityName}</h2>
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
                        <div>
                            <p className="text-sm font-semibold text-[#1d1d1f] mb-2 uppercase tracking-wide">Hospitales Principales:</p>
                            <ul className="space-y-2">
                                {healthData.hospitals.map((hospital, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#86868b]">
                                        <Building className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                                        {hospital}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="text-xs text-[#86868b] italic pt-2">
                            *Esta lista es informativa. En caso de emergencia grave acude al hospital más cercano.
                        </p>
                    </div>
                </div>

                {/* Transport Card */}
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
            </div>
        </div>
      </section>

      {/* Medical Zones Section */}
      {medicalZones.length > 0 && (
        <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Zonas médicas destacadas en {cityName}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {medicalZones.map((zone, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#0071e3]/20 transition-colors">
                            <h3 className="font-bold text-[#1d1d1f] text-lg mb-2">{zone.title}</h3>
                            <p className="text-[#86868b] text-sm leading-relaxed">{zone.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

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
            <div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#86868b]" />
                    Explora doctores en otras ciudades populares
                </h3>
                <div className="flex flex-wrap gap-3">
                    {POPULAR_CITIES.filter(c => slugify(c) !== citySlug).map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="
                                group flex items-center gap-2 px-5 py-2.5 
                                bg-white border border-slate-200 rounded-full 
                                text-[#1d1d1f] font-medium text-sm 
                                hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-[#0071e3]/5
                                transition-all duration-300
                            "
                        >
                            {city}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Searches SEO Text Links */}
            <div>
                 <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                      Búsquedas populares en {cityName}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-3">
                      {GLOBAL_POPULAR_SPECIALTIES.slice(0, 6).flatMap((spec, idx) => (
                          <Link 
                              key={idx}
                               href={`/doctores/${citySlug}/${slugify(spec)}`}
                              className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                          >
                              <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                              <span>{spec} en {cityName}</span>
                          </Link>
                      ))}
                  </div>
            </div>
        </div>
      </section>



    </div>
  );
}
