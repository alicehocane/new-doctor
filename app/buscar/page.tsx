"use client";
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, UserCheck, Star, HeartPulse, FileCheck, Map, Wallet, HelpCircle, Check } from 'lucide-react';
import { ALL_DISEASES } from '../../lib/constants';
import SearchForm from '../../components/SearchForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Doctores y Especialistas',
  description: 'Busca doctores por nombre, especialidad o enfermedad. Encuentra el especialista médico ideal cerca de ti.',
};

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function SearchPage() {
  
  // Schema Markup - Separated Scripts for Maximum Google Compatibility
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://medibusca.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Buscar",
        "item": "https://medibusca.com/buscar"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Buscar Doctores y Especialistas",
    "description": "Busca doctores por nombre, especialidad o enfermedad. Encuentra el especialista médico ideal cerca de ti.",
    "url": "https://medibusca.com/buscar",
    "audience": {
        "@type": "Patient",
        "geographicArea": {
            "@type": "Country",
            "name": "Mexico"
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans flex flex-col pt-8 pb-12 px-4 md:items-center">
      
      {/* Schema Scripts - Injected Separately */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header */}
      <div className="w-full max-w-2xl text-left md:text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-3">
          Buscar.
        </h1>
        <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed">
          Encuentra médicos verificados.
        </p>
      </div>

      {/* Interactive Search Container (Client Component) */}
      <SearchForm />

      {/* Verification Process Section (Trust Building) */}
      <section className="w-full max-w-4xl mt-20 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-6">
          <div className="text-center mb-10">
              <span className="text-[#0071e3] font-semibold text-sm uppercase tracking-wider mb-2 block">Seguridad y Confianza</span>
              <h2 className="text-3xl font-bold text-[#1d1d1f] flex items-center justify-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-[#0071e3]" />
                  Nuestro Proceso de Verificación
              </h2>
              <p className="text-[#86868b] mt-4 max-w-2xl mx-auto text-lg">
                  En MediBusca, tu salud no es un juego. Cada médico en nuestra plataforma pasa por un proceso de revisión antes de aparecer en los resultados.
              </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0071e3]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FileCheck className="w-24 h-24 text-[#0071e3]" />
                  </div>
                  <div className="relative z-10">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700 font-bold">1</div>
                      <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Cédula Profesional</h3>
                      <p className="text-[#86868b] text-sm leading-relaxed">
                          Validamos que el número de cédula profesional esté registrado y vigente ante la Secretaría de Educación Pública (SEP).
                      </p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0071e3]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <UserCheck className="w-24 h-24 text-[#0071e3]" />
                  </div>
                  <div className="relative z-10">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700 font-bold">2</div>
                      <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Especialidad Certificada</h3>
                      <p className="text-[#86868b] text-sm leading-relaxed">
                          Confirmamos que el doctor cuente con los estudios de especialidad necesarios para tratar los padecimientos que indica.
                      </p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0071e3]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Map className="w-24 h-24 text-[#0071e3]" />
                  </div>
                  <div className="relative z-10">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700 font-bold">3</div>
                      <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Ubicación Real</h3>
                      <p className="text-[#86868b] text-sm leading-relaxed">
                          Verificamos la existencia del consultorio o clínica para asegurar que la dirección publicada sea correcta y segura.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Patient Success Guide (Tips) */}
      <section className="w-full max-w-4xl mt-16 pt-12 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                      <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                          <HelpCircle className="w-7 h-7 text-[#0071e3]" />
                          Guía del Paciente: Qué preguntar
                      </h2>
                      <p className="text-[#86868b] text-lg leading-relaxed mb-6">
                          Llamar al doctor por primera vez puede causar nervios. Aquí tienes una lista de preguntas clave para hacer antes de agendar tu cita y evitar sorpresas.
                      </p>
                      
                      <div className="space-y-4">
                          <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                                  <Wallet className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-semibold text-[#1d1d1f]">Costo de la consulta</h4>
                                  <p className="text-sm text-[#86868b]">¿Cuál es el precio de la primera visita? ¿Aceptan tarjeta o solo efectivo?</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                                  <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-semibold text-[#1d1d1f]">Aseguradoras</h4>
                                  <p className="text-sm text-[#86868b]">¿Trabajan con mi seguro de gastos médicos mayores? ¿Tienen convenio directo?</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                                  <FileCheck className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-semibold text-[#1d1d1f]">Preparación</h4>
                                  <p className="text-sm text-[#86868b]">¿Necesito llegar en ayunas? ¿Debo llevar estudios previos o historial médico?</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 bg-[#f5f5f7] rounded-2xl p-8 flex flex-col justify-center text-center">
                      <h3 className="text-xl font-bold text-[#1d1d1f] mb-4">¿Listo para encontrar a tu médico?</h3>
                      <p className="text-[#86868b] mb-8">
                          Usa nuestro buscador para filtrar por ciudad y especialidad. Recuerda que en MediBusca el contacto es directo.
                      </p>
                      <button 
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="inline-flex items-center justify-center px-8 py-3 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-all shadow-lg"
                      >
                          Iniciar Búsqueda
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* Popular Diseases by City (SEO Cross-Linking) */}
      <section className="mt-16 pt-16 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-8 w-full max-w-4xl">
           <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-2">
              Encuentra tratamiento en tu ciudad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_CITIES.map((city) => (
                  <div key={city} className="space-y-3">
                      <h3 className="font-semibold text-[#1d1d1f] border-b border-slate-100 pb-2 mb-3">
                          {city}
                      </h3>
                      <ul className="space-y-2.5">
                          {/* Show top 5 diseases for each city */}
                          {ALL_DISEASES.slice(0, 5).map((disease) => (
                              <li key={disease}>
                                  <Link 
                                      href={`/enfermedad/${slugify(disease)}/${slugify(city)}`}
                                      className="text-[14px] text-[#86868b] hover:text-[#0071e3] hover:underline flex items-center gap-2 transition-colors"
                                  >
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                      {disease} en {city}
                                  </Link>
                              </li>
                          ))}
                          <li>
                              <Link 
                                  href={`/doctores/${slugify(city)}`}
                                  className="text-[13px] font-medium text-[#0071e3] hover:underline mt-1 inline-block"
                              >
                                  Ver todos en {city}
                              </Link>
                          </li>
                      </ul>
                  </div>
              ))}
          </div>
      </section>

      {/* Why Choose MediBusca */}
      <section className="w-full max-w-4xl mt-24 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-4">
            La forma más segura de encontrar doctores
          </h2>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            Hemos simplificado el proceso de búsqueda médica eliminando intermediarios y verificando la información.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Información Clara</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Datos actualizados sobre especialidades, tratamientos y horarios de atención.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Sin Comisiones</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Llama directamente al consultorio. Nosotros no cobramos por la conexión.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Privacidad Total</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              No necesitas registrarte ni dejar tus datos personales para buscar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
