
import React from 'react';
import Link from 'next/link';
import { FileQuestion, Search, Stethoscope, BookOpen, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f7] px-6 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Icon & Title */}
        <div className="space-y-4">
            <div className="w-20 h-20 bg-[#f5f5f7] border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <FileQuestion className="w-10 h-10 text-[#86868b]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
                Página no encontrada
            </h1>
            <p className="text-lg text-[#86868b] max-w-md mx-auto leading-relaxed">
                Lo sentimos, no pudimos encontrar la página que buscas. Es posible que el enlace esté roto o que la información haya cambiado.
            </p>
        </div>

        {/* Helpful Alternatives Grid */}
        <div className="grid md:grid-cols-3 gap-4 text-left">
            <Link 
                href="/buscar"
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300"
            >
                <div className="w-10 h-10 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1d1d1f] mb-1">Buscar Doctor</h3>
                <p className="text-sm text-[#86868b] leading-snug mb-4">
                    Encuentra especialistas en tu ciudad rápidamente.
                </p>
                <div className="flex items-center text-[#0071e3] text-sm font-medium">
                    Ir al buscador <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            <Link 
                href="/especialidades"
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300"
            >
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1d1d1f] mb-1">Especialidades</h3>
                <p className="text-sm text-[#86868b] leading-snug mb-4">
                    Explora nuestra lista completa de especialidades médicas.
                </p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                    Ver catálogo <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            <Link 
                href="/enciclopedia"
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300"
            >
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1d1d1f] mb-1">Enciclopedia</h3>
                <p className="text-sm text-[#86868b] leading-snug mb-4">
                    Infórmate sobre síntomas y enfermedades comunes.
                </p>
                <div className="flex items-center text-teal-600 text-sm font-medium">
                    Leer artículos <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>

        {/* Back Home */}
        <div className="pt-4">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-colors shadow-lg shadow-gray-200"
            >
                <Home className="w-4 h-4" />
                Volver al Inicio
            </Link>
        </div>

      </div>
    </div>
  );
}
