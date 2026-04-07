'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Check, Upload, ArrowLeft, ShieldCheck, 
  User, Stethoscope, Activity, Award, MapPin, Phone, 
  CheckCircle, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';
import HumanVerify from '../../components/HumanVerify';

// --- LOGIC PORTED FROM PYTHON ---

const generarSlug = (nombre: string, especialidad: string) => {
  if (!nombre) return "";
  let n = nombre.replace(/^(?:dr|dra|lic|mtra|mtro|p\.s\.|psic\.)\.?\s+/gi, '');
  const words = n.split(/\s+/);
  const shortName = words.length > 6 ? words.slice(0, 6).join(' ') : n;
  let text = "";

  if (!especialidad || especialidad.toLowerCase() === "not found") {
    text = shortName;
  } else {
    const isClinic = /clinica|clínica|hospital|centro|unidad/i.test(n);
    if (isClinic) {
      text = shortName;
    } else {
      const primary = especialidad.split(/[;,]/)[0].trim();
      const specTokens = primary.split(/\s+/);
      const shortSpec = specTokens.length > 3 ? specTokens.slice(0, 3).join(' ') : primary;
      text = `${shortName} ${shortSpec}`;
    }
  }

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-').trim().replace(/^-+|-+$/g, '');
};

const formatearTelefono = (tel: string) => {
  const d = tel.replace(/\D/g, '');
  if (!d) return null;
  if (d.length === 10) return `+52${d}`;
  if (d.length === 12 && d.startsWith("52")) return `+${d}`;
  return d.length >= 10 ? `+${d}` : d;
};

const procesarUbicaciones = (dir: string) => {
  if (!dir || dir.toLowerCase().includes("not found")) return [];
  return dir.split(' ; ').map(raw => {
    const clean = raw.trim();
    if (!clean) return null;
    const parts = clean.split('\n');
    let clinic = parts[0].trim();
    let addr = parts.length > 1 ? parts.slice(1).join(' ').replace(/\n/g, ' ').trim() : "";
    if (!addr && /\d/.test(clinic)) {
      addr = clinic; clinic = "Consultorio Privado";
    }
    return {
      clinic_name: clinic || "Consultorio Privado",
      address: addr,
      map_url: addr ? `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(addr)}` : null
    };
  }).filter(Boolean);
};

// --- MAIN COMPONENT ---

export default function PaginaRegistro() {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [esHumano, setEsHumano] = useState(false);
  const [datos, setDatos] = useState({
  nombre: '',
  especialidad: '',
  sub_specialidad: '', // <--- Spelled with 'd' at the end
  cedula: '',
  ubicacion: '',
  telefono: '',
  enfermedades: '',
  foto: null as File | null,
});

  // Optimize and Convert to WebP
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.2, // 200KB target
        maxWidthOrHeight: 1000,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      const compressedBlob = await imageCompression(file, options);
      
      // Convert to WebP using Canvas
      const img = new Image();
      img.src = URL.createObjectURL(compressedBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
            setDatos({ ...datos, foto: webpFile });
          }
        }, 'image/webp', 0.8);
      };
    } catch (err) {
      setDatos({ ...datos, foto: file }); // Fallback
    }
  };

  const manejarEnvio = async () => {
  if (!esHumano) return;
  setCargando(true);
  try {
    let urlImagen = null;

    // 1. Upload logic (Ensures WebP extension)
    if (datos.foto) {
      const path = `perfiles/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, datos.foto);
      if (!upErr) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        urlImagen = data.publicUrl;
      }
    }

    // 2. Format Contact Info (Matches your JSONB structure exactly)
    const info_contacto = {
      phones: [formatearTelefono(datos.telefono)].filter(Boolean),
      locations: procesarUbicaciones(datos.ubicacion)
    };

    // 3. Format Medical Profile (Matches your JSONB structure exactly)
    // Using default empty strings "" to prevent the .split() build error
    const perfil_medico = {
      sub_specialties: (datos.sub_specialidad || "").split(',').map(s => s.trim()).filter(Boolean),
      diseases_treated: (datos.enfermedades || "").split(',').map(c => c.trim()).filter(Boolean)
    };

    // 4. Final Insert
    const { error } = await supabase.from('doctors').insert({
      full_name: datos.nombre,
      slug: generarSlug(datos.nombre, datos.especialidad),
      specialties: [datos.especialidad],
      cities: [datos.ubicacion.split(',').pop()?.trim() || "México"], // Extracts city from address
      license_numbers: [datos.cedula],
      contact_info: info_contacto, // Supabase SDK handles the object to JSONB conversion
      medical_profile: perfil_medico,
      image_url: urlImagen,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    if (error) throw error;
    setPaso(9);
  } catch (err: any) {
    alert("Error: " + err.message);
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center">
      <div className="w-full max-w-xl px-6 pt-12">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-sm font-semibold text-[#0071e3] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-widest">Paso {paso} de 8</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${(paso / 8) * 100}%` }} className="h-full bg-[#0071e3]" />
        </div>
      </div>

      <main className="flex-1 w-full max-w-xl px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={paso} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {paso === 1 && <Step label="Identidad" q="¿Su nombre profesional completo?"><input className="apple-input" value={datos.nombre} onChange={e => setDatos({...datos, nombre: e.target.value})} placeholder="Ej: Dra. Elena Ríos" autoFocus /></Step>}
            {paso === 2 && <Step label="Especialidad" q="¿Su especialidad principal?"><input className="apple-input" value={datos.especialidad} onChange={e => setDatos({...datos, especialidad: e.target.value})} placeholder="Ej: Pediatría" /></Step>}
            {paso === 3 && <Step label="Expertiz" q="¿Cuenta con sub-especialidades?"><input className="apple-input" value={datos.sub_specialidad} onChange={e => setDatos({...datos, sub_specialidad: e.target.value})} placeholder="Separe con comas" /></Step>}
            {paso === 4 && <Step label="Cédula" q="Número de Cédula Profesional"><input className="apple-input" value={datos.cedula} onChange={e => setDatos({...datos, cedula: e.target.value})} /></Step>}
            {paso === 5 && <Step label="Ubicación" q="Nombre de Clínica y Dirección"><textarea className="apple-input min-h-[100px]" value={datos.ubicacion} onChange={e => setDatos({...datos, ubicacion: e.target.value})} placeholder="Hospital Angeles
Calle Ejemplo 123, Ciudad" /></Step>}
            {paso === 6 && <Step label="Contacto" q="Teléfono para recibir citas"><input className="apple-input" value={datos.telefono} onChange={e => setDatos({...datos, telefono: e.target.value})} /></Step>}
            {paso === 7 && <Step label="Tratamientos" q="¿Qué enfermedades trata?"><textarea className="apple-input min-h-[100px]" value={datos.enfermedades} onChange={e => setDatos({...datos, enfermedades: e.target.value})} placeholder="Diabetes, Gastritis..." /></Step>}
            {paso === 8 && (
              <Step label="Finalizar" q="Suba su fotografía profesional">
                <div className="relative border-2 border-dashed rounded-[2.5rem] p-10 bg-white text-center hover:border-[#0071e3] transition-all">
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <Upload className={`w-10 h-10 mx-auto mb-2 ${datos.foto ? 'text-green-500' : 'text-slate-300'}`} />
                  <p className="text-sm font-medium text-slate-500">{datos.foto ? `✓ ${datos.foto.name} (WebP)` : "Seleccionar Imagen"}</p>
                </div>
                <HumanVerify onVerify={setEsHumano} />
              </Step>
            )}
            
            {paso === 9 && (
              <div className="text-center py-10">
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Registro en revisión</h2>
                <p className="text-slate-500 mb-10 text-lg">Validaremos su información y activaremos su perfil en breve.</p>
                <Link href="/" className="bg-black text-white px-10 py-4 rounded-2xl font-semibold">Regresar al inicio</Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {paso < 9 && (
        <footer className="fixed bottom-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t flex justify-center">
          <div className="max-w-xl w-full flex gap-4">
            {paso > 1 && <button onClick={() => setPaso(paso-1)} className="flex-1 h-14 rounded-2xl bg-gray-100 font-bold">Atrás</button>}
            <button onClick={paso === 8 ? manejarEnvio : () => setPaso(paso+1)} disabled={cargando || (paso === 8 && !esHumano)} className={`flex-[2] h-14 rounded-2xl font-bold text-white transition-all ${ (paso === 8 && !esHumano) ? 'bg-gray-300' : 'bg-[#0071e3]'}`}>
              {cargando ? <Loader2 className="animate-spin" /> : (paso === 8 ? 'Finalizar' : 'Siguiente')}
            </button>
          </div>
        </footer>
      )}
      <style jsx global>{`.apple-input{width:100%;font-size:28px;font-weight:500;padding:12px 0;background:transparent;border:none;border-bottom:2px solid #e5e7eb;outline:none;transition:border-color 0.3s;}.apple-input:focus{border-color:#0071e3;}textarea.apple-input{font-size:20px;resize:none;}`}</style>
    </div>
  );
}

function Step({ label, q, children }: any) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</h2>
      <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-10 tracking-tight">{q}</h3>
      {children}
    </div>
  );
}