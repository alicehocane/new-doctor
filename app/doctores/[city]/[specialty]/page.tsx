import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Doctor } from '../../../../types';
import { MapPin, CheckCircle, Loader2, Plus, Phone, User, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES, ALL_CITIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS } from '../../../../lib/constants';

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

export default function CitySpecialtyPage({ params }: { params: { city: string, specialty: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const cityName = getCanonicalCity(params.city);
  const decodedSpecialty = decodeURIComponent(params.specialty);

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

  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en ${cityName}.`;
  
  // Get conditions for dynamic text
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || [];
  const conditionText = conditions.slice(0, 2).join(', ').toLowerCase() || 'tus síntomas';

  // SEO
  useEffect(() => {
    if (cityName && searchTerm) {
        document.title = `${searchTerm}s en ${cityName} | MediBusca`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Lista de los mejores ${searchTerm.toLowerCase()}s en ${cityName}. Consulta opiniones, direcciones y teléfonos de consultorios.`);
    }
  }, [cityName, searchTerm]);

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
            .contains('specialties', [searchTerm])
            .range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.city && params.specialty) fetchInitial();
  }, [params.city, params.specialty, searchTerm, cityName]);

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
        .contains('specialties', [searchTerm])
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

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb - Hierarchy: Home > Specialties > Specialty > City */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center flex-wrap animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href={`/especialidad/${params.specialty}`} className="hover:text-[#0071e3] transition-colors capitalize">{searchTerm}</Link>
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

        {/* Doctor Grid (New Design) */}
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
                            <span className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                {searchTerm}
                            </span>
                            {doc.specialties.filter(s => s !== searchTerm).slice(0, 2).map(s => (
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
                    <p className="text-[#86868b] text-lg">No encontramos resultados específicos para esta combinación.</p>
                    <Link href="/buscar" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">Intentar otra búsqueda</Link>
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

          </div>
        </section>

        {/* Nearby Cities Section */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                También disponible en ciudades cercanas
            </h2>
            <p className="text-lg text-[#86868b] mb-8 max-w-3xl">
                Si no encuentras lo que buscas en <span className="text-[#1d1d1f] font-medium">{cityName}</span>, 
                explora <span className="text-[#1d1d1f] font-medium">{searchTerm}s</span> en otras ciudades.
            </p>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES.filter(c => slugify(c) !== slugify(params.city)).map((city) => (
                    <Link 
                        key={city}
                        href={`/doctores/${slugify(city)}/${slugify(searchTerm)}`}
                        className="
                            inline-flex items-center px-6 py-4
                            bg-[#f5f5f7] rounded-full
                            text-[#1d1d1f] font-medium text-[15px]
                            hover:bg-[#e8e8ed] transition-colors
                        "
                    >
                        {searchTerm} en {city}
                    </Link>
                ))}
            </div>
        </section>

        {/* Other Specialties in {City} */}
        <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30 pb-12">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                Otras especialidades en {cityName}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
                {POPULAR_SPECIALTIES
                    .filter(s => s !== searchTerm) // Remove current specialty
                    .slice(0, 7)                   // Only take the first 7 results
                    .map((spec, idx) => (
                        <Link 
                            key={idx}
                            href={`/doctores/${slugify(params.city)}/${slugify(spec)}`}
                            className="text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-1.5 rounded-full hover:bg-[#e8e8ed] transition-colors"
                        >
                            {spec} en {cityName}
                        </Link>
                    ))
                }
            </div>
        </section>

      </div>
    </div>
  );
}