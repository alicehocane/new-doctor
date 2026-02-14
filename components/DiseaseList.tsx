'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Activity, ArrowRight, Plus } from 'lucide-react';

const PAGE_SIZE = 12;

interface DiseaseListProps {
  allDiseases: string[];
  children?: React.ReactNode;
}

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function DiseaseList({ allDiseases, children }: DiseaseListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter diseases based on search query
  const filteredDiseases = allDiseases.filter(d => 
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
    <>
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

        {/* Static Content Injection (Guide) */}
        {children}

        {/* Grid */}
        {visibleDiseases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-6">
            {visibleDiseases.map((disease) => (
              <Link 
                key={disease} 
                href={`/padecimientos/${slugify(disease)}`}
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
    </>
  );
}