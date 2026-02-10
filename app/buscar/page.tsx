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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
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

  const handleSelectSuggestion = (suggestion: string) => {
    setSpecialty(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && specialty.trim()) {
      const citySlug = slugify(city);
      const termSlug = slugify(specialty.trim());
      
      // Check if term matches a known disease to route correctly
      const isDisease = ALL_DISEASES.some(d => slugify(d) === termSlug);

      if (isDisease) {
        setLocation(`/enfermedad/${termSlug}/${citySlug}`);
      } else {
        setLocation(`/doctores/${citySlug}/${termSlug}`);
      }
    }
  };

  // Schema Markup
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Buscar Doctores y Especialistas",
    "description": "Busca doctores por nombre, especialidad o enfermedad. Encuentra el especialista médico ideal cerca de ti.",
    "url": "https://medibusca.com/buscar"
  };

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
        "name": "Buscar",
        "item": "https://medibusca.com/buscar"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans flex flex-col pt-8 pb-12 px-4 md:items-center">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
      <div 
        className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100"
        ref={wrapperRef}
      >
        <form onSubmit={handleSearch} className="space-y-4">
          
            {/* City Selector - iOS style input */}
            <div className="relative bg-white rounded-2xl h-[60px] flex items-center px-4 shadow-sm">
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
            <div className="relative bg-white rounded-2xl h-[60px] flex items-center px-4 shadow-sm">
                <div className="bg-[#0071e3]/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <Search className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="flex-1 relative">
                    <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide absolute top-[-6px] left-0">Especialidad</label>
                    <input 
                        type="text" 
                        value={specialty}
                        onChange={handleSpecialtyChange}
                        onFocus={() => { setShowSuggestions(true); }}
                        placeholder="Especialidad o Padecimiento" 
                        className="w-full bg-transparent border-none outline-none text-[17px] text-[#1d1d1f] placeholder-[#d2d2d7] font-medium pt-3"
                        autoComplete="off"
                    />
                </div>
                {/* Search Button (Internal) */}
                <button 
                    type="submit"
                    disabled={!specialty.trim()}
                    className={`
                      h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ml-2
                      ${specialty.trim() ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]' : 'bg-[#f5f5f7] text-[#d2d2d7] cursor-not-allowed'}
                    `}
                   >
                     <ArrowRight className="w-5 h-5" />
                </button>
            </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => {
                  const isDisease = ALL_DISEASES.includes(suggestion);
                  return (
                    <li 
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-6 py-4 hover:bg-[#f5f5f7] cursor-pointer text-[17px] text-[#1d1d1f] transition-colors flex items-center gap-3"
                    >
                      {isDisease ? (
                        <Activity className="w-4 h-4 text-[#0071e3]" />
                      ) : (
                        <Stethoscope className="w-4 h-4 text-[#86868b]" />
                      )}
                      {suggestion}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>

        {/* Tags */}
        <div className="mt-12">
          <p className="text-xs font-semibold text-[#86868b] mb-4 uppercase tracking-wide">Populares</p>
          <div className="flex flex-wrap gap-2">
             {['Angiólogo', 'Cardiólogo', 'Dermatólogo', 'Pediatra'].map((spec) => (
               <Link 
                key={spec} 
                href={`/especialidad/${slugify(spec)}`}
                className="px-4 py-2 bg-white rounded-full text-[14px] font-medium text-[#1d1d1f] shadow-sm hover:text-[#0071e3] transition-colors cursor-pointer"
               >
                 {spec}
               </Link>
             ))}
          </div>
        </div>

      </div>

      {/* Popular Diseases by City (SEO Cross-Linking) */}
        <section className="mt-16 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
             <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-2">
                Encuentra tratamiento en tu ciudad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="space-y-3">
                        <h3 className="font-semibold text-[#1d1d1f] border-b border-slate-100 pb-2 mb-3">
                            {city}
                        </h3>
                        <ul className="space-y-2.5">
                            {/* Show top 5 diseases for each city */}
                            {ALL_DISEASES.slice(0, 5).map((disease) => (
                                <li key={disease}>
                                    <Link 
                                        href={`/enfermedad/${slugify(disease)}/${slugify(city)}`}
                                        className="text-[14px] text-[#86868b] hover:text-[#0071e3] hover:underline flex items-center gap-2 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                        {disease} en {city}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link 
                                    href={`/doctores/${slugify(city)}`}
                                    className="text-[13px] font-medium text-[#0071e3] hover:underline mt-1 inline-block"
                                >
                                    Ver todos en {city}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </section>



      {/* SEO Content Section */}
      <section className="w-full max-w-4xl mt-24 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-4">
            Encuentra tu especialista ideal en segundos
          </h2>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            MediBusca es el directorio médico más completo y confiable. Conectamos a pacientes con doctores verificados de manera directa y segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">100% Verificados</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Validamos las cédulas profesionales de cada médico para garantizar tu seguridad y tranquilidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Contacto Directo</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Sin intermediarios ni comisiones. Llama directamente al consultorio o envía un mensaje.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Perfiles Completos</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Revisa experiencia, enfermedades que tratan, ubicación exacta y horarios antes de agendar.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-[#0071e3]" />
                ¿Cómo usar el buscador médico?
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Selecciona tu ubicación</strong>
                    <p className="text-[#86868b] text-sm">Elige la ciudad donde deseas recibir atención médica. Cubrimos las principales ciudades de México.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Escribe la especialidad o síntoma</strong>
                    <p className="text-[#86868b] text-sm">¿Buscas un cardiólogo o tienes dolor de espalda? Nuestro buscador inteligente te sugerirá las mejores opciones.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Compara y contacta</strong>
                    <p className="text-[#86868b] text-sm">Explora los perfiles y usa los botones de "Llamar" para agendar tu cita inmediatamente.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                <Star className="w-6 h-6 text-[#0071e3]" />
                ¿Por qué elegir MediBusca?
              </h3>
              <div className="prose text-[#86868b] text-sm leading-relaxed">
                <p className="mb-4">
                  En un mundo donde la información de salud abunda pero no siempre es confiable, MediBusca se destaca por su compromiso con la calidad y la verificación.
                </p>
                <p className="mb-4">
                  Nuestra plataforma está diseñada para simplificar el proceso de encontrar atención médica. Ya no necesitas navegar por múltiples sitios o directorios desactualizados. Aquí encuentras:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Especialistas certificados por consejos médicos.</li>
                  <li>Ubicaciones geolocalizadas para encontrar el consultorio más cercano.</li>
                  <li>Información clara sobre padecimientos y tratamientos.</li>
                </ul>
                <p>
                  Únete a miles de pacientes que ya han encontrado a su médico de confianza a través de nuestra plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}