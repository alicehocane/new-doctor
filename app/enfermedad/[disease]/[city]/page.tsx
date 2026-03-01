import React from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, ShieldCheck, Phone, CheckCircle, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, ALL_CITIES, ALL_DISEASES, getDiseaseInfo, getMetroAreaForCity, SPECIALTY_COMPARISONS } from '../../../../lib/constants';
import DiseaseDoctorList from '../../../../components/DiseaseDoctorList';
import EmergencyBanner from '../../../../components/EmergencyBanner';

const PAGE_SIZE = 12;
export const revalidate = 86400;

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


export async function generateMetadata({ params }: { params: { disease: string, city: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  const { name: diseaseName } = getDiseaseInfo(params.disease);
  
  return {
    title: `Especialistas en ${diseaseName} en ${cityName}`,
    description: `Encuentra doctores expertos en ${diseaseName} en ${cityName}. Consulta perfiles verificados, direcciones y teléfonos para agendar tu cita.`,
  };
}

export default async function DiseaseCityPage({ params }: { params: { disease: string, city: string } }) {
  const diseaseSlug = params.disease;
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);
  
  // Use helper to get disease info
  const { name: diseaseName, primarySpecialty: targetSpecialty, emergencyCategory, detailedInfo } = getDiseaseInfo(diseaseSlug);

  // Get the dynamic comparison text if a primary specialty exists
  const specialtyComparison = targetSpecialty ? SPECIALTY_COMPARISONS[targetSpecialty] : null;

  // NEW: Generate the dynamic treatment text
  const treatmentItems = detailedInfo?.treatment?.subsections?.[0]?.items;
  let dynamicTreatmentText = null;
  
  if (treatmentItems && treatmentItems.length > 0) {
      const treatmentList = treatmentItems.join(', ').toLowerCase();
      const treatmentNote = detailedInfo.treatment.note ? ` ${detailedInfo.treatment.note}` : '';
      dynamicTreatmentText = `Nuestros especialistas en ${cityName} manejan diversos enfoques para tratar la ${diseaseName.toLowerCase()}. Dependiendo de la gravedad, el tratamiento puede incluir: ${treatmentList}.${treatmentNote}`;
  }

  // 1. Fetch Initial Data Server-Side
  let query = supabase.from('doctors').select('*').contains('cities', [cityName]);

  if (targetSpecialty) {
      query = query.contains('specialties', [targetSpecialty]);
  } else {
       // Fallback strategy: Search by disease tag in medical_profile
      query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
  }

  // Tell Supabase to sort by has_phone first, then alphabetically
  query = query
      .order('has_phone', { ascending: false });
       // .order('full_name', { ascending: true });  // 2. Alphabetical secondary sort

  const { data: rawDoctors } = await query.range(0, PAGE_SIZE - 1);
  const doctors = rawDoctors as Doctor[] || [];

  // Logic to prevent Thin Content indexing
  // If no doctors are found AND (disease is unknown OR city is unknown), return 404.
  // This prevents URL manipulation like /enfermedad/foobar/fake-city from generating indexable pages.
  const isKnownCity = ALL_CITIES.includes(cityName);
  const isKnownDisease = ALL_DISEASES.includes(diseaseName);
  const metroCities = getMetroAreaForCity(cityName);

  

  if (doctors.length === 0 && (!isKnownCity || !isKnownDisease)) {
    notFound();
  }


  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `¿Cuánto cuesta un tratamiento para ${diseaseName} en ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Los precios de las consultas en ${cityName} varían según la zona y la experiencia del especialista. Generalmente, una consulta inicial oscila entre $600 y $1,500 MXN. Te recomendamos contactar directamente al especialista para confirmar sus honorarios.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Cómo encuentro especialistas en ${diseaseName} cerca de mi zona en ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Revisa los perfiles de arriba para ver la ubicación exacta del consultorio. Muchos de nuestros especialistas en ${cityName} también ofrecen la opción de videoconsulta si prefieres no desplazarte.`
        }
      }
    ]
  };

  // Dynamically add the comparison FAQ to the Schema if it exists
  if (specialtyComparison) {
      faqSchema.mainEntity.push({
          "@type": "Question",
          // Replace the closing '?' to inject the city name seamlessly
          "name": specialtyComparison.title.replace('?', ` en ${cityName}?`),
          "acceptedAnswer": {
              "@type": "Answer",
              "text": `${specialtyComparison.text} Muchos de nuestros especialistas en ${cityName} trabajan en conjunto para ofrecer un tratamiento integral.`
          }
      });
  }

  // NEW: Dynamically add the Treatment FAQ to the Schema
  if (dynamicTreatmentText) {
      faqSchema.mainEntity.push({
          "@type": "Question",
          "name": `¿Qué tipos de tratamiento para ${diseaseName.toLowerCase()} ofrecen los especialistas en ${cityName}?`,
          "acceptedAnswer": {
              "@type": "Answer",
              "text": dynamicTreatmentText
          }
      });
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
        "item": "https://medibusca.com/enfermedades"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": diseaseName,
        "item": `https://medibusca.com/enfermedad/${diseaseSlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${diseaseName} en ${cityName}`,
        "item": `https://medibusca.com/enfermedad/${diseaseSlug}/${citySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Tratamiento para ${diseaseName} en ${cityName} | MediBusca`,
    "description": `Encuentra doctores especialistas en ${diseaseName} en ${cityName}. Agenda tu cita con expertos verificados.`,
    "url": `https://medibusca.com/enfermedad/${diseaseSlug}/${citySlug}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/enfermedades" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/enfermedad/${diseaseSlug}`} className="hover:text-[#0071e3] transition-colors capitalize">{diseaseName}</Link>
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

        {/* EmergencyBanner Component */}
        <EmergencyBanner 
            diseaseName={diseaseName} 
            cityName={cityName} 
            category={emergencyCategory} 
        />

        {/* Metro Area Sub-filters */}
        {metroCities && metroCities.length > 1 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-sm font-medium text-[#86868b] mb-3 md:mb-4 uppercase tracking-wider">
              Filtrar por zona metropolitana
            </h3>
            
            {/* Mobile: Horizontal scroll edge-to-edge, hidden scrollbar, snap scrolling
              Desktop (md): Wrap naturally, no scrolling needed
            */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:flex-wrap gap-2 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
              {metroCities.map((metroCity) => {
                const isActive = metroCity === cityName;
                return (
                  <Link 
                    key={metroCity}
                    href={`/enfermedad/${diseaseSlug}/${slugify(metroCity)}`}
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

            

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 mt-8">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900/80">
                    <strong>Aviso Importante:</strong> La información aquí presentada es de carácter educativo. Para diagnóstico y tratamiento de {diseaseName}, siempre consulta directamente a un profesional de la salud.
                </div>
            </div>

          </div>
        </section>


        {/* 3. Localized FAQs */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center flex items-center justify-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                    Preguntas Frecuentes sobre {diseaseName} en {cityName}
                </h3>
                {/* Changed to grid-cols-1 or md:grid-cols-2/3 depending on how many FAQs you have */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {dynamicTreatmentText && (
                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                            <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">
                                ¿Qué tipos de tratamiento para {diseaseName.toLowerCase()} ofrecen en {cityName}?
                            </h4>
                            <p className="text-[#86868b] leading-relaxed">
                                <span className="capitalize">{dynamicTreatmentText.charAt(0)}</span>{dynamicTreatmentText.slice(1)}
                            </p>
                        </div>
                    )}

                    {/* NEW: Dynamic Specialty Comparison FAQ */}
                    {specialtyComparison && (
                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                            <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">
                                {specialtyComparison.title.replace('?', ` en ${cityName}?`)}
                            </h4>
                            <p className="text-[#86868b] leading-relaxed">
                                {specialtyComparison.text} Muchos de nuestros especialistas en <span className="font-medium text-[#1d1d1f]">{cityName}</span> trabajan en conjunto para ofrecer un tratamiento integral.
                            </p>
                        </div>
                    )}

                    {/* Your Existing Location FAQ */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Cómo encuentro especialistas en {diseaseName} cerca de mi zona en {cityName}?</h4>
                        <p className="text-[#86868b] leading-relaxed">
                            Revisa los perfiles de arriba para ver la ubicación exacta del consultorio. Muchos de nuestros especialistas en {cityName} también ofrecen la opción de videoconsulta si prefieres no desplazarte.
                        </p>
                    </div>

                    {/* Your Existing Price FAQ */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:border-[#0071e3]/30 transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 text-lg">¿Cuánto cuesta un tratamiento para {diseaseName} en {cityName}?</h4>
                        <p className="text-[#86868b] leading-relaxed">
                            Los precios de las consultas en {cityName} varían según la zona y la experiencia del especialista. Generalmente, una consulta inicial oscila entre $600 y $1,500 MXN. Te recomendamos contactar directamente al especialista para confirmar sus honorarios.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        {/* Educational Cross-Link Banner */}
        <section className="mt-16 bg-[#0071e3]/5 border border-[#0071e3]/10 rounded-[24px] p-8 md:p-10 text-center animate-in fade-in slide-in-from-bottom-8">
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">
                Aprende más sobre la {diseaseName}
            </h3>
            <p className="text-[#86868b] mb-6 max-w-2xl mx-auto">
                ¿Quieres entender mejor los síntomas, causas y diferentes tipos de tratamientos disponibles antes de agendar tu cita?
            </p>
            <Link 
                href={`/enfermedad/${diseaseSlug}`}
                className="inline-flex items-center px-6 py-3 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-colors"
            >
                Leer guía médica completa
            </Link>
        </section>

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
                {POPULAR_CITIES.filter(c => slugify(c) !== citySlug).slice(0, 8) 
                    .map((city) => (
                    <Link 
                        key={city}
                        href={`/enfermedad/${diseaseSlug}/${slugify(city)}`}
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

      </div>
    </div>
  );
}