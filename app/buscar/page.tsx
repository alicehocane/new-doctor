'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Stethoscope, ChevronRight, ArrowRight, ShieldCheck, Clock, Phone, UserCheck, Star, HeartPulse, Activity } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { ALL_DISEASES, ALL_CITIES, COMMON_SPECIALTIES } from '../../lib/constants';

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  
  // SEO
  useEffect(() => {
    document.title = "Buscar Doctores y Especialistas | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Busca doctores por nombre, especialidad o enfermedad. Encuentra el especialista médico ideal cerca de ti.");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

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

  const handleSelectSuggestion = (suggestion) => {
    setSpecialty(suggestion);
    setShowSuggestions(false);
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
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans flex flex-col pt-8 pb-12 px-4 md:items-center">
      
      {/* Header */}
      <div className="w-full max-w-2xl text-left md:text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-3">
          Buscar.
        </h1>
        <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed">
          Encuentra médicos verificados.
        </p>
      </div>

      {/* Search Container */}
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100" ref={wrapperRef}>
        <form onSubmit={handleSearch} className="space-y-4">
            {/* City Selector */}
            <div className="relative bg-white rounded-2xl h-[60px] flex items-center px-4 shadow-sm border border-transparent focus-within:border-[#0071e3]/30 transition-all">
                <div className="bg-[#0071e3]/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                   <MapPin className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="flex-1 relative">
                    <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide absolute top-[-6px] left-0">Ciudad</label>
                    <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[17px] font-medium text-[#1d1d1f] appearance-none cursor-pointer pt-3"
                    >
                        {ALL_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <ChevronRight className="w-4 h-4 text-[#d2d2d7] rotate-90" />
            </div>

            {/* Specialty Input */}
            <div className="relative bg-white rounded-2xl h-[60px] flex items-center px-4 shadow-sm border border-transparent focus-within:border-[#0071e3]/30 transition-all">
                <div className="bg-[#0071e3]/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <Search className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="flex-1 relative">
                    <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide absolute top-[-6px] left-0">Especialidad</label>
                    <input 
                        type="text" 
                        value={specialty}
                        onChange={handleSpecialtyChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Especialidad o Padecimiento" 
                        className="w-full bg-transparent border-none outline-none text-[17px] text-[#1d1d1f] placeholder-[#d2d2d7] font-medium pt-3"
                        autoComplete="off"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!specialty.trim()}
                    className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ml-2
                      ${specialty.trim() ? 'bg-[#0071e3] text-white hover:bg-[#0077ED] shadow-lg shadow-[#0071e3]/20' : 'bg-[#f5f5f7] text-[#d2d2d7] cursor-not-allowed'}
                    `}
                   >
                     <ArrowRight className="w-5 h-5" />
                </button>
            </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => {
                  const isDisease = ALL_DISEASES.includes(suggestion);
                  return (
                    <li 
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-6 py-4 hover:bg-[#f5f5f7] cursor-pointer text-[17px] text-[#1d1d1f] transition-colors flex items-center gap-3 group"
                    >
                      {isDisease ? (
                        <Activity className="w-4 h-4 text-[#0071e3]" />
                      ) : (
                        <Stethoscope className="w-4 h-4 text-[#86868b] group-hover:text-[#0071e3]" />
                      )}
                      {suggestion}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>

        {/* Tags - App Style */}
        <div className="mt-10">
          <p className="text-[11px] font-bold text-[#86868b] mb-4 uppercase tracking-[0.1em]">Búsquedas Destacadas</p>
          <div className="flex flex-wrap gap-2.5">
             {['Cardiólogo', 'Dermatólogo', 'Pediatra', 'Ginecólogo', 'Psicólogo'].map((spec) => (
               <Link 
                key={spec} 
                href={`/especialidad/${slugify(spec)}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[14px] font-medium text-[#0066cc] shadow-sm border border-transparent hover:border-[#0071e3]/20 hover:bg-[#f5f5f7] transition-all group"
               >
                 <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0071e3]" />
                 {spec}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* Popular Diseases by City (SEO Content Story) */}
      <section className="w-full max-w-5xl mt-24 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">
                Atención médica cerca de ti
            </h2>
            <p className="text-lg text-[#86868b] mb-10 max-w-2xl">
                Encuentra alivio y tratamiento especializado en las principales ciudades de México. Conectamos pacientes con los mejores consultorios locales.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                            <MapPin className="w-5 h-5 text-[#0071e3]" />
                            <h3 className="text-xl font-bold text-[#1d1d1f]">{city}</h3>
                        </div>
                        <ul className="space-y-3">
                            {ALL_DISEASES.slice(0, 5).map((disease) => (
                                <li key={disease}>
                                    <Link 
                                        href={`/enfermedad/${slugify(disease)}/${slugify(city)}`}
                                        className="text-[15px] text-[#86868b] hover:text-[#0071e3] flex items-center gap-3 group transition-colors"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-[#d2d2d7] group-hover:bg-[#0071e3] transition-colors"></div>
                                        <span>{disease} en {city}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <Link 
                                    href={`/doctores/${slugify(city)}`}
                                    className="inline-flex items-center gap-1 text-[14px] font-bold text-[#0071e3] hover:gap-2 transition-all"
                                >
                                    Ver todos los especialistas <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
      </section>

      {/* SEO Content Section - Enhanced Design */}
      <section className="w-full max-w-5xl mt-24 pt-16 border-t border-slate-200">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
                <h2 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-6">
                    Tu salud merece el mejor especialista.
                </h2>
                <p className="text-xl text-[#86868b] leading-relaxed mb-8">
                    MediBusca no es solo un directorio; es una herramienta diseñada para darte tranquilidad cuando más la necesitas.
                </p>
                <div className="space-y-4">
                    {[
                        { icon: ShieldCheck, title: "Médicos Verificados", desc: "Validamos cédulas y certificaciones de consejos médicos." },
                        { icon: Phone, title: "Sin Intermediarios", desc: "Agenda directamente llamando al consultorio del especialista." },
                        { icon: UserCheck, title: "Transparencia Total", desc: "Conoce su experiencia y padecimientos que trata antes de ir." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors">
                            <div className="shrink-0 w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-xl flex items-center justify-center">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#1d1d1f]">{item.title}</h4>
                                <p className="text-[#86868b] text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                 <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-[#0071e3]" />
                    Guía de búsqueda
                 </h3>
                 <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                    {[
                        { step: "1", t: "Selecciona Ubicación", d: "Elige tu ciudad para ver médicos disponibles cerca de ti." },
                        { step: "2", t: "Busca por Especialidad", d: "¿Dolor de rodilla? Busca 'Traumatólogo' o 'Dolor de rodilla'." },
                        { step: "3", t: "Contacta y Agenda", d: "Usa el botón de llamada directa para agendar tu cita en segundos." }
                    ].map((step, i) => (
                        <div key={i} className="relative pl-10">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-sm font-bold z-10 shadow-lg">
                                {step.step}
                            </div>
                            <h4 className="font-bold text-[#1d1d1f] mb-1">{step.t}</h4>
                            <p className="text-[#86868b] text-sm leading-relaxed">{step.d}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </section>
    </div>
  );
}