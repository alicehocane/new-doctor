import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { CheckCircle, Phone, ShieldCheck, HelpCircle, ArrowRight, Search, MapPin, UserCheck, Stethoscope, Activity, Info, BookOpen, Building2, Bus, HeartPulse} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES, ALL_CITIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS, getMetroAreaForCity, SPECIALTY_COMPARISONS, CITY_HEALTH_DATA } from '../../../../lib/constants';
import CityDoctorList from '../../../../components/CityDoctorList';


export const revalidate = 86400;
const PAGE_SIZE = 12;

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

const getCanonicalCity = (slug: string) => {
  return ALL_CITIES.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getCanonicalSpecialty = (input: string) => {
    // Try to find exact match by slug (handles dentista-odontologo -> Dentista - Odontólogo)
    const targetSlug = slugify(input);
    const found = COMMON_SPECIALTIES.find(s => slugify(s) === targetSlug);
    
    if (found) return found;

    // Fallback
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const foundFallback = COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    );
    return foundFallback || input;
};

// --- Metadata ---

export async function generateMetadata({ params }: { params: { city: string, specialty: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);

  return {
    title: `${searchTerm}s en ${cityName}`,
    description: `Encuentra información detallada sobre médicos ${searchTerm.toLowerCase()}s en ${cityName}. Explora nuestro directorio de especialistas, conoce las enfermedades que tratan y obtén su contacto directo.`,
  };
}

// --- Server Component ---

export default async function CitySpecialtyPage({ params }: { params: { city: string, specialty: string } }) {
  const citySlug = params.city;
  const specialtySlug = params.specialty;
  
  const cityName = getCanonicalCity(citySlug);
  const decodedSpecialty = decodeURIComponent(specialtySlug);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en ${cityName}.`;
  
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || [];
  const conditionText = conditions.slice(0, 2).join(', ').toLowerCase() || 'tus síntomas';


  // NEW: Get the dynamic comparison text
  const specialtyComparison = SPECIALTY_COMPARISONS[searchTerm] || null;

  // NEW: Get the metro cities for the filter
  const metroCities = getMetroAreaForCity(cityName);
  // NEW: Extract local health data
  const cityHealthInfo = CITY_HEALTH_DATA[citySlug] || null;

  // Fetch Data
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .contains('specialties', [searchTerm])
    .order('has_phone', { ascending: false }) // 1. Doctors with phones first
     // .order('full_name', { ascending: true })  // 2. Alphabetical secondary sort
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors as Doctor[] || [];

  // Logic to prevent Thin Content indexing
  // If no doctors are found AND the specialty is not in our known list (meaning it's likely gibberish or a typo), return 404.
  const isKnownSpecialty = COMMON_SPECIALTIES.includes(searchTerm);
  if (doctors.length === 0 && !isKnownSpecialty) {
    notFound();
  }


  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `¿Cuánto cuesta una consulta con un ${searchTerm} en ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `El precio de una consulta con un ${searchTerm} en ${cityName} varía según su experiencia y la zona. Generalmente, una valoración inicial oscila entre $800 y $2,000 MXN. Te sugerimos contactar directamente al especialista para confirmar sus honorarios.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Cómo encuentro un ${searchTerm} cerca de mí en ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Revisa los perfiles verificados de arriba para ver la ubicación exacta del consultorio. Muchos de nuestros especialistas en ${cityName} también ofrecen videoconsulta si prefieres no desplazarte.`
        }
      }
    ]
  };

  if (specialtyComparison) {
      faqSchema.mainEntity.push({
          "@type": "Question",
          "name": specialtyComparison.title.replace('?', ` en ${cityName}?`),
          "acceptedAnswer": {
              "@type": "Answer",
              "text": `${specialtyComparison.text} Muchos de nuestros especialistas en ${cityName} trabajan en conjunto para ofrecer un tratamiento integral.`
          }
      });
  }

  if (cityHealthInfo && cityHealthInfo.hospitals.length > 0) {
      faqSchema.mainEntity.push({
          "@type": "Question",
          "name": `¿Cuáles son los principales hospitales y clínicas en ${cityName}?`,
          "acceptedAnswer": {
              "@type": "Answer",
              "text": `Algunos de los principales centros de salud en ${cityName} incluyen: ${cityHealthInfo.hospitals.join(', ')}. Recuerda consultar el perfil del ${searchTerm} para ver en qué clínica u hospital específico atiende.`
          }
      });
  }

  // Schema
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
        "name": `${searchTerm} en ${cityName}`,
        "item": `https://medibusca.com/doctores/${citySlug}/${specialtySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${searchTerm}s en ${cityName} | MediBusca`,
    "description": description,
    "url": `https://medibusca.com/doctores/${citySlug}/${specialtySlug}`,
    "specialty": {
        "@type": "MedicalSpecialty",
        "name": searchTerm
    },
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
    "name": `Lista de ${searchTerm}s en ${cityName}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {doctors.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/especialidad/${specialtySlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{searchTerm}</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 capitalize tracking-tight">
            {searchTerm}s En {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            {description}
            </p>
        </div>


        {/* NEW: Metro Area Sub-filters */}
        {metroCities && metroCities.length > 1 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-sm font-medium text-[#86868b] mb-3 md:mb-4 uppercase tracking-wider">
              Filtrar por zona metropolitana
            </h3>
            
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:flex-wrap gap-2 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
              {metroCities.map((metroCity) => {
                const isActive = metroCity === cityName;
                return (
                  <Link 
                    key={metroCity}
                    href={`/doctores/${slugify(metroCity)}/${specialtySlug}`}
                    className={`
                      shrink-0 snap-start inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-[#0071e3] text-white shadow-sm' 
                        : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3]'
                      }
                    `}
                  >
                    {metroCity}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Doctor Grid (Interactive Component) */}
        <CityDoctorList initialDoctors={doctors} city={cityName} specialty={searchTerm} />

        {/* NEW: Dynamic Informational Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mt-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* 1. How to Choose */}
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-bold text-[#1d1d1f]">Cómo elegir el {searchTerm} adecuado para ti</h2>
               <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                 Encontrar atención médica no debería ser difícil. En <span className="text-[#1d1d1f] font-medium">{cityName}</span>, contamos con expertos en {searchTerm} listos para ayudarte. Ya sea que busques tratamiento para {conditionText}, o una revisión general, aquí puedes ver perfiles verificados de forma gratuita.
               </p>
            </div>

            {/* NEW: Guía Local de Salud (Dynamic City Data) */}
            {cityHealthInfo && (
                <div>
                    <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center flex items-center justify-center gap-2">
                        <MapPin className="w-6 h-6 text-[#0071e3]" />
                        Guía de Salud Local en {cityName}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Panorama */}
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-[#1d1d1f] mb-2">Panorama Médico</h4>
                            <p className="text-[#86868b] text-sm leading-relaxed">{cityHealthInfo.overview}</p>
                        </div>

                        {/* Hospitales */}
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-[#1d1d1f] mb-2">Hospitales de Referencia</h4>
                            <ul className="text-[#86868b] text-sm leading-relaxed space-y-1.5 list-disc list-inside">
                                {cityHealthInfo.hospitals.map((hospital, i) => (
                                    <li key={i} className="truncate" title={hospital}>{hospital}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Transporte */}
                        <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                <Bus className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-[#1d1d1f] mb-2">Movilidad para tus Citas</h4>
                            <p className="text-[#86868b] text-sm leading-relaxed">{cityHealthInfo.transport}</p>
                        </div>
                    </div>
                </div>
            )}

            

            

          </div>
        </section>


        <section>
            {/* 3. Localized FAQs */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center flex items-center justify-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                    Preguntas Frecuentes sobre {searchTerm} en {cityName}
                </h3>
                
                <div className="grid grid-cols-1 gap-4">

                    {/* Dynamic Specialty Comparison FAQ */}
                    {specialtyComparison && (
                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                            <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">
                                {specialtyComparison.title.replace('?', ` en ${cityName}?`)}
                            </h4>
                            <p className="text-[#86868b] leading-relaxed">
                                {specialtyComparison.text} Muchos de nuestros especialistas en <span className="font-medium text-[#1d1d1f]">{cityName}</span> trabajan en conjunto para ofrecer atención integral.
                            </p>
                        </div>
                    )}

                    {/* Localized Location FAQ */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Cómo encuentro un {searchTerm} cerca de mí en {cityName}?</h4>
                        <p className="text-[#86868b] leading-relaxed">
                            Revisa los perfiles de arriba para ver la ubicación exacta del consultorio. Muchos de nuestros especialistas en {cityName} también ofrecen la opción de videoconsulta si prefieres no desplazarte.
                        </p>
                    </div>

                    {/* Localized Price FAQ */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Cuánto cuesta una consulta con un {searchTerm} en {cityName}?</h4>
                        <p className="text-[#86868b] leading-relaxed">
                            El precio de una consulta en {cityName} varía según la experiencia y la zona del consultorio. Generalmente, una valoración inicial oscila entre $800 y $2,000 MXN. Te recomendamos contactar directamente al especialista para confirmar sus honorarios.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        {/* Nearby Cities Section */}
        <section className="mt-12 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                También disponible en ciudades cercanas
            </h2>
            <p className="text-lg text-[#86868b] mb-8 max-w-3xl">
                Si no encuentras lo que buscas en <span className="text-[#1d1d1f] font-medium">{cityName}</span>, 
                explora <span className="text-[#1d1d1f] font-medium">{searchTerm}s</span> en otras ciudades.
            </p>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES
                    .filter(c => slugify(c) !== citySlug)
                    .slice(0, 8)
                    .map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}/${specialtySlug}`}
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

        

        {/* 3️⃣ Section: Padecimientos Comunes */}
        {conditions.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 mt-16 pt-12 border-t border-[#d2d2d7]/30">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <Activity className="w-7 h-7 text-[#0071e3]" />
                        Problemas de Salud Tratados por un {searchTerm}
                    </h2>
                    <p className="text-lg text-[#86868b] max-w-3xl">
                        Conoce los síntomas, prevención y tratamiento recomendado para cada condición antes de consultar a un especialista en {cityName}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conditions.slice(0, 9).map((condition) => (
                        <Link 
                            key={condition}
                            // Link Logic: /padecimientos/[disease]/[state]/[city]
                            // Usually padecimientos routes are /padecimientos/[slug] or /padecimientos/[slug]/[city-slug]
                            // The requested structure was /padecimientos/[disease]/[state]/[city], but typical pattern in this app has been /padecimientos/[disease]/[city] (deducing state from city)
                            // We will follow existing pattern: /padecimientos/[disease-slug]/[city-slug]
                            // Note: State slug is usually implicit in city lookups or handled via redirection in the disease [city] page.
                            href={`/enfermedad/${slugify(condition)}/${citySlug}`}
                            className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-[#0071e3] hover:shadow-sm transition-all group"
                        >
                            <span className="font-medium text-[#1d1d1f]">{condition}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                        </Link>
                    ))}
                </div>
            </section>
        )}


        {/* Other Specialties in {City} */}
        <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30 pb-12">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                Otras especialidades en {cityName}
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
                {POPULAR_SPECIALTIES
                    .filter(s => s !== searchTerm)
                    .slice(0, 7)
                    .map((spec, idx) => (
                        <Link 
                            key={idx}
                            href={`/doctores/${citySlug}/${slugify(spec)}`}
                            className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                        >
                            <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                            <span>{spec} en {cityName}</span>
                        </Link>
                    ))
                }
            </div>
        </section>


        {/* 5️⃣ Section: Recursos Adicionales */}
        <section className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-6 mt-16 pt-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Más Información Médica</h2>
            <p className="text-[#86868b] mb-8 max-w-2xl mx-auto text-lg">
                Aprovecha nuestros recursos educativos para tomar decisiones informadas sobre tu salud.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={`/especialidad/${searchTerm}`} className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" /> Guía de {searchTerm}
                </Link>
                <Link href="/enfermedad" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> Padecimientos Comunes
                </Link>
                <Link href="/enciclopedia" className="bg-[#0071e3] text-white px-6 py-4 rounded-full font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    <Info className="w-5 h-5" /> Enciclopedia Médica
                </Link>
            </div>
        </section>



      </div>
    </div>
  );
}