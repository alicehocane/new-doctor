import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Stethoscope, ArrowRight, Activity, MapPin, Plus } from 'lucide-react';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../lib/constants';

const COMMON_DISEASES = [
  { name: 'Diabetes', category: 'Endocrinología' },
  { name: 'Hipertensión', category: 'Cardiología' },
  { name: 'Acné', category: 'Dermatología' },
  { name: 'Ansiedad', category: 'Psiquiatría' },
  { name: 'Dolor de espalda', category: 'Traumatología' },
  { name: 'Embarazo', category: 'Ginecología' },
  { name: 'Gastritis', category: 'Gastroenterología' },
  { name: 'Migraña', category: 'Neurología' },
  { name: 'Alergias', category: 'Alergología' },
  { name: 'Varices', category: 'Angiología' },
  { name: 'Obesidad', category: 'Bariatría' },
  { name: 'Asma', category: 'Neumología' }
];

const TOP_SPECIALTIES = [
  'Ginecólogo', 'Pediatra', 'Dermatólogo', 'Cardiólogo', 'Traumatólogo', 'Psicólogo'
];

export default function SpecialtiesIndexPage() {
  const [visibleCount, setVisibleCount] = useState(40); // Increased to cover popular list initially

  const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Combine Popular + Remaining Common Specialties
  const sortedSpecialties = useMemo(() => {
    const popularSet = new Set(POPULAR_SPECIALTIES);
    const others = COMMON_SPECIALTIES.filter(s => !popularSet.has(s));
    return [...POPULAR_SPECIALTIES, ...others];
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Especialidades Médicas.
            </h1>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
                Explora nuestra lista completa de especialistas y encuentra al médico ideal para tu necesidad de salud.
            </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {sortedSpecialties.slice(0, visibleCount).map((spec) => (
            <Link 
                key={spec} 
                href={`/especialidad/${normalize(spec)}`}
                className="
                    group flex items-center justify-between p-6 
                    bg-white border border-slate-200 rounded-[20px] 
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-transparent hover:-translate-y-1
                    transition-all duration-300 cursor-pointer
                "
            >
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors duration-300">
                    <Stethoscope className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[#1d1d1f] text-[15px] group-hover:text-[#0071e3] transition-colors">
                    {spec}
                </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" />
            </Link>
            ))}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedSpecialties.length && (
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

        {/* Popular Diseases Section */}
        <section className="mt-24 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-3">
                <Activity className="w-7 h-7 text-[#0071e3]" />
                Padecimientos frecuentes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {COMMON_DISEASES.map((disease) => (
                    <Link
                        key={disease.name}
                        href={`/enfermedad/${slugify(disease.name)}`}
                        className="
                            flex flex-col p-4 bg-white border border-slate-200 rounded-xl
                            hover:border-[#0071e3] hover:shadow-md transition-all duration-300
                            cursor-pointer h-full
                        "
                    >
                        <span className="font-semibold text-[#1d1d1f] mb-1">{disease.name}</span>
                        <span className="text-xs text-[#86868b] uppercase tracking-wide">{disease.category}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-6 text-center md:text-left">
                <Link href="/enfermedades" className="text-[#0071e3] hover:underline text-sm font-medium inline-flex items-center gap-1">
                    Ver todos los padecimientos <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>

        {/* Popular Specialties by City Section */}
        <section className="mt-20 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
             <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-10 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-[#0071e3]" />
                Especialistas por ciudad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {POPULAR_CITIES.map((city) => (
                    <div key={city} className="space-y-4">
                        <h3 className="font-bold text-lg text-[#1d1d1f] border-b border-slate-100 pb-3">
                            {city}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {TOP_SPECIALTIES.map((spec) => (
                                <Link 
                                    key={`${city}-${spec}`}
                                    href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                                    className="
                                        flex items-center justify-between group
                                        text-[15px] text-[#86868b] hover:text-[#0071e3] 
                                        transition-colors py-1
                                    "
                                >
                                    <span>{spec}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            ))}
                             <Link 
                                href={`/doctores/${slugify(city)}`}
                                className="text-sm font-semibold text-[#0071e3] hover:underline mt-2 inline-block"
                            >
                                Ver todos en {city}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
