import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // SEO
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
          Estamos aquí para ayudarte. Envíanos tus dudas, comentarios o sugerencias.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Información de contacto</h2>
            <p className="text-[#86868b] leading-relaxed">
              Si tienes problemas con la plataforma, quieres reportar información incorrecta o eres un doctor interesado en unirte a MediBusca, utiliza el formulario o nuestros canales directos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#0071e3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Correo Electrónico</h3>
                <p className="text-[#86868b]">contacto@medibusca.com</p>
                <p className="text-[#86868b]">soporte@medibusca.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#0071e3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Oficinas</h3>
                <p className="text-[#86868b]">Ciudad de México, México.</p>
                <span className="text-xs text-[#86868b] block mt-1">(Atención presencial solo con cita)</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#0071e3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f]">Soporte</h3>
                <p className="text-[#86868b]">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
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