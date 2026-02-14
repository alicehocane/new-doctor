import React from 'react';
import Link from 'next/link';
import { MapPin, Stethoscope, ChevronRight, Activity, ArrowUpRight, Check, Search, Heart, Users, BookOpen, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import { ALL_DISEASES } from '../lib/constants';
import HomeSearch from '../components/HomeSearch';

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla'
];

export const metadata: Metadata = {
  title: "MediBusca - Encuentra Doctores y Especialistas en México",
  description: "Directorio médico líder en México. Encuentra doctores verificados, clínicas y especialistas. Agenda citas, revisa opiniones y contacta directamente.",
};

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function HomePage() {
  
  // Schema Markup
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MediBusca",
    "url": "https://medibusca.com",
    "logo": "https://medibusca.com/icon-512.png",
    "description": "Plataforma informativa de salud y directorio médico en México.",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contacto@medibusca.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MediBusca",
    "url": "https://medibusca.com",
    "description": "Directorio médico líder en México. Encuentra doctores verificados, clínicas y especialistas.",
    "publisher": {
        "@type": "Organization",
        "name": "MediBusca",
        "logo": {
            "@type": "ImageObject",
            "url": "https://medibusca.com/icon-512.png"
        }
    }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 md:py-32 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-7xl font-semibold tracking-tighter text-[#1d1d1f] leading-[1.1] md:leading-[1.05]">
            Salud, <br className="md:hidden" /> simplificada.
          </h1>
          <p className="text-lg md:text-2xl text-[#6e6e73] max-w-lg mx-auto font-medium leading-relaxed">
            Encuentra al especialista ideal o tratamiento para tu padecimiento, rápido y seguro.
          </p>
          
          {/* Client Side Search Component */}
          <HomeSearch />
          
        </div>
      </section>

      {/* Cities Section - Horizontal Snap Scroll on Mobile */}
      <section className="py-12 md:py-24 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 md:mb-12 tracking-tight">
            Ciudades destacadas.
          </h2>
          
          {/* Scroll Container */}
          <div className="
            flex md:grid md:grid-cols-4 gap-4 
            overflow-x-auto snap-x snap-mandatory no-scrollbar 
            -mx-4 px-4 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {FEATURED_CITIES.map((city) => (
              <Link 
                key={city} 
                href={`/doctores/${slugify(city)}`}
                className="
                  snap-center shrink-0 w-[260px] md:w-auto
                  group p-6 md:p-8 bg-[#f5f5f7] rounded-[24px] 
                  transition-all duration-300 hover:bg-[#ededf0] hover:scale-[1.02] 
                  flex flex-col justify-between h-[180px] md:h-[220px] cursor-pointer
                "
              >
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-[#0071e3] mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] leading-tight">{city}</h3>
                  <div className="flex items-center gap-1 text-[#0071e3] text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Ver doctores <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section - Bento Grid style */}
      <section className="py-12 md:py-24 bg-[#f5f5f7] w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Explora por <span className="text-[#6e6e73]">especialidad.</span>
            </h2>
            <Link href="/especialidades" className="text-[#0071e3] hover:underline text-[15px] font-medium hidden md:block">
               Ver todas
            </Link>
          </div>
          
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="
             flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4
             overflow-x-auto snap-x snap-mandatory no-scrollbar
             -mx-4 px-4 md:mx-0 md:px-0 pb-8 md:pb-0
          ">
            {['Dentista - Odontólogo', 'Psicólogo', 'Pediatra', 'Médico general', 'Ginecólogo', 'Internista' , 'Cirujano general', 'Radiólogo', 'Ortopedista', 'Traumatólogo', 'Oftalmólogo', 'Cardiólogo'].map((spec) => (
              <Link 
                key={spec} 
                href={`/especialidad/${slugify(spec)}`}
                className="
                  snap-center shrink-0 w-[140px] md:w-auto aspect-square
                  flex flex-col items-center justify-center gap-3
                  p-4 bg-white rounded-[24px] shadow-sm 
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer
                "
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                   <Stethoscope className="w-5 h-5 md:w-6 md:h-6 stroke-1" />
                </div>
                <span className="font-semibold text-[#1d1d1f] text-sm md:text-[15px] text-center leading-tight">{spec}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-4 md:hidden text-center">
            <Link href="/especialidades" className="text-[#0071e3] font-medium text-sm">
              Ver todas las especialidades
            </Link>
          </div>
        </div>
      </section>

      {/* Common Diseases/Symptoms Section */}
      <section className="py-12 md:py-24 bg-white w-full border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 md:mb-12 tracking-tight">
            Busca por <span className="text-[#6e6e73]">enfermedad o síntoma.</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {ALL_DISEASES.slice(0, 20map((disease) => (
               <Link 
                  key={disease}
                  href={`/enfermedad/${slugify(disease)}`}
                  className="
                    group flex items-center justify-between p-4 px-6
                    bg-[#f5f5f7] rounded-xl md:rounded-2xl hover:bg-[#0071e3] hover:text-white
                    transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500/10
                  "
               >
                 <span className="font-medium text-sm md:text-[15px] truncate">{disease}</span>
                 <ArrowUpRight className="w-4 h-4 text-[#6e6e73] group-hover:text-white transition-colors shrink-0" />
               </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/enfermedades" className="text-[#0071e3] hover:underline text-[15px] font-medium">
               Ver todos los padecimientos
            </Link>
          </div>
        </div>
      </section>

      {/* SEO / Informational Content Section */}
      <section className="py-12 md:py-24 bg-[#f5f5f7] w-full border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-10 md:space-y-20">
          
          {/* Main Intro */}
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
              MediBusca
            </h2>
            <p className="text-lg md:text-2xl text-[#1d1d1f] font-semibold px-2">
              Encuentra médicos, especialidades e información médica en un solo lugar
            </p>
            <p className="text-base md:text-lg text-[#6e6e73] leading-relaxed max-w-3xl mx-auto">
              MediBusca es una plataforma informativa de salud que ayuda a las personas a encontrar médicos, especialidades y contenido médico claro. Nuestro objetivo es facilitar el primer paso cuando surge una duda de salud.
            </p>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 inline-block text-left max-w-2xl shadow-sm mx-4 md:mx-0">
                <p className="text-[#6e6e73] text-sm font-medium leading-relaxed">
                  <span className="text-[#1d1d1f] font-bold block mb-1">Nota Importante:</span>
                  No ofrecemos tratamientos médicos ni consultas en línea. MediBusca existe para orientar, informar y conectar a los pacientes con profesionales de la salud reales.
                </p>
            </div>
          </div>

          {/* Grid 1: What It Does & Who It's For */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Qué hace MediBusca</h3>
              </div>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                Buscar un médico puede ser confuso. Muchas personas no saben qué especialista necesitan o por dónde empezar. MediBusca organiza la información médica para que el proceso sea más simple y claro.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Buscar médicos por ciudad
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Explorar especialidades médicas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Conocer enfermedades y síntomas
                </li>
                <li className="flex items-center gap-3 text-[#1d1d1f] font-medium text-sm md:text-base">
                  <Check className="w-5 h-5 text-green-600 shrink-0" /> Contactar médicos cuando el contacto está disponible
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Pensado para pacientes y familias</h3>
              </div>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                MediBusca está creado para personas comunes. No necesitas conocimientos médicos para usar la plataforma. Explicamos los temas de salud con palabras sencillas.
              </p>
              <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed">
                Organizamos a los médicos por especialidad para ayudarte a entender quién puede atender tu caso. Nuestro objetivo es ahorrar tiempo y reducir la confusión cuando aparece un problema de salud.
              </p>
            </div>
          </div>

          {/* Grid 2: Information & Direct Connection */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-slate-200 pt-12">
             <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#0071e3]" />
                  Información médica fácil de entender
                </h3>
                <p className="text-[#6e6e73] mb-4 leading-relaxed text-sm md:text-base">
                  Nuestra enciclopedia médica cubre una amplia variedad de enfermedades, síntomas y temas de salud. Cada artículo explica:
                </p>
                <ul className="space-y-2 text-[#6e6e73] text-sm">
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Qué es la enfermedad
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Síntomas más comunes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Posibles causas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></span> Cuándo acudir al médico
                  </li>
                </ul>
                <p className="text-xs text-[#86868b] mt-6 italic">
                  El contenido es solo educativo. No reemplaza la consulta médica.
                </p>
             </div>

             <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#0071e3]" />
                  Conecta con médicos de forma directa
                </h3>
                <p className="text-[#6e6e73] mb-4 leading-relaxed text-sm md:text-base">
                  Algunos perfiles de médicos en MediBusca incluyen opciones de contacto directo. Cuando está disponible, puedes comunicarte con el médico por WhatsApp u otro medio indicado.
                </p>
                <div className="bg-[#f5f5f7] rounded-xl p-4 mt-4">
                  <p className="text-sm font-medium text-[#1d1d1f]">
                    MediBusca no gestiona citas, pagos ni consultas médicas. La comunicación se realiza directamente entre el paciente y el profesional.
                  </p>
                </div>
             </div>
          </div>

          {/* Trust Section */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] text-center">Por qué confiar en MediBusca</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                "No vendemos tratamientos médicos",
                "No realizamos diagnósticos",
                "No solicitamos historial médico",
                "No reemplazamos al médico"
              ].map((text, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-[#0071e3] mx-auto mb-3" />
                  <p className="font-semibold text-[#1d1d1f] text-sm md:text-base">{text}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[#6e6e73] max-w-3xl mx-auto text-base md:text-lg">
              MediBusca se basa en la transparencia y la responsabilidad. Nuestra función es informar, orientar y conectar. Respetamos la privacidad de los usuarios y no pedimos datos médicos sensibles.
            </p>
          </div>

          {/* Responsibility & Audience */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-slate-200 pt-12">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Una plataforma de salud responsable</h3>
              <p className="text-[#6e6e73] leading-relaxed text-sm md:text-base">
                La información médica debe ser clara y honesta. Por eso MediBusca sigue principios de responsabilidad médica:
              </p>
              <ul className="space-y-2 text-[#6e6e73] text-sm md:text-base">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Usa lenguaje claro y sencillo</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Distingue información de consejo médico</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Recomienda siempre consultar a un profesional</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Respeta la ética médica</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f]">Para quién es MediBusca</h3>
              <p className="text-[#6e6e73] leading-relaxed text-sm md:text-base">MediBusca es útil para:</p>
              <ul className="space-y-2 text-[#6e6e73] text-sm md:text-base">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Pacientes que buscan orientación médica</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Familias que necesitan encontrar especialistas</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Personas que desean conocer médicos por ciudad o especialidad</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div> Usuarios que prefieren informarse antes de contactar a un doctor</li>
              </ul>
              <p className="text-sm font-semibold text-[#0071e3] mt-2">No es necesario registrarse para acceder al contenido.</p>
            </div>
          </div>

          {/* Footer Disclaimer & Links */}
          <div className="bg-[#1d1d1f] text-white rounded-3xl p-8 md:p-12 text-center space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Aviso médico importante</h3>
              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
                La información publicada en MediBusca es solo educativa. No sustituye la consulta, el diagnóstico ni el tratamiento médico profesional. Siempre consulta a un médico calificado ante cualquier problema de salud. En caso de emergencia, llama a los servicios de emergencia de tu país.
              </p>
            </div>
            
            <div className="border-t border-slate-700 pt-8">
              <h4 className="text-lg font-bold mb-6">Empieza a explorar MediBusca</h4>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Link href="/buscar" className="bg-white text-[#1d1d1f] px-6 py-3 rounded-full font-semibold hover:bg-slate-200 transition-colors">
                  Busca médicos por ciudad
                </Link>
                <Link href="/especialidades" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Explora especialidades
                </Link>
                <Link href="/enfermedades" className="bg-[#333] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#444] transition-colors border border-slate-600">
                  Infórmate sobre enfermedades
                </Link>
              </div>
              <p className="text-slate-400 text-sm mt-8">
                MediBusca te ayuda a tomar decisiones informadas sobre tu salud.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}