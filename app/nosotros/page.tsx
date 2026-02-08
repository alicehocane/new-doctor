import React from 'react';
import { ShieldCheck, Heart, Search, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="py-20 md:py-28 px-6 bg-[#f5f5f7] text-center border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
          Sobre MediBusca.
        </h1>
        <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto font-medium leading-relaxed">
          Nuestra misión es conectar pacientes con los mejores especialistas de México de forma rápida, transparente y confiable.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        
        {/* Story Section */}
        <div className="prose prose-lg max-w-3xl mx-auto text-[#1d1d1f]/80 leading-relaxed mb-24">
          <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-6">Quiénes Somos</h2>
          <p className="mb-6">
            MediBusca nació de una necesidad simple pero fundamental: la dificultad de encontrar información médica confiable y actualizada en un solo lugar. Entendemos que cuando se trata de salud, la confianza y la rapidez son esenciales.
          </p>
          <p className="mb-6">
            Somos una plataforma tecnológica dedicada a organizar la información de miles de doctores y clínicas a lo largo de México, verificando sus credenciales y facilitando el contacto directo sin intermediarios ni costos ocultos para el paciente.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-xl flex items-center justify-center text-[#0071e3]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Confianza y Seguridad</h3>
            <p className="text-[#86868b] leading-relaxed">
              Verificamos las cédulas profesionales y la información de contacto de los médicos listados para asegurar que estás en buenas manos.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-xl flex items-center justify-center text-[#0071e3]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Simplicidad</h3>
            <p className="text-[#86868b] leading-relaxed">
              Diseñamos nuestra plataforma pensando en el usuario. Búsquedas intuitivas y acceso directo a la información que realmente importa.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-xl flex items-center justify-center text-[#0071e3]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Enfoque Humano</h3>
            <p className="text-[#86868b] leading-relaxed">
              Entendemos que detrás de cada búsqueda hay una persona preocupada por su salud o la de un familiar. Tratamos esa responsabilidad con respeto.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-xl flex items-center justify-center text-[#0071e3]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Sin Barreras</h3>
            <p className="text-[#86868b] leading-relaxed">
              Facilitamos el contacto directo (teléfono, WhatsApp, ubicación) para que la comunicación entre médico y paciente sea fluida.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#f5f5f7] rounded-[30px] p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4">¿Eres profesional de la salud?</h2>
          <p className="text-[#86868b] max-w-xl mx-auto mb-8">
            Únete a la red médica de más rápido crecimiento y permite que más pacientes te encuentren.
          </p>
          <a href="/contacto" className="inline-block bg-[#0071e3] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0077ED] transition-colors shadow-sm active:scale-95">
            Contáctanos para registrarte
          </a>
        </div>

      </div>
    </div>
  );
}