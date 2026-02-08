import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">Aviso de Privacidad</h1>
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-lg">
          <p className="mb-4 text-sm text-[#86868b]">Última actualización: {new Date().getFullYear()}</p>
          <p className="mb-8 font-medium">
            En MediBusca, nos tomamos muy en serio su privacidad. Este aviso describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestra plataforma.
          </p>
          
          <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">1. Recopilación de Información</h2>
          <p className="mb-6">
            Recopilamos información que usted nos proporciona directamente, como cuando busca un médico o se pone en contacto con nosotros. Esto puede incluir datos de uso, dirección IP, tipo de navegador y preferencias de navegación. No recopilamos información médica sensible de los usuarios visitantes.
          </p>

          <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">2. Uso de la Información</h2>
          <p className="mb-6">
            Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, así como para conectar a pacientes con especialistas médicos adecuados. También utilizamos datos agregados para entender tendencias de búsqueda y mejorar la experiencia del usuario.
          </p>

          <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">3. Protección de Datos</h2>
          <p className="mb-6">
            Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su información contra el acceso no autorizado, la alteración, divulgación o destrucción.
          </p>

          <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">4. Cookies y Tecnologías Similares</h2>
          <p className="mb-6">
            Utilizamos cookies para mejorar la funcionalidad del sitio y analizar el tráfico. Usted puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie.
          </p>

          <h2 className="text-2xl font-semibold text-[#1d1d1f] mt-10 mb-4">5. Contacto</h2>
          <p>
            Si tiene preguntas sobre este aviso de privacidad, por favor contáctenos a través de nuestros canales oficiales o envíe un correo a privacidad@medibusca.com.
          </p>
        </div>
      </div>
    </div>
  );
}