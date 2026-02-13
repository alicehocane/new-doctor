
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article } from '../../../types';
import { MapPin, CheckCircle, ArrowRight, AlertCircle, Info, BookOpen, ShieldCheck, Activity, Brain, HeartPulse, Stethoscope, Search } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, getDiseaseInfo, ALL_DISEASES, slugify, getStateForCity } from '../../../lib/constants';
import DiseaseDoctorList from '../../../components/DiseaseDoctorList';

const PAGE_SIZE = 8;

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

// --- Content Dictionary for Rich Pages ---
const getRichContent = (slug: string, name: string, genericDetails: { symptoms: string[], causes: string[] }) => {
  if (slug === 'ansiedad') {
    return {
      intro: "La ansiedad es una respuesta natural del cuerpo ante el estrés o situaciones percibidas como amenazantes. Sin embargo, cuando la ansiedad es persistente, intensa o interfiere con la vida diaria, puede convertirse en un trastorno que requiere atención médica y psicológica. En esta página encontrarás información clara y confiable sobre qué es la ansiedad, sus síntomas, causas, tipos y opciones de tratamiento.",
      whatIs: {
        title: "¿Qué es la Ansiedad?",
        text: "La ansiedad es un estado emocional caracterizado por preocupación excesiva, nerviosismo o miedo anticipatorio. A diferencia del estrés ocasional, la ansiedad clínica puede mantenerse durante semanas o meses y afectar el bienestar físico, mental y social de una persona."
      },
      symptoms: {
        title: "Síntomas Comunes de la Ansiedad",
        intro: "Los síntomas pueden variar según la persona y el tipo de ansiedad, pero suelen incluir:",
        groups: [
          { name: "Síntomas emocionales", items: ["Preocupación constante o pensamientos repetitivos", "Sensación de peligro inminente", "Dificultad para concentrarse", "Irritabilidad"] },
          { name: "Síntomas físicos", items: ["Palpitaciones o taquicardia", "Sudoración excesiva", "Tensión muscular", "Dificultad para respirar", "Problemas gastrointestinales", "Trastornos del sueño"] }
        ],
        warning: "Si los síntomas son intensos, persistentes o empeoran, es importante buscar orientación médica."
      },
      types: {
        title: "Tipos de Trastornos de Ansiedad",
        intro: "La ansiedad puede manifestarse de diferentes formas, entre ellas:",
        items: ["Trastorno de ansiedad generalizada (TAG)", "Trastorno de pánico", "Fobias específicas", "Ansiedad social", "Trastorno obsesivo-compulsivo (TOC)", "Trastorno de estrés postraumático (TEPT)"],
        note: "Cada tipo tiene características y tratamientos específicos."
      },
      causes: {
        title: "Causas y Factores de Riesgo",
        intro: "La ansiedad suele ser el resultado de una combinación de factores:",
        items: ["Estrés prolongado", "Experiencias traumáticas", "Factores genéticos", "Desequilibrios químicos en el cerebro", "Problemas de salud física", "Consumo excesivo de cafeína, alcohol o drogas"]
      },
      diagnosis: {
        title: "¿Cómo se Diagnostica la Ansiedad?",
        intro: "El diagnóstico generalmente lo realiza un profesional de la salud mediante:",
        items: ["Entrevista clínica", "Evaluación de síntomas", "Historial médico y emocional", "Descarte de otras condiciones médicas"],
        note: "No existen pruebas de laboratorio específicas para la ansiedad, pero pueden usarse estudios para descartar causas físicas."
      },
      treatment: {
        title: "Tratamientos para la Ansiedad",
        intro: "El tratamiento depende del tipo y la gravedad, e incluye:",
        subsections: [
            { title: "Opciones comunes", items: ["Psicoterapia (como terapia cognitivo-conductual)", "Medicación (cuando es indicada por un médico)", "Técnicas de relajación y manejo del estrés", "Cambios en el estilo de vida (ejercicio, sueño, alimentación)"] }
        ],
        note: "Muchas personas mejoran significativamente con el tratamiento adecuado y seguimiento profesional."
      },
      whenToSeekHelp: {
        title: "¿Cuándo Buscar Ayuda Profesional?",
        intro: "Se recomienda buscar ayuda cuando:",
        items: ["La ansiedad interfiere con el trabajo, estudios o relaciones", "Los síntomas duran varias semanas", "Hay ataques de pánico frecuentes", "Aparecen pensamientos negativos persistentes"]
      }
    };
  }
  
  // Generic Fallback generator
  return {
      intro: `Información detallada sobre ${name}, sus síntomas, causas y opciones de tratamiento. En MediBusca te ayudamos a entender esta condición y encontrar especialistas.`,
      whatIs: {
          title: `¿Qué es ${name}?`,
          text: `${name} es una condición de salud que afecta a muchas personas. Comprender sus características es el primer paso para un manejo adecuado.`
      },
      symptoms: {
          title: `Síntomas de ${name}`,
          intro: "Los signos y síntomas pueden incluir:",
          groups: [{ name: "Comunes", items: genericDetails.symptoms.length > 0 ? genericDetails.symptoms : ["Consulte a un médico para una evaluación detallada."] }],
          warning: "Si presentas síntomas persistentes, consulta a un especialista."
      },
      types: null,
      causes: {
        title: "Causas y Factores de Riesgo",
        intro: "Los factores que pueden contribuir incluyen:",
        items: genericDetails.causes.length > 0 ? genericDetails.causes : ["Factores genéticos", "Estilo de vida", "Condiciones ambientales"]
      },
      diagnosis: {
        title: "Diagnóstico",
        intro: "El diagnóstico es realizado por un profesional médico a través de:",
        items: ["Evaluación clínica", "Historial médico", "Pruebas específicas según sea necesario"],
        note: ""
      },
      treatment: {
        title: "Tratamiento",
        intro: "Las opciones de tratamiento pueden incluir:",
        subsections: [
            { title: "General", items: ["Manejo de síntomas", "Medicamentos bajo prescripción", "Terapias específicas"] }
        ],
        note: "El plan de tratamiento debe ser personalizado por un doctor."
      },
      whenToSeekHelp: {
        title: "¿Cuándo ver a un doctor?",
        intro: "Es recomendable acudir a consulta si:",
        items: ["Los síntomas interfieren con la vida diaria", "Hay dolor o malestar persistente", "Existe preocupación sobre la salud"]
      }
  };
};

// --- Metadata ---

export async function generateMetadata({ params }: { params: { disease: string } }): Promise<Metadata> {
  const { name: diseaseName } = getDiseaseInfo(params.disease);
  
  return {
    title: `Todo sobre ${diseaseName} - Síntomas, Causas y Tratamiento | MediBusca`,
    description: `Guía completa sobre ${diseaseName}. Conoce qué es, sus síntomas, causas y cómo se diagnostica. Encuentra especialistas en ${diseaseName} cerca de ti.`,
  };
}

// --- Server Component ---

export default async function DiseasePage({ params }: { params: { disease: string } }) {
  const diseaseSlug = params.disease;
  const { name: diseaseName, primarySpecialty: targetSpecialty, details } = getDiseaseInfo(diseaseSlug);
  const content = getRichContent(diseaseSlug, diseaseName, details);

  // 1. Fetch Initial Doctors (Supporting list)
  let query = supabase.from('doctors').select('*');
  if (targetSpecialty) {
      query = query.contains('specialties', [targetSpecialty]);
  } else {
      query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
  }
  const { data: rawDoctors } = await query.range(0, PAGE_SIZE - 1);
  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  const isKnownDisease = ALL_DISEASES.includes(diseaseName);
  if (doctors.length === 0 && !isKnownDisease && diseaseSlug !== 'ansiedad') { // Allow 'ansiedad' even if no docs locally for now
    notFound();
  }

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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": diseaseName,
        "item": `https://medibusca.com/padecimientos/${diseaseSlug}`
      }
    ]
  };

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": diseaseName,
    "description": content.intro,
    "possibleTreatment": content.treatment.subsections.flatMap(s => s.items).map(t => ({ "@type": "MedicalTherapy", "name": t })),
    "signOrSymptom": content.symptoms.groups.flatMap(g => g.items).map(s => ({ "@type": "MedicalSymptom", "name": s })),
    "riskFactor": content.causes.items.map(c => ({ "@type": "MedicalRiskFactor", "name": c }))
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* 1️⃣ Header */}
        <header className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <nav className="text-sm font-medium text-[#86868b] flex items-center flex-wrap">
                <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <Link href="/padecimientos" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
                <span className="mx-2 text-[#d2d2d7]">/</span>
                <span className="text-[#1d1d1f] font-semibold">{diseaseName}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
                {diseaseName}
            </h1>
            
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm leading-relaxed text-lg text-[#1d1d1f]/80">
                {content.intro}
            </div>
        </header>

        {/* 2️⃣ What Is It? */}
        <section className="animate-in fade-in slide-in-from-bottom-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                <Info className="w-7 h-7 text-[#0071e3]" />
                {content.whatIs.title}
            </h2>
            <p className="text-lg text-[#1d1d1f]/80 leading-relaxed">
                {content.whatIs.text}
            </p>
        </section>

        {/* 3️⃣ Symptoms */}
        <section className="bg-white rounded-[32px] p-8 border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                <Activity className="w-7 h-7 text-[#0071e3]" />
                {content.symptoms.title}
            </h2>
            <p className="text-[#86868b] mb-6 text-lg">{content.symptoms.intro}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
                {content.symptoms.groups.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="font-semibold text-[#1d1d1f] mb-3 text-lg border-b border-slate-100 pb-2">{group.name}</h3>
                        <ul className="space-y-3">
                            {group.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#1d1d1f]/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2.5 shrink-0"></div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <p className="font-medium text-sm md:text-base">{content.symptoms.warning}</p>
            </div>
        </section>

        {/* 4️⃣ Types (Optional) */}
        {content.types && (
            <section className="animate-in fade-in slide-in-from-bottom-5">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4">
                    {content.types.title}
                </h2>
                <p className="text-lg text-[#1d1d1f]/80 mb-6">{content.types.intro}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {content.types.items.map((type, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#0071e3] shrink-0"></div>
                            <span className="font-medium text-[#1d1d1f]">{type}</span>
                        </div>
                    ))}
                </div>
                {content.types.note && (
                    <p className="mt-4 text-[#86868b] text-sm">{content.types.note}</p>
                )}
            </section>
        )}

        {/* 5️⃣ Causes */}
        <section className="animate-in fade-in slide-in-from-bottom-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-[#0071e3]" />
                {content.causes.title}
            </h2>
            <p className="text-lg text-[#1d1d1f]/80 mb-6">{content.causes.intro}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
                {content.causes.items.map((cause, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#1d1d1f]/80 bg-white p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                        {cause}
                    </li>
                ))}
            </ul>
        </section>

        {/* 6️⃣ Diagnosis */}
        <section className="bg-[#f5f5f7] border border-slate-200 rounded-[32px] p-8 animate-in fade-in slide-in-from-bottom-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                <Stethoscope className="w-7 h-7 text-[#0071e3]" />
                {content.diagnosis.title}
            </h2>
            <p className="text-lg text-[#1d1d1f]/80 mb-6">{content.diagnosis.intro}</p>
            <ul className="space-y-3 mb-6">
                {content.diagnosis.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#1d1d1f]">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0071e3] shrink-0 border border-slate-200 text-sm font-bold">
                            {i + 1}
                        </div>
                        <span className="mt-0.5">{item}</span>
                    </li>
                ))}
            </ul>
            {content.diagnosis.note && (
                <p className="text-sm text-[#86868b] bg-white p-4 rounded-xl border border-slate-200 inline-block">
                    {content.diagnosis.note}
                </p>
            )}
        </section>

        {/* 7️⃣ Treatments */}
        <section className="animate-in fade-in slide-in-from-bottom-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-3">
                <HeartPulse className="w-7 h-7 text-[#0071e3]" />
                {content.treatment.title}
            </h2>
            <p className="text-lg text-[#1d1d1f]/80 mb-8">{content.treatment.intro}</p>
            
            <div className="grid gap-6">
                {content.treatment.subsections.map((sub, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#1d1d1f] mb-4 text-lg">{sub.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {sub.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                                    <span className="text-[#1d1d1f]/80 text-sm md:text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {content.treatment.note && (
                <p className="mt-6 text-center text-[#86868b] italic">{content.treatment.note}</p>
            )}
        </section>

        {/* 8️⃣ When to seek help */}
        <section className="bg-blue-50 rounded-[32px] p-8 md:p-12 border border-blue-100 animate-in fade-in slide-in-from-bottom-7">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-3">
                <Brain className="w-7 h-7 text-[#0071e3]" />
                {content.whenToSeekHelp.title}
            </h2>
            <p className="text-lg text-[#1d1d1f]/80 mb-6">{content.whenToSeekHelp.intro}</p>
            <div className="grid sm:grid-cols-2 gap-4">
                {content.whenToSeekHelp.items.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[#1d1d1f] font-medium">{item}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 9️⃣ Local Treatment Links */}
        <section className="pt-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6">Tratamiento de {diseaseName} en tu Ciudad</h2>
            <p className="text-lg text-[#86868b] mb-8">
                Si buscas atención médica o psicológica especializada, puedes explorar opciones de tratamiento disponibles cerca de ti:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {POPULAR_CITIES.slice(0, 6).map((city) => {
                    const stateSlug = getStateForCity(city);
                    return (
                        <Link 
                            key={city}
                            href={`/padecimientos/${diseaseSlug}/${slugify(city)}`}
                            className="
                                flex items-center justify-between p-5 
                                bg-white border border-slate-200 rounded-2xl 
                                hover:border-[#0071e3] hover:shadow-md transition-all group
                            "
                        >
                            <span className="font-semibold text-[#1d1d1f]">{diseaseName} en {city}</span>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0071e3] transition-colors" />
                        </Link>
                    );
                })}
            </div>

            {/* Doctor Listings as Support */}
            {doctors.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#86868b]" />
                        Especialistas disponibles recientemente
                    </h3>
                    <DiseaseDoctorList 
                        initialDoctors={doctors.slice(0, 4)} 
                        diseaseName={diseaseName} 
                        targetSpecialty={targetSpecialty} 
                    />
                    <div className="mt-8 text-center">
                        <Link href="/buscar" className="text-[#0071e3] font-medium hover:underline inline-flex items-center gap-1">
                            Ver todos los especialistas <Search className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </section>

        {/* 🔟 Related Resources */}
        <section className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8">Recursos Relacionados</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/especialidades" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Stethoscope className="w-5 h-5" /> Especialistas Médicos
                </Link>
                <Link href="/padecimientos" className="bg-white border border-slate-200 px-6 py-4 rounded-full font-medium text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> Otros Padecimientos
                </Link>
                <Link href="/enciclopedia" className="bg-[#0071e3] text-white px-6 py-4 rounded-full font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                    <BookOpen className="w-5 h-5" /> Guías Médicas
                </Link>
            </div>
        </section>

      </div>
    </div>
  );
}
