import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Doctor, Article } from '../../../../types'; // Adjusted path for 4 levels deep
import { MapPin, Phone, Award, FileText, HelpCircle, User, CheckCircle, Search, BookOpen, Clock, Activity, ChevronLeft, Info, ShieldCheck, ExternalLink, CalendarDays, MessageCircle, ClipboardList, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { POPULAR_SPECIALTIES, SPECIALTY_CONDITIONS } from '../../../../lib/constants'; // Adjusted path
import ArticleRecommendation from '../../../../components/ArticleRecommendation'; // Adjusted path

// Never cache the admin preview
export const dynamic = 'force-dynamic';

// --- Utility Functions ---
const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(dateString).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
};

function getEnfermedades(doctor: Doctor): string[] {
    const dbDiseases = doctor.medical_profile?.diseases_treated;
    if (dbDiseases && dbDiseases.length > 0) return dbDiseases;
    
    const specialty = doctor.specialties?.[0] || "";
    
    if (SPECIALTY_CONDITIONS[specialty]) {
        return SPECIALTY_CONDITIONS[specialty].slice(0, 6);
    }

    for (const key in SPECIALTY_CONDITIONS) {
        if (specialty.toLowerCase().includes(key.toLowerCase())) {
            return SPECIALTY_CONDITIONS[key].slice(0, 6);
        }
    }

    return ["Evaluación diagnóstica", "Tratamiento médico especializado", "Prevención de enfermedades", "Seguimiento clínico", "Asesoría médica"];
}

function generarBiografiaDinamica(doctor: Doctor) {
  const nombre = doctor.full_name || 'Este especialista';
  const especialidad = doctor.specialties?.[0] || 'médico especialista';
  const ciudad = doctor.cities?.[0] || 'México';
  
  const variaciones = [
    `Conoce al ${nombre}, especialista en ${especialidad}. Actualmente brinda atención a sus pacientes en su consultorio ubicado en ${ciudad}. Revisa sus servicios médicos y contacta directamente para solicitar más información.`,
    `El ${nombre} cuenta con amplia experiencia como ${especialidad}. Si te encuentras en ${ciudad} y buscas atención médica de calidad, aquí encontrarás la información detallada de su clínica, tratamientos y contacto directo.`,
    `Para quienes buscan un experto en ${especialidad} dentro de ${ciudad}, el ${nombre} es una excelente opción médica. Consulta su perfil, ubicación, enfermedades tratadas y datos de contacto en este directorio verificado.`
  ];

  const indice = nombre.length % variaciones.length;
  return variaciones[indice];
}

// --- SEO Metadata (Strictly blocked for Admin Route) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Vista Previa Admin - ${params.slug}`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    }
  };
}

// --- Server Component ---
export default async function AdminPreviewProfile({ params }: { params: { slug: string } }) {
  const isValidSlugFormat = /^[a-z0-9\-]+$/.test(params.slug);
  if (!isValidSlugFormat) {
      notFound();
  }

  // 1. Initialize SSR Authenticated Client
  const cookieStore = await cookies();
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // 2. Fetch the doctor WITHOUT the 'status = published' restriction
  const { data: currentDoctor } = await supabaseAdmin
    .from('doctors')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!currentDoctor) {
    notFound();
  }

  const doctor = currentDoctor as Doctor;
  
  // 3. Fetch related data using the authenticated client
  const relatedDoctorsPromise = (async () => {
    if (doctor.cities.length > 0 && doctor.specialties.length > 0) {
      const { data: related } = await supabaseAdmin
        .from('doctors')
        .select('*')
        .contains('cities', [doctor.cities[0]])
        .contains('specialties', [doctor.specialties[0]])
        .eq('status', 'published') // Only show published ones in the related section
        .neq('id', doctor.id)
        .limit(20);
      
      if (related) {
        return (related as Doctor[])
          .sort((a, b) => {
            const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
            const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
            if (aHas === bHas) return 0;
            return aHas ? -1 : 1;
          })
          .slice(0, 4);
      }
    }
    return [];
  })();

  const relatedArticlesPromise = (async () => {
    if (doctor.specialties.length > 0) {
      const mainSpecialty = doctor.specialties[0];
      const { data: articlesData } = await supabaseAdmin
        .from('articles')
        .select('*')
        .ilike('category', `%${mainSpecialty}%`)
        .limit(3);
      return articlesData as Article[] || [];
    }
    return [];
  })();

  const [relatedDoctors, relatedArticles] = await Promise.all([relatedDoctorsPromise, relatedArticlesPromise]);

  // --- UI Variables Preparation ---
  const cityDisp = doctor.cities?.[0] || "Monterrey";
  const specDisp = doctor.specialties?.[0] || "";
  
  const diseases = getEnfermedades(doctor);
  const generatedDescription = generarBiografiaDinamica(doctor);

  const subSpecialtiesText = doctor.medical_profile?.sub_specialties?.length 
    ? `, con enfoque en ${doctor.medical_profile.sub_specialties.join(', ')}` 
    : '';

  const faqs = [
    {
      question: `¿Cuál es la especialidad de ${doctor.full_name}?`,
      answer: `${doctor.full_name} se especializa en ${doctor.specialties.join(' y ')}${subSpecialtiesText}, ofreciendo diagnóstico y atención profesional en esta área médica.`
    },
    {
      question: `¿Qué enfermedades trata ${doctor.full_name}?`,
      answer: `Algunas de las principales enfermedades o condiciones que trata incluyen: ${diseases.slice(0, 5).join(', ')}, brindando atención integral a sus pacientes.`
    },
    {
      question: `¿Dónde se encuentran los consultorios de ${doctor.full_name}?`,
      answer: `${doctor.full_name} ofrece consulta en: ${doctor.contact_info?.locations?.map(l => `${l.clinic_name} en ${l.address}`).join('; ') || cityDisp}.`
    },
    {
      question: `¿Cómo puedo contactar a ${doctor.full_name}?`,
      answer: `Puedes comunicarte llamando al teléfono ${doctor.contact_info?.phones?.[0] || 'de contacto'} o visitando directamente sus instalaciones en ${cityDisp}.`
    }
  ];

  const phones = doctor.contact_info?.phones || [];
  const mainPhone = phones[0];
  const waPhone = mainPhone?.replace(/\D/g, '');
  const waMessage = encodeURIComponent(`Hola ${doctor.full_name}, Encontré su perfil en MediBusca y me gustaría solicitar más información sobre un tema relacionado con su especialidad en ${doctor.specialties[0]}. Podría brindarme más detalles sobre sus consultas?`);
  
  const searchQuery = encodeURIComponent(`${doctor.full_name} ${doctor.specialties[0] || ''} ${doctor.cities[0] || ''} teléfono consultorio`);
  const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

  const recommendedArticle = relatedArticles.length > 0 ? relatedArticles[0] : null;

  // --- Render ---
  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-24 md:pb-12">

      {/* ADMIN BANNER */}
      <div className="bg-amber-500 text-amber-950 px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm tracking-wide sticky top-0 z-[100] shadow-md">
        <AlertTriangle className="w-5 h-5" />
        VISTA PREVIA DE ADMIN - ESTADO: <span className="uppercase">{doctor.status}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <ChevronLeft className="w-4 h-4" /> Volver al panel de administración
        </Link>
      </div>

      {/* MOBILE TOP BANNER: Article Recommendation */}
      <ArticleRecommendation article={recommendedArticle} />

      {/* Header Profile */}
      <div className="bg-white border-b border-slate-200/50 mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          
          {/* Breadcrumb */}
          <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
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
            <span className="text-[#1d1d1f] capitalize">{doctor.full_name}</span>
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
              
              {/* Licenses & Validation Block */}
              {doctor.license_numbers && doctor.license_numbers.length > 0 && (
                <div className="space-y-3">
                    <div className="text-[14px] text-[#86868b] flex items-center gap-2 font-medium">
                        <Award className="w-4 h-4 text-[#86868b]" />
                        <span>Cédula(s): {doctor.license_numbers.join(', ')}</span>
                    </div>
                    
                    {/* Verification Tooltip/Block */}
                    <div className="bg-green-50 border border-green-200/60 rounded-xl p-3 max-w-xl">
                        <div className="flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">
                                    Verificación de Credenciales
                                </h4>
                                <p className="text-xs text-green-900/80 leading-relaxed">
                                    La <strong>Cédula Profesional</strong> de este especialista ha sido cotejada con registros públicos, como el Registro Nacional de Profesionistas de la SEP. Este proceso asegura que el médico cuenta con la autorización legal para ejercer su especialidad en territorio mexicano.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Sub Specialties */}
              {doctor.medical_profile?.sub_specialties && doctor.medical_profile.sub_specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center pt-2">
                    <Activity className="w-4 h-4 text-[#86868b]" />
                    {doctor.medical_profile.sub_specialties.map((sub, i) => (
                        <span key={i} className="text-[14px] text-[#1d1d1f] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {sub}
                        </span>
                    ))}
                </div>
              )}

              {/* Description */}
              <p className="text-[#1d1d1f]/80 max-w-3xl leading-relaxed text-[16px] pt-2">
                {generatedDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Medical Profile Card */}
          <section className="bg-white rounded-[24px] shadow-sm p-8 transition-transform hover:scale-[1.005]">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#86868b]" />
              Información Médica
            </h2>
            <div className="space-y-4">
                <div>
                  <h3 className="text-[13px] font-semibold text-[#86868b] mb-3 uppercase tracking-wider">
                    {doctor.medical_profile?.diseases_treated?.length ? "Enfermedades Tratadas" : "Condiciones comunes tratadas"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {diseases.map((d, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-[14px] font-medium border border-slate-100">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
          </section>

          {/* Locations Card */}
          <section className="bg-white rounded-[24px] shadow-sm p-8 transition-transform hover:scale-[1.005]">
             <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#86868b]" />
              Ubicaciones
            </h2>
            <div className="space-y-6">
              {doctor.contact_info?.locations?.map((loc, idx) => (
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

          {/* MOBILE-ONLY CONTACT SECTION */}
          <section className="md:hidden bg-white rounded-[24px] shadow-sm p-8">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#86868b]" />
              Contacto Directo
            </h2>
            <div className="space-y-4">
              {phones.length > 0 ? (
                phones.map((phone, idx) => {
                  const cleanPhone = phone.replace(/\D/g, '');
                  return (
                    <div key={idx} className="flex flex-col gap-3 p-4 bg-[#f5f5f7] rounded-2xl">
                      <p className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                         Teléfono {phones.length > 1 ? idx + 1 : ''}: <span className="text-[#0071e3] font-medium">{phone}</span>
                      </p>
                      <div className="flex gap-2">
                        <a 
                          href={`tel:${phone}`}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0071e3] text-white rounded-xl text-sm font-medium active:scale-95 transition-all"
                        >
                          <Phone className="w-4 h-4" /> Llamar
                        </a>
                        <a 
                          href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl text-sm font-medium active:scale-95 transition-all"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 bg-[#f5f5f7] rounded-2xl text-center flex flex-col items-center">
                  <p className="text-[14px] text-[#1d1d1f]/80 leading-relaxed mb-4">
                    Aún no tenemos el teléfono registrado, pero te ayudamos a encontrarlo rápidamente en la web.
                  </p>
                  <a 
                    href={googleSearchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-xl font-medium text-[15px] hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                  >
                    <Search className="w-4 h-4 text-[#0071e3]" /> 
                    Buscar en Google
                  </a>
                </div>
              )}
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

        {/* Desktop Sidebar: Contact & Helper */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* 1. Contact Card */}
            <div className="bg-white rounded-[24px] shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Contacto</h2>
              {mainPhone ? (
                <div className="space-y-3">
                  <a 
                    href={`tel:${mainPhone}`} 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-current" /> Llamar
                  </a>
                  <a 
                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-full font-medium hover:bg-[#22c35e] transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp
                  </a>
                  <div className="text-[11px] text-center text-[#86868b] mt-4 px-4 leading-tight">
                    Al contactar, menciona que lo viste en MediBusca para mejor atención.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center pt-2">
                  <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4">
                    <Search className="w-5 h-5 text-[#86868b]" />
                  </div>
                  <p className="text-[13px] text-[#1d1d1f]/80 leading-relaxed mb-5">
                    Actualmente no contamos con el teléfono directo de este especialista.
                  </p>
                  <a 
                    href={googleSearchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-xl font-medium text-[14px] hover:bg-[#f5f5f7] transition-all active:scale-95 shadow-sm"
                  >
                    <Search className="w-4 h-4 text-[#0071e3]" /> 
                    Buscar en Google
                  </a>
                </div>
              )}
            </div>

            {/* 2. Prepara tu Consulta Card */}
            <div className="bg-white rounded-[24px] shadow-sm p-6 animate-in fade-in slide-in-from-bottom-6">
              <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0071e3]" />
                Prepara tu cita
              </h2>
              <p className="text-[13px] text-[#86868b] mb-4 leading-relaxed">
                Te sugerimos confirmar estos detalles al contactar al consultorio:
              </p>
              
              <ul className="space-y-3.5">
                <li className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#1d1d1f]/80 leading-snug">
                    <strong>Aseguradoras:</strong> ¿Trabajan con seguros de Gastos Médicos Mayores (GMM) o aplica pago directo?
                  </span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#1d1d1f]/80 leading-snug">
                    <strong>Formas de pago:</strong> ¿Aceptan tarjeta de crédito/débito o requiere transferencia / efectivo?
                  </span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#1d1d1f]/80 leading-snug">
                    <strong>Estudios previos:</strong> ¿Es necesario llevar algún análisis de laboratorio o imagen a la primera consulta?
                  </span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#1d1d1f]/80 leading-snug">
                    <strong>Seguimiento:</strong> ¿La tarifa cubre la revisión de estudios médicos posteriores?
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}