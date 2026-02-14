import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, MapPin, Search, Phone } from 'lucide-react';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../lib/constants';
import SpecialtiesList from '../../components/SpecialtiesList';
import { Metadata } from 'next';

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

export const metadata: Metadata = {
  title: "Especialidades Médicas - Directorio Completo",
  description: "Explora todas las especialidades médicas disponibles en MediBusca. Encuentra expertos para cada necesidad de salud.",
};

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function SpecialtiesIndexPage() {
  
  // Merge and Deduplicate Specialties for Client List
  const allSpecialties = Array.from(new Set([...POPULAR_SPECIALTIES, ...COMMON_SPECIALTIES]));

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

        {/* Introduction Section */}
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

        {/* Interactive List Component */}
        <SpecialtiesList specialties={allSpecialties} />

        {/* How It Works Section */}
        <section className="mt-24 py-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Cómo encontrar a tu especialista</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Search className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Elige una especialidad</h3>
                    <p className="text-[#86868b] leading-relaxed">Haz clic en el campo médico que necesitas de nuestra lista completa.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Selecciona tu ciudad</h3>
                    <p className="text-[#86868b] leading-relaxed">Mira los doctores verificados que están cerca de ti.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Phone className="w-7 h-7" />
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
                        <Activity className="w-7 h-7 text-[#0071e3]" />
                        Padecimientos frecuentes
                    </h2>
                    <Link href="/enfermedades" className="text-[#0071e3] hover:underline text-[15px] font-medium inline-flex items-center gap-1 shrink-0 h-fit">
                        Ver todos los padecimientos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {/* Educational Context */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4">
                    <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                            <Activity className="w-5 h-5" />
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
                            <MapPin className="w-4 h-4 text-[#0071e3]" />
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
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
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