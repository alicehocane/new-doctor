import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Stethoscope, ChevronRight, Activity, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { ALL_CITIES, POPULAR_CITIES, COMMON_SPECIALTIES } from '../lib/constants';

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla'
];

const COMMON_DISEASES = [
  { name: 'Ansiedad' },
  { name: 'Depresión' },
  { name: 'Duelo' },
  { name: 'Estrés' },
  { name: 'Codependencia' },
  { name: 'Hipertensión' },
  { name: 'Caries' },
  { name: 'Estrés postraumático' },
  { name: 'Trastorno de conducta' },
  { name: 'Diabetes' },
  { name: 'Dislipidemia' },
  { name: 'Depresión en adolescentes' },
  { name: 'Bruxismo' },
  { name: 'Síndrome metabólico' },
  { name: 'Dolor de muelas' },
  { name: 'Obesidad' }
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // SEO
  useEffect(() => {
    document.title = "MediBusca - Encuentra Doctores y Especialistas en México";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Directorio médico líder en México. Encuentra doctores verificados, clínicas y especialistas. Agenda citas, revisa opiniones y contacta directamente.");
  }, []);

  useEffect(() => {
    // Close suggestions if clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

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
      const filtered = COMMON_SPECIALTIES.filter(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
          val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSpecialty(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && specialty.trim()) {
      const citySlug = slugify(city);
      const specialtyTerm = specialty.trim(); 
      setLocation(`/doctores/${citySlug}/${encodeURIComponent(specialtyTerm)}`);
    }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#1d1d1f] leading-[1.05]">
            Salud, <br className="md:hidden" /> simplificada.
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-lg mx-auto font-medium leading-relaxed">
            Encuentra al especialista ideal para ti, rápido y seguro.
          </p>
          
          {/* Search Form - Apple Glass Style */}
          <div className="mt-12 mx-auto max-w-2xl relative" ref={wrapperRef}>
            <form 
              onSubmit={handleSearch} 
              className="
                flex flex-col md:flex-row gap-3 p-2
                bg-white/70 backdrop-blur-xl border border-white/40
                rounded-[24px] shadow-lg
              "
              role="search"
            >
              
              {/* City Select */}
              <div className="relative md:w-1/3 h-14 bg-white/50 rounded-2xl hover:bg-white transition-colors group flex items-center px-4">
                <MapPin className="w-5 h-5 text-secondary mr-2 shrink-0" aria-hidden="true" />
                <label htmlFor="city-select" className="sr-only">Selecciona tu ciudad</label>
                <select 
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-[15px] appearance-none cursor-pointer"
                >
                  {ALL_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronRight className="w-3 h-3 text-secondary absolute right-4 rotate-90" aria-hidden="true" />
              </div>

              {/* Specialty Input */}
              <div className="relative flex-1 h-14 bg-white/50 rounded-2xl hover:bg-white transition-colors flex items-center px-4">
                <Stethoscope className="w-5 h-5 text-secondary mr-2 shrink-0" aria-hidden="true" />
                <label htmlFor="specialty-input" className="sr-only">Especialidad médica</label>
                <input 
                  id="specialty-input"
                  type="text" 
                  value={specialty}
                  onChange={handleSpecialtyChange}
                  onFocus={() => specialty.length > 0 && setShowSuggestions(true)}
                  placeholder="Especialidad (ej. Cardiólogo)" 
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-[15px] placeholder-gray-500"
                  autoComplete="off"
                />
              </div>

              <button 
                type="submit" 
                aria-label="Buscar doctores"
                className="
                   h-14 md:w-auto px-8
                   bg-[#0071e3] hover:bg-[#0077ED] active:scale-95
                   text-white font-medium text-[15px] rounded-2xl 
                   transition-all shadow-md flex items-center justify-center
                "
              >
                Buscar
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 px-2 z-50">
                 <ul className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li 
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-6 py-4 hover:bg-[#0071e3] hover:text-white cursor-pointer text-[#1d1d1f] font-medium text-[15px] transition-colors flex items-center gap-3"
                    >
                      <Search className="w-4 h-4 opacity-50" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cities Section - Horizontal Snap Scroll on Mobile */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 md:mb-12 tracking-tight">
            Ciudades destacadas.
          </h2>
          
          {/* Scroll Container */}
          <div className="
            flex md:grid md:grid-cols-4 gap-4 
            overflow-x-auto snap-x snap-mandatory no-scrollbar 
            -mx-6 px-6 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {FEATURED_CITIES.map((city) => (
              <Link 
                key={city} 
                href={`/doctores/${slugify(city)}`}
                className="
                  snap-center shrink-0 w-[280px] md:w-auto
                  group p-6 md:p-8 bg-[#f5f5f7] rounded-[24px] 
                  transition-all duration-300 hover:bg-[#ededf0] hover:scale-[1.02] 
                  flex flex-col justify-between h-[200px] md:h-[220px] cursor-pointer
                "
              >
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] leading-tight">{city}</h3>
                  <div className="flex items-center gap-1 text-[#0071e3] text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Ver doctores <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section - Bento Grid style */}
      <section className="py-16 md:py-24 bg-[#f5f5f7] w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Explora por <span className="text-secondary">especialidad.</span>
            </h2>
            <Link href="/especialidades" className="text-[#0071e3] hover:underline text-[15px] font-medium hidden md:block">
               Ver todas
            </Link>
          </div>
          
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="
             flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4
             overflow-x-auto snap-x snap-mandatory no-scrollbar
             -mx-6 px-6 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {['Dentista - Odontólogo', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista' , 'Cirujano general', 'Radiólogo', 'Ortopedista', 'Traumatólogo', 'Oftalmólogo', 'Cardiólogo'].map((spec) => (
              <Link 
                key={spec} 
                href={`/especialidad/${spec.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                className="
                  snap-center shrink-0 w-[160px] md:w-auto aspect-square
                  flex flex-col items-center justify-center gap-3
                  p-4 bg-white rounded-[24px] shadow-sm 
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer
                "
              >
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                   <Stethoscope className="w-6 h-6 stroke-1" />
                </div>
                <span className="font-semibold text-[#1d1d1f] text-[15px] text-center">{spec}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 md:hidden text-center">
            <Link href="/especialidades" className="text-[#0071e3] font-medium text-[15px]">
              Ver todas las especialidades
            </Link>
          </div>
        </div>
      </section>

      {/* Common Diseases/Symptoms Section */}
      <section className="py-16 md:py-24 bg-white w-full border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-12 tracking-tight">
            Busca por <span className="text-secondary">enfermedad o síntoma.</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COMMON_DISEASES.map((item) => (
               <Link 
                  key={item.name}
                  href={`/enfermedad/${slugify(item.name)}`}
                  className="
                    group flex items-center justify-between p-4 px-6
                    bg-[#f5f5f7] rounded-2xl hover:bg-[#0071e3] hover:text-white
                    transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500/10
                  "
               >
                 <span className="font-medium text-[15px]">{item.name}</span>
                 <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-white transition-colors" />
               </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: SEO / Informational Content Section (Full Spanish Content Update) */}
      <section className="py-16 md:py-24 bg-[#f5f5f7] w-full border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 space-y-20">
          
          {/* Main Intro */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
              MediBusca
            </h2>
            <p className="text-xl md:text-2xl text-[#1d1d1f] font-semibold">
              Encuentra médicos, especialidades e información médica en un solo lugar
            </p>
            <p className="text-lg text-secondary leading-relaxed max-w-3xl mx-auto">
              MediBusca es una plataforma informativa de salud que ayuda a las personas a encontrar médicos, especialidades y contenido médico claro. Nuestro objetivo es facilitar el primer paso cuando surge una duda de salud.
            </p>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 inline-block text-left max-w-2xl shadow-sm">
                <p className="text-secondary text-sm font-medium leading-relaxed">
                  <span className="text-[#1d1d1f] font-bold block mb-1">Nota Importante:</span>
                  No ofrecemos tratamientos médicos ni consultas en línea. MediBusca existe para orientar, informar y conectar a los pacientes con profesionales de la salud reales.
                </p>
            </div>
          </div>

          {/* Grid 1: What It Does & Who It's For */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">Qué hace MediBusca</h3>
              </div>
              <p className="text-secondary text-lg leading-relaxed">
                Buscar un médico puede ser confuso. Muchas personas no saben qué especialista necesitan o por dónde empezar. MediBusca organiza la información médica para que el proceso sea más simple y claro.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Buscar médicos por ciudad
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Explorar especialidades médicas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Conocer enfermedades y síntomas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Contactar médicos cuando el contacto está disponible
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">Pensado para pacientes y familias</h3>
              </div>
              <p className="text-secondary text-lg leading-relaxed">
                MediBusca está creado para personas comunes. No necesitas conocimientos médicos para usar la plataforma. Explicamos los temas de salud con palabras sencillas.
              </p>
              <p className="text-secondary text-lg leading-relaxed">
                Organizamos a los médicos por especialidad para ayudarte a entender quién puede atender tu caso. Nuestro objetivo es ahorrar tiempo y reducir la confusión cuando aparece un problema de salud.
              </p>
            </div>
          </div>

          {/* Grid 2: Information & Direct Connection */}
          <div className="grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-12">
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#0071e3]" />
                  Información médica fácil de entender
                </h3>
                <p className="text-secondary mb-4 leading-relaxed">
                  Nuestra enciclopedia médica cubre una amplia variedad de enfermedades, síntomas y temas de salud. Cada artículo explica:
                </p>
                <ul className="space-y-2 text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Qué es la enfermedad
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Síntomas más comunes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Posibles causas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Cuándo acudir al médico
                  </li>
                </ul>
                <p className="text-xs text-[#86868b] mt-6 italic">
                  El contenido es solo educativo. No reemplaza la consulta médica.
                </p>
             </div>

             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#0071e3]" />
                  Conecta con médicos de forma directa
                </h3>
                <p className="text-secondary mb-4 leading-relaxed">
                  Algunos perfiles de médicos en MediBusca incluyen opciones de contacto directo. Cuando está disponible, puedes comunicarte con el médico por WhatsApp u otro medio indicado.
                </p>
                <div className="bg-[#f5f5f7] rounded-xl p-4 mt-4">
                  <p className="text-sm font-medium text-[#1d1d1f]">
                    MediBusca no gestiona citas, pagos ni consultas médicas. La comunicación se realiza directamente entre el paciente y el profesional.
                  </p>
                </div>
             </div>
          </div>

          {/* Trust Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#1d1d1f] text-center">Por qué confiar en MediBusca</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                "No vendemos tratamientos médicos",
                "No realizamos diagnósticos",
                "No solicitamos historial médico",
                "No reemplazamos al médico"
              ].map((text, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-[#0071e3] mx-auto mb-3" />
                  <p className="font-semibold text-[#1d1d1f]">{text}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-secondary max-w-3xl mx-auto text-lg">
              MediBusca se basa en la transparencia y la responsabilidad. Nuestra función es informar, orientar y conectar. Respetamos la privacidad de los usuarios y no pedimos datos médicos sensibles.
            </p>
          </div>

          {/* Responsibility & Audience */}
          <div className="grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Una plataforma de salud responsable</h3>
              <p className="text-secondary leading-relaxed">
                La información médica debe ser clara y honesta. Por eso MediBusca sigue principios de responsabilidad médica:
              </p>
              <ul className="space-y-2 text-secondary">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Usa lenguaje claro y sencillo</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Distingue información de consejo médico</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Recomienda siempre consultar a un profesional</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Respeta la ética médica</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Para quién es MediBusca</h3>
              <p className="text-secondary leading-relaxed">MediBusca es útil para:</p>
              <ul className="space-y-2 text-secondary">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Pacientes que buscan orientación médica</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Familias que necesitan encontrar especialistas</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Personas que desean conocer médicos por ciudad o especialidad</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Usuarios que prefieren informarse antes de contactar a un doctor</li>
              </ul>
              <p className="text-sm font-semibold text-[#0071e3] mt-2">No es necesario registrarse para acceder al contenido.</p>
            </div>
          </div>

          {/* Footer Disclaimer & Links */}
          <div className="bg-[#1d1d1f] text-white rounded-3xl p-8 md:p-12 text-center space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Aviso médico importante</h3>
              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                La información publicada en MediBusca es solo educativa. No sustituye la consulta, el diagnóstico ni el tratamiento médico profesional. Siempre consulta a un médico calificado ante cualquier problema de salud. En caso de emergencia, llama a los servicios de emergencia de tu país.
              </p>
            </div>
            
            <div className="border-t border-slate-700 pt-8">
              <h4 className="text-lg font-bold mb-6">Empieza a explorar MediBusca</h4>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/buscar" className="bg-white text-[#1d1d1f] px-6 py-3 rounded-full font-semibold hover:bg-slate-200 transition-colors">
                  Busca médicos por ciudad
                </Link>
                <Link href="/especialidades" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Explora especialidades
                </Link>
                <Link href="/enfermedades" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Infórmate sobre enfermedades
                </Link>
              </div>
              <p className="text-slate-400 text-sm mt-8">
                MediBusca te ayuda a tomar decisiones informadas sobre tu salud.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}