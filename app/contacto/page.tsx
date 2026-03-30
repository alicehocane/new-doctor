import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import { Metadata } from 'next';

export const revalidate = 604800;


export const metadata: Metadata = {
  title: "Contacto y Soporte",
  description: "Ponte en contacto con el equipo de MediBusca. Resolvemos tus dudas, recibimos comentarios y ayudamos a doctores a unirse a nuestra red médica.",
};

const FAQS = [
  {
    question: "¿Tiene algún costo utilizar MediBusca?",
    answer: "No. MediBusca es un directorio 100% gratuito para los pacientes. No cobramos comisiones ni tarifas ocultas por buscar o contactar a los especialistas."
  },
  {
    question: "¿Cómo agendo una cita con un doctor?",
    answer: "En el perfil de cada especialista encontrarás su número de teléfono o enlace directo. Solo debes comunicarte directamente con su consultorio para agendar y confirmar tu cita."
  },
  {
    question: "Soy doctor, ¿cómo me uno a MediBusca?",
    answer: "¡Nos encantaría tenerte en nuestra red! Utiliza el formulario de esta página enviando tu nombre completo, especialidad y número de cédula profesional. Nuestro equipo te contactará con los siguientes pasos."
  },
  {
    question: "¿Cómo verifican a los especialistas?",
    answer: "La seguridad es nuestra prioridad. Validamos las cédulas profesionales de todos nuestros especialistas directamente ante el Registro Nacional de Profesionistas de la SEP para garantizar su autenticidad."
  },
  {
    question: "Encontré un error en un perfil, ¿qué hago?",
    answer: "Si notas información desactualizada o incorrecta, por favor envíanos un mensaje usando el formulario con el enlace del perfil. Lo revisaremos y corregiremos inmediatamente."
  }
];

export default function ContactPage() {
  
  // 1. Original Contact Schema
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
        "email": "medibusca.info@gmail.com",
        "availableLanguage": ["Spanish"]
      }
    }
  };

  // 2. NEW: FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div className="py-20 px-6 bg-[#f5f5f7] text-center border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-2">
          Contacto.
        </h1>
        <p className="text-xl text-[#86868b] max-w-xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4">
          Estamos aquí para ayudarte. Envíanos tus dudas, comentarios o sugerencias.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        
        {/* NEW: FAQ Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#0071e3]" />
              Preguntas Frecuentes
            </h2>
            <p className="text-[#86868b] leading-relaxed mb-8">
              Encuentra respuestas rápidas a las dudas más comunes sobre la plataforma. Si no encuentras lo que buscas, envíanos un mensaje.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details 
                key={index} 
                className="group border border-slate-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden shadow-sm hover:border-[#0071e3]/30 transition-colors"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-semibold text-[#1d1d1f]">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#86868b] transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-[#86868b] leading-relaxed border-t border-slate-100 pt-4 mt-1">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Backup Contact Email */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-[#86868b] text-sm">
              ¿Prefieres enviarnos un correo directamente? Escríbenos a <a href="mailto:medibusca.info@gmail.com" className="text-[#0071e3] hover:underline font-medium">medibusca.info@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Interactive Form (Client Component) */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 sticky top-8">
            <ContactForm />
        </div>

      </div>
    </div>
  );
}