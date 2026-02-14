'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Stethoscope, ArrowRight, Plus } from 'lucide-react';

const PAGE_SIZE = 24;

interface SpecialtiesListProps {
  specialties: string[];
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

export default function SpecialtiesList({ specialties }: SpecialtiesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter specialties based on search query
  const filteredSpecialties = specialties.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const visibleSpecialties = filteredSpecialties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSpecialties.length;

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
        <div className="max-w-xl mx-auto mb-12 relative group animate-in fade-in slide-in-from-bottom-3">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#86868b]" />
             </div>
             <input 
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar especialidad (ej. Cardiólogo)..."
                className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border border-slate-200 text-[#1d1d1f] text-[15px] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all shadow-sm"
             />
        </div>

        {/* Grid */}
        {visibleSpecialties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
                {visibleSpecialties.map((spec) => (
                <Link 
                    key={spec} 
                    href={`/especialidad/${slugify(spec)}`}
                    className="
                        group flex items-center justify-between p-6 
                        bg-white border border-slate-200 rounded-[20px] 
                        hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-transparent hover:-translate-y-1
                        transition-all duration-300 cursor-pointer
                    "
                >
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors duration-300 shrink-0">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-[#1d1d1f] text-[15px] group-hover:text-[#0071e3] transition-colors leading-tight">
                        {spec}
                    </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 animate-in fade-in">
                <p className="text-[#86868b] text-lg">No encontramos especialidades que coincidan con "{searchQuery}".</p>
            </div>
        )}

        {/* Load More Button */}
        {hasMore && (
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-6">
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
                    Ver más especialidades
                </button>
            </div>
        )}
    </>
  );
}