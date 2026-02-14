import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, UserCheck, Star, HeartPulse } from 'lucide-react';
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

      {/* SEO Content Section */}
      <section className="w-full max-w-4xl mt-24 pt-16 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-4">
            Encuentra tu especialista ideal en segundos
          </h2>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            MediBusca es el directorio médico más completo y confiable. Conectamos a pacientes con doctores verificados de manera directa y segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">100% Verificados</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Validamos las cédulas profesionales de cada médico para garantizar tu seguridad y tranquilidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Contacto Directo</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Sin intermediarios ni comisiones. Llama directamente al consultorio o envía un mensaje.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">Perfiles Completos</h3>
            <p className="text-[#86868b] text-sm leading-relaxed">
              Revisa experiencia, enfermedades que tratan, ubicación exacta y horarios antes de agendar.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                ¿Cómo usar el buscador médico?
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Selecciona tu ubicación</strong>
                    <p className="text-[#86868b] text-sm">Elige la ciudad donde deseas recibir atención médica. Cubrimos las principales ciudades de México.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Escribe la especialidad o síntoma</strong>
                    <p className="text-[#86868b] text-sm">¿Buscas un cardiólogo o tienes dolor de espalda? Nuestro buscador inteligente te sugerirá las mejores opciones.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <strong className="text-[#1d1d1f] block mb-1">Compara y contacta</strong>
                    <p className="text-[#86868b] text-sm">Explora los perfiles y usa los botones de "Llamar" para agendar tu cita inmediatamente.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                ¿Por qué elegir MediBusca?
              </h3>
              <div className="prose text-[#86868b] text-sm leading-relaxed">
                <p className="mb-4">
                  En un mundo donde la información de salud abunda pero no siempre es confiable, MediBusca se destaca por su compromiso con la calidad y la verificación.
                </p>
                <p className="mb-4">
                  Nuestra plataforma está diseñada para simplificar el proceso de encontrar atención médica. Ya no necesitas navegar por múltiples sitios o directorios desactualizados. Aquí encuentras:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Especialistas certificados por consejos médicos.</li>
                  <li>Ubicaciones geolocalizadas para encontrar el consultorio más cercano.</li>
                  <li>Información clara sobre padecimientos y tratamientos.</li>
                </ul>
                <p>
                  Únete a miles de pacientes que ya han encontrado a su médico de confianza a través de nuestra plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}