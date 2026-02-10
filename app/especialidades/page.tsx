import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { Stethoscope, ArrowRight, Activity, MapPin, Plus, Search, Phone } from 'lucide-react';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../lib/constants';

const COMMON_DISEASES = [
  { name: 'Diabetes', category: 'Endocrinología' },
  { name: 'Hipertensión', category: 'Cardiología' },
  { name: 'Acné', category: 'Dermatología' },
  { name: 'Ansiedad', category: 'Psiquiatría' },
  { name: 'Dolor de espalda', category: 'Traumatología' },
  { name: 'Embarazo', category: 'Ginecología' },
  { name: 'Gastritis', category: 'Gastroenterología' },
  { name: 'Migraña', category: 'Neurología' },
  { name: 'Alergias', category: 'Alergología' },
  { name: 'Varices', category: 'Angiología' },
  { name: 'Obesidad', category: 'Bariatría' },
  { name: 'Asma', category: 'Neumología' }
];

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

const TOP_SPECIALTIES = [
  'Dentista - Odontólogo', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista'
];

export default function SpecialtiesIndexPage() {
  const [visibleCount, setVisibleCount] = useState(20); // Increased to cover popular list initially

  // SEO
  useEffect(() => {
    document.title = "Especialidades Médicas - Directorio Completo | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Explora todas las especialidades médicas disponibles en MediBusca. Encuentra expertos para cada necesidad de salud.");
  }, []);

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Combine Popular + Remaining Common Specialties
  const sortedSpecialties = useMemo(() => {
    const popularSet = new Set(POPULAR_SPECIALTIES);
    const others = COMMON_SPECIALTIES.filter(s => !popularSet.has(s));
    return [...POPULAR_SPECIALTIES, ...others];
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  // Schema Markup - Separate Tags
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
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Especialidades Médicas Populares",
    "description": "Lista de las especialidades médicas más buscadas en México.",
    "itemListElement": TOP_SPECIALTIES.map((spec, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": spec,
      "url": `https://medibusca.com/especialidad/${slugify(spec)}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Especialidades Médicas.
            </h1>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
                Explora nuestra lista completa de especialistas y encuentra al médico ideal para tu necesidad de salud.
            </p>
        </div>

        {/* NEW: Introduction Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-3">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0071e3] to-transparent opacity-20"></div>
                
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Directorio Médico Gratuito en México</h2>
                <p className="text-[#86868b] leading-relaxed text-lg">
                    En MediBusca, te ayudamos a encontrar al médico adecuado de forma rápida y sencilla. 
                    Ya sea que busques un dentista, un pediatra o un psicólogo, aquí puedes ver perfiles de profesionales en tu ciudad. 
                    Nuestra plataforma es gratuita y te permite contactar directamente a las clínicas sin pagar comisiones.
                </p>
            </div>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {sortedSpecialties.slice(0, visibleCount).map((spec) => (
            <Link 
                key={spec} 
                href={`/especialidad/${slugify(spec)}`}
                className="
                    group flex items-center justify-between p-6 
                    bg-white border border-slate-200 rounded-[20px] 
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-transparent hover:-translate-y-1
                    transition-all duration-300 cursor-pointer
                "
            >
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors duration-300">
                    <Stethoscope 
                        className="w-6 h-6" 
                        aria-label={`Icono de ${spec} en MediBusca`} 
                        role="img" 
                    />
                </div>
                <span className="font-semibold text-[#1d1d1f] text-[15px] group-hover:text-[#0071e3] transition-colors">
                    {spec}
                </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" aria-hidden="true" />
            </Link>
            ))}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedSpecialties.length && (
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-6">
                <button 
                    onClick={handleLoadMore}
                    className="
                        inline-flex items-center gap-2 px-6 py-3
                        bg-white border border-slate-200 rounded-full
                        text-[15px] font-medium text-[#1d1d1f]
                        hover:bg-[#f5f5f7] hover:border-[#86868b]
                        transition-all active:scale-95 shadow-sm
                    "
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Ver más especialidades
                </button>
            </div>
        )}

        {/* NEW: How It Works Section */}
        <section className="mt-20 py-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Cómo encontrar a tu especialista</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Search className="w-7 h-7" aria-label="Icono de Búsqueda" role="img" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Elige una especialidad</h3>
                    <p className="text-[#86868b] leading-relaxed">Haz clic en el campo médico que necesitas de nuestra lista completa.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <MapPin className="w-7 h-7" aria-label="Icono de Ubicación" role="img" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Selecciona tu ciudad</h3>
                    <p className="text-[#86868b] leading-relaxed">Mira los doctores verificados que están cerca de ti.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Phone className="w-7 h-7" aria-label="Icono de Contacto" role="img" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Llama directamente</h3>
                    <p className="text-[#86868b] leading-relaxed">Usa el botón de contacto para hablar con el consultorio y agendar tu cita.</p>
                </div>
            </div>
        </section>

        {/* Popular Diseases Section + Educational Context */}
        <section className="mt-20 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <div className="grid lg:grid-cols-2 gap-12 mb-10 items-center">
                <div>
                    <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <Activity className="w-7 h-7 text-[#0071e3]" aria-hidden="true" />
                        Padecimientos frecuentes
                    </h2>
                    <Link href="/enfermedades" className="text-[#0071e3] hover:underline text-[15px] font-medium inline-flex items-center gap-1 shrink-0 h-fit">
                        Ver todos los padecimientos <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
                {/* NEW: Educational Context */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4">
                    <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Activity className="w-5 h-5" aria-label="Icono de Salud" role="img" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Aprende sobre tu salud</h3>
                        <p className="text-[#86868b] leading-relaxed">
                            Si tienes dudas sobre un padecimiento como diabetes o ansiedad, visita nuestras guías. 
                            Te explicamos qué son y qué tipo de médico es el mejor para atenderte.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {COMMON_DISEASES.map((disease) => (
                    <Link
                        key={disease.name}
                        href={`/enfermedad/${slugify(disease.name)}`}
                        className="
                            flex flex-col p-4 bg-white border border-slate-200 rounded-xl
                            hover:border-[#0071e3] hover:shadow-md transition-all duration-300
                            cursor-pointer h-full
                        "
                    >
                        <span className="font-semibold text-[#1d1d1f] mb-1">{disease.name}</span>
                        <span className="text-xs text-[#86868b] uppercase tracking-wide">{disease.category}</span>
                    </Link>
                ))}
            </div>
        </section>

        {/* Popular Specialties by City Section */}
        <section className="mt-20 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
             <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-10 flex items-center gap-3">
                Especialistas por ciudad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="space-y-4">
                        <h3 className="font-bold text-lg text-[#1d1d1f] border-b border-slate-100 pb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#0071e3]" aria-label={`Ubicación ${city}`} role="img" />
                            {city}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {TOP_SPECIALTIES.map((spec) => (
                                <Link 
                                    key={`${city}-${spec}`}
                                    href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                    className="
                                        flex items-center justify-between group
                                        text-[15px] text-[#86868b] hover:text-[#0071e3] 
                                        transition-colors py-1
                                    "
                                >
                                    <span>{spec}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" aria-hidden="true" />
                                </Link>
                            ))}
                             <Link 
                                href={`/doctores/${slugify(city)}`}
                                className="text-sm font-semibold text-[#0071e3] hover:underline mt-2 inline-block"
                            >
                                Ver todos en {city}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}