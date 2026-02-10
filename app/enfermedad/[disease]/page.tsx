import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article } from '../../../types';
import { MapPin, Loader2, User, Phone, CheckCircle, ArrowRight, AlertCircle, Stethoscope, Plus, Search, Info, BookOpen, ShieldCheck, Activity, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, ALL_DISEASES, getDiseaseInfo } from '../../../lib/constants';

const PAGE_SIZE = 20;

// Curated list of top cities for SEO sections to avoid keyword stuffing
const TOP_CITIES = ['Ciudad de México', 'Monterrey', 'Guadalajara', 'Puebla', 'Tijuana', 'León'];

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
    // Check if valid phone exists (non-empty string)
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function DiseasePage({ params }: { params: { disease: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const diseaseSlug = params.disease;
  
  // Use helper to get all disease info
  const { name: diseaseName, primarySpecialty: targetSpecialty, relatedSpecialties, details } = getDiseaseInfo(diseaseSlug);

  // SEO
  useEffect(() => {
    document.title = `Tratamiento para ${diseaseName} - Especialistas y Causas | MediBusca`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Información sobre ${diseaseName}: síntomas, causas y tratamiento. Encuentra doctores especialistas en ${diseaseName} cerca de ti.`);
  }, [diseaseName]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        // 1. Fetch Doctors
        let query = supabase.from('doctors').select('*');

        if (relatedSpecialties.length > 0) {
             // Use OVERLAPS to find doctors with ANY of the related specialties
            query = query.overlaps('specialties', relatedSpecialties);
        } else {
             // Fallback strategy: Search by disease tag in medical_profile
            query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
        }

        const { data } = await query.range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }

        // 2. Fetch Related Articles
        const searchTerm = diseaseName;
        const { data: articlesData } = await supabase
            .from('articles')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
            .order('published_at', { ascending: false })
            .limit(3);
        
        if (articlesData) {
            setRelatedArticles(articlesData as Article[]);
        }

        setLoading(false);
    }
    if (params.disease) fetchInitial();
  }, [params.disease, relatedSpecialties, diseaseName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('doctors').select('*');

    if (relatedSpecialties.length > 0) {
        query = query.overlaps('specialties', relatedSpecialties);
    } else {
        query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
    }

    const { data } = await query.range(from, to);

    if (data) {
        if (data.length > 0) {
            const sortedNew = sortDoctorsByPhone(data as Doctor[]);
            setDoctors(prev => [...prev, ...sortedNew]);
            setPage(nextPage);
        }
        if (data.length < PAGE_SIZE) {
            setHasMore(false);
        }
    }
    setLoadingMore(false);
  };

  // Schema Markup
  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": diseaseName,
    "description": `Información sobre síntomas, causas y especialistas para ${diseaseName}.`,
    "possibleTreatment": targetSpecialty ? {
      "@type": "MedicalTherapy",
      "name": `Consulta con ${targetSpecialty}`
    } : undefined,
    "signOrSymptom": details.symptoms.map(s => ({
      "@type": "MedicalSymptom",
      "name": s
    })),
    "riskFactor": details.causes.map(c => ({
      "@type": "MedicalRiskFactor",
      "name": c
    }))
  };

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/enfermedades" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{diseaseName}</span>
        </nav>

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
        {!targetSpecialty && doctors.length === 0 && !loading && (
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

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {doctors.map((doc, idx) => (
              <div 
                key={doc.id} 
                className={`
                  bg-white p-6 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 border border-transparent hover:border-[#0071e3]/20
                  flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                  {/* Content */}
                  <div className="flex-1 min-w-0 mb-5">
                      <div className="flex justify-between items-start gap-3">
                         <Link href={`/medico/${doc.slug}`} className="flex-1">
                            <h2 className="text-lg md:text-xl font-bold text-[#1d1d1f] leading-snug hover:text-[#0071e3] transition-colors tracking-tight cursor-pointer">
                                {doc.full_name}
                            </h2>
                         </Link>
                         {doc.license_numbers.length > 0 && (
                             <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-1" />
                         )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                           {doc.specialties.slice(0, 3).map(s => (
                               <span key={s} className={`
                                 px-2.5 py-1 text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide
                                 ${relatedSpecialties.includes(s) ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#f5f5f7] text-[#86868b]'}
                               `}>
                                  {s}
                               </span>
                           ))}
                      </div>

                      {/* Location */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm font-medium text-[#86868b]">
                           {doc.cities.map((c, i) => (
                               <span key={i} className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-[#86868b]/70" /> {c}
                               </span>
                           ))}
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <Link 
                        href={`/medico/${doc.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#f5f5f7] text-[#1d1d1f] rounded-xl font-medium text-sm hover:bg-[#e5e5ea] transition-colors active:scale-95"
                      >
                        <User className="w-4 h-4" />
                        Ver Perfil
                      </Link>
                      
                      {doc.contact_info.phones?.[0] ? (
                        <a 
                          href={`tel:${doc.contact_info.phones[0]}`}
                          className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#0071e3] text-white rounded-xl font-medium text-sm hover:bg-[#0077ED] transition-colors active:scale-95"
                        >
                          <Phone className="w-4 h-4" />
                          Llamar
                        </a>
                      ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
                           <Phone className="w-4 h-4" />
                           Llamar
                        </button>
                      )}
                  </div>
              </div>
          ))}
          
          {doctors.length === 0 && targetSpecialty && (
            <div className="col-span-full py-20 text-center text-[#86868b]">
               <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-[#d2d2d7]" />
               </div>
               <p className="text-lg">No encontramos doctores verificados para {diseaseName} en este momento.</p>
               <Link href="/especialidades" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">
                 Ver todas las especialidades
               </Link>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && doctors.length > 0 && (
          <div className="pt-12 flex justify-center">
              <button 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="
                    flex items-center gap-2 px-8 py-3.5 
                    bg-white border border-[#d2d2d7] rounded-full 
                    font-medium text-[#1d1d1f] text-[15px]
                    hover:bg-[#f5f5f7] hover:border-[#86868b] transition-all 
                    disabled:opacity-50 active:scale-95 shadow-sm
                  "
              >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Ver más doctores
              </button>
          </div>
        )}

        
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

        {/* NEW: SEO / Informational Content Section */}
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Síntomas Comunes</h3>
                        </div>
                        <ul className="space-y-3">
                            {details.symptoms.map((symptom, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{symptom}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Causes */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Causas y Factores de Riesgo</h3>
                        </div>
                         <ul className="space-y-3">
                            {details.causes.map((cause, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7] mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{cause}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Care & Diagnosis */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#86868b]" />
                            Diagnóstico y Cuidado
                        </h3>
                        <div className="space-y-3 text-[#86868b] leading-relaxed text-[15px]">
                            <p><strong>Diagnóstico:</strong> Los doctores pueden diagnosticar esta condición mediante el historial médico, examen físico y las pruebas apropiadas.</p>
                            <p><strong>Cuidado y Manejo:</strong> El manejo puede incluir cambios en el estilo de vida, medicamentos u orientación médica, dependiendo de las recomendaciones del doctor.</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             <Info className="w-5 h-5 text-[#86868b]" />
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