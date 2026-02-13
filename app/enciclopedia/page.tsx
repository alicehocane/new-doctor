
import React from 'react';
import Link from 'next/link';
import { Activity, Search, ShieldCheck, CheckCircle, AlertCircle, BookOpen, Stethoscope, ChevronRight, HeartPulse, Brain, Smile } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Article } from '../../types';
import EncyclopediaBrowser from '../../components/EncyclopediaBrowser';
import { Metadata } from 'next';

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Enciclopedia Médica | MediBusca",
  description: "Bienvenido a nuestra Enciclopedia Médica. Guías completas sobre enfermedades, tratamientos, síntomas y prevención.",
};

export default async function EncyclopediaIndexPage() {
  
  // 1. Fetch Initial Articles on Server
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const initialArticles = articles as Article[] || [];

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
        "name": "Enciclopedia",
        "item": "https://medibusca.com/enciclopedia"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Enciclopedia Médica | MediBusca",
    "description": "Bienvenido a nuestra Enciclopedia Médica. Aquí encontrarás guías completas y artículos especializados sobre enfermedades, tratamientos, síntomas, prevención y cuidado general de la salud.",
    "url": "https://medibusca.com/enciclopedia",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Interactive Browser (Search, List, Pagination) */}
      <EncyclopediaBrowser 
        initialArticles={initialArticles}
        title="Enciclopedia Médica"
        description="Bienvenido a nuestra Enciclopedia Médica. Aquí encontrarás guías completas y artículos especializados sobre enfermedades, tratamientos, síntomas, prevención y cuidado general de la salud. Aprende todo lo que necesitas saber para tomar decisiones informadas sobre tu bienestar."
      >
        
        {/* New Educational Sections */}
        <section className="mt-20 pt-16 border-t border-slate-200">
            <div className="max-w-5xl mx-auto space-y-20">
                
                {/* 3️⃣ Cómo Usar la Enciclopedia */}
                <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-[#0071e3]" />
                            Aprende a Navegar la Información Médica
                        </h2>
                        <p className="text-lg text-[#86868b] leading-relaxed mb-6">
                            Nuestra enciclopedia está organizada por categorías y especialidades médicas. Puedes explorar artículos según la condición, el tratamiento o la especialidad para encontrar información confiable y detallada.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Explora por enfermedad o padecimiento
                            </li>
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Busca guías por especialidad médica
                            </li>
                            <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                                <CheckCircle className="w-5 h-5 text-[#0071e3]" /> Filtra por síntomas o tratamientos
                            </li>
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <Activity className="w-6 h-6 text-[#0071e3] mb-3" />
                            <h3 className="font-bold text-[#1d1d1f]">Por Padecimiento</h3>
                            <p className="text-sm text-[#86868b] mt-1">Encuentra información sobre síntomas específicos y su manejo.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <Stethoscope className="w-6 h-6 text-[#0071e3] mb-3" />
                            <h3 className="font-bold text-[#1d1d1f]">Por Especialidad</h3>
                            <p className="text-sm text-[#86868b] mt-1">Lee artículos escritos desde la perspectiva de expertos en cada área.</p>
                        </div>
                    </div>
                </div>

                {/* 4️⃣ Relación con Especialistas */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 animate-in fade-in slide-in-from-bottom-6">
                    <div className="text-center mb-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra Doctores Según lo que Aprendes</h2>
                        <p className="text-lg text-[#86868b] leading-relaxed">
                            Después de aprender sobre un padecimiento o tratamiento, consulta nuestros listados de especialistas en tu ciudad para recibir atención profesional confiable.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/padecimientos/ansiedad/ciudad-de-mexico" className="group bg-[#f5f5f7] p-6 rounded-2xl hover:bg-[#0071e3] hover:text-white transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white text-[#0071e3] flex items-center justify-center">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-lg text-[#1d1d1f] group-hover:text-white">Ansiedad</span>
                            </div>
                            <p className="text-sm text-[#86868b] group-hover:text-white/90 mb-4">Encuentra especialistas en Ciudad de México.</p>
                            <span className="text-sm font-medium text-[#0071e3] group-hover:text-white flex items-center gap-1">
                                Ver doctores <ChevronRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link href="/padecimientos/diabetes/jalisco/guadalajara" className="group bg-[#f5f5f7] p-6 rounded-2xl hover:bg-[#0071e3] hover:text-white transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white text-[#0071e3] flex items-center justify-center">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-lg text-[#1d1d1f] group-hover:text-white">Diabetes</span>
                            </div>
                            <p className="text-sm text-[#86868b] group-hover:text-white/90 mb-4">Especialistas en Guadalajara.</p>
                            <span className="text-sm font-medium text-[#0071e3] group-hover:text-white flex items-center gap-1">
                                Ver doctores <ChevronRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link href="/especialidad/dentista-odontologo/ciudad-de-mexico" className="group bg-[#f5f5f7] p-6 rounded-2xl hover:bg-[#0071e3] hover:text-white transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white text-[#0071e3] flex items-center justify-center">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-lg text-[#1d1d1f] group-hover:text-white">Gingivitis</span>
                            </div>
                            <p className="text-sm text-[#86868b] group-hover:text-white/90 mb-4">Dentistas en Ciudad de México.</p>
                            <span className="text-sm font-medium text-[#0071e3] group-hover:text-white flex items-center gap-1">
                                Ver doctores <ChevronRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </div>
                </div>

                {/* 5️⃣ Navegación por Categorías */}
                <div className="animate-in fade-in slide-in-from-bottom-8">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 text-center">Categorías Principales</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                            href="/especialidades" 
                            className="bg-white border border-slate-200 px-8 py-4 rounded-full text-[#1d1d1f] font-semibold hover:border-[#0071e3] hover:text-[#0071e3] transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Stethoscope className="w-5 h-5" /> Especialidades Médicas
                        </Link>
                        <Link 
                            href="/padecimientos" 
                            className="bg-white border border-slate-200 px-8 py-4 rounded-full text-[#1d1d1f] font-semibold hover:border-[#0071e3] hover:text-[#0071e3] transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Activity className="w-5 h-5" /> Padecimientos y Condiciones
                        </Link>
                        <Link 
                            href="/enciclopedia" 
                            className="bg-[#0071e3] text-white border border-[#0071e3] px-8 py-4 rounded-full font-semibold shadow-sm flex items-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" /> Guías y Artículos
                        </Link>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 animate-in fade-in slide-in-from-bottom-8">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Nota importante</h3>
                        <p className="text-sm text-amber-900/80 leading-relaxed">
                            La Enciclopedia Médica de MediBusca ofrece información solamente. No proporciona diagnóstico, tratamiento ni citas médicas. Los pacientes se conectan directamente con los doctores para recibir atención profesional.
                        </p>
                    </div>
                </div>
            </div>
        </section>

      </EncyclopediaBrowser>
    </div>
  );
}
