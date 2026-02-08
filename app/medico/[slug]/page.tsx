import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article } from '../../../types';
import { MapPin, Phone, Award, FileText, Loader2, Share2, HelpCircle, User, ArrowRight, CheckCircle, Stethoscope, Search, BookOpen, Clock, Activity } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, POPULAR_SPECIALTIES } from '../../../lib/constants';

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function DoctorProfile({ params }: { params: { slug: string } }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [relatedDoctors, setRelatedDoctors] = useState<Doctor[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctorAndRelated() {
      setLoading(true);
      
      // 1. Fetch current doctor
      const { data: currentDoctor, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('slug', params.slug)
        .single();
      
      if (currentDoctor) {
        const doc = currentDoctor as Doctor;
        setDoctor(doc);

        // 2. Fetch related doctors (Same specialty, Same city, Not current doctor)
        if (doc.cities.length > 0 && doc.specialties.length > 0) {
            // Fetch more candidates (20) to allow better sorting by phone availability
            const { data: related } = await supabase
                .from('doctors')
                .select('*')
                .contains('cities', [doc.cities[0]])
                .contains('specialties', [doc.specialties[0]])
                .neq('id', doc.id)
                .limit(20);
            
            if (related) {
                // Sort by phone availability (doctors with phones first)
                const sortedRelated = (related as Doctor[]).sort((a, b) => {
                    // Check if valid phone exists (non-empty string)
                    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
                    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
                    
                    if (aHas === bHas) return 0;
                    return aHas ? -1 : 1;
                });
                
                // Take the top 4 after sorting
                setRelatedDoctors(sortedRelated.slice(0, 4));
            }
        }

        // 3. Fetch related articles based on specialty
        if (doc.specialties.length > 0) {
            const mainSpecialty = doc.specialties[0];
            const { data: articlesData } = await supabase
                .from('articles')
                .select('*')
                // Using ilike to match the specialty within the comma-separated category string
                .ilike('category', `%${mainSpecialty}%`) 
                .limit(3);
            
            if (articlesData) {
                setRelatedArticles(articlesData as Article[]);
            }
        }
      }
      setLoading(false);
    }
    
    if (params.slug) fetchDoctorAndRelated();
  }, [params.slug]);

  // SEO Head Management
  useEffect(() => {
    if (doctor) {
        // 1. Set Page Title
        const pageTitle = doctor.seo_metadata?.meta_title || `${doctor.full_name} - ${doctor.specialties[0] || 'Doctor'} | MediBusca`;
        document.title = pageTitle;

        // 2. Set Meta Description
        const metaDescContent = doctor.seo_metadata?.meta_description || 
             `Agenda una cita con ${doctor.full_name}, especialista en ${doctor.specialties.join(', ')}. Consulta opiniones, ubicaciones y disponibilidad.`;
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', metaDescContent);

        // 3. Set Keywords
        if (doctor.seo_metadata?.keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', doctor.seo_metadata.keywords);
        }
    }
    
    // Cleanup: We don't remove tags as moving to another page usually overwrites them, 
    // but good practice might reset title if needed.
  }, [doctor]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#f5f5f7]"><Loader2 className="animate-spin text-[#86868b] w-8 h-8" /></div>;
  }

  if (!doctor) {
    return <div className="min-h-screen flex justify-center items-center bg-[#f5f5f7] text-[#86868b]">Doctor no encontrado.</div>;
  }

  // Generate Dynamic FAQs for SEO
  const faqs = [
    {
      question: `¿Cuál es la especialidad de ${doctor.full_name}?`,
      answer: `${doctor.full_name} se especializa en ${doctor.specialties.join(' y ')}, ofreciendo diagnóstico y tratamiento profesional en esta área médica.`
    },
    {
      question: `¿Qué enfermedades trata ${doctor.full_name}?`,
      answer: doctor.medical_profile.diseases_treated && doctor.medical_profile.diseases_treated.length > 0
        ? `Algunas de las principales enfermedades que trata incluyen: ${doctor.medical_profile.diseases_treated.slice(0, 8).join(', ')}, entre otras condiciones relacionadas con su especialidad.`
        : `${doctor.full_name} trata una amplia gama de condiciones médicas relacionadas con ${doctor.specialties[0]}.`
    },
    {
      question: `¿Dónde se encuentran los consultorios de ${doctor.full_name}?`,
      answer: `${doctor.full_name} ofrece consulta en: ${doctor.contact_info.locations.map(l => `${l.clinic_name} en ${l.address}`).join('; ')}.`
    },
    {
      question: `¿Cómo puedo agendar una cita con ${doctor.full_name}?`,
      answer: `Puedes agendar una cita llamando al teléfono ${doctor.contact_info.phones?.[0] || 'de contacto'} o visitando directamente sus instalaciones.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Safe construction of Physician Schema
  // We prioritize our database fields to ensure critical fields like 'address' are present
  // even if the stored schema_data is incomplete.
  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    ...(doctor.schema_data || {}), // Spread existing schema data first
    "name": doctor.full_name,
    "image": "https://medibusca.com/icon-512.png", // Valid image URL required
    "medicalSpecialty": doctor.specialties.map(s => ({
      "@type": "MedicalSpecialty",
      "name": s
    })),
    // Force address from reliable contact_info
    "address": doctor.contact_info.locations && doctor.contact_info.locations.length > 0 ? {
        "@type": "PostalAddress",
        "streetAddress": doctor.contact_info.locations[0].address,
        "addressLocality": doctor.cities[0] || "",
        "addressCountry": "MX"
    } : undefined,
    // Force telephone
    "telephone": doctor.contact_info.phones?.[0] || undefined
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-24 md:pb-12">
      {/* Schema.org JSON-LD (Physician) */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />
      {/* Schema.org JSON-LD (FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header Profile */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
          
          {/* Breadcrumb */}
          <nav className="text-sm font-medium text-[#86868b] mb-6 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            {doctor.cities && doctor.cities.length > 0 && (
              <>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href={`/doctores/${slugify(doctor.cities[0])}`} className="hover:text-[#0071e3] transition-colors">
                  {doctor.cities[0]}
                </Link>
              </>
            )}
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] truncate max-w-[150px] sm:max-w-md">{doctor.full_name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] leading-tight mb-4">
                  {doctor.full_name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] font-medium rounded-full text-[14px]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Licenses */}
              {doctor.license_numbers && doctor.license_numbers.length > 0 && (
                <div className="text-[14px] text-[#86868b] flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4 text-[#86868b]" />
                  <span>Cédula(s): {doctor.license_numbers.join(', ')}</span>
                </div>
              )}

              {/* Sub Specialties */}
              {doctor.medical_profile?.sub_specialties && doctor.medical_profile.sub_specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <Activity className="w-4 h-4 text-[#86868b]" />
                    {doctor.medical_profile.sub_specialties.map((sub, i) => (
                        <span key={i} className="text-[14px] text-[#1d1d1f] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {sub}
                        </span>
                    ))}
                </div>
              )}

              {/* Description from SEO Metadata or Fallback */}
              <p className="text-[#1d1d1f]/80 max-w-3xl leading-relaxed text-[16px] pt-2">
                {doctor.seo_metadata?.meta_description || 'Especialista médico certificado dedicado a brindar la mejor atención a sus pacientes.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Medical Profile Card */}
          <section className="bg-white rounded-[24px] shadow-sm p-8 transition-transform hover:scale-[1.005]">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#86868b]" />
              Información Médica
            </h2>
            <div className="space-y-4">
              {doctor.medical_profile.diseases_treated?.length > 0 ? (
                <div>
                  <h3 className="text-[13px] font-semibold text-[#86868b] mb-3 uppercase tracking-wider">Enfermedades Tratadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.medical_profile.diseases_treated.map((d, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-[14px] font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#86868b]">Información detallada sobre enfermedades tratadas no disponible.</p>
              )}
            </div>
          </section>

          {/* Locations Card */}
          <section className="bg-white rounded-[24px] shadow-sm p-8 transition-transform hover:scale-[1.005]">
             <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#86868b]" />
              Ubicaciones
            </h2>
            <div className="space-y-6">
              {doctor.contact_info.locations?.map((loc, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-start p-5 bg-[#f5f5f7] rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] text-lg">{loc.clinic_name}</h3>
                    <p className="text-[#86868b] text-[15px] mt-1 leading-relaxed">{loc.address}</p>
                  </div>
                  {loc.map_url && (
                    <a 
                      href={loc.map_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#0071e3] rounded-full text-[14px] font-medium shadow-sm hover:bg-slate-50 transition-colors shrink-0"
                    >
                      Ver en Mapa
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-[24px] shadow-sm p-8 transition-transform hover:scale-[1.005]">
             <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#86868b]" />
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6 divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-5' : ''}>
                  <h3 className="font-medium text-[#1d1d1f] text-[16px] mb-2">{faq.question}</h3>
                  <p className="text-[#86868b] text-[15px] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Desktop Sidebar: Contact */}
        <div className="hidden md:block md:col-span-1">
          <div className="bg-white rounded-[24px] shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Contacto</h2>
            <div className="space-y-3">
              {doctor.contact_info.phones?.map((phone, idx) => (
                <a 
                  key={idx}
                  href={`tel:${phone}`} 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  Llamar
                </a>
              ))}
              <div className="text-[11px] text-center text-[#86868b] mt-4 px-4 leading-tight">
                Al contactar, menciona que lo viste en MediBusca para mejor atención.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 mt-8">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#86868b]" />
                Artículos Relacionados con {doctor.specialties[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                    <Link key={article.id} href={`/enciclopedia/${article.slug}`}>
                        <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 cursor-pointer h-full flex flex-col">
                             <div className="flex items-center gap-2 mb-3">
                                 <span className="px-2.5 py-0.5 bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider rounded-full truncate max-w-[150px]">
                                     {article.category.split(',')[0].trim()}
                                 </span>
                                 <span className="text-[11px] text-[#86868b] flex items-center gap-1 ml-auto shrink-0">
                                    <Clock className="w-3 h-3" /> {article.read_time}
                                </span>
                             </div>
                             <h3 className="font-bold text-[#1d1d1f] mb-2 leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2">
                                 {article.title}
                             </h3>
                             <p className="text-sm text-[#86868b] line-clamp-3 mb-4 flex-1 leading-relaxed">
                                 {article.excerpt}
                             </p>
                             <div className="flex items-center gap-2 text-xs font-medium text-[#1d1d1f] mt-auto">
                                 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] shrink-0">
                                     {article.author.charAt(0)}
                                 </div>
                                 <span className="truncate">{article.author}</span>
                             </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      {/* Related Doctors Section */}
      {relatedDoctors.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Otros {doctor.specialties[0]}s en {doctor.cities[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedDoctors.map((doc) => (
                    <div 
                        key={doc.id}
                        className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-[#0071e3]/20 flex flex-col justify-between"
                    >
                         <div className="flex-1 min-w-0 mb-5">
                            <div className="flex justify-between items-start gap-3">
                                <Link href={`/medico/${doc.slug}`} className="flex-1">
                                    <h3 className="text-lg font-bold text-[#1d1d1f] leading-snug hover:text-[#0071e3] transition-colors cursor-pointer">
                                        {doc.full_name}
                                    </h3>
                                </Link>
                                {doc.license_numbers.length > 0 && (
                                    <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-1" />
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3 mb-4">
                                {doc.specialties.slice(0, 2).map(s => (
                                    <span key={s} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] font-bold rounded-lg uppercase tracking-wide">
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-1.5 text-sm font-medium text-[#86868b]">
                                <MapPin className="w-4 h-4 text-[#86868b]/70" /> 
                                {doc.cities[0]}
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
            </div>
        </section>
      )}

      {/* SEO Cross-Linking Section (Optimized) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 mt-8">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#86868b]" />
            Búsquedas Relacionadas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
             {/* 1. Same Specialty in Major Cities (Reduced list) */}
             {['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla']
                .filter(c => doctor.cities.length === 0 || slugify(c) !== slugify(doctor.cities[0])) 
                .map((city, idx) => (
                 <Link
                    key={`spec-${idx}`}
                    href={`/doctores/${slugify(city)}/${slugify(doctor.specialties[0])}`}
                    className="
                        text-[13px] text-[#86868b] hover:text-[#0071e3] 
                        transition-colors hover:underline truncate
                        py-1 block
                    "
                 >
                    {doctor.specialties[0]} en {city}
                 </Link>
             ))}

             {/* 2. Other Specialties in Current City (Reduced list) */}
             {doctor.cities.length > 0 && POPULAR_SPECIALTIES
                .filter(s => slugify(s) !== slugify(doctor.specialties[0]))
                .slice(0, 5)
                .map((spec, idx) => (
                 <Link
                    key={`city-${idx}`}
                    href={`/doctores/${slugify(doctor.cities[0])}/${slugify(spec)}`}
                    className="
                        text-[13px] text-[#86868b] hover:text-[#0071e3] 
                        transition-colors hover:underline truncate
                        py-1 block
                    "
                 >
                    {spec} en {doctor.cities[0]}
                 </Link>
             ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 pb-8 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          {doctor.contact_info.phones?.slice(0, 1).map((phone, idx) => (
            <a 
              key={idx}
              href={`tel:${phone}`} 
              className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#0071e3] text-white rounded-full font-semibold text-[17px] active:scale-95 transition-transform"
            >
              <Phone className="w-5 h-5 fill-current" />
              Llamar
            </a>
          ))}
          <button className="w-12 h-12 flex items-center justify-center bg-[#f5f5f7] rounded-full text-[#1d1d1f] active:scale-95">
             <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}