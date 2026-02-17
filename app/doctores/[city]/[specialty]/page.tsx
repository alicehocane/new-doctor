
import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor, Specialty, City } from '../../../../types';
import { CheckCircle, Phone, ShieldCheck, HelpCircle, ArrowRight, Search, MapPin, Info, Scale } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SPECIALTY_CONDITIONS } from '../../../../lib/constants';
import CityDoctorList from '../../../../components/CityDoctorList';

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

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

// --- Metadata ---

export async function generateMetadata({ params }: { params: { city: string, specialty: string } }): Promise<Metadata> {
  // 1. Fetch City Name from DB
  const { data: cityRecord } = await supabase
    .from('cities')
    .select('name')
    .eq('slug', params.city)
    .single();

  const cityName = cityRecord?.name || params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // 2. Fetch Specialty Name from DB
  const { data: specialtyRecord } = await supabase
    .from('specialties')
    .select('name, description')
    .eq('slug', params.specialty)
    .single();

  // Fallback name generation if not in DB
  let searchTerm = '';
  let metaDesc = '';

  if (specialtyRecord) {
      searchTerm = specialtyRecord.name;
      // Use DB description if available, otherwise generic
      metaDesc = specialtyRecord.description || `Lista de los mejores ${searchTerm.toLowerCase()}s en ${cityName}. Consulta opiniones, direcciones y teléfonos de consultorios verificados.`;
  } else {
      const decoded = decodeURIComponent(params.specialty);
      // Simple capitalization fallback
      searchTerm = decoded.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      metaDesc = `Encuentra a los mejores especialistas en ${searchTerm} en ${cityName}. Directorio médico verificado con contacto directo.`;
  }

  return {
    title: `${searchTerm}s en ${cityName}`,
    description: metaDesc,
  };
}

// --- Server Component ---

export default async function CitySpecialtyPage({ params }: { params: { city: string, specialty: string } }) {
  const citySlug = params.city;
  const specialtySlug = params.specialty;
  
  // 1. Parallel Data Fetching
  const cityPromise = supabase.from('cities').select('*').eq('slug', citySlug).single();
  const specialtyPromise = supabase.from('specialties').select('*').eq('slug', specialtySlug).single();
  
  // Fetch featured cities for footer links
  const featuredCitiesPromise = supabase
    .from('cities')
    .select('name, slug')
    .eq('is_featured', true)
    .neq('slug', citySlug)
    .limit(8);

  // Fetch popular specialties for footer links (Using is_popular from DB)
  const popularSpecialtiesPromise = supabase
    .from('specialties')
    .select('name, slug')
    .eq('is_popular', true)
    .neq('slug', specialtySlug)
    .limit(8);

  const [cityRes, specialtyRes, featuredCitiesRes, popularSpecialtiesRes] = await Promise.all([
    cityPromise, 
    specialtyPromise, 
    featuredCitiesPromise,
    popularSpecialtiesPromise
  ]);

  // Handle City 404
  if (!cityRes.data) {
    notFound();
  }

  const cityRecord = cityRes.data as City;
  const cityName = cityRecord.name;
  
  const specialty = specialtyRes.data as Specialty | null;
  const featuredCities = featuredCitiesRes.data || [];
  const otherSpecialties = popularSpecialtiesRes.data || [];

  // Logic for Specialty Text/Fallback
  let searchTerm = '';
  let description = '';
  let comparison: { title: string, text: string } | null = null;

  if (specialty) {
      // SCENARIO A: Specialty exists in DB
      searchTerm = specialty.name;
      description = specialty.description || `Encuentra a los mejores especialistas en ${searchTerm} verificados en ${cityName}.`;
      
      try {
        if (typeof specialty.comparison_guide === 'object' && specialty.comparison_guide !== null) {
            comparison = specialty.comparison_guide as { title: string, text: string };
        } else if (typeof specialty.comparison_guide === 'string') {
            comparison = JSON.parse(specialty.comparison_guide);
        }
      } catch (e) { console.error("Error parsing comparison guide", e); }

  } else {
      // SCENARIO B: Specialty NOT in DB (Dynamic Fallback)
      const decodedSpecialty = decodeURIComponent(specialtySlug);
      // Try to clean up slug to name
      const normalized = decodedSpecialty.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      searchTerm = normalized;
      // Generic description since we don't have the DB record
      description = `Encuentra a los mejores especialistas en ${searchTerm} verificados en ${cityName}. Consulta la ubicación del consultorio, teléfonos y agenda tu cita directamente.`;
  }
  
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || [];
  const conditionText = conditions.slice(0, 2).join(', ').toLowerCase() || 'tus síntomas';

  // 2. Fetch Doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .contains('specialties', [searchTerm])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Logic to prevent Thin Content indexing (404 Logic)
  // We return 404 ONLY if:
  // 1. The specialty is NOT in the database (so we don't have content for it)
  // 2. AND we found NO doctors for this search query.
  // This allows "hidden" specialties that exist on doctor profiles but not in the specialties table to still render a list.
  if (!specialty && doctors.length === 0) {
    notFound();
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

        {/* Doctor Grid (Interactive Component) */}
        <CityDoctorList initialDoctors={doctors} city={cityName} specialty={searchTerm} />

        {/* NEW: Dynamic Informational Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mt-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* 1. How to Choose */}
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-bold text-[#1d1d1f]">Cómo elegir el {searchTerm} adecuado para ti</h2>
               <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                 Encontrar atención médica no debería ser difícil. En <span className="text-[#1d1d1f] font-medium">{cityName}</span>, contamos con expertos en {searchTerm} listos para ayudarte. Ya sea que busques tratamiento para {conditionText}, o una revisión general, aquí puedes ver perfiles verificados de forma gratuita.
               </p>
            </div>

            {/* Comparison Guide (If available) */}
            {comparison && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">{comparison.title}</h3>
                        <p className="text-indigo-900/80 leading-relaxed">
                            {comparison.text}
                        </p>
                    </div>
                </div>
            )}

            {/* 2. What you should know */}
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">Lo que debes saber</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2">Sin costos ocultos</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">MediBusca no te cobra nada por buscar o contactar a un especialista.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2">Contacto directo</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">Hablas directamente con el consultorio del doctor para agendar tu cita.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2">Perfiles reales</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">Verificamos que los especialistas sean profesionales certificados en {cityName}.</p>
                    </div>
                </div>
            </div>

            {/* 3. FAQs */}
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">Preguntas Frecuentes sobre {searchTerm}</h3>
                <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2">¿Qué hace un {searchTerm}?</h4>
                        <p className="text-[#86868b] leading-relaxed">{description}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2">¿Cuánto dura una consulta?</h4>
                        <p className="text-[#86868b] leading-relaxed">Por lo general, una consulta dura entre 30 y 60 minutos. Esto puede variar dependiendo del especialista que elijas en {cityName}.</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                        <h4 className="font-bold text-[#1d1d1f] mb-2">¿Cómo contacto a un doctor en MediBusca?</h4>
                        <p className="text-[#86868b] leading-relaxed">Solo haz clic en el botón "Llamar" o "Ver Perfil". Te conectarás de inmediato con el consultorio para pedir informes o agendar.</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 mt-8">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900/80">
                    <strong>Aviso Importante:</strong> La información aquí presentada es de carácter educativo. Para diagnóstico y tratamiento de {searchTerm}, siempre consulta directamente a un profesional de la salud.
                </div>
            </div>

          </div>
        </section>

        {/* Nearby Cities Section */}
        {featuredCities.length > 0 && (
            <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                    También disponible en ciudades cercanas
                </h2>
                <p className="text-lg text-[#86868b] mb-8 max-w-3xl">
                    Si no encuentras lo que buscas en <span className="text-[#1d1d1f] font-medium">{cityName}</span>, 
                    explora <span className="text-[#1d1d1f] font-medium">{searchTerm}s</span> en otras ciudades.
                </p>
                
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {featuredCities.map((city) => (
                            <Link 
                                key={city.slug}
                                href={`/doctores/${city.slug}/${specialtySlug}`}
                                className="
                                    inline-flex items-center gap-2.5 px-6 py-4
                                    bg-[#e8e8ed] rounded-full
                                    text-[#1d1d1f] font-medium text-[15px]
                                    hover:bg-[#d2d2d7] hover:shadow-sm transition-all group
                                "
                            >
                            {searchTerm} en {city.name}
                            </Link>
                        ))
                    }
                </div>
            </section>
        )}

        {/* Other Specialties in {City} */}
        {otherSpecialties.length > 0 && (
            <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30 pb-12">
                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                    Otras especialidades en {cityName}
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-3">
                    {otherSpecialties.map((spec, idx) => (
                            <Link 
                                key={idx}
                                href={`/doctores/${citySlug}/${spec.slug}`}
                                className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                            >
                                <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                                <span>{spec.name} en {cityName}</span>
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
