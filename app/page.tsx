'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Stethoscope, ChevronRight, Activity, ArrowUpRight, Check, ShieldCheck, Heart, Users, BookOpen, Scale, Award, FileText } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { ALL_CITIES, COMMON_SPECIALTIES, ALL_DISEASES } from '../lib/constants';

const FEATURED_CITIES = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla'];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "MediBusca - Directorio Médico Verificado y Guía de Salud en México";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Acceda a información médica confiable y encuentre especialistas verificados en México. Una plataforma transparente para conectar pacientes con la salud.");
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

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpecialty(val);
    if (val.length > 0) {
      const normalizedVal = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filteredSpecs = COMMON_SPECIALTIES.filter(s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedVal));
      const filteredDiseases = ALL_DISEASES.filter(d => d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedVal));
      setSuggestions([...filteredSpecs, ...filteredDiseases].slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && specialty.trim()) {
      const citySlug = slugify(city);
      const termSlug = slugify(specialty.trim()); 
      const isDisease = ALL_DISEASES.some(d => slugify(d) === termSlug);
      setLocation(isDisease ? `/enfermedad/${termSlug}/${citySlug}` : `/doctores/${citySlug}/${termSlug}`);
    }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden bg-[#f5f5f7]">
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 md:py-32 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Información Médica Transparente
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter text-[#1d1d1f] leading-[1.1]">
            Salud, <br /> simplificada.
          </h1>
          <p className="text-xl md:text-3xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed">
            Encuentre especialistas certificados y contenido médico verificado en todo México.
          </p>
          
          <div className="mt-12 mx-auto max-w-3xl relative" ref={wrapperRef}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-2 p-3 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-slate-300/40">
              <div className="relative w-full md:w-1/3 h-14 bg-[#f5f5f7] rounded-[1.8rem] flex items-center px-5">
                <MapPin className="w-5 h-5 text-[#86868b] mr-3" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-semibold text-base appearance-none cursor-pointer">
                  {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronRight className="w-3 h-3 text-[#86868b] absolute right-5 rotate-90" />
              </div>

              <div className="relative w-full md:flex-1 h-14 bg-[#f5f5f7] rounded-[1.8rem] flex items-center px-5">
                <Search className="w-5 h-5 text-[#86868b] mr-3" />
                <input type="text" value={specialty} onChange={handleSpecialtyChange} onFocus={() => specialty.length > 0 && setShowSuggestions(true)} placeholder="Especialidad o Síntoma" className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-semibold text-base" autoComplete="off" />
              </div>

              <button type="submit" className="h-14 px-10 bg-[#0071e3] text-white font-bold text-lg rounded-[1.8rem] hover:bg-[#0077ED] transition-all shadow-lg shadow-[#0071e3]/20">
                Buscar
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 px-2 z-50">
                 <ul className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-50">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => { setSpecialty(suggestion); setShowSuggestions(false); }} className="px-8 py-5 hover:bg-[#0071e3] hover:text-white cursor-pointer text-[#1d1d1f] font-bold text-[17px] flex items-center gap-4">
                      <Search className="w-4 h-4 opacity-30" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & E-E-A-T Foundation Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071e3]">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Verificación de Cédula</h3>
            <p className="text-[#86868b]">Validamos los registros profesionales ante las autoridades competentes para asegurar que cada especialista cuente con la certificación necesaria.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071e3]">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Contenido Ético</h3>
            <p className="text-[#86868b]">Nuestra enciclopedia de salud se basa en fuentes médicas reconocidas, sintetizadas para ofrecer claridad sin comprometer la precisión técnica.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071e3]">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Sin Intermediarios</h3>
            <p className="text-[#86868b]">Fomentamos la transparencia financiera. Usted contacta directamente al consultorio; MediBusca no cobra comisiones por cita.</p>
          </div>
        </div>
      </section>

      {/* SEO & Informational Content - EEAT Focused */}
      <section className="py-24 bg-[#f5f5f7] w-full">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-[#1d1d1f]">Propósito y Compromiso de MediBusca</h2>
            <p className="text-xl text-[#86868b] leading-relaxed max-w-3xl mx-auto">
              Como plataforma de referencia en el sector salud mexicano, MediBusca asume la responsabilidad de combatir la desinformación médica mediante la organización estructurada de datos de profesionales y patologías.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#0071e3]" /> Rigor Informativo
              </h3>
              <p className="text-[#86868b] leading-relaxed mb-6">
                Nuestra base de datos de padecimientos y síntomas está diseñada para orientar, no para diagnosticar. Entendemos que en salud, la **Experiencia** de un médico presencial es insustituible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-sm font-semibold">Explicaciones de términos médicos complejos.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-sm font-semibold">Guía de especialidades según el sistema de salud nacional.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1d1d1f] p-10 rounded-[3rem] text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#0071e3]" /> Transparencia para el Paciente
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                La **Confianza** se construye con claridad. MediBusca es un directorio gratuito para el usuario final, manteniendo total independencia editorial frente a los servicios médicos listados.
              </p>
              <Link href="/buscar" className="inline-flex items-center gap-2 text-white font-bold border-b border-white/20 pb-1 hover:border-white transition-all">
                Explorar directorio verificado <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Critical Disclaimer - High Visibility for Quality Raters */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-8 rounded-2xl">
            <div className="flex gap-4">
              <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-amber-900 uppercase tracking-wide">Aviso de Responsabilidad Médica (YMYL)</h4>
                <p className="text-amber-800 leading-relaxed">
                  El contenido de MediBusca tiene fines exclusivamente informativos y educativos. **No constituye un consejo médico, diagnóstico o tratamiento profesional.** Nunca ignore el consejo de su médico ni retrase la búsqueda de tratamiento debido a algo que haya leído en este portal. Ante una emergencia médica, llame inmediatamente al 911 o a su servicio local de urgencias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Authority Links */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-10 text-[#1d1d1f]">Navegación por Especialidad y Región</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {FEATURED_CITIES.map(city => (
              <Link key={city} href={`/doctores/${slugify(city)}`} className="px-6 py-4 bg-[#f5f5f7] rounded-2xl font-bold text-[#1d1d1f] hover:bg-[#0071e3] hover:text-white transition-all">
                {city}
              </Link>
            ))}
          </div>
          <p className="text-[#86868b] max-w-2xl mx-auto text-sm">
            MediBusca — Comprometidos con la democratización del acceso a la información de salud confiable en México.
          </p>
        </div>
      </section>
    </div>
  );
}