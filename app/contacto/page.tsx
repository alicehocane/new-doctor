import React, { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  // State for FAQ Accordion
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // SEO Logic (Preserved from your code)
  useEffect(() => {
    document.title = "Contacto y Soporte | MediBusca";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Ponte en contacto con el equipo de MediBusca. Resolvemos tus dudas, recibimos comentarios y ayudamos a doctores a unirse a nuestra red médica.");
  }, []);

  // FAQ Data (Tailored for Directory/Connection platform)
  const faqs = [
    {
      question: "¿Cómo agendo una cita con un médico?",
      answer: "MediBusca es un directorio de conexión. Nosotros te facilitamos el teléfono, WhatsApp y dirección del especialista para que tú los contactes y agendes tu cita directamente con ellos sin intermediarios."
    },
    {
      question: "¿Tiene algún costo para los pacientes?",
      answer: "No. Buscar médicos y acceder a su información de contacto es 100% gratuito. No cobramos tarifas por uso ni comisiones."
    },
    {
      question: "¿Cómo puedo cancelar o cambiar una cita?",
      answer: "Dado que la cita se agenda directamente con el especialista o su consultorio, cualquier cambio o cancelación debes gestionarlo contactándolos directamente a ellos."
    },
    {
      question: "Soy médico, ¿cómo puedo aparecer en el directorio?",
      answer: "Nos encantaría tenerte. Visita la sección 'Para Médicos' en el menú principal o escríbenos a través de este formulario seleccionando el asunto 'Afiliación'."
    },
    {
      question: "La información de un doctor es incorrecta, ¿qué hago?",
      answer: "Si encuentras un número o dirección desactualizada, por favor envíanos un mensaje usando el formulario de esta página para que nuestro equipo lo verifique y corrija de inmediato."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-20 px-6 bg-[#f5f5f7] text-center border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
          Contacto.
        </h1>
        <p className="text-xl text-[#86868b] max-w-xl mx-auto font-medium leading-relaxed">
          Estamos aquí para ayudarte. Resuelve tus dudas sobre la plataforma o envíanos un mensaje.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        
        {/* Left Column: FAQs (Replaced static info) */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-[#0071e3]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">Preguntas Frecuentes</h2>
            </div>
            <p className="text-[#86868b] leading-relaxed mb-8">
              Revisa nuestras dudas más comunes. Recuerda que MediBusca conecta pacientes con doctores, pero no administramos las agendas médicas.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl overflow-hidden bg-[#f5f5f7]/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f5f5f7] transition-colors"
                >
                  <span className={`font-medium text-sm ${openIndex === index ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-[#86868b]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#86868b]" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-[#86868b] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Form (Kept exactly as it was) */}
        <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm h-fit">
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8">Envíanos un mensaje</h2>
          
          {submitted ? (
            <div className="bg-green-50 text-green-800 p-6 rounded-2xl flex items-center gap-3 animate-in fade-in">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                 <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">¡Mensaje enviado!</p>
                <p className="text-sm">Gracias por contactarnos. Te responderemos a la brevedad.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide">Nombre</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 bg-[#f5f5f7] rounded-xl border-transparent focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 bg-[#f5f5f7] rounded-xl border-transparent focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide">Asunto</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 bg-[#f5f5f7] rounded-xl border-transparent focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-all"
                  placeholder="¿Cómo podemos ayudarte?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1d1d1f] uppercase tracking-wide">Mensaje</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-4 bg-[#f5f5f7] rounded-xl border-transparent focus:bg-white focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full h-14 bg-[#0071e3] text-white rounded-xl font-semibold text-lg hover:bg-[#0077ED] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Enviar Mensaje <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}