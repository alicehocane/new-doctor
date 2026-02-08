import React, { useEffect } from 'react';

export default function TermsPage() {
  // SEO
  useEffect(() => {
    document.title = "Términos y Condiciones de Uso | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Lee los términos y condiciones para el uso de la plataforma MediBusca. Información legal sobre el servicio de directorio médico.");
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">Términos y Condiciones</h1>
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-lg">
           <p className="mb-4 text-sm text-[#86868b]">Última actualización: {new Date().getFullYear()}</p>
           <p className="mb-8 font-medium">
             Bienvenido a MediBusca. Al acceder y utilizar nuestro sitio web, usted acepta estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
           </p>

           <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">1. Naturaleza del Servicio</h2>
           <p className="mb-6">
             MediBusca es un directorio médico informativo diseñado para facilitar la búsqueda de profesionales de la salud. <strong>No proporcionamos consejos médicos, diagnósticos ni tratamientos.</strong> La información contenida en este sitio es solo para fines informativos y no sustituye la consulta médica profesional.
           </p>

           <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">2. Relación Médico-Paciente</h2>
           <p className="mb-6">
             El uso de MediBusca no crea una relación médico-paciente. Cualquier interacción, consulta o contratación de servicios médicos es estrictamente entre el usuario y el profesional de la salud. MediBusca no es responsable de la calidad, resultado o costos de los servicios médicos recibidos.
           </p>

           <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">3. Exactitud de la Información</h2>
           <p className="mb-6">
             Nos esforzamos por mantener la información actualizada, pero no garantizamos la exactitud completa de los perfiles médicos, horarios o ubicaciones, ya que estos datos son proporcionados por terceros o recopilados de fuentes públicas. Se recomienda verificar la información directamente con el consultorio.
           </p>

           <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">4. Propiedad Intelectual</h2>
           <p className="mb-6">
             Todo el contenido, diseño, logotipos y software de MediBusca son propiedad exclusiva de MediBusca o sus licenciantes y están protegidos por leyes de derechos de autor y propiedad intelectual.
           </p>

           <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">5. Modificaciones</h2>
           <p>
             Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio. El uso continuado del sitio constituye su aceptación de dichos cambios.
           </p>
        </div>
      </div>
    </div>
  );
}