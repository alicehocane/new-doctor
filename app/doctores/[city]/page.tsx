import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Loader2, Plus, CheckCircle, Phone, User, Stethoscope, ArrowRight, Search, ShieldCheck, HeartPulse, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, POPULAR_SPECIALTIES as GLOBAL_POPULAR_SPECIALTIES, ALL_CITIES, COMMON_SPECIALTIES } from '../../../lib/constants';

const PAGE_SIZE = 20;
const INITIAL_SPECIALTIES_COUNT = 12;

// Filter Common Specialties to create a local popular list if needed, or just use slice
const LOCAL_POPULAR_SPECIALTIES = COMMON_SPECIALTIES.filter(s => 
  ['Angiólogo', 'Cardiólogo', 'Dermatólogo', 'Ginecólogo', 'Pediatra', 'Traumatólogo', 'Cirujano Plástico', 'Médico General'].includes(s)
).concat(COMMON_SPECIALTIES.slice(0, 20)).filter((v, i, a) => a.indexOf(v) === i).sort();

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

export default function CityPage({ params }: { params: { city: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  const cityName = getCanonicalCity(params.city);
  const citySlug = params.city;

  // SEO
  useEffect(() => {
    if (cityName) {
        document.title = `Doctores en ${cityName} | MediBusca`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Encuentra los mejores doctores y especialistas en ${cityName}. Revisa perfiles, ubicaciones y contacta para agendar tu cita.`);
    }
  }, [cityName]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        const { data } = await supabase
            .from('doctors')
            .select('*')
            .contains('cities', [cityName])
            .range(0, PAGE_SIZE - 1);
        
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.city) fetchInitial();
  }, [params.city, cityName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [cityName])
        .range(from, to);

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

  const displayedSpecialties = showAllSpecialties 
    ? COMMON_SPECIALTIES 
    : COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
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
            Explora los mejores especialistas médicos verificados en {cityName}. Agenda tu cita hoy mismo.
            </p>
        </div>

        {/* Doctor Grid (Consistent Design) */}
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
                <div className="col-span-full py-20 text-center">
                    <p className="text-[#86868b] text-lg">No hay doctores registrados en esta ciudad aún.</p>
                </div>
            )}
        </div>

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
      </div>

      {/* NEW: Specialties in {City} */}
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

            {!showAllSpecialties && (
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => setShowAllSpecialties(true)}
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
                    </button>
                </div>
            )}
        </div>
      </section>

      {/* NEW: Informational Sections (Why & How) */}
      <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            
            {/* Why Choose {City} */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">¿Por qué elegir {cityName} para tu salud?</h2>
                </div>
                <div className="prose text-[#86868b] leading-relaxed">
                    <p>
                        {cityName} se ha consolidado como uno de los centros de salud más importantes del país, ofreciendo una combinación de tecnología médica de vanguardia y especialistas altamente capacitados.
                    </p>
                    <p className="mt-4">
                        Los pacientes eligen {cityName} por la calidad de sus hospitales certificados, la disponibilidad de tratamientos avanzados y la atención personalizada que brindan los profesionales de la salud en la región.
                    </p>
                </div>
            </div>

            {/* How to find a doctor */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Cómo encontrar doctor en {cityName}</h2>
                </div>
                <ul className="space-y-4">
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f] Selecciona la especialidad">Selecciona la especialidad</h3>
                            <p className="text-sm text-[#86868b] mt-1">Usa nuestros filtros para encontrar cardiólogos, pediatras o cualquier especialista que necesites en {cityName}.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Revisa perfiles verificados</h3>
                            <p className="text-sm text-[#86868b] mt-1">Consulta la experiencia, cédulas profesionales y ubicaciones de consultorios de cada doctor.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Contacta directamente</h3>
                            <p className="text-sm text-[#86868b] mt-1">Llama directamente al consultorio desde MediBusca para agendar tu cita sin intermediarios.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* SEO & Other Cities Footer */}
      <section className="bg-white py-12 border-t border-slate-200">
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
                 <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#86868b]" />
                    Búsquedas populares en {cityName}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    {GLOBAL_POPULAR_SPECIALTIES.map((spec, idx) => (
                        <Link 
                            key={idx}
                            href={`/doctores/${citySlug}/${slugify(spec)}`}
                            className="text-[13px] text-[#86868b] hover:text-[#0071e3] hover:underline truncate transition-colors"
                        >
                            {spec} en {cityName}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}