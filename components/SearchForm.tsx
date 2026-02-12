'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Stethoscope, ChevronRight, ArrowRight, Activity } from 'lucide-react';
import { ALL_DISEASES, ALL_CITIES, COMMON_SPECIALTIES, slugify, getStateForCity } from '../lib/constants';

export default function SearchForm() {
  const router = useRouter();
  const [city, setCity] = useState('Ciudad de México');
  const [specialty, setSpecialty] = useState('');
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

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
      const stateSlug = getStateForCity(city);
      
      // Check if term matches a known disease to route correctly
      const isDisease = ALL_DISEASES.some(d => slugify(d) === termSlug);

      if (isDisease) {
        // Disease pages maintain their own structure or can be updated too.
        // For now keeping /enfermedad structure separate as requested in other prompts, 
        // but city drilldown in disease can now use state if needed.
        router.push(`/enfermedad/${termSlug}/${citySlug}`);
      } else {
        // Updated routing for doctors
        router.push(`/doctores/${stateSlug}/${citySlug}/${termSlug}`);
      }
    }
  };

  return (
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
  );
}