
import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, BookOpen, Brain, HeartPulse, Stethoscope, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { POPULAR_SPECIALTIES } from '../../lib/constants';
import DiseaseList from '../../components/DiseaseList';
import { Metadata } from 'next';
import { supabase } from '../../lib/supabase';
import { Disease } from '../../types';

export const metadata: Metadata = {
  title: "Diccionario de Enfermedades y Guía de Síntomas | MediBusca",
  description: "Guía médica completa de enfermedades y síntomas en México. Aprende a identificar cuándo acudir a un especialista y encuentra doctores verificados.",
};

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

const DISEASE_CATEGORIES = [
  {
    title: "Salud Mental y Emocional",
    icon: Brain,
    description: "Condiciones que afectan el estado de ánimo, el pensamiento y el comportamiento.",
    examples: ["Ansiedad", "Depresión", "Estrés", "Duelo", "Codependencia"]
  },
  {
    title: "Enfermedades Crónicas",
    icon: HeartPulse,
    description: "Padecimientos de larga duración que requieren monitoreo médico constante.",
    examples: ["Diabetes", "Hipertensión", "Obesidad", "Asma"]
  },
  {
    title: "Dolor y Traumatología",
    icon: Activity,
    description: "Afecciones relacionadas con huesos, músculos y dolor persistente.",
    examples: ["Dolor de espalda", "Migraña", "Varices"]
  },
  {
    title: "Salud General y Piel",
    icon: Stethoscope,
    description: "Desde afecciones dermatológicas hasta problemas gastrointestinales comunes.",
    examples: ["Acné", "Gastritis", "Alergias", "Embarazo"]
  }
];

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default async function DiseasesIndexPage() {
  
  // Fetch All Diseases from DB (Category: Common)
  const { data: diseasesData } = await supabase
    .from('diseases')
    .select('*')
    .eq('category', 'common')
    .order('name');

  const allDiseases = (diseasesData as Disease[]) || [];

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
        "name": "Padecimientos",
        "item": "https://medibusca.com/enfermedades"
      }
    ]
  };

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Diccionario de Enfermedades y Padecimientos | MediBusca",
    "description": "Busca doctores por enfermedad o síntoma. Guía completa de padecimientos y los especialistas que los tratan.",
    "url": "https://medibusca.com/enfermedades",
    "audience": {
        "@type": "Patient",
        "geographicArea": {
            "@type": "Country",
            "name": "Mexico"
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
            Diccionario de Padecimientos
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
            Una guía completa para entender tus síntomas y encontrar al especialista correcto.
          </p>
        </div>

        {/* EDUCATIONAL INTRO (Add value beyond just links) */}
        <section className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-3">
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">¿Cuándo acudir a un especialista?</h2>
                <div className="prose prose-lg text-[#86868b] leading-relaxed">
                    <p className="mb-4">
                        Identificar correctamente un síntoma es el primer paso para recuperar tu salud. A menudo, los pacientes no saben si su malestar requiere la atención de un médico general o de un especialista específico.
                    </p>
                    <p className="mb-6">
                        Por ejemplo, un dolor de cabeza persistente podría ser tratado por un <strong>médico general</strong> si es ocasional, pero si se acompaña de alteraciones visuales, un <strong>neurólogo</strong> sería el indicado. Del mismo modo, problemas digestivos recurrentes como la gastritis requieren el seguimiento de un <strong>gastroenterólogo</strong> para evitar complicaciones crónicas.
                    </p>
                    <p>
                        En este directorio, hemos organizado las enfermedades y síntomas más comunes para ayudarte a navegar el sistema de salud. Al seleccionar un padecimiento, no solo aprenderás qué es, sino que te conectaremos directamente con los doctores expertos en tratarlo en tu ciudad.
                    </p>
                </div>
            </div>
        </section>

        {/* Client Component for Interactive Search */}
        <DiseaseList diseases={allDiseases} />

        {/* SEMANTIC CATEGORIZATION (Grouping for context) */}
        <section className="mt-24 pt-12 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-6">
            <div className="mb-12 text-center md:text-left">
                <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-4">Explora por sistema de salud</h2>
                <p className="text-[#86868b] text-lg max-w-3xl">
                    Hemos agrupado los padecimientos más frecuentes por categorías para facilitar tu búsqueda.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {DISEASE_CATEGORIES.map((category, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[24px] border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                                <category.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1d1d1f]">{category.title}</h3>
                                <p className="text-sm text-[#86868b]">{category.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {category.examples.map((disease) => (
                                <Link 
                                    key={disease}
                                    href={`/enfermedad/${slugify(disease)}`}
                                    className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-sm font-medium rounded-full transition-colors"
                                >
                                    {disease}
                                </Link>
                            ))}
                            <Link href="/enfermedades" className="px-4 py-2 text-[#0071e3] text-sm font-medium hover:underline">
                                Ver más...
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* SYMPTOM CHECKER DISCLAIMER / SAFETY GUIDE */}
        <section className="mt-20 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                            <h2 className="text-2xl font-bold text-[#1d1d1f]">Uso seguro de la información médica</h2>
                        </div>
                        <p className="text-[#86868b] text-lg leading-relaxed mb-6">
                            Buscar síntomas en internet es útil para informarse, pero nunca debe sustituir el criterio profesional. Aquí te explicamos cómo usar MediBusca de manera responsable:
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1d1d1f] shrink-0 shadow-sm">1</div>
                                <div>
                                    <h4 className="font-semibold text-[#1d1d1f]">No te autodiagnostiques</h4>
                                    <p className="text-sm text-[#86868b]">Los síntomas de una enfermedad leve pueden parecerse a los de una grave. Solo un médico puede notar la diferencia.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1d1d1f] shrink-0 shadow-sm">2</div>
                                <div>
                                    <h4 className="font-semibold text-[#1d1d1f]">Verifica la fuente</h4>
                                    <p className="text-sm text-[#86868b]">Asegúrate de que la información provenga de sitios actualizados. En MediBusca revisamos nuestros contenidos periódicamente.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1d1d1f] shrink-0 shadow-sm">3</div>
                                <div>
                                    <h4 className="font-semibold text-[#1d1d1f]">Usa la información para dialogar</h4>
                                    <p className="text-sm text-[#86868b]">Lleva tus dudas a la consulta. Decir "leí esto en internet" es un buen punto de partida para hablar con tu doctor.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-center text-center">
                        <ShieldCheck className="w-16 h-16 text-[#0071e3] mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-[#1d1d1f] mb-4">Tu salud es lo primero</h3>
                        <p className="text-[#86868b] mb-8">
                            Si tus síntomas son intensos, repentinos o inusuales, no pierdas tiempo buscando en línea.
                        </p>
                        <Link 
                            href="/buscar"
                            className="inline-flex items-center justify-center px-8 py-4 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-all shadow-lg shadow-blue-500/30"
                        >
                            Encontrar un doctor ahora
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Popular Specialties Section (SEO) */}
        <section className="mt-20 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-3 flex items-center gap-2">
                    Encuentra doctores por su especialidad
                </h2>
                <p className="text-[#86868b] text-lg leading-relaxed max-w-3xl">
                    Si ya sabes qué tipo de doctor necesitas, como un pediatra para tus hijos o un dentista para una revisión, búscalo aquí. Tenemos una lista completa de especialistas listos para atenderte.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {POPULAR_SPECIALTIES.map((spec) => (
                    <Link 
                        key={spec}
                        href={`/especialidad/${slugify(spec)}`}
                        className="
                            flex items-center justify-center px-4 py-3
                            bg-white border border-slate-200 rounded-xl
                            text-sm font-medium text-[#1d1d1f] text-center
                            hover:border-[#0071e3] hover:text-[#0071e3]
                            transition-colors shadow-sm
                        "
                    >
                        {spec}
                    </Link>
                ))}
            </div>
            <div className="mt-6 text-center md:text-left">
                <Link href="/especialidades" className="text-[#0071e3] hover:underline text-sm font-medium inline-flex items-center gap-1">
                    Ver todas las especialidades <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>

        {/* Popular Diseases by City (SEO Cross-Linking) */}
        <section className="mt-16 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
             <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-2">
                Encuentra tratamiento en tu ciudad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="space-y-3">
                        <h3 className="font-semibold text-[#1d1d1f] border-b border-slate-100 pb-2 mb-3">
                            {city}
                        </h3>
                        <ul className="space-y-2.5">
                            {/* Show top 5 diseases for each city */}
                            {allDiseases.slice(0, 5).map((disease) => (
                                <li key={disease.id}>
                                    <Link 
                                        href={`/enfermedad/${disease.slug}/${slugify(city)}`}
                                        className="text-[14px] text-[#86868b] hover:text-[#0071e3] hover:underline flex items-center gap-2 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                        {disease.name} en {city}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link 
                                    href={`/doctores/${slugify(city)}`}
                                    className="text-[13px] font-medium text-[#0071e3] hover:underline mt-1 inline-block"
                                >
                                    Ver todos en {city}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}
