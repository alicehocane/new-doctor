'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send the data to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "ba99dc68-56b0-4b41-9670-790319310e1b", // Replace with your key
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "MediBusca Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            setSubmitted(false);
        }, 5000);
      } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Hubo un error de conexión.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm h-full">
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
  );
}