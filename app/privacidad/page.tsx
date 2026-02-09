import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  // SEO
  useEffect(() => {
    document.title = "Política de Privacidad | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Política de Privacidad de MediBusca. Conoce cómo protegemos tu información y el uso de datos en nuestra plataforma informativa de salud.");
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <ShieldCheck className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Política de Privacidad</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
             En MediBusca, la privacidad de los usuarios es una prioridad.
           </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-6">
        
        <div className="prose prose-slate max-w-none text-[#1d1d1f]/80 leading-relaxed text-[17px]">
          <p className="font-medium text-[#1d1d1f] mb-8">
            Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información cuando visitas nuestro sitio web. Al utilizar MediBusca, aceptas las prácticas descritas en esta política.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              Qué es MediBusca
            </h2>
            <p>
              MediBusca es una plataforma informativa de salud. Ofrecemos información sobre médicos, especialidades, enfermedades y síntomas con fines educativos.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-sm font-medium text-[#1d1d1f]">
              No ofrecemos atención médica, diagnósticos ni tratamientos.
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Información que recopilamos</h2>
            <p className="mb-4">
              MediBusca no solicita información médica personal. Podemos recopilar información básica de forma automática, como:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador</li>
              <li>Tipo de dispositivo</li>
              <li>Páginas visitadas</li>
              <li>Tiempo de navegación</li>
            </ul>
            <p>
              Estos datos se usan solo para mejorar el funcionamiento del sitio y la experiencia del usuario.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0071e3]" />
              Información que no recopilamos
            </h2>
            <p className="mb-4">En MediBusca:</p>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> No solicitamos historial médico
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> No pedimos diagnósticos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> No almacenamos datos clínicos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> No exigimos registro obligatorio
              </li>
            </ul>
            <p>
              La comunicación con médicos, cuando está disponible, ocurre directamente entre el usuario y el profesional de la salud.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Uso de la información</h2>
            <p className="mb-4">La información recopilada se utiliza para:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Mejorar el contenido del sitio</li>
              <li>Analizar el rendimiento de la plataforma</li>
              <li>Optimizar la navegación</li>
              <li>Mantener la seguridad del sitio</li>
            </ul>
            <p>
              MediBusca no vende, alquila ni comparte información personal con terceros.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Cookies</h2>
            <p className="mb-4">MediBusca puede usar cookies para:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Mejorar la experiencia de navegación</li>
              <li>Analizar el tráfico del sitio</li>
              <li>Recordar preferencias básicas</li>
            </ul>
            <p>
              El usuario puede desactivar las cookies desde la configuración de su navegador en cualquier momento.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Enlaces a sitios externos</h2>
            <p className="mb-4">
              Nuestro sitio puede incluir enlaces a páginas externas, como perfiles de médicos, clínicas u otros servicios.
            </p>
            <p>
              MediBusca no controla ni es responsable de las políticas de privacidad ni del contenido de esos sitios. Recomendamos revisar sus políticas antes de proporcionar información.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Seguridad de la información</h2>
            <p className="mb-4">
              Aplicamos medidas razonables para proteger la información del usuario y evitar accesos no autorizados.
            </p>
            <p>
              Sin embargo, ningún sistema en internet es completamente seguro y no podemos garantizar una protección absoluta.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Privacidad de menores</h2>
            <p className="mb-4">
              MediBusca no está dirigido a menores sin la supervisión de un adulto. No recopilamos intencionalmente información personal de niños.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Cambios en esta política</h2>
            <p className="mb-4">
              MediBusca puede actualizar esta Política de Privacidad cuando sea necesario. Los cambios se publicarán en esta misma página y entrarán en vigor desde su publicación.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Derechos del usuario</h2>
            <p className="mb-4">El usuario puede:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Navegar por MediBusca sin registrarse</li>
              <li>Configurar el uso de cookies desde su navegador</li>
              <li>Dejar de usar el sitio en cualquier momento</li>
            </ul>
            <p>
              Para consultas relacionadas con privacidad, puedes contactarnos desde la página de Contacto.
            </p>
          </section>

          <section className="mb-12 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Contacto</h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o sobre el uso de datos en MediBusca, puedes comunicarte con nosotros a través de la sección de Contacto del sitio.
            </p>
          </section>

          <div className="bg-[#1d1d1f] text-white p-8 rounded-[24px]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Aviso final
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              La información publicada en MediBusca es educativa y no sustituye la consulta médica profesional.
            </p>
            <p className="text-sm text-slate-400 font-medium">
              El uso del sitio implica la aceptación de esta Política de Privacidad.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}