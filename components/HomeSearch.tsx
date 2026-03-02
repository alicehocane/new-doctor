'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronRight, Stethoscope, Activity } from 'lucide-react';
import { ALL_CITIES, ALL_DISEASES, COMMON_SPECIALTIES } from '../lib/constants';

export default function HomeSearch() {
  const router = useRouter();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  
  // Autocomplete & Focus state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
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

  const executeSearch = (searchCity: string, searchTerm: string) => {
    if (searchCity && searchTerm.trim()) {
      const citySlug = slugify(searchCity);
      const termSlug = slugify(searchTerm.trim()); 
      
      const isDisease = ALL_DISEASES.some(d => slugify(d) === termSlug);

      if (isDisease) {
        router.push(`/enfermedad/${termSlug}/${citySlug}`);
      } else {
        router.push(`/doctores/${citySlug}/${termSlug}`);
      }
    }
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
    setSpecialty(suggestion); // Update input visually
    setShowSuggestions(false); // Hide dropdown
    setIsFocused(false); // Reset mobile focus layout
    
    // --- NEW: Check if screen is mobile (< 768px, matching Tailwind's 'md' breakpoint) ---
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Mobile: Trigger search immediately since there is no button
      executeSearch(city, suggestion); 
    }
    // Desktop: Do nothing else, let the user click the "Buscar" button manually
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    
    // Trigger search with the currently typed specialty
    executeSearch(city, specialty);
  };

  return (
    <div 
      ref={wrapperRef}
      className={`mx-auto max-w-3xl w-full z-50 transition-all duration-300 ${
        isFocused 
          ? 'fixed top-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md shadow-lg md:relative md:p-0 md:bg-transparent md:shadow-none md:mt-12' 
          : 'relative mt-10 md:mt-12'
      }`} 
    >
      <form 
        onSubmit={handleSearch} 
        className="
          flex flex-col md:flex-row gap-3 md:gap-2 p-3 md:p-2
          bg-white border border-slate-200/60
          rounded-[1.8rem] md:rounded-[2rem] shadow-xl md:shadow-2xl shadow-slate-200/50
        "
        role="search"
      >
        
        {/* City Select */}
        <div className="relative w-full md:w-1/3 h-14 bg-[#f5f5f7] rounded-xl md:rounded-[1.5rem] hover:bg-[#e8e8ed] transition-colors group flex items-center px-5">
          <MapPin className="w-5 h-5 text-[#6e6e73] mr-3 shrink-0" aria-hidden="true" />
          <label htmlFor="city-select" className="sr-only">Selecciona tu ciudad</label>
          <select 
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-base appearance-none cursor-pointer pr-4 truncate"
          >
            {ALL_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronRight className="w-3 h-3 text-[#6e6e73] absolute right-4 rotate-90 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Specialty Input */}
        <div className="relative w-full md:flex-1 h-14 bg-[#f5f5f7] rounded-xl md:rounded-[1.5rem] hover:bg-[#e8e8ed] transition-colors flex items-center px-5">
          <Search className="w-5 h-5 text-[#6e6e73] mr-3 shrink-0" aria-hidden="true" />
          <label htmlFor="specialty-input" className="sr-only">Especialidad o Padecimiento</label>
          <input 
            id="specialty-input"
            type="text" 
            value={specialty}
            onChange={handleSpecialtyChange}
            onFocus={() => { 
              setIsFocused(true);
              if (specialty.length > 0) setShowSuggestions(true); 
            }}
            placeholder="Especialidad (ej. Cardiólogo) o Padecimiento" 
            className="w-full h-full bg-transparent border-none outline-none text-[#1d1d1f] font-medium text-base placeholder-gray-500"
            autoComplete="off"
          />
        </div>

        <button 
          type="submit" 
          aria-label="Buscar doctores"
          className="
             hidden md:flex h-14 w-full md:w-auto px-8
             bg-[#0071e3] hover:bg-[#0077ED] active:scale-95
             text-white font-medium text-base rounded-xl md:rounded-[1.5rem]
             transition-all shadow-md items-center justify-center shrink-0
          "
        >
          Buscar
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
           <ul className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => {
              const isDisease = ALL_DISEASES.includes(suggestion);
              return (
                <li 
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-6 py-4 hover:bg-[#0071e3] hover:text-white cursor-pointer text-[#1d1d1f] font-medium text-[15px] transition-colors flex items-center gap-3 group"
                >
                  {isDisease ? (
                    <Activity className="w-4 h-4 opacity-50 group-hover:text-white" />
                  ) : (
                    <Stethoscope className="w-4 h-4 opacity-50 group-hover:text-white" />
                  )}
                  {suggestion}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}