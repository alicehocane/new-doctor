'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { 
  Activity, ArrowRight, Search, Plus, MapPin, 
  Stethoscope, ShieldCheck, BookOpen, HeartPulse, 
  Info, AlertCircle, FileText 
} from 'lucide-react';
import { POPULAR_SPECIALTIES, ALL_DISEASES } from '../../lib/constants';

const slugify = (text) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const FEATURED_CITIES = ['Ciudad de México', 'Guadalajara', 'Monterrey'];
const PAGE_SIZE = 16;

export default function DiseasesIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = "Enciclopedia de Enfermedades y Síntomas | MediBusca México";
  }, []);

  const filteredDiseases = useMemo(() => 
    ALL_DISEASES.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const visibleDiseases = filteredDiseases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDiseases.length;

  const handleLoadMore = () => setVisibleCount(prev => prev + PAGE_SIZE);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Story Part 1: The Mission (Expertise) */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-3.5 h-3.5" /> Diccionario Médico Verificado
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
            Entender tu salud <br className="hidden md:block" /> es el primer paso.
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-3xl mx-auto font-medium leading-relaxed">
            Nuestra enciclopedia médica organiza cientos de padecimientos para ayudarte a identificar síntomas y encontrar al especialista certificado adecuado.
          </p>
        </div>

        {/* Search Experience */}
        <div className="max-w-2xl mx-auto mb-20 relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-[#86868b]" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="¿Qué síntoma o condición buscas? Ej. Diabetes, Migraña..."
            className="w-full h-16 pl-16 pr-6 bg-white rounded-[2rem] border border-slate-200 text-[#1d1d1f] text-lg shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all"
          />
        </div>

        {/* Story Part 2: Navigation Guide (Authoritativeness) */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in duration-1000">
            <div>
                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-6">Cómo usar esta enciclopedia</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold">1</div>
                        <p className="text-[#86868b] leading-relaxed"><strong className="text-[#1d1d1f]">Identifica:</strong> Busca por síntoma o nombre de la enfermedad para leer una descripción clara y profesional.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold">2</div>
                        <p className="text-[#86868b] leading-relaxed"><strong className="text-[#1d1d1f]">Conecta:</strong> Cada padecimiento te sugerirá qué tipo de especialista (Cardiólogo, Dermatólogo, etc.) es el indicado para tratarte.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold">3</div>
                        <p className="text-[#86868b] leading-relaxed"><strong className="text-[#1d1d1f]">Localiza:</strong> Una vez que sepas el tipo de doctor, encuentra perfiles verificados cerca de tu ubicación actual.</p>
                    </div>
                </div>
            </div>
            <div className="bg-[#f5f5f7] p-8 rounded-[2rem]">
                <div className="flex items-center gap-3 mb-4">
                    <HeartPulse className="w-6 h-6 text-[#0071e3]" />
                    <h3 className="font-bold text-lg">Nota de Rigor Médico</h3>
                </div>
                <p className="text-sm text-[#86868b] leading-relaxed italic">
                    "Toda la información contenida en MediBusca es sintetizada a partir de protocolos médicos estándar. Nuestro objetivo es democratizar el acceso a la información de salud, fomentando siempre la consulta presencial con profesionales certificados."
                </p>
            </div>
        </div>

        {/* Disease Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visibleDiseases.map((disease) => (
            <Link key={disease} href={`/enfermedad/${slugify(disease)}`}
              className="group p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-[#0071e3] hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3] transition-colors">
                <Activity className="w-6 h-6 text-[#86868b] group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] mb-1">{disease}</h3>
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">Guía Médica</span>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12 mb-20">
            <button onClick={handleLoadMore} className="px-10 py-4 bg-white border border-slate-200 rounded-full font-bold hover:bg-[#f5f5f7] hover:border-[#86868b] transition-all">
                Cargar más padecimientos
            </button>
          </div>
        )}

        {/* Story Part 3: The Cross-Link (SEO Authority) */}
        <section className="mt-32 pt-20 border-t border-slate-200">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Especialistas por área médica</h2>
                    <p className="text-lg text-[#86868b]">Si ya cuentas con un diagnóstico, encuentra directamente al especialista que necesitas.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {POPULAR_SPECIALTIES.slice(0, 6).map(spec => (
                        <Link key={spec} href={`/especialidad/${slugify(spec)}`}
                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-[#0066cc] hover:bg-[#f5f5f7] transition-all"
                        >
                            {spec}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEATURED_CITIES.map((city) => (
                    <div key={city} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <MapPin className="w-5 h-5 text-[#0071e3]" />
                            <h3 className="font-bold text-[#1d1d1f]">{city}</h3>
                        </div>
                        <ul className="space-y-2.5">
                            {ALL_DISEASES.slice(0, 5).map((disease) => (
                                <li key={disease}>
                                    <Link href={`/enfermedad/${slugify(disease)}/${slugify(city)}`}
                                        className="text-[14px] text-[#86868b] hover:text-[#0071e3] flex items-center gap-2"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-[#d2d2d7]"></div>
                                        {disease} en {city}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        {/* Story Part 4: Trust & Responsibility (EEAT Baseline) */}
        <section className="mt-32">
            <div className="bg-[#1d1d1f] rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071e3]/20 rounded-full -mr-32 -mt-32"></div>
                <div className="max-w-4xl relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-[#0071e3] rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold">Compromiso con la Veracidad</h2>
                    </div>
                    <p className="text-xl text-slate-300 leading-relaxed mb-10">
                        En MediBusca, la **Transparencia** es nuestra prioridad. No vendemos tratamientos ni realizamos diagnósticos automatizados. Somos una plataforma informativa dedicada a orientar a las familias mexicanas hacia el profesional de la salud más competente y cercano.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-green-500 shrink-0" />
                            <p className="text-sm text-slate-400">Verificamos cédulas profesionales de cada doctor listado.</p>
                        </div>
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-green-500 shrink-0" />
                            <p className="text-sm text-slate-400">Contenido educativo libre de sesgos comerciales.</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex gap-5">
                        <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg mb-2 uppercase tracking-wide">Aviso de Responsabilidad (YMYL)</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                El contenido de MediBusca tiene fines únicamente informativos y educativos. **Bajo ninguna circunstancia reemplaza la consulta, el diagnóstico o el tratamiento médico profesional.** Siempre busque el consejo de su médico u otro proveedor de salud calificado ante cualquier pregunta sobre una condición médica. Nunca ignore el consejo profesional ni retrase la búsqueda de tratamiento por algo que haya leído en este sitio.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}