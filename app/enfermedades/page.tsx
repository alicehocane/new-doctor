import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, BookOpen } from 'lucide-react';
import { POPULAR_SPECIALTIES, ALL_DISEASES, slugify, getStateForCity } from '@/lib/constants';
import DiseaseList from '../../components/DiseaseList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Diccionario de Enfermedades y Padecimientos | MediBusca",
  description: "Busca doctores por enfermedad o síntoma. Guía completa de padecimientos y los especialistas que los tratan.",
};

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

export default function DiseasesIndexPage() {
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
            Busca por padecimiento.
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
            Encuentra al especialista indicado según tus síntomas o enfermedad diagnosticada.
          </p>
        </div>

        {/* Client Component for Interactive List */}
        <DiseaseList allDiseases={ALL_DISEASES}>
            {/* Guide Section (Passed as children to appear between search and grid) */}
            <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-5">
                <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-4">Tu guía para encontrar al especialista adecuado</h2>
                <p className="text-[#86868b] text-lg leading-relaxed max-w-3xl mx-auto">
                    A veces sabemos dónde nos duele, pero no sabemos qué doctor puede ayudarnos. En esta sección, puedes buscar por síntomas o padecimientos comunes. Haz clic en cualquier malestar para aprender qué es y encontrar expertos verificados en tu ciudad. En MediBusca, te conectamos directamente con el doctor, sin cobrar comisiones.
                </p>
            </div>
        </DiseaseList>
        
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
                {FEATURED_CITIES.map((city) => {
                    const stateSlug = getStateForCity(city);
                    return (
                        <div key={city} className="space-y-3">
                            <h3 className="font-semibold text-[#1d1d1f] border-b border-slate-100 pb-2 mb-3">
                                {city}
                            </h3>
                            <ul className="space-y-2.5">
                                {/* Show top 5 diseases for each city */}
                                {ALL_DISEASES.slice(0, 5).map((disease) => (
                                    <li key={disease}>
                                        <Link 
                                            href={`/enfermedad/${slugify(disease)}/${slugify(city)}`}
                                            className="text-[14px] text-[#86868b] hover:text-[#0071e3] hover:underline flex items-center gap-2 transition-colors"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                            {disease} en {city}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link 
                                        href={`/doctores/${stateSlug}/${slugify(city)}`}
                                        className="text-[13px] font-medium text-[#0071e3] hover:underline mt-1 inline-block"
                                    >
                                        Ver todos en {city}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Professional Trust & Disclaimer */}
        <section className="mt-20 pt-12 border-t border-slate-200/60 pb-12 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-200 flex flex-col md:flex-row gap-8 items-start shadow-sm">
                <div className="w-14 h-14 bg-blue-50 text-[#0071e3] rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#1d1d1f] mb-3">Información en la que puedes confiar</h3>
                    <p className="text-[#86868b] leading-relaxed mb-6 text-lg">
                        Todas las condiciones listadas aquí vienen con guías informativas. Recuerda que esta información es solo una guía y no reemplaza la visita al médico. Siempre consulta a un profesional para un diagnóstico preciso.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-[#1d1d1f]">
                            <BookOpen className="w-5 h-5 text-[#0071e3]" />
                            Guías educativas
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-[#1d1d1f]">
                            <MapPin className="w-5 h-5 text-[#0071e3]" />
                            Doctores locales
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}