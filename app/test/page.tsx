import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, BookOpen, Activity, AlertCircle, HeartPulse, Brain, Info } from 'lucide-react';
import { ALL_DISEASES, slugify } from '../../lib/constants';
import DiseaseList from '../../components/DiseaseList';
import { Metadata } from 'next';
import { supabase } from '../../lib/supabase';

export const metadata: Metadata = {
  title: "Padecimientos y Condiciones Médicas | MediBusca",
  description: "Conoce los padecimientos y condiciones de salud más frecuentes. Aprende sobre sus síntomas, causas y tratamientos recomendados.",
};

const FEATURED_CONDITIONS = [
  { 
    name: 'Ansiedad', 
    description: 'Trastorno emocional común que afecta la salud mental y física; aprende a reconocer sus síntomas y opciones de tratamiento.',
    icon: Brain
  },
  { 
    name: 'Diabetes', 
    description: 'Enfermedad crónica que altera la forma en que el cuerpo maneja el azúcar en la sangre; conoce sus tipos y cuidados.',
    icon: Activity
  },
  { 
    name: 'Hipertensión', 
    description: 'Condición de presión arterial elevada que puede causar complicaciones cardiovasculares; descubre prevención y tratamiento.',
    icon: HeartPulse
  },
  { 
    name: 'Dolor de cabeza', 
    description: 'Identifica las causas más comunes del dolor de cabeza, migrañas y cómo aliviarlos de forma segura.',
    icon: AlertCircle
  },
  { 
    name: 'Obesidad', 
    description: 'Acumulación anormal o excesiva de grasa que puede ser perjudicial para la salud.',
    icon: Activity
  },
  { 
    name: 'Gastritis', 
    description: 'Inflamación del revestimiento del estómago que causa dolor y malestar digestivo.',
    icon: Info
  }
];

const CITY_HUBS = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla'
];

export default async function DiseasesIndexPage() {
  
  // Fetch recent articles for the "Related Guides" section
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, category')
    .limit(3)
    .order('published_at', { ascending: false });

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
        "item": "https://medibusca.com/padecimientos"
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Padecimientos y Condiciones Médicas",
    "description": "Guía completa de padecimientos, síntomas y tratamientos médicos.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": FEATURED_CONDITIONS.map((cond, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": cond.name,
        "url": `https://medibusca.com/padecimientos/${slugify(cond.name)}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* 1️⃣ Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
            Padecimientos y Condiciones Médicas
          </h1>
          <p className="text-xl text-[#86868b] max-w-3xl mx-auto font-normal leading-relaxed">
            Conoce los padecimientos y condiciones de salud más frecuentes. Aprende sobre sus síntomas, causas y tratamientos recomendados, y encuentra especialistas en tu ciudad si necesitas atención profesional.
          </p>
        </div>

        {/* 2️⃣ Featured Conditions */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#0071e3]" />
                Condiciones de Salud Relevantes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURED_CONDITIONS.map((cond) => (
                    <Link 
                        key={cond.name}
                        href={`/padecimientos/${slugify(cond.name)}`}
                        className="
                            group flex flex-col p-6 bg-white border border-slate-200 rounded-[24px]
                            hover:border-[#0071e3] hover:shadow-lg transition-all duration-300
                            cursor-pointer h-full
                        "
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                <cond.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-xl text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                                {cond.name}
                            </h3>
                        </div>
                        <p className="text-sm text-[#86868b] leading-relaxed flex-1">
                            {cond.description}
                        </p>
                        <div className="mt-4 flex items-center text-sm font-medium text-[#0071e3] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            Leer más <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* 3️⃣ Identification Guide */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mb-20 shadow-sm animate-in fade-in slide-in-from-bottom-5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿Cómo Saber Qué Condición Puedes Tener?</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Conocer los síntomas y signos de cada padecimiento te permite tomar decisiones informadas sobre tu salud. Antes de buscar tratamiento, revisa nuestros artículos para identificar la condición correcta.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/padecimientos/ansiedad" className="block bg-[#f5f5f7] p-5 rounded-2xl hover:bg-[#e8e8ed] transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div> Ansiedad
                        </h4>
                        <p className="text-sm text-[#86868b]">Nerviosismo, insomnio, palpitaciones y preocupación constante.</p>
                    </Link>
                    <Link href="/padecimientos/diabetes" className="block bg-[#f5f5f7] p-5 rounded-2xl hover:bg-[#e8e8ed] transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Diabetes
                        </h4>
                        <p className="text-sm text-[#86868b]">Sed constante, fatiga extrema, visión borrosa y pérdida de peso.</p>
                    </Link>
                    <Link href="/padecimientos/hipertension" className="block bg-[#f5f5f7] p-5 rounded-2xl hover:bg-[#e8e8ed] transition-colors">
                        <h4 className="font-bold text-[#1d1d1f] mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> Hipertensión
                        </h4>
                        <p className="text-sm text-[#86868b]">Dolor de cabeza matutino, mareos, zumbido en oídos.</p>
                    </Link>
                </div>
            </div>
        </section>

        {/* 4️⃣ Local Treatment */}
        <section className="mb-20 border-t border-slate-200 pt-16 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra Tratamiento en Tu Ciudad</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Una vez que comprendas tu padecimiento, consulta nuestros listados de doctores y especialistas en tu ciudad para recibir atención confiable y cercana.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CITY_HUBS.map((city) => {
                    return (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="
                                group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl
                                hover:border-[#0071e3] hover:shadow-md transition-all
                            "
                        >
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-[#1d1d1f]">{city}</span>
                        </Link>
                    );
                })}
            </div>
        </section>

        {/* 5️⃣ Related Guides */}
        {articles && articles.length > 0 && (
            <section className="mb-20 animate-in fade-in slide-in-from-bottom-6">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-[#0071e3]" />
                    Aprende Más Sobre Cada Padecimiento
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {articles.map((article: any) => (
                        <Link key={article.slug} href={`/enciclopedia/${article.slug}`}>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all h-full flex flex-col justify-between group">
                                <div>
                                    <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wide mb-2 block">
                                        {article.category?.split(',')[0] || 'Guía Médica'}
                                    </span>
                                    <h3 className="font-bold text-lg text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">{article.title}</h3>
                                </div>
                                <span className="text-sm font-medium text-[#86868b] flex items-center gap-1 mt-4">
                                    Leer artículo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* 6️⃣ Full Search List */}
        <section className="pt-16 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">Diccionario Completo de Padecimientos</h2>
            <DiseaseList allDiseases={ALL_DISEASES} />
        </section>

      </div>
    </div>
  );
}
