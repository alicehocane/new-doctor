'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { Stethoscope, ArrowRight, Activity, MapPin, Plus, Search, Phone, ShieldCheck, HeartPulse } from 'lucide-react';
import { COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../lib/constants';

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

  useEffect(() => {
    document.title = "Especialidades Médicas - Directorio Completo | MediBusca";
  }, []);

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const sortedSpecialties = useMemo(() => {
    const popularSet = new Set(POPULAR_SPECIALTIES);
    const others = COMMON_SPECIALTIES.filter(s => !popularSet.has(s));
    return [...POPULAR_SPECIALTIES, ...others];
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Story Part 1: The Vision */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Toda la medicina en un solo lugar.
            </h1>
            <p className="text-xl md:text-2xl text-[#86868b] max-w-3xl mx-auto font-medium leading-relaxed">
                Desde medicina general hasta subespecialidades complejas. 
                Navega por nuestro directorio y conecta con expertos verificados en todo México.
            </p>
        </div>

        {/* Story Part 2: Trust & Ease (The Intro Box) */}
        <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" /> Directorio Gratuito
                    </div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra al médico que realmente necesitas</h2>
                    <p className="text-[#86868b] leading-relaxed text-lg mb-6">
                        En MediBusca, eliminamos las barreras entre tú y tu salud. No somos intermediarios; somos el puente que te permite ver perfiles reales, verificar experiencia y llamar al consultorio de forma directa y gratuita.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1d1d1f]">100%</div>
                            <div className="text-xs text-[#86868b] uppercase font-bold">Verificados</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1d1d1f]">Directo</div>
                            <div className="text-xs text-[#86868b] uppercase font-bold">Sin Comisiones</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {['Cardiología', 'Pediatría', 'Dermatología', 'Psicología'].map((s, i) => (
                        <div key={i} className="p-6 bg-[#f5f5f7] rounded-2xl flex flex-col items-center text-center">
                            <HeartPulse className="w-6 h-6 text-[#0071e3] mb-2" />
                            <span className="font-bold text-[#1d1d1f] text-sm">{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Story Part 3: Exploration (The Grid) */}
        <div className="mb-8 flex items-end justify-between px-2">
            <div>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">Explorar por Especialidad</h3>
                <p className="text-[#86868b]">Selecciona una categoría para ver doctores disponibles</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {sortedSpecialties.slice(0, visibleCount).map((spec) => (
                <Link key={spec} href={`/especialidad/${slugify(spec)}`}
                    className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0071e3] hover:shadow-md transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3]/10 transition-colors">
                            <Search className="w-5 h-5 text-[#86868b] group-hover:text-[#0071e3]" />
                        </div>
                        <span className="font-bold text-[#1d1d1f] text-[15px] group-hover:text-[#0071e3] transition-colors">{spec}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>

        {/* Story Part 4: Educational Context (The Connection) */}
        <section className="mt-32 pt-16 border-t border-slate-200">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿No sabes a qué médico acudir?</h2>
                        <p className="text-lg text-[#86868b] mb-6">
                            A veces los síntomas no son claros. Aquí te mostramos los padecimientos más comunes y qué especialista los trata.
                        </p>
                        <Link href="/enfermedades" className="inline-flex items-center gap-2 text-[#0071e3] font-bold hover:gap-3 transition-all">
                            Ver guía completa de enfermedades <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {COMMON_DISEASES.map((disease) => (
                        <Link key={disease.name} href={`/enfermedad/${slugify(disease.name)}`}
                            className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all group"
                        >
                            <div>
                                <h4 className="font-bold text-[#1d1d1f] text-lg group-hover:text-[#0071e3]">{disease.name}</h4>
                                <p className="text-sm text-[#86868b]">Tratado por: <span className="text-[#1d1d1f] font-medium">{disease.category}</span></p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#d2d2d7] group-hover:bg-[#0071e3] group-hover:text-white transition-all">
                                <Plus className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* Story Part 5: Hyper-Local Focus */}
        <section className="mt-32 pt-16 border-t border-slate-200">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#1d1d1f]">Especialistas en tu ciudad</h2>
                <p className="text-[#86868b]">La mejor atención médica, a solo unos minutos de casa.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[#0071e3] flex items-center justify-center text-white">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1d1d1f]">{city}</h3>
                        </div>
                        <ul className="space-y-4">
                            {TOP_SPECIALTIES.map((spec) => (
                                <li key={spec}>
                                    <Link href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                        className="text-[15px] text-[#86868b] hover:text-[#0071e3] flex items-center justify-between group"
                                    >
                                        <span>{spec}</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link href={`/doctores/${slugify(city)}`} className="mt-8 block text-center py-3 bg-[#f5f5f7] rounded-xl text-sm font-bold text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors">
                            Ver todos en {city}
                        </Link>
                    </div>
                ))}
             </div>
        </section>

      </div>
    </div>
  );
}