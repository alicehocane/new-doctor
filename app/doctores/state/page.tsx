import React from 'react';
import { supabase } from '../../lib/supabase';
import { Doctor } from '../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { STATE_TO_CITIES, slugify } from '@/lib/constants';

const PAGE_SIZE = 12;

export async function generateMetadata({ params }: { params: { state: string } }): Promise<Metadata> {
  const stateSlug = params.state;
  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `Doctores en ${stateName} | MediBusca`,
    description: `Encuentra los mejores doctores y especialistas en el estado de ${stateName}. Revisa perfiles verificados y contacta directamente.`,
  };
}

export default async function StatePage({ params }: { params: { state: string } }) {
  const stateSlug = params.state;
  const citiesInState = STATE_TO_CITIES[stateSlug];

  if (!citiesInState) {
    notFound();
  }

  const stateName = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Schema Generation
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
        "name": `Doctores en ${stateName}`,
        "item": `https://medibusca.com/doctores/${stateSlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{stateName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
            Doctores en {stateName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Explora las principales ciudades de {stateName} para encontrar al especialista que necesitas.
            </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {citiesInState.map((city) => (
                <Link 
                    key={city}
                    href={`/doctores/${stateSlug}/${slugify(city)}`}
                    className="
                        group flex items-center justify-between p-6 
                        bg-white border border-slate-200 rounded-2xl
                        hover:border-[#0071e3] hover:shadow-md transition-all duration-300
                    "
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-[#1d1d1f] text-lg">{city}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
                </Link>
            ))}
        </div>

        {/* Informational Section */}
        <section className="mt-20 pt-12 border-t border-slate-200/60">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Salud en {stateName}</h2>
                <p className="text-[#86868b] leading-relaxed text-lg">
                    MediBusca te conecta con una red verificada de profesionales de la salud en todo el estado de {stateName}. 
                    Desde especialistas en la capital hasta doctores en municipios clave, nuestra misión es facilitar tu acceso a la atención médica sin intermediarios.
                </p>
            </div>
        </section>

      </div>
    </div>
  );
}