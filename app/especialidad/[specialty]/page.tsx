
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article } from '../../../types';
import { Stethoscope, Search, BookOpen, AlertCircle, Info, ShieldCheck, ClipboardList, Check, Clock, ArrowRight, UserCheck, Scale } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS, SPECIALTY_PROCEDURES, SPECIALTY_FIRST_VISIT, SPECIALTY_COMPARISONS } from '../../../lib/constants';
import SpecialtyDoctorList from '../../../components/SpecialtyDoctorList';

const PAGE_SIZE = 12;

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

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
    title: `${searchTerm}s en México - Procedimientos y Consulta`,
    description: `Guía completa sobre ${searchTerm}s. Qué esperar en la primera consulta, procedimientos comunes y lista de especialistas verificados en México.`,
  };
}

// --- Server Component ---

export default async function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const decodedSpecialty = decodeURIComponent(params.specialty);
  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en México.`;
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || ['Diagnóstico general', 'Tratamiento especializado', 'Seguimiento de padecimientos', 'Consultas preventivas'];
  const procedures = SPECIALTY_PROCEDURES[searchTerm] || ['Evaluación clínica', 'Diagnóstico especializado', 'Plan de tratamiento', 'Seguimiento médico'];
  const firstVisitText = SPECIALTY_FIRST_VISIT[searchTerm] || 'Durante la primera consulta, el especialista realizará una historia clínica detallada para entender tus síntomas y antecedentes. Se llevará a cabo un examen físico enfocado en tu motivo de consulta para determinar el mejor plan de diagnóstico y tratamiento.';
  const comparison = SPECIALTY_COMPARISONS[searchTerm];

  // 1. Fetch Initial Data Server-Side (Doctors)
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('specialties', [searchTerm])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // 2. Fetch Related Articles
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, category, author, read_time')
    .ilike('category', `%${searchTerm}%`)
    .limit(3);
  
  const relatedArticles = articles as Article[] || [];

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
               Guía completa y directorio de especialistas.
             </p>
             <p className="text-[#86868b] text-base md:text-lg max-w-3xl font-normal leading-relaxed">
               {description}
             </p>
          </div>
        </div>

        {/* 1️⃣ "What to Expect" Section - Adds authoritative content */}
        <section className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-200 mb-8 animate-in fade-in slide-in-from-bottom-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <UserCheck className="w-7 h-7 text-[#0071e3]" />
                        ¿Qué esperar de tu primera visita?
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed mb-6">
                        {firstVisitText}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4 text-[#0071e3]" />
                            Duración: 30 - 60 min
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] px-4 py-2 rounded-full">
                            <ClipboardList className="w-4 h-4 text-[#0071e3]" />
                            Llevar estudios previos
                        </div>
                    </div>
                </div>
                {/* Procedures Mini-Grid */}
                <div className="flex-1 w-full bg-[#f9f9fb] rounded-2xl p-6 md:p-8">
                    <h3 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-[#86868b]" />
                        Procedimientos Comunes
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {procedures.map((proc, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                                <div className="mt-1 w-4 h-4 rounded-full bg-white border border-[#d2d2d7] flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-[#0071e3]"></div>
                                </div>
                                <span className="text-sm text-[#1d1d1f]/80 font-medium leading-tight">{proc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 1.5 Contextual Comparison (New Feature) */}
        {comparison && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-12 animate-in fade-in slide-in-from-bottom-4 flex gap-4">
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

        {/* Interactive Doctor List */}
        <SpecialtyDoctorList initialDoctors={doctors} specialty={searchTerm} />

        {/* 2️⃣ Related Articles Section - Boosts internal linking and relevance */}
        {relatedArticles.length > 0 && (
            <section className="mt-20 pt-10 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-[#0071e3]" />
                        Artículos y Guías sobre {searchTerm}
                    </h2>
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium hover:underline text-sm hidden md:block">
                        Ver biblioteca
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/enciclopedia/${article.slug}`}>
                            <div className="group h-full bg-white rounded-[24px] p-6 border border-slate-200 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider rounded-lg truncate">
                                        {article.category.split(',')[0]}
                                    </span>
                                    <span className="text-[11px] text-[#86868b] ml-auto">
                                        {article.read_time} lectura
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-[#86868b] text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center text-[#0071e3] font-semibold text-xs mt-auto group-hover:translate-x-1 transition-transform">
                                    Leer más <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* Existing Educational Content Section (Refined) */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-16 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        Doctores y Especialistas en {searchTerm}
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto">
                        La {searchTerm.toLowerCase()} se enfoca en el diagnóstico y manejo de condiciones en este campo médico. MediBusca lista doctores que ejercen de manera independiente, permitiendo a los pacientes conectar directamente con especialistas para recibir orientación y tratamiento.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
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

                    {/* When to consult */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <Info className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">¿Cuándo consultar?</h3>
                        </div>
                        <p className="text-[#86868b] leading-relaxed">
                            Los pacientes deben considerar contactar a un especialista si los síntomas persisten, si requieren una segunda opinión experta o si han sido derivados por un médico general para un tratamiento específico.
                        </p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
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
                    .map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}/${slugify(searchTerm)}`}
                            className="
                                inline-flex items-center gap-2.5 px-6 py-4
                                bg-[#e8e8ed] rounded-full
                                text-[#1d1d1f] font-medium text-[15px]
                                hover:bg-[#d2d2d7] transition-all group
                            "
                        >
                            {searchTerm} en {city}
                        </Link>
                    ))
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
                .map((item, idx) => (
                    <Link 
                        key={idx}
                        href={`/doctores/${slugify(item.city)}/${slugify(item.spec)}`}
                        className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                    >
                        <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                        <span>{item.spec} en {item.city}</span>
                    </Link>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}
