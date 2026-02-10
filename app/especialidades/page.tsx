'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Stethoscope, 
  ArrowRight, 
  Activity, 
  MapPin, 
  Plus, 
  Search, 
  Phone, 
  ShieldCheck, 
  HeartPulse, 
  ChevronRight 
} from 'lucide-react';
import { ALL_DISEASES, ALL_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../lib/constants';

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

const FEATURED_CITIES = ['Ciudad de México', 'Guadalajara', 'Monterrey'];
const TOP_SPECIALTIES = ['Dentista', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista'];

export default function SpecialtiesIndexPage() {
  const [visibleCount, setVisibleCount] = useState(24);

  // SEO
  useEffect(() => {
    document.title = "Especialidades Médicas - Directorio Completo | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Explora todas las especialidades médicas disponibles en MediBusca. Encuentra expertos para cada necesidad de salud de forma gratuita.");
  }, []);

  const slugify = (text) => {
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

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Story Part 1: The Vision */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Toda la medicina. <br className="hidden md:block" /> En un solo lugar.
            </h1>
            <p className="text-xl md:text-2xl text-[#86868b] max-w-3xl mx-auto font-medium leading-relaxed">
                Desde medicina preventiva hasta subespecialidades de alta complejidad. 
                Navega por nuestro directorio y conecta con expertos verificados.
            </p>
        </div>

        {/* Story Part 2: The Trust Bridge (Intro Box) */}
        <div className="max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" /> Directorio Médico Gratuito
                    </div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] leading-tight">Encuentra al médico que realmente necesitas</h2>
                    <p className="text-[#86868b] leading-relaxed text-lg">
                        En MediBusca, eliminamos las barreras entre tú y tu bienestar. No somos intermediarios; somos el puente que te permite ver perfiles reales, verificar certificaciones y llamar al consultorio de forma directa.
                    </p>
                    <div className="flex items-center gap-8 pt-2">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#1d1d1f]">100%</span>
                            <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-widest">Verificados</span>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#1d1d1f]">Directo</span>
                            <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-widest">Sin Comisiones</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {['Cardiología', 'Pediatría', 'Dermatología', 'Psicología'].map((s, i) => (
                        <div key={i} className="p-6 bg-[#f5f5f7] rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-md transition-all">
                            <HeartPulse className="w-6 h-6 text-[#0071e3] mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-[#1d1d1f] text-sm">{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Story Part 3: Exploration (The Main Grid) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">Explorar por Especialidad</h3>
                <p className="text-[#86868b]">Contamos con la red más amplia de profesionales certificados</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#86868b] bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <Search className="w-4 h-4" />
                <span>{sortedSpecialties.length} especialidades listadas</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 animate-in fade-in slide-in-from-bottom-8">
            {sortedSpecialties.slice(0, visibleCount).map((spec) => (
                <Link key={spec} href={`/especialidad/${slugify(spec)}`}
                    className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0071e3] hover:shadow-[0_10px_30px_-10px_rgba(0,113,227,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3]/10 transition-colors">
                            <Stethoscope className="w-5 h-5 text-[#86868b] group-hover:text-[#0071e3]" />
                        </div>
                        <span className="font-bold text-[#1d1d1f] text-[15px] group-hover:text-[#0071e3] transition-colors">{spec}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedSpecialties.length && (
            <div className="mt-12 text-center">
                <button 
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-full text-[15px] font-bold text-[#1d1d1f] hover:bg-white hover:border-[#0071e3] hover:text-[#0071e3] hover:shadow-md transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Mostrar más especialidades
                </button>
            </div>
        )}

        {/* Story Part 4: Symptom-to-Specialist Connection */}
        <section className="mt-32 pt-20 border-t border-slate-200">
            <div className="grid lg:grid-cols-3 gap-16 items-start">
                <div className="lg:col-span-1 lg:sticky lg:top-8">
                    <div className="w-12 h-12 bg-[#0071e3] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#0071e3]/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4 leading-tight">¿No sabes a qué médico acudir?</h2>
                    <p className="text-lg text-[#86868b] mb-8 leading-relaxed">
                        A veces los síntomas no son claros. Hemos diseñado esta guía para conectar tus dudas con la especialidad médica correcta.
                    </p>
                    <Link href="/enfermedades" className="inline-flex items-center gap-2 text-[#0071e3] font-bold hover:gap-3 transition-all group">
                        Ver guía completa de enfermedades 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {COMMON_DISEASES.map((disease) => (
                        <Link key={disease.name} href={`/enfermedad/${slugify(disease.name)}`}
                            className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[24px] hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                        >
                            <div className="space-y-1">
                                <h4 className="font-bold text-[#1d1d1f] text-lg group-hover:text-[#0071e3] transition-colors">{disease.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Tratado por:</span>
                                    <span className="text-xs bg-[#f5f5f7] px-2 py-0.5 rounded-md font-bold text-[#1d1d1f]">{disease.category}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#d2d2d7] group-hover:bg-[#0071e3] group-hover:text-white transition-all">
                                <Plus className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* Story Part 5: Local Access (The City Grid) */}
        <section className="mt-32 pt-20 border-t border-slate-200">
             <div className="max-w-3xl mb-12">
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-3 tracking-tight">Especialistas cerca de casa</h2>
                <p className="text-lg text-[#86868b]">
                    La mejor atención médica no debe implicar viajes largos. Encuentra consultorios equipados y especialistas certificados en tu propia ciudad.
                </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#0071e3]">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1d1d1f]">{city}</h3>
                                <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Principales Sedes</p>
                            </div>
                        </div>
                        <ul className="space-y-1 flex-1">
                            {TOP_SPECIALTIES.map((spec) => (
                                <li key={spec}>
                                    <Link href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                        className="text-[15px] text-[#86868b] hover:text-[#0071e3] flex items-center justify-between group py-2 border-b border-slate-50 transition-colors"
                                    >
                                        <span>{spec}</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link href={`/doctores/${slugify(city)}`} 
                            className="mt-8 flex items-center justify-center gap-2 py-4 bg-[#1d1d1f] rounded-2xl text-sm font-bold text-white hover:bg-[#0071e3] transition-colors shadow-lg shadow-slate-200"
                        >
                            Explorar {city} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ))}
             </div>
        </section>

      </div>
    </div>
  );
}