import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Loader2, Plus, User, Phone, CheckCircle, ArrowRight, Stethoscope, Search, BookOpen, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES, SPECIALTY_DESCRIPTIONS, SPECIALTY_CONDITIONS } from '../../../lib/constants';

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

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    // Check if valid phone exists (non-empty string)
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Decode URL param
  const decodedSpecialty = decodeURIComponent(params.specialty);

  // Helper to find the matching canonical specialty name
  const getCanonicalSpecialty = (input: string) => {
    // Try to find exact match by slug (handles dentista-odontologo -> Dentista - Odontólogo)
    const targetSlug = slugify(input);
    const found = COMMON_SPECIALTIES.find(s => slugify(s) === targetSlug);
    
    if (found) return found;

    // Fallback: match normalized string if slug match fails (for legacy or partial inputs)
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const foundFallback = COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    );
    return foundFallback || input;
  };

  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en México.`;
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || ['Diagnóstico general', 'Tratamiento especializado', 'Seguimiento de padecimientos', 'Consultas preventivas'];

  // SEO
  useEffect(() => {
    if (searchTerm) {
        document.title = `${searchTerm}s en México | MediBusca`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Encuentra a los mejores ${searchTerm.toLowerCase()}s verificados en México. Información sobre padecimientos, tratamientos y contacto directo.`);
    }
  }, [searchTerm]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        const { data } = await supabase
            .from('doctors')
            .select('*')
            .contains('specialties', [searchTerm])
            .range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.specialty) fetchInitial();
  }, [params.specialty, searchTerm]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
        .from('doctors')
        .select('*')
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

  // Schema Markup - Distinct Scripts
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

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

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
               Encuentra al mejor {searchTerm}.
             </p>
             <p className="text-[#86868b] text-base md:text-lg max-w-3xl font-normal leading-relaxed">
               {description}
             </p>
          </div>
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
          
          {doctors.length === 0 && (
            <div className="col-span-full py-20 text-center text-[#86868b]">
               <p className="text-lg">No se encontraron doctores para esta especialidad.</p>
               <Link href="/buscar" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">Buscar otra especialidad</Link>
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
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-20 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Intro */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        Doctores y Especialistas en {searchTerm} | MediBusca
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto">
                        La {searchTerm.toLowerCase()} se enfoca en el diagnóstico y manejo de condiciones en este campo médico. MediBusca lista doctores que ejercen de manera independiente, permitiendo a los pacientes conectar directamente con especialistas para recibir orientación y tratamiento.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* What they do */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">¿Qué hace un {searchTerm}?</h3>
                        </div>
                        <p className="text-[#86868b] leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Conditions Managed */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
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
                </div>

                {/* When to consult & Find Doctors */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            ¿Cuándo consultar a un especialista?
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                            Los pacientes deben considerar contactar a un especialista si los síntomas persisten, si requieren una segunda opinión experta o si han sido derivados por un médico general para un tratamiento específico.
                        </p>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             Encuentra especialistas en {searchTerm}
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                             Explora los perfiles de doctores en MediBusca, revisa la información de sus clínicas y conecta directamente con ellos para agendar una consulta o resolver tus dudas.
                        </p>
                     </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900/80">
                        <strong>Aviso Legal:</strong> El contenido mostrado es únicamente informativo y no sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busque el consejo de su médico u otro proveedor de salud calificado.
                    </div>
                </div>

            </div>
        </section>

        {/* SEO Cities Links - Updated Design */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Encuentra {searchTerm}s en las principales ciudades de México
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES
                    .slice(0, 8) // Limit to 8 records for a cleaner look
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
                            {/* Integrated Search Icon */}
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
                .slice(0, 10) // Limits the total "chips" to 10 records
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