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
  { name: 'Obesidad' },
  { name: 'Trastorno obsesivo compulsivo (TOC)' },
  { name: 'Infección dental' },
  { name: 'Sobrepeso' },
  { name: 'Fracturas de dientes' },
  { name: 'Desgaste dental' },
  { name: 'Ataques de pánico' },
  { name: 'Bullying (acoso escolar)' },
  { name: 'Pérdida de dientes' },
  { name: 'Dientes desalineados' },
  { name: 'Dientes apiñados' },
  { name: 'Estrés laboral' },
  { name: 'Angustia' },
  { name: 'Enfermedad periodontal - piorrea' },
  { name: 'Lesiones deportivas' },
  { name: 'Trastorno de ansiedad' },
  { name: 'Trastorno de ansiedad generalizada' },
  { name: 'Gastritis' },
  { name: 'Colon irritable' },
  { name: 'Virus del papiloma humano (VPH)' },
  { name: 'Diabetes gestacional' }
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [city, setCity] = useState(ALL_CITIES[0]);
  const [specialty, setSpecialty] = useState('');
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
          <p className="text-xl md:text-2xl text-[#86868b] max-w-lg mx-auto font-medium leading-relaxed">
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
            >
              
              {/* City Select */}
              <div className="relative md:w-1/3 h-14 bg-white/50 rounded-2xl hover:bg-white transition-colors group flex items-center px-4">
                <MapPin className="w-5 h-5 text-[#86868b] mr-2 shrink-0" />
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-[15px] appearance-none cursor-pointer"
                >
                  {ALL_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronRight className="w-3 h-3 text-[#86868b] absolute right-4 rotate-90" />
              </div>

              {/* Specialty Input */}
              <div className="relative flex-1 h-14 bg-white/50 rounded-2xl hover:bg-white transition-colors flex items-center px-4">
                <Stethoscope className="w-5 h-5 text-[#86868b] mr-2 shrink-0" />
                <input 
                  type="text" 
                  value={specialty}
                  onChange={handleSpecialtyChange}
                  onFocus={() => specialty.length > 0 && setShowSuggestions(true)}
                  placeholder="Especialidad (ej. Cardiólogo)" 
                  className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-[15px] placeholder-[#86868b]"
                  autoComplete="off"
                />
              </div>

              <button 
                type="submit" 
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
              Explora por <span className="text-[#86868b]">especialidad.</span>
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
            {['Dentista-Odontólogo', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista' , 'Cirujano general', 'Radiólogo', 'Ortopedista'].map((spec) => (
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
            Busca por <span className="text-[#86868b]">enfermedad o síntoma.</span>
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
                 <ArrowUpRight className="w-4 h-4 text-[#86868b] group-hover:text-white transition-colors" />
               </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: SEO / Informational Content Section */}
      <section className="py-16 md:py-24 bg-[#f5f5f7] w-full border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          
          {/* Intro */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight">
              Encuentra Doctores y Especialistas Verificados con MediBusca
            </h2>
            <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
              MediBusca ayuda a los pacientes a encontrar información precisa y actualizada sobre doctores, especialistas y clínicas en múltiples ciudades. Explora perfiles de doctores, especialidades y detalles de clínicas, y conecta directamente con los doctores para consultas o dudas.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 inline-flex items-start gap-3 text-left max-w-2xl">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm font-medium">
                  MediBusca no proporciona servicios médicos ni gestiona citas. Los pacientes contactan a los doctores directamente.
                </p>
            </div>
          </div>

          {/* 3 Columns Info */}
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* What MediBusca Offers */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Qué Ofrece MediBusca</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                  Información verificada de doctores para todas las especialidades
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                  Perfiles detallados de doctores incluyendo información de clínicas
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                  Información sobre enfermedades y áreas de tratamiento
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                  Conexión directa con doctores vía teléfono o WhatsApp
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Cómo Funciona</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold shrink-0 mt-0.5">1</span>
                  Busca doctores por especialidad, enfermedad o ciudad
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold shrink-0 mt-0.5">2</span>
                  Revisa perfiles de doctores e información de clínicas
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold shrink-0 mt-0.5">3</span>
                  Conecta directamente con el doctor para consultas o dudas
                </li>
              </ul>
            </div>

            {/* Why Patients Trust MediBusca */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Por Qué los Pacientes Confían en MediBusca</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  Información de doctores pública y verificada
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  Listados transparentes y precisos
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  Los pacientes conectan directamente sin intermediarios
                </li>
                <li className="flex items-start gap-3 text-[#86868b] text-[15px] leading-relaxed">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  Sin cargos ocultos ni servicios extra
                </li>
              </ul>
            </div>

          </div>

          {/* Disclaimer */}
          <div className="border-t border-slate-200 pt-10 text-center md:text-left">
            <h4 className="text-xs font-bold text-[#1d1d1f] mb-2 uppercase tracking-wider">Aviso Importante</h4>
            <p className="text-xs text-[#86868b] leading-relaxed max-w-4xl">
              <strong>Renuncia:</strong> MediBusca es un directorio médico informativo. No ofrecemos consejo médico, diagnóstico, tratamiento ni reserva de citas. El contenido proporcionado aquí es solo para fines informativos y no sustituye el consejo médico profesional.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}