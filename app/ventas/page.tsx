import React from 'react';
import { CheckCircle, Users, ShieldCheck, BarChart, ChevronRight } from 'lucide-react';

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Hero */}
      <div className="bg-white pt-20 pb-16 md:pt-32 md:pb-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-4xl md:text-7xl font-semibold text-[#1d1d1f] tracking-tighter mb-6 leading-tight">
          Haz crecer <br className="hidden md:block" /> tu práctica médica.
        </h1>
        <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          Únete a la red de especialistas más confiable de México y conecta con pacientes que buscan tu experiencia hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#0071e3] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#0077ED] transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            Registrar mi consultorio
            </button>
            <button className="bg-[#f5f5f7] text-[#1d1d1f] px-8 py-4 rounded-full font-medium text-lg hover:bg-[#e8e8ed] transition-all active:scale-95">
            Contactar ventas
            </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
           <div className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-2xl flex items-center justify-center mb-6">
                 <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">Más Pacientes</h3>
              <p className="text-[#86868b] leading-relaxed text-lg">
                Aumenta tu visibilidad online. Miles de pacientes visitan MediBusca cada mes buscando especialistas calificados en su ciudad.
              </p>
           </div>
           <div className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-2xl flex items-center justify-center mb-6">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">Perfil Verificado</h3>
              <p className="text-[#86868b] leading-relaxed text-lg">
                Destaca tu experiencia. Genera confianza inmediata mostrando tu cédula profesional, especialidades y ubicaciones validadas.
              </p>
           </div>
           <div className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-2xl flex items-center justify-center mb-6">
                 <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">Presencia Digital</h3>
              <p className="text-[#86868b] leading-relaxed text-lg">
                Aparece en los primeros resultados de búsqueda locales y permite que los pacientes te contacten directamente por teléfono.
              </p>
           </div>
        </div>
      </div>

      {/* Pricing/CTA */}
      <div className="bg-white py-20 border-t border-slate-100">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-12 tracking-tight">Planes diseñados para ti</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
                {/* Free Plan */}
                <div className="bg-[#f5f5f7] rounded-[30px] p-8 md:p-10 border border-slate-200 flex flex-col h-full">
                    <div className="mb-4">
                        <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-full text-[#86868b]">
                            Básico
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-5xl font-bold text-[#1d1d1f]">Gratis</span>
                    </div>
                    <p className="text-[#86868b] mb-8 font-medium">Ideal para doctores que inician su presencia digital.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-[#1d1d1f] text-[15px]">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0" /> Perfil con nombre y especialidad
                        </li>
                        <li className="flex items-center gap-3 text-[#1d1d1f] text-[15px]">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0" /> Aparición en directorio general
                        </li>
                        <li className="flex items-center gap-3 text-[#1d1d1f] text-[15px]">
                            <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0" /> 1 Ubicación de consultorio
                        </li>
                    </ul>
                    <button className="w-full bg-white border border-slate-300 text-[#1d1d1f] py-4 rounded-xl font-semibold hover:bg-[#fafafa] transition-colors">
                        Registrarse Gratis
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-[#1d1d1f] rounded-[30px] p-8 md:p-10 border border-slate-800 flex flex-col h-full text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldCheck className="w-32 h-32" />
                    </div>
                    <div className="mb-4 relative z-10">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold uppercase tracking-wider rounded-full text-white">
                            Recomendado
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-6 relative z-10">
                        <span className="text-5xl font-bold">$499</span>
                        <span className="text-slate-400 font-medium text-lg">/ mes</span>
                    </div>
                    <p className="text-slate-400 mb-8 font-medium relative z-10">Maximiza tu alcance y consigue más citas.</p>
                    <ul className="space-y-4 mb-8 flex-1 relative z-10">
                        <li className="flex items-center gap-3 text-white text-[15px]">
                            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> Posicionamiento destacado
                        </li>
                        <li className="flex items-center gap-3 text-white text-[15px]">
                            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> Botón de llamada directa y WhatsApp
                        </li>
                        <li className="flex items-center gap-3 text-white text-[15px]">
                            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> Múltiples ubicaciones y fotos
                        </li>
                        <li className="flex items-center gap-3 text-white text-[15px]">
                            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> Estadísticas de perfil
                        </li>
                    </ul>
                    <button className="w-full bg-[#0071e3] text-white py-4 rounded-xl font-semibold hover:bg-[#0077ED] transition-colors relative z-10">
                        Comenzar Prueba
                    </button>
                </div>
            </div>

            <div className="mt-16 text-[#86868b]">
                <p>¿Tienes dudas? <a href="#" className="text-[#0071e3] hover:underline">Habla con un asesor</a></p>
            </div>
         </div>
      </div>
    </div>
  );
}