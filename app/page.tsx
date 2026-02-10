'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Stethoscope, ChevronRight, Activity, 
  ArrowUpRight, Check, ShieldCheck, Heart, Users, 
  BookOpen, ArrowRight, Zap, Award, Star, Info
} from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { ALL_CITIES, POPULAR_CITIES, COMMON_SPECIALTIES, ALL_DISEASES } from '../lib/constants';

const FEATURED_CITIES = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla'];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.title = "MediBusca - Directorio Médico Verificado en México";
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

  const handleSpecialtyChange = (e) => {
    const val = e.target.value;
    setSpecialty(val);
    if (val.length > 0) {
      const normalizedVal = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filteredSpecs = COMMON_SPECIALTIES.filter(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedVal)
      );
      const filteredDiseases = ALL_DISEASES.filter(d => 
        d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedVal)
      );
      setSuggestions([...filteredSpecs, ...filteredDiseases].slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city && specialty.trim()) {
      const citySlug = slugify(city);
      const termSlug = slugify(specialty.trim()); 
      const isDisease = ALL_DISEASES.some(d => slugify(d) === termSlug);
      if (isDisease) {
        setLocation(`/enfermedad/${termSlug}/${citySlug}`);
      } else {
        setLocation(`/doctores/${citySlug}/${termSlug}`);
      }
    }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden bg-[#f5f5f7]">
      
      {/* 1. HERO SECTION: The Core Promise */}
      <section className="relative py-20 px-4 md:py-32 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-xs font-bold uppercase tracking-widest text-[#0071e3] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 fill-current" /> Médicos verificados en todo México
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-semibold tracking-tighter text-[#1d1d1f] leading-[1] md:leading-[0.95]">
            Tu salud, <br /> simplificada.
          </h1>
          <p className="text-xl md:text-3xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed">
            Encuentra especialistas certificados y respuestas claras a tus dudas médicas en segundos.
          </p>
          
          {/* Search Pill */}
          <div className="mt-12 mx-auto max-w-3xl relative" ref={wrapperRef}>
            <form onSubmit={handleSearch} 
              className="flex flex-col md:flex-row gap-3 md:gap-2 p-3 bg-white border border-slate-200 rounded-[2.8rem] shadow-2xl shadow-slate-300/60 transition-all focus-within:ring-4 focus-within:ring-[#0071e3]/5"
            >
              <div className="relative w-full md:w-1/3 h-16 bg-[#f5f5f7] rounded-[2rem] flex items-center px-6">
                <MapPin className="w-5 h-5 text-[#86868b] mr-3" />
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-bold text-base appearance-none cursor-pointer"
                >
                  {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronRight className="w-4 h-4 text-[#86868b] absolute right-6 rotate-90" />
              </div>

              <div className="relative w-full md:flex-1 h-16 bg-[#f5f5f7] rounded-[2rem] flex items-center px-6">
                <Search className="w-5 h-5 text-[#86868b] mr-3" />
                <input type="text" value={specialty} onChange={handleSpecialtyChange}
                  onFocus={() => specialty.length > 0 && setShowSuggestions(true)}
                  placeholder="Especialidad o Síntoma" 
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-bold text-base placeholder-[#d2d2d7]"
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="h-16 px-12 bg-[#0071e3] text-white font-bold text-lg rounded-[2rem] hover:bg-[#0077ED] transition-all shadow-xl shadow-[#0071e3]/30 active:scale-95">
                Buscar
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 px-2 z-50 animate-in fade-in zoom-in-95">
                 <ul className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden divide-y divide-slate-50 text-left">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => { setSpecialty(suggestion); setShowSuggestions(false); }}
                      className="px-10 py-6 hover:bg-[#0071e3] hover:text-white cursor-pointer text-[#1d1d1f] font-bold text-xl transition-all flex items-center gap-5"
                    >
                      <Search className="w-5 h-5 opacity-20" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CITIES: The "Proximity" Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
                <h2 className="text-5xl font-bold text-[#1d1d1f] tracking-tighter">Ciudades destacadas.</h2>
                <p className="text-2xl text-[#86868b] mt-3 font-medium">La mejor atención médica, justo donde te encuentras.</p>
          </div>
          <div className="flex md:grid md:grid-cols-4 gap-8 overflow-x-auto no-scrollbar pb-10 px-2 snap-x">
            {FEATURED_CITIES.map((city) => (
              <Link key={city} href={`/doctores/${slugify(city)}`}
                className="snap-center shrink-0 w-[300px] md:w-auto group p-10 bg-[#f5f5f7] rounded-[3.5rem] transition-all hover:bg-[#e8e8ed] hover:-translate-y-3 flex flex-col justify-between h-[320px] shadow-sm hover:shadow-xl"
              >
                <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-md text-[#0071e3]">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#1d1d1f]">{city}</h3>
                  <div className="flex items-center gap-3 text-[#0071e3] font-bold text-base mt-4 group-hover:gap-5 transition-all">
                    Explorar especialistas <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SPECIALTIES: The "Expertise" Story */}
      <section className="py-24 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#1d1d1f] mb-16 tracking-tighter text-center md:text-left">
              Busca por <span className="text-[#0071e3]">especialidad.</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Odontólogo', 'Psicólogo', 'Pediatra', 'Ginecólogo', 'Ortopedista', 'Cardiólogo'].map((spec) => (
              <Link key={spec} href={`/especialidad/${slugify(spec)}`}
                className="flex flex-col items-center justify-center gap-5 p-10 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-all shadow-inner">
                   <Stethoscope className="w-8 h-8" />
                </div>
                <span className="font-bold text-[#1d1d1f] text-[17px] text-center group-hover:text-[#0071e3]">{spec}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DISEASES: The "Education" Story */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tighter leading-tight">Enfermedades y Síntomas.</h2>
            <p className="text-2xl text-[#86868b] font-medium">Información médica clara para ayudarte a entender qué especialista necesitas.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {ALL_DISEASES.slice(0, 15).map((disease) => (
               <Link key={disease} href={`/enfermedad/${slugify(disease)}`}
                  className="flex items-center gap-3 px-8 py-5 bg-[#f5f5f7] rounded-full text-[#0066cc] font-bold text-lg hover:bg-[#e8e8ed] transition-all group border border-transparent hover:border-[#0071e3]/20"
               >
                 <Activity className="w-5 h-5 text-[#86868b] group-hover:text-[#0071e3]" />
                 <span>{disease}</span>
               </Link>
            ))}
            <Link href="/enfermedades" className="flex items-center gap-3 px-10 py-5 border-2 border-[#1d1d1f] rounded-full text-[#1d1d1f] font-bold text-lg hover:bg-[#1d1d1f] hover:text-white transition-all">
                Ver enciclopedia <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INFORMATIONAL CONTENT: The "Trust & Truth" Story */}
      <section className="py-24 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <div className="w-20 h-20 bg-[#0071e3] rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-[#0071e3]/30">
                    <Heart className="w-10 h-10" />
                </div>
                <h2 className="text-5xl font-bold text-[#1d1d1f] tracking-tighter mb-8 leading-[1.1]">MediBusca: Salud con transparencia.</h2>
                <p className="text-2xl text-[#86868b] leading-relaxed mb-10 font-medium">
                    Somos una plataforma informativa que conecta a las familias mexicanas con doctores verificados de forma gratuita y directa.
                </p>
                <div className="grid grid-cols-1 gap-8">
                    {[
                        { icon: ShieldCheck, title: "100% Verificados", text: "Validamos certificaciones profesionales para tu seguridad." },
                        { icon: Users, title: "Sin Comisiones", text: "Contacta al médico directamente, sin intermediarios." },
                        { icon: BookOpen, title: "Información Educativa", text: "Contenido médico explicado en lenguaje sencillo." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 p-6 bg-white rounded-[2.5rem] shadow-sm">
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center">
                                <item.icon className="w-7 h-7 text-[#0071e3]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1d1d1f] text-xl">{item.title}</h4>
                                <p className="text-[#86868b] text-lg">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative">
                <h3 className="text-3xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <Info className="w-8 h-8 text-[#0071e3]" /> Nota Importante
                </h3>
                <p className="text-xl text-[#86868b] leading-relaxed mb-10 font-medium">
                    MediBusca no ofrece tratamientos médicos ni consultas en línea. Somos una herramienta informativa diseñada para orientar y facilitar el primer paso hacia una atención profesional presencial.
                </p>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-[#f5f5f7] rounded-2xl">
                         <Star className="w-6 h-6 text-[#0071e3] fill-current" />
                         <p className="font-bold text-[#1d1d1f] text-lg">Tu médico de confianza, cerca de ti.</p>
                    </div>
                    <p className="text-[#86868b] leading-relaxed">
                        En un mundo de información confusa, MediBusca se basa en la transparencia. Organizamos a los doctores por ciudad y especialidad para que ahorres tiempo cuando más lo necesitas.
                    </p>
                </div>
            </div>
          </div>

          {/* 6. FINAL CTA: The Closure */}
          <div className="bg-[#1d1d1f] text-white rounded-[5rem] p-16 md:p-32 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/10 to-transparent"></div>
             <div className="relative z-10">
                <h3 className="text-5xl md:text-8xl font-bold mb-10 tracking-tighter">Tu salud merece claridad.</h3>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <Link href="/buscar" className="bg-[#0071e3] text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-white hover:text-black transition-all shadow-xl shadow-[#0071e3]/30">
                        Encontrar Especialista
                    </Link>
                    <Link href="/enfermedades" className="bg-white/10 backdrop-blur-xl text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-white/20 transition-all border border-white/20">
                        Ver Enfermedades
                    </Link>
                </div>
                <p className="mt-16 text-slate-500 font-bold uppercase tracking-widest text-sm">MediBusca — Directorio Médico Líder en México</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}