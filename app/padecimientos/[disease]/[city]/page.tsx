
import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, ShieldCheck, Phone, CheckCircle, HelpCircle, Info, Stethoscope, Activity, BookOpen, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, ALL_CITIES, ALL_DISEASES, getDiseaseInfo, slugify } from '../../../../lib/constants';
import DiseaseDoctorList from '../../../../components/DiseaseDoctorList';

const PAGE_SIZE = 12;

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

export async function generateMetadata({ params }: { params: { disease: string, city: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  const { name: diseaseName } = getDiseaseInfo(params.disease);
  
  return {
    title: `Especialistas en ${diseaseName} en ${cityName} | MediBusca`,
    description: `Encuentra doctores expertos en ${diseaseName} en ${cityName}. Consulta perfiles verificados, direcciones y teléfonos para agendar tu cita.`,
  };
}

export default async function DiseaseCityPage({ params }: { params: { disease: string, city: string } }) {
  const diseaseSlug = params.disease;
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);
  
  // Use helper to get disease info
  const { name: diseaseName, primarySpecialty: targetSpecialty, relatedSpecialties, details } = getDiseaseInfo(diseaseSlug);

  // 1. Fetch Initial Data Server-Side
  let query = supabase.from('doctors').select('*').contains('cities', [cityName]);

  if (targetSpecialty) {
      query = query.contains('specialties', [targetSpecialty]);
  } else {
       // Fallback strategy: Search by disease tag in medical_profile
      query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
  }

  const { data: rawDoctors } = await query.range(0, PAGE_SIZE - 1);
  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Logic to prevent Thin Content indexing
  const isKnownCity = ALL_CITIES.includes(cityName);
  const isKnownDisease = ALL_DISEASES.includes(diseaseName);

  if (doctors.length === 0 && (!isKnownCity || !isKnownDisease)) {
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
        "name": "Padecimientos",
        "item": "https://medibusca.com/padecimientos"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": diseaseName,
        "item": `https://medibusca.com/padecimientos/${diseaseSlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${diseaseName} en ${cityName}`,
        "item": `https://medibusca.com/padecimientos/${diseaseSlug}/${citySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Tratamiento para ${diseaseName} en ${cityName} | MediBusca`,
    "description": `Encuentra doctores especialistas en ${diseaseName} en ${cityName}. Agenda tu cita con expertos verificados.`,
    "url": `https://medibusca.com/padecimientos/${diseaseSlug}/${citySlug}`,
    "specialty": targetSpecialty ? {
        "@type": "MedicalSpecialty",
        "name": targetSpecialty
    } : undefined,
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

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/padecimientos" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/padecimientos/${diseaseSlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{diseaseName}</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
                Tratamiento para <span className="capitalize">{diseaseName}</span> en <span className="capitalize">{cityName}</span>
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
                {targetSpecialty 
                    ? `Encuentra los mejores ${targetSpecialty}s expertos en el tratamiento de ${diseaseName} en ${cityName}.`
                    : `Encuentra especialistas para ${diseaseName} en ${cityName}.`
                }
            </p>
        </div>

        {/* Doctor Grid (Client Component) */}
        <DiseaseDoctorList 
            initialDoctors={doctors} 
            diseaseName={diseaseName} 
            targetSpecialty={targetSpecialty}
            city={cityName}
        />

        {/* Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mt-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* 1. Intro */}
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-bold text-[#1d1d1f]">
                 {diseaseName} en {cityName}: Encuentra apoyo hoy
               </h2>
               <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                 Vivir en una ciudad como {cityName} puede ser un desafío. La {diseaseName.toLowerCase()} es una condición que requiere atención, pero cuando los síntomas persisten, es momento de buscar ayuda profesional. En MediBusca, te conectamos con expertos listos para ayudarte de forma gratuita y directa.
               </p>
            </div>

            {/* 2. Why Choose MediBusca */}
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">¿Por qué elegir MediBusca para tu salud?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4 mx-auto">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">Sin costos ocultos</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">No somos una agencia de citas ni cobramos comisiones por contactar a los doctores.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">Contacto directo</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">Hablas directamente con el consultorio para preguntar disponibilidad y precios.</p>
                    </div>
                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4 mx-auto">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">Perfiles verificados</h4>
                        <p className="text-[#86868b] text-sm leading-relaxed">Te mostramos especialistas con cédula profesional y experiencia real en {cityName}.</p>
                    </div>
                </div>
            </div>

            {/* 3. FAQs */}
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center flex items-center justify-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                    Preguntas Frecuentes
                </h3>
                <div className="grid gap-6">
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Cómo contacto a un especialista en {diseaseName} en {cityName}?</h4>
                        <p className="text-[#86868b] leading-relaxed">Simplemente elige al profesional que prefieras de nuestra lista y haz clic en el botón "Llamar". La conexión es inmediata con su consultorio.</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Necesito una cuenta para usar MediBusca?</h4>
                        <p className="text-[#86868b] leading-relaxed">No. Puedes navegar por todas nuestras especialidades y ver los datos de contacto de los doctores sin registrarte.</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 mt-8">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900/80">
                    <strong>Aviso Importante:</strong> La información aquí presentada es de carácter educativo. Para diagnóstico y tratamiento de {diseaseName}, siempre consulta directamente a un profesional de la salud.
                </div>
            </div>

          </div>
        </section>

        {/* Cities Section (Specialty Focused) - Updated to new URL structure */}
        {relatedSpecialties.length > 0 ? (
            relatedSpecialties.slice(0, 3).map((spec) => (
                <section key={spec} className="mt-16 pt-12 border-t border-[#d2d2d7]/30">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
                        {spec.startsWith('Medicina') || spec.includes('Cirujano') 
                            ? `Expertos en ${spec} cerca de ti`
                            : `Mejores ${spec}s por ciudad`
                        }
                    </h2>
                    <p className="text-[#86868b] mb-8 max-w-3xl text-[17px]">
                        La atención local es clave para el seguimiento de <span className="text-[#1d1d1f] font-medium">{diseaseName}</span>. Encuentra consultorios equipados y especialistas certificados en las principales ciudades.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {POPULAR_CITIES.slice(0, 8).map((city) => {
                            return (
                                <Link 
                                    key={city}
                                    href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-full text-[#1d1d1f] text-[14px] hover:bg-[#e8e8ed] hover:border-[#d2d2d7] transition-all"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
                                    <span>{spec} en {city}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))
        ) : (
            /* Fallback: General Doctor Search */
            <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
                    Encuentra especialistas en las principales ciudades
                </h2>
                <p className="text-[#86868b] mb-8 text-[17px]">
                    Explora nuestro directorio médico para encontrar la atención adecuada en tu ubicación actual.
                </p>
                <div className="flex flex-wrap gap-3">
                    {POPULAR_CITIES.slice(0, 8).map((city) => {
                        return (
                            <Link 
                                key={city}
                                href={`/doctores/${slugify(city)}`}
                                className="flex items-center gap-2 px-6 py-3.5 bg-[#f5f5f7] rounded-full text-[#1d1d1f] font-medium text-[15px] hover:bg-[#e8e8ed] transition-all"
                            >
                                <MapPin className="w-4 h-4 text-[#86868b]" />
                                <span>Doctores en {city}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        )}

        {/* Nearby Cities Section */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                También disponible en ciudades cercanas
            </h2>
            <p className="text-lg text-[#86868b] mb-8 max-w-3xl">
                Si no encuentras lo que buscas en <span className="text-[#1d1d1f] font-medium">{cityName}</span>, 
                explora atención para <span className="text-[#1d1d1f] font-medium">{diseaseName}</span> en otras ciudades.
            </p>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES.filter(c => slugify(c) !== citySlug).map((city) => (
                    <Link 
                        key={city}
                        href={`/padecimientos/${diseaseSlug}/${slugify(city)}`}
                        className="
                            inline-flex items-center px-5 py-2.5
                            bg-white border border-[#d2d2d7]/60 rounded-full
                            text-[#1d1d1f] font-medium text-[15px]
                            hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white
                            active:scale-[0.98] transition-all duration-200
                            shadow-sm hover:shadow-md
                        "
                    >
                        {diseaseName} en {city}
                    </Link>
                ))}
            </div>
        </section>

        {/* 10️⃣ Related Resources */}
        <section className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-8 mt-12">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8">Recursos Relacionados</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/especialidades" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Stethoscope className="w-5 h-5" /> Especialistas Médicos
                </Link>
                <Link href="/padecimientos" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> Otros Padecimientos
                </Link>
                <Link href="/enciclopedia" className="bg-[#0071e3] text-white px-6 py-4 rounded-full font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    <BookOpen className="w-5 h-5" /> Guías Médicas
                </Link>
            </div>
        </section>

      </div>
    </div>
  );
}
