'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

// 1. The Curated Static Data
const CATEGORIES = [
  {
    title: "Salud Mental y Emocional",
    description: "Incluye condiciones relacionadas con emociones, conducta y bienestar psicológico.",
    articles: [
      // Format: { name: "Display Text", slug: "exact-database-slug" }
      { name: "Ansiedad Generalizada: Síntomas, Diagnóstico y Tratamiento Integral", slug: "guia-ansiedad-sintomas-tratamiento" }, 
      { name: "Depresión Clínica: Síntomas, Causas y Tratamientos Efectivos", slug: "guia-completa-depresion-sintomas-ayuda" }, // <-- Update with your real DB slug
      { name: "Estrés Crónico: Síntomas, Consecuencias y Manejo Clínico", slug: "guia-estres-sintomas-manejo-salud" },       // <-- Update with your real DB slug
      { name: "Etapas del Duelo: Síntomas Psicológicos y Terapia para Sanar", slug: "guia-duelo-etapas-sanacion-emocional" },
      { name: "Ataques de Pánico: Síntomas, Causas y Tratamiento Inmediato", slug: "ataques-de-panico-sintomas-guia-detenerlos" },
      { name: "Trastorno de Ansiedad: Síntomas Físicos y Terapias Especializadas", slug: "guia-trastorno-ansiedad-sintomas-tratamiento" },
      { name: "Trastorno Bipolar: Síntomas, Fases y Tratamientos Psiquiátricos", slug: "guia-trastorno-bipolar-sintomas-ayuda" },
      { name: "Esquizofrenia: Primeros Síntomas, Diagnóstico y Tratamiento Médico", slug: "guia-esquizofrenia-sintomas-tratamiento-completo" },
      { name: "Bullying Escolar: Síntomas Psicológicos y Prevención Profesional", slug: "guia-bullying-sintomas-prevencion-escolar" },
      { name: "Baja Autoestima: Síntomas, Causas y Terapia Psicológica Efectiva", slug: "guia-baja-autoestima-sintomas-soluciones" },
      { name: "Depresión Posparto: Síntomas, Duración y Apoyo Psicológico", slug: "guia-depresion-posparto-sintomas-ayuda" },
      { name: "Trastornos del Sueño: Síntomas, Clínicas y Tratamiento Médico", slug: "guia-trastornos-del-sueno-sintomas-tratamiento" },
      { name: "Prevención del Suicidio: Señales de Alerta y Ayuda Psiquiátrica", slug: "guia-prevencion-comportamiento-suicida-ayuda" },
      { name: "Autismo (TEA): Primeros Síntomas, Diagnóstico y Terapias", slug: "guia-autismo-sintomas-diagnostico-apoyo" },
      { name: "TDAH en Niños y Adultos: Síntomas, Test y Tratamiento Profesional", slug: "guia-tdah-sintomas-tratamiento-apoyo" }
    ]
  },
  {
    title: "Salud Bucal y Dental",
    description: "Problemas relacionados con dientes, encías y mandíbula.",
    articles: [
      { name: "Caries Dentales: Síntomas, Prevención y Tratamientos Clínicos", slug: "guia-caries-dentales-sintomas-prevencion" },
      { name: "Dolor de Muelas: Causas, Síntomas y Atención de Urgencia Dental", slug: "guia-dolor-de-muelas-sintomas-remedios" },
      { name: "Bruxismo: Síntomas, Consecuencias y Tratamiento con Férula Dental", slug: "guia-bruxismo-sintomas-tratamiento-dental" }
      { name: "Gingivitis: Síntomas, Causas y Tratamiento Odontológico Efectivo", slug: "guia-gingivitis-sintomas-tratamiento" },
      { name: "Periodontitis (Piorrea): Síntomas y Tratamiento Periodontal Avanzado", slug: "periodontitis-sintomas-tratamiento-hueso" },
      { name: "Absceso Dental: Síntomas, Infección y Tratamiento de Urgencia", slug: "guia-absceso-dental-sintomas-tratamiento-urgente" },
      { name: "Sensibilidad Dentaria: Síntomas, Causas y Tratamiento Clínico", slug: "sensibilidad-dentaria-sintomas-tratamiento" },
      { name: "Desgaste Dental: Síntomas, Causas y Tratamientos de Reconstrucción", slug: "desgaste-dental-sintomas-tratamiento" },
      { name: "Dientes Apiñados: Síntomas, Causas y Tratamientos de Ortodoncia", slug: "dientes-apinados-sintomas-tratamiento-ortodoncia" }
      { name: "Diente Impactado: Síntomas, Riesgos y Cirugía de Extracción", slug: "diente-impactado-sintomas-tratamiento" },
      { name: "Muelas del Juicio: Síntomas, Dolor y Cuándo Requieren Extracción", slug: "muelas-del-juicio-sintomas-cirugia" },
      { name: "Halitosis (Mal Aliento): Causas, Síntomas y Tratamiento Definitivo", slug: "halitosis-sintomas-aliento-fresco" },
      { name: "Movilidad Dentaria: Síntomas y Tratamientos para Salvar tus Dientes", slug: "guia-movilidad-dentaria-sintomas-tratamiento" }
    ]
  },
  // Add your remaining categories following this exact same pattern...
];

export default function EncyclopediaCategories() {
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-[#0071e3]" />
        Explorar por Categorías
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {CATEGORIES.map((cat, index) => {
          const isOpen = openCategory === index;
          
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => toggleCategory(index)}
                className="w-full text-left p-5 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div>
                  <h3 className="font-semibold text-[#1d1d1f] text-lg leading-tight mb-1">{cat.title}</h3>
                  <p className="text-sm text-[#86868b] leading-relaxed line-clamp-2">{cat.description}</p>
                </div>
                <div className={`mt-1 shrink-0 p-1 rounded-full bg-[#f5f5f7] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-[#86868b]" />
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="border-t border-slate-100 bg-slate-50/50">
                  {cat.articles.map((article, i) => (
                    <Link 
                      key={i}
                      // Uses the exact database slug from the object!
                      href={`/enciclopedia/${article.slug}`} 
                      className="flex items-center justify-between p-4 pl-6 border-b border-slate-100 last:border-0 hover:bg-white transition-colors group"
                    >
                      <span className="text-[15px] font-medium text-[#1d1d1f]/90 group-hover:text-[#0071e3] transition-colors">
                        {article.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}