import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Activity, ArrowRight, Search, Plus, MapPin, Stethoscope } from 'lucide-react';
import { POPULAR_SPECIALTIES, ALL_DISEASES } from '../../lib/constants';

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const PAGE_SIZE = 12;

export default function DiseasesIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // SEO
  useEffect(() => {
    document.title = "Diccionario de Enfermedades y Padecimientos | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Busca doctores por enfermedad o síntoma. Guía completa de padecimientos y los especialistas que los tratan.");
  }, []);

  // Filter diseases based on search query
  const filteredDiseases = ALL_DISEASES.filter(d => 
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const visibleDiseases = filteredDiseases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDiseases.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE); // Reset pagination on new search
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
            Busca por padecimiento.
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
            Encuentra al especialista indicado según tus síntomas o enfermedad diagnosticada.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16 relative group animate-in fade-in slide-in-from-bottom-4">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#86868b]" />
             </div>
             <input 
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar cualquier enfermedad..."
                className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border border-slate-200 text-[#1d1d1f] text-[15px] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all shadow-sm"
             />
        </div>

        {/* Grid */}
        {visibleDiseases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-6">
            {visibleDiseases.map((disease) => (
              <Link 
                key={disease} 
                href={`/enfermedad/${slugify(disease)}`}
                className="
                  group relative flex flex-col justify-between p-6 
                  bg-white border border-slate-200 rounded-[20px] 
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-transparent hover:-translate-y-1
                  transition-all duration-300 cursor-pointer h-full min-h-[120px]
                "
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f7] group-hover:bg-[#0071e3]/10 flex items-center justify-center transition-colors">
                    <Activity className="w-5 h-5 text-[#86868b] group-hover:text-[#0071e3] transition-colors" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors -rotate-45 group-hover:rotate-0 transform duration-300" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1 group-hover:text-[#0071e3] transition-colors">
                      {disease}
                  </h3>
                  <span className="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                      Información Médica
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-in fade-in">
             <p className="text-[#86868b] text-lg">No encontramos resultados para "{searchQuery}".</p>
          </div>
        )}
        
        {/* Load More Button */}
        {hasMore && (
           <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-8">
              <button 
                  onClick={handleLoadMore}
                  className="
                      inline-flex items-center gap-2 px-6 py-3
                      bg-white border border-slate-200 rounded-full
                      text-[15px] font-medium text-[#1d1d1f]
                      hover:bg-[#f5f5f7] hover:border-[#86868b]
                      transition-all active:scale-95 shadow-sm
                  "
              >
                  <Plus className="w-4 h-4" />
                  Ver más padecimientos
              </button>
           </div>
        )}
        
        {/* Popular Specialties Section (SEO) */}
        <section className="mt-20 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-[#0071e3]" />
                Explora por especialidad médica
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {POPULAR_SPECIALTIES.map((spec) => (
                    <Link 
                        key={spec}
                        href={`/especialidad/${slugify(spec)}`}
                        className="
                            flex items-center justify-center px-4 py-3
                            bg-white border border-slate-200 rounded-xl
                            text-sm font-medium text-[#1d1d1f] text-center
                            hover:border-[#0071e3] hover:text-[#0071e3]
                            transition-colors shadow-sm
                        "
                    >
                        {spec}
                    </Link>
                ))}
            </div>
            <div className="mt-6 text-center md:text-left">
                <Link href="/especialidades" className="text-[#0071e3] hover:underline text-sm font-medium inline-flex items-center gap-1">
                    Ver todas las especialidades <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>


        <div className="mt-20 text-center text-[#86868b] text-sm animate-in fade-in slide-in-from-bottom-8 border-t border-slate-200 pt-8">
            <p>La información mostrada es solo de referencia y no sustituye un diagnóstico médico profesional.</p>
        </div>

      </div>
    </div>
  );
}