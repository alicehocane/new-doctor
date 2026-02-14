
import React from 'react';
import { Activity, Search, ShieldCheck, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Article } from '../../types';
import EncyclopediaBrowser from '../../components/EncyclopediaBrowser';
import { Metadata } from 'next';

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Enciclopedia Médica y Artículos de Salud",
  description: "Biblioteca de salud de MediBusca. Artículos verificados sobre bienestar, prevención y medicina escritos por expertos.",
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
    "name": "Enciclopedia Médica y Artículos de Salud | MediBusca",
    "description": "Biblioteca de salud de MediBusca. Artículos verificados sobre bienestar, prevención y medicina escritos por expertos.",
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
      <EncyclopediaBrowser initialArticles={initialArticles}>
        
        {/* SEO / Informational Content Section (Static Server Content passed as children) */}
        <section className="mt-24 pt-16 border-t border-slate-200">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
                     <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                        Biblioteca de Salud y Divulgación Médica
                     </h2>
                     <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                        La Enciclopedia Médica de MediBusca es tu fuente de <strong>guías clínicas</strong> y recursos de <strong>bienestar preventivo</strong>. Diseñada para pacientes en México, ofrecemos información clara sobre síntomas, protocolos de salud y los especialistas adecuados para cada condición.
                     </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16 animate-in fade-in slide-in-from-bottom-6">
                    <div>
                        <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                                <Activity className="w-4 h-4" />
                             </div>
                             Cómo te ayuda la Enciclopedia
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Conocer problemas de salud y enfermedades comunes', 
                                'Entender los síntomas y señales de alerta temprana', 
                                'Descubrir opciones de tratamiento y cuidados preventivos', 
                                'Encontrar doctores que pueden ayudarte con cada condición',
                                'Validar la especialidad del médico tratante a través de nuestra base de datos cotejada con la SEP'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b] leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                                <Search className="w-4 h-4" />
                             </div>
                             Fácil de usar
                        </h3>
                        <p className="text-[#86868b] mb-4 leading-relaxed">La Enciclopedia Médica de MediBusca es muy fácil de leer. Puedes buscar por:</p>
                        <ul className="space-y-3">
                            {['Enfermedad o condición de salud', 'Parte del cuerpo o sistema (como corazón, pulmones o piel)', 'Especialidad del doctor (como cardiología o pediatría)'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b] leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-[#86868b] mt-4 leading-relaxed">Cada página explica la condición con palabras simples. También muestra qué doctores pueden ayudar y cómo contactarlos directamente.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 mb-16 animate-in fade-in slide-in-from-bottom-8">
                     <h3 className="text-xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                         <ShieldCheck className="w-6 h-6 text-[#0071e3]" />
                         Por qué MediBusca es confiable
                     </h3>
                     <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            'Información basada en protocolos de salud en México', 
                            'Contenido verificado por profesionales', 
                            'Se actualiza regularmente para mantener vigencia médica', 
                            'Te ayuda a tomar decisiones informadas sobre tu salud'
                        ].map((item, i) => (
                             <div key={i} className="flex items-start gap-3 text-[#86868b]">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                             </div>
                        ))}
                     </div>
                </div>

                <div className="bg-[#f0f5fa] border border-[#dcecfc] rounded-xl p-6 flex gap-4 animate-in fade-in slide-in-from-bottom-8">
                    <FileText className="w-6 h-6 text-[#0071e3] shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-[#1d1d1f] mb-1">Nota legal y responsabilidad</h3>
                        <p className="text-sm text-[#526075] leading-relaxed">
                            La Enciclopedia Médica de MediBusca ofrece información solamente con fines de divulgación. No proporciona diagnóstico, tratamiento ni citas médicas automáticas. Los pacientes se conectan directamente con los doctores para recibir atención profesional personalizada.
                        </p>
                    </div>
                </div>
            </div>
        </section>

      </EncyclopediaBrowser>
    </div>
  );
}
