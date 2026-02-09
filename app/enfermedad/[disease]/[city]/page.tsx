import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, Loader2, Plus, Phone, User, CheckCircle, ArrowRight, Stethoscope, Search, ShieldCheck, Activity, HelpCircle, Info } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, ALL_CITIES, ALL_DISEASES, getDiseaseInfo } from '../../../../lib/constants';

const PAGE_SIZE = 20;

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

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    // Check if valid phone exists (non-empty string)
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function DiseaseCityPage({ params }: { params: { disease: string, city: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const diseaseSlug = params.disease;
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);
  
  // Use helper to get disease info
  const { name: diseaseName, primarySpecialty: targetSpecialty, details } = getDiseaseInfo(diseaseSlug);

  // SEO
  useEffect(() => {
    document.title = `Tratamiento para ${diseaseName} en ${cityName} | MediBusca`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Encuentra doctores especialistas en ${diseaseName} en ${cityName}. Agenda tu cita con expertos verificados.`);
  }, [diseaseName, cityName]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        let query = supabase.from('doctors').select('*').contains('cities', [cityName]);

        if (targetSpecialty) {
            query = query.contains('specialties', [targetSpecialty]);
        } else {
             // Fallback strategy: Search by disease tag in medical_profile
            query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
        }

        const { data } = await query.range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.disease && params.city) fetchInitial();
  }, [params.disease, params.city, targetSpecialty, cityName, diseaseName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('doctors').select('*').contains('cities', [cityName]);

    if (targetSpecialty) {
        query = query.contains('specialties', [targetSpecialty]);
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

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb: Inicio / Padecimientos / [Disease] / [City] */}
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
                            {/* Highlight the mapped specialty first */}
                            {targetSpecialty && (
                                <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {targetSpecialty}
                                </span>
                            )}
                            {doc.specialties
                                .filter(s => s !== targetSpecialty)
                                .slice(0, 2)
                                .map(s => (
                                <span key={s} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#86868b]">
                            <MapPin className="w-4 h-4 text-[#86868b]/70" /> 
                            {cityName}
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
            
            {doctors.length === 0 && (
                <div className="col-span-full py-20 text-center text-[#86868b]">
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="w-8 h-8 text-[#d2d2d7]" />
                    </div>
                    <p className="text-lg">No encontramos doctores verificados para {diseaseName} en {cityName} por el momento.</p>
                    <Link href={`/doctores/${citySlug}`} className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">
                        Ver todos los doctores en {cityName}
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

        {/* NEW: SEO / Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mt-20 animate-in fade-in slide-in-from-bottom-8">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* 1. Intro */}
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-bold text-[#1d1d1f]">
                 {diseaseName} en {cityName}: Encuentra apoyo hoy
               </h2>
               <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                 Vivir en una ciudad tan grande como {cityName} puede ser un desafío. La {diseaseName.toLowerCase()} es una condición que requiere atención, pero cuando los síntomas persisten, es momento de buscar ayuda profesional. En MediBusca, te conectamos con expertos listos para ayudarte de forma gratuita y directa.
               </p>
            </div>

            {/* 2. Symptoms */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-3 justify-center mb-6">
                    <Activity className="w-6 h-6 text-[#0071e3]" />
                    ¿Cómo saber si necesitas ayuda para {diseaseName}?
                </h3>
                <p className="text-[#86868b] text-center leading-relaxed max-w-2xl mx-auto mb-8">
                    La {diseaseName.toLowerCase()} afecta a cada persona de manera diferente. Algunos síntomas comunes que los especialistas en {cityName} pueden ayudarte a manejar incluyen:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {details.symptoms.map((symptom, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#f5f5f7] p-4 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-[#0071e3] shrink-0"></div>
                            <span className="text-[#1d1d1f] font-medium">{symptom}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Why Choose MediBusca */}
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

            {/* 4. FAQs */}
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