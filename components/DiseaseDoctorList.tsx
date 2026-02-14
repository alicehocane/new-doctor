'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, User, CheckCircle, Loader2, Plus, Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Doctor } from '../types';

const PAGE_SIZE = 12;

interface DiseaseDoctorListProps {
  initialDoctors: Doctor[];
  diseaseName: string;
  targetSpecialty: string | null;
  city?: string;
}

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function DiseaseDoctorList({ initialDoctors, diseaseName, targetSpecialty, city }: DiseaseDoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialDoctors.length >= PAGE_SIZE);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('doctors').select('*');

    // Filter by City if provided
    if (city) {
        query = query.contains('cities', [city]);
    }

    // Filter by Specialty or Disease Tag
    if (targetSpecialty) {
        query = query.contains('specialties', [targetSpecialty]);
    } else {
        query = query.contains('medical_profile', { diseases_treated: [diseaseName] });
    }

    const { data } = await query.range(from, to);

    if (data) {
        if (data.length > 0) {
            const sortedNew = sortDoctorsByPhone(data as Doctor[]);
            setDoctors(prev => [...prev, ...sortedNew]);
            setPage(nextPage);
        }
        if (data.length < PAGE_SIZE) {
            setHasMore(false);
        }
    }
    setLoadingMore(false);
  };

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {doctors.map((doc, idx) => (
                <div 
                    key={doc.id} 
                    className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-[#0071e3]/20 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx < 12 ? idx * 50 : 0}ms` }}
                >
                    <div className="flex-1 min-w-0 mb-5">
                         <div className="flex justify-between items-start gap-3">
                             <Link href={`/medico/${doc.slug}`} className="flex-1">
                                <h2 className="text-lg md:text-xl font-bold text-[#1d1d1f] leading-snug hover:text-[#0071e3] transition-colors tracking-tight cursor-pointer">
                                    {doc.full_name}
                                </h2>
                             </Link>
                             {doc.license_numbers.length > 0 && (
                                 <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-1" />
                             )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3 mb-4">
                            {targetSpecialty && doc.specialties.includes(targetSpecialty) && (
                                <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {targetSpecialty}
                                </span>
                            )}
                            {doc.specialties
                                .filter(s => s !== targetSpecialty)
                                .slice(0, 2)
                                .map(s => (
                                <span key={s} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {s}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#86868b]">
                            <MapPin className="w-4 h-4 text-[#86868b]/70" /> 
                            {doc.cities[0] || 'México'}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <Link 
                        href={`/medico/${doc.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#f5f5f7] text-[#1d1d1f] rounded-xl font-medium text-sm hover:bg-[#e5e5ea] transition-colors active:scale-95"
                      >
                        <User className="w-4 h-4" />
                        Ver Perfil
                      </Link>
                      
                      {doc.contact_info.phones?.[0] ? (
                        <a 
                          href={`tel:${doc.contact_info.phones[0]}`}
                          className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#0071e3] text-white rounded-xl font-medium text-sm hover:bg-[#0077ED] transition-colors active:scale-95"
                        >
                          <Phone className="w-4 h-4" />
                          Llamar
                        </a>
                      ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
                           <Phone className="w-4 h-4" />
                           Llamar
                        </button>
                      )}
                    </div>
                </div>
            ))}
            
            {doctors.length === 0 && (
                <div className="col-span-full py-20 text-center text-[#86868b]">
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="w-8 h-8 text-[#d2d2d7]" />
                    </div>
                    <p className="text-lg">No encontramos doctores verificados para {diseaseName} {city ? `en ${city}` : ''} en este momento.</p>
                    <Link href="/especialidades" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">
                        Ver todas las especialidades
                    </Link>
                </div>
            )}
        </div>

        {hasMore && doctors.length > 0 && (
            <div className="pt-12 flex justify-center">
                <button 
                    onClick={loadMore} 
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3.5 bg-white border border-[#d2d2d7] rounded-full font-medium text-[#1d1d1f] text-[15px] hover:bg-[#f5f5f7] hover:border-[#86868b] transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Ver más doctores
                </button>
            </div>
        )}
    </>
  );
}