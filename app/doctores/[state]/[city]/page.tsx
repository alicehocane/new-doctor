
import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, Building, BookOpen, Stethoscope, Activity, ArrowRight, CheckCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { ALL_CITIES, COMMON_SPECIALTIES, STATE_TO_CITIES, ALL_DISEASES, SPECIALTY_DESCRIPTIONS, slugify } from '../../../../lib/constants';
import CityDoctorList from '../../../../components/CityDoctorList';

const PAGE_SIZE = 8; // Reduced for hub
const POPULAR_SPECIALTIES_DISPLAY = 12;
const POPULAR_DISEASES_DISPLAY = 12;

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
  
  const citiesInState = STATE_TO_CITIES[stateSlug] || [];
  const matchedCity = citiesInState.find(c => slugify(c) === paramSlug);
  const matchedSpecialty = getCanonicalSpecialty(paramSlug);
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);

  if (matchedCity) {
      return {
        title: `Información Médica en ${matchedCity} | MediBusca`,
        description: `Centro de información de salud de ${matchedCity}. Encuentra especialistas, guías de enfermedades y servicios médicos locales.`,
      };
  } else if (matchedSpecialty && selfNamedCity) {
      // Fallback for specialty route handled here
      const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return {
        title: `${matchedSpecialty}s en ${stateName} | MediBusca`,
        description: `Lista de los mejores ${matchedSpecialty.toLowerCase()}s en ${stateName}.`,
      };
  }
  
  return { title: 'MediBusca' };
}

export default async function CityHubPage({ params }: { params: { state: string, city: string } }) {
  const { state: stateSlug, city: paramSlug } = params;
  
  const citiesInState = STATE_TO_CITIES[stateSlug];
  if (!citiesInState) {
      notFound();
  }

  // 1. Is 'paramSlug' a City?
  const cityName = citiesInState.find(c => slugify(c) === paramSlug);

  if (cityName) {
      // REDIRECT Logic: If State == City (e.g. CDMX), redirect to State Hub
      if (slugify(cityName) === stateSlug) {
          redirect(`/doctores/${stateSlug}`);
      }

      // Render CITY HUB PAGE
      const displayedSpecialties = COMMON_SPECIALTIES.slice(0, POPULAR_SPECIALTIES_DISPLAY);
      const displayedDiseases = ALL_DISEASES.slice(0, POPULAR_DISEASES_DISPLAY);

      // Fetch a sample of doctors for bottom list
      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [cityName])
        .range(0, PAGE_SIZE - 1);
      const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

      // Fetch recent articles
      const { data: articles } = await supabase
        .from('articles')
        .select('title, slug, category')
        .limit(3);

      // BREADCRUMB: Inicio > Información Médica > [City]
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://medibusca.com" },
          { "@type": "ListItem", "position": 2, "name": "Información Médica", "item": "https://medibusca.com/buscar" },
          { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://medibusca.com/doctores/${stateSlug}/${paramSlug}` }
        ]
      };

      const medicalWebPageSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": `Información Médica en ${cityName}`,
        "description": `Guía médica completa para ${cityName}. Especialidades, padecimientos y doctores.`,
        "contentLocation": {
            "@type": "City",
            "name": cityName
        }
      };

      return (
        <div className="min-h-screen bg-[#f5f5f7]">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }} />
          
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <nav className="text-sm font-medium text-[#86868b] mb-6 flex items-center animate-in fade-in slide-in-from-bottom-1 flex-wrap">
                    <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                    <span className="mx-2 text-[#d2d2d7]">/</span>
                    <span className="text-[#86868b]">Información Médica</span>
                    <span className="mx-2 text-[#d2d2d7]">/</span>
                    <span className="text-[#1d1d1f] capitalize">{cityName}</span>
                </nav>

                <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-2">
                    Información Médica en {cityName}
                </h1>
                <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-3">
                    Bienvenido a la sección de Información Médica para {cityName}. Aquí encontrarás todo lo necesario para entender las especialidades médicas más relevantes, los padecimientos más comunes y guías completas de salud. Aprende primero sobre cada tema y luego descubre especialistas en la ciudad si lo necesitas.
                </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">

            {/* Section 2: Especialidades Más Buscadas */}
            <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">Especialidades Médicas Destacadas</h2>
                    </div>
                    <p className="text-[#86868b] max-w-3xl text-lg">
                        Explora cada especialidad para aprender qué trata, síntomas comunes y cuándo buscar atención profesional.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {displayedSpecialties.map((spec) => (
                        <Link 
                            key={spec}
                            // Link Logic: Specialty -> Location
                            href={`/doctores/${stateSlug}/${paramSlug}/${slugify(spec)}`}
                            className="
                                flex flex-col items-center justify-center p-4 text-center
                                bg-white border border-slate-200 rounded-xl
                                hover:border-[#0071e3] hover:shadow-md transition-all group
                            "
                        >
                            <span className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#0071e3]">{spec}</span>
                        </Link>
                    ))}
                </div>
                <div className="mt-6 text-center md:text-left">
                    <Link href="/especialidades" className="text-[#0071e3] text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Ver todas las especialidades <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </section>

            {/* Section 3: Padecimientos Comunes */}
            <section className="animate-in fade-in slide-in-from-bottom-5">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">Condiciones y Enfermedades Frecuentes</h2>
                    </div>
                    <p className="text-[#86868b] max-w-3xl text-lg">
                        Conoce los padecimientos más frecuentes y accede a información confiable sobre sus síntomas, prevención y tratamiento.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedDiseases.map((disease) => (
                        <Link 
                            key={disease}
                            // Link Logic: Disease -> Location
                            href={`/padecimientos/${slugify(disease)}/${paramSlug}`}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#0071e3] transition-all group"
                        >
                            <span className="font-medium text-[#1d1d1f]">{disease}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Section 4: Guías Médicas y Enciclopedia */}
            <section className="animate-in fade-in slide-in-from-bottom-6">
                 <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">Guías de Salud y Artículos Informativos</h2>
                    </div>
                    <p className="text-[#86868b] max-w-3xl text-lg">
                        Profundiza en guías médicas completas para comprender mejor cada condición y tratamiento.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {articles?.map((article: any) => (
                        <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all h-full flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wide mb-2 block">
                                        {article.category?.split(',')[0] || 'Guía Médica'}
                                    </span>
                                    <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">{article.title}</h3>
                                </div>
                                <span className="text-sm text-[#86868b] flex items-center gap-1 mt-4">
                                    Leer guía <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    ))}
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center">
                        <h3 className="font-bold text-lg text-[#1d1d1f] mb-2">Enciclopedia Médica</h3>
                        <p className="text-sm text-[#86868b] mb-4">Accede a cientos de artículos verificados.</p>
                        <Link href="/enciclopedia" className="bg-white px-4 py-2 rounded-full text-sm font-medium text-[#1d1d1f] shadow-sm hover:text-[#0071e3] transition-colors">
                            Explorar todo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section 5: Consejos de Salud Locales */}
            <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 animate-in fade-in slide-in-from-bottom-7">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-[#0071e3]" />
                            Prevención y Bienestar en {cityName}
                        </h2>
                        <p className="text-[#86868b] leading-relaxed text-lg">
                            Encuentra recomendaciones sobre hábitos saludables, prevención de enfermedades y cuidados especiales según tu ciudad. Mantener un estilo de vida saludable es clave para prevenir padecimientos crónicos.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-[#1d1d1f] text-sm md:text-base">Ubica clínicas y hospitales de referencia en {cityName} para atención inmediata.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-[#1d1d1f] text-sm md:text-base">Infórmate sobre programas de salud locales y campañas de vacunación vigentes.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-[#1d1d1f] text-sm md:text-base">Sigue recomendaciones de higiene y estilo de vida adaptadas al clima y entorno de la ciudad.</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="flex-1 space-y-6 bg-[#f5f5f7] p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-[#0071e3]" />
                            Descubre Profesionales de la Salud
                        </h2>
                        <p className="text-[#86868b] leading-relaxed">
                            Tras informarte, puedes consultar a especialistas locales en {cityName}. Cada página de especialidad muestra los doctores disponibles en tu ciudad listos para atenderte.
                        </p>
                        <div className="flex flex-col gap-3">
                            {['Dentista - Odontólogo', 'Ginecólogo', 'Pediatra'].map(spec => (
                                <Link 
                                    key={spec}
                                    href={`/doctores/${stateSlug}/${paramSlug}/${slugify(spec)}`}
                                    className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0071e3] transition-all group"
                                >
                                    <span className="font-medium text-[#1d1d1f]">{spec}s en {cityName}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071e3]" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: Doctores destacados (Secondary) */}
            {doctors.length > 0 && (
                <div className="pt-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-[#1d1d1f]">Doctores verificados recientes en {cityName}</h3>
                    </div>
                    <CityDoctorList initialDoctors={doctors} city={cityName} />
                </div>
            )}

          </div>
        </div>
      );
  }

  // 2. Is 'paramSlug' a Specialty? (Logic for hijacking URL structure for Self-Named City States like CDMX)
  const specialtyName = getCanonicalSpecialty(paramSlug);
  const selfNamedCity = citiesInState.find(c => slugify(c) === stateSlug);

  if (specialtyName && selfNamedCity) {
      // Render Specialty Page Logic (Redirects handled or rendered here for CDMX scenarios)
      const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const description = SPECIALTY_DESCRIPTIONS[specialtyName] || `Encuentra a los mejores especialistas en ${specialtyName} verificados en ${stateName}.`;

      const { data: rawDoctors } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [selfNamedCity])
        .contains('specialties', [specialtyName])
        .range(0, PAGE_SIZE - 1);
      const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

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
          </div>
        </div>
      );
  }

  // Not found if neither city nor specialty (or invalid state context)
  notFound();
}
