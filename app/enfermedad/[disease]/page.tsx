
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article, Disease } from '../../../types';
import { MapPin, CheckCircle, ArrowRight, AlertCircle, Info, BookOpen, ShieldCheck, Activity, Clock, ChevronRight, Search, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, DISEASE_RELATED_SPECIALTIES } from '../../../lib/constants';
import DiseaseDoctorList from '../../../components/DiseaseDoctorList';

const PAGE_SIZE = 12;
const TOP_CITIES = ['Ciudad de México', 'Monterrey', 'Guadalajara', 'Puebla', 'Tijuana', 'León'];

// --- Helpers ---

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

export async function generateMetadata({ params }: { params: { disease: string } }): Promise<Metadata> {
  const { data: diseaseData } = await supabase
    .from('diseases')
    .select('name')
    .eq('slug', params.disease)
    .single();

  const diseaseName = diseaseData?.name || params.disease.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `Tratamiento para ${diseaseName} - Especialistas y Causas`,
    description: `Información sobre ${diseaseName}: síntomas, causas y tratamiento. Encuentra doctores especialistas en ${diseaseName} cerca de ti.`,
  };
}

// --- Server Component ---

export default async function DiseasePage({ params }: { params: { disease: string } }) {
  const diseaseSlug = params.disease;

  // 1. Fetch Disease Info from DB
  const { data: diseaseRecord } = await supabase
    .from('diseases')
    .select('*')
    .eq('slug', diseaseSlug)
    .single();

  if (!diseaseRecord) {
    notFound();
  }

  const disease = diseaseRecord as Disease;
  const diseaseName = disease.name;
  
  // Parse JSON columns
  const symptoms = JSON.parse(disease.symptoms || '[]') as string[];
  const causes = JSON.parse(disease.causes || '[]') as string[];

  // Determine Related Specialties (from Constants map or empty)
  // Try to match by exact name or slugified name in constants key
  const relatedSpecialties = DISEASE_RELATED_SPECIALTIES[diseaseName] || 
                             Object.entries(DISEASE_RELATED_SPECIALTIES).find(([k]) => slugify(k) === diseaseSlug)?.[1] || 
                             [];
  
  const targetSpecialty = relatedSpecialties.length > 0 ? relatedSpecialties[0] : null;

  // 2. Fetch Initial Doctors
  let query = supabase.from('doctors').select('*');

  if (targetSpecialty) {
      query = query.contains('specialties', [targetSpecialty]);
  } else {
      query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
  }

  const { data: rawDoctors } = await query.range(0, PAGE_SIZE - 1);
  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // 3. Fetch Related Articles
  const { data: articlesData } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${diseaseName}%,category.ilike.%${diseaseName}%,excerpt.ilike.%${diseaseName}%`)
    .order('published_at', { ascending: false })
    .limit(3);
  
  const relatedArticles = articlesData as Article[] || [];

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
      }
    ]
  };

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": diseaseName,
    "description": `Información sobre síntomas, causas y especialistas para ${diseaseName}.`,
    "possibleTreatment": targetSpecialty ? {
      "@type": "MedicalTherapy",
      "name": `Consulta con ${targetSpecialty}`
    } : undefined,
    "signOrSymptom": symptoms.map(s => ({
      "@type": "MedicalSymptom",
      "name": s
    })),
    "riskFactor": causes.map(c => ({
      "@type": "MedicalRiskFactor",
      "name": c
    }))
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Tratamiento para ${diseaseName} - Especialistas y Causas | MediBusca`,
    "description": `Información sobre ${diseaseName}: síntomas, causas y tratamiento. Encuentra doctores especialistas en ${diseaseName} cerca de ti.`,
    "url": `https://medibusca.com/enfermedad/${diseaseSlug}`,
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
    "name": `Especialistas en ${diseaseName}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {doctors.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/enfermedades" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{diseaseName}</span>
        </nav>

        {/* MEDICAL EMERGENCY ALERT */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-10 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-100 p-2 rounded-full shrink-0">
                <PhoneCall className="w-5 h-5 text-red-600" />
            </div>
            <div>
                <h3 className="font-bold text-red-900 text-sm mb-1">¿Emergencia Médica?</h3>
                <p className="text-sm text-red-800/90 leading-relaxed">
                    Si tienes una emergencia médica, llama al <strong>911</strong> o acude al hospital más cercano de inmediato. Esta página es solo para fines informativos y no sustituye la atención urgente.
                </p>
            </div>
        </div>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
              <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                {diseaseName}
              </h1>
              {targetSpecialty && (
                <Link href={`/especialidad/${slugify(targetSpecialty)}`} className="mb-1.5">
                    <span className="px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-sm font-semibold hover:bg-[#0071e3]/20 transition-colors">
                        Especialista sugerido: {targetSpecialty}
                    </span>
                </Link>
              )}
          </div>
          <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Encuentra especialistas médicos expertos en el diagnóstico y tratamiento de {diseaseName}.
          </p>
        </div>

        {/* Show alert ONLY if NO specialty mapped AND NO doctors found via fallback */}
        {!targetSpecialty && doctors.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-amber-800 flex gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                    <h3 className="font-semibold">Búsqueda limitada</h3>
                    <p className="text-sm mt-1">
                        No encontramos doctores que traten específicamente "{diseaseName}" en este momento. 
                        Intenta buscar directamente por una especialidad relacionada en nuestro <Link href="/buscar" className="underline font-medium">buscador</Link>.
                    </p>
                </div>
            </div>
        )}

        {/* Doctor Grid (Client Component) */}
        <DiseaseDoctorList 
            initialDoctors={doctors} 
            diseaseName={diseaseName} 
            targetSpecialty={targetSpecialty} 
        />

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
            <section className="mt-20 mb-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                        Guías y Artículos sobre {diseaseName}
                    </h2>
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium hover:underline text-sm hidden md:block">
                        Ver enciclopedia
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/enciclopedia/${article.slug}`}>
                            <div className="group h-full bg-white rounded-[20px] p-6 border border-[#d2d2d7]/60 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden">
                                {/* Decorative gradient blob */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0071e3]/5 rounded-full blur-2xl group-hover:bg-[#0071e3]/10 transition-all"></div>
                                
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                        Artículo
                                    </span>
                                    <span className="text-[11px] text-[#86868b] flex items-center gap-1 ml-auto shrink-0">
                                        <Clock className="w-3 h-3" /> {article.read_time}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2 relative z-10">
                                    {article.title}
                                </h3>
                                
                                <p className="text-[#86868b] text-[14px] leading-relaxed mb-6 line-clamp-3 flex-1 relative z-10">
                                    {article.excerpt}
                                </p>
                                
                                <div className="flex items-center text-[#0071e3] font-semibold text-[14px] mt-auto relative z-10 group-hover:translate-x-1 transition-transform">
                                    Leer artículo completo <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="mt-6 md:hidden text-center">
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium hover:underline text-sm">
                        Ver enciclopedia
                    </Link>
                </div>
            </section>
        )}

        {/* Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-16 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Intro */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        {diseaseName} – Síntomas, Causas e Información de Cuidado | MediBusca
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                        {diseaseName} afecta a cada persona de manera diferente. MediBusca ofrece recursos informativos para ayudar a los pacientes a comprender los síntomas, las causas y las opciones de atención disponibles, y conectar directamente con doctores para recibir orientación.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Symptoms */}
                    {symptoms.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-[#0071e3]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1d1d1f]">Síntomas Comunes</h3>
                            </div>
                            <ul className="space-y-3">
                                {symptoms.map((symptom, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                                        <span className="leading-relaxed">{symptom}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Causes */}
                    {causes.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1d1d1f]">Causas y Factores de Riesgo</h3>
                            </div>
                            <ul className="space-y-3">
                                {causes.map((cause, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7] mt-2 shrink-0"></div>
                                        <span className="leading-relaxed">{cause}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Care & Diagnosis */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            Diagnóstico y Cuidado
                        </h3>
                        <div className="space-y-3 text-[#86868b] leading-relaxed text-[15px]">
                            <p><strong>Diagnóstico:</strong> Los doctores pueden diagnosticar esta condición mediante el historial médico, examen físico y las pruebas apropiadas.</p>
                            <p><strong>Cuidado y Manejo:</strong> El manejo puede incluir cambios en el estilo de vida, medicamentos u orientación médica, dependiendo de las recomendaciones del doctor.</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             Cuándo contactar a un Doctor
                        </h3>
                         <div className="space-y-3 text-[#86868b] leading-relaxed text-[15px]">
                            <p>Los pacientes deben conectar con doctores calificados listados en MediBusca para una evaluación y orientación adecuada si los síntomas persisten.</p>
                            <p><strong>Encuentra Doctores para {diseaseName}:</strong> Explora los perfiles de doctores en MediBusca relacionados con esta condición y conecta directamente con ellos para consulta.</p>
                         </div>
                     </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900/80">
                        <strong>Aviso Médico:</strong> MediBusca proporciona solo información. La plataforma no ofrece consejo médico, diagnóstico, tratamiento ni reserva de citas. Siempre consulta a un profesional de la salud calificado.
                    </div>
                </div>

            </div>
        </section>


        {/* Specialties that treat {Disease} Section */}
        {relatedSpecialties.length > 0 && (
            <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
                <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2 flex items-center gap-2">
                    Especialidades que tratan {diseaseName}
                </h2>
                <p className="text-[#86868b] mb-8 max-w-2xl text-[17px]">
                    Dependiendo de tus síntomas y la etapa de la condición, diferentes enfoques médicos pueden ser necesarios para un tratamiento integral de <span className="text-[#1d1d1f] font-medium">{diseaseName}</span>.
                </p>
                
                <div className="flex flex-wrap gap-3">
                    {relatedSpecialties.slice(0, 8).map((spec) => (
                        <Link 
                            key={spec} 
                            href={`/especialidad/${slugify(spec)}`}
                            className="flex items-center gap-2 px-5 py-3 bg-[#f5f5f7] rounded-full text-[#0066cc] font-medium text-[15px] hover:bg-[#e8e8ed] transition-all group"
                        >
                            <Search className="w-4 h-4 text-[#86868b] group-hover:text-[#0066cc]" />
                            <span>{spec}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#86868b]/50 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* Cities Section (Specialty Focused) */}
        {relatedSpecialties.length > 0 ? (
            relatedSpecialties.slice(0, 3).map((spec) => ( // Limiting to top 3 specialties to avoid page bloat
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
                        {TOP_CITIES.slice(0, 8).map((city) => (
                            <Link 
                                key={city}
                                href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-full text-[#1d1d1f] text-[14px] hover:bg-[#e8e8ed] hover:border-[#d2d2d7] transition-all"
                            >
                                <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
                                <span>{spec} en {city}</span>
                            </Link>
                        ))}
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
                    {TOP_CITIES.slice(0, 8).map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="flex items-center gap-2 px-6 py-3.5 bg-[#f5f5f7] rounded-full text-[#1d1d1f] font-medium text-[15px] hover:bg-[#e8e8ed] transition-all"
                        >
                            <MapPin className="w-4 h-4 text-[#86868b]" />
                            <span>Doctores en {city}</span>
                        </Link>
                    ))}
                </div>
            </section>
        )}

      </div>
    </div>
  );
}
