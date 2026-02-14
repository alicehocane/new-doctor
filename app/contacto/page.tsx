import React from 'react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contacto y Soporte",
  description: "Ponte en contacto con el equipo de MediBusca. Resolvemos tus dudas, recibimos comentarios y ayudamos a doctores a unirse a nuestra red médica.",
};

export default function ContactPage() {
  
  // Schema Markup
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto MediBusca",
    "description": "Página de contacto y soporte de MediBusca. Resolvemos tus dudas y comentarios.",
    "url": "https://medibusca.com/contacto",
    "mainEntity": {
      "@type": "Organization",
      "name": "MediBusca",
      "url": "https://medibusca.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "contacto@medibusca.com",
        "availableLanguage": ["Spanish"]
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Schema Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />

      {/* Header */}
      <div className="py-20 px-6 bg-[#f5f5f7] text-center border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-2">
          Contacto.
        </h1>
        <p className="text-xl text-[#86868b] max-w-xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4">
          Estamos aquí para ayudarte. Envíanos tus dudas, comentarios o sugerencias.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Información de contacto</h2>
            <p className="text-[#86868b] leading-relaxed">
              Si tienes problemas con la plataforma, quieres reportar información incorrecta o eres un doctor interesado en unirte a MediBusca, utiliza el formulario o nuestros canales directos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Correo Electrónico</h3>
                <p className="text-[#86868b] hover:text-[#0071e3] transition-colors">
                  <a href="mailto:contacto@medibusca.com">contacto@medibusca.com</a>
                </p>
                <p className="text-[#86868b] hover:text-[#0071e3] transition-colors">
                  <a href="mailto:soporte@medibusca.com">soporte@medibusca.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Oficinas</h3>
                <p className="text-[#86868b]">Ciudad de México, México.</p>
                <span className="text-xs text-[#86868b] block mt-1">(Atención presencial solo con cita)</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0 text-[#0071e3]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Soporte</h3>
                <p className="text-[#86868b]">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Form (Client Component) */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
            <ContactForm />
        </div>

      </div>
    </div>
  );
}