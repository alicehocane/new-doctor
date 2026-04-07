'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Check, Upload, ArrowLeft, User, Stethoscope, 
  Activity, Award, MapPin, Phone, CheckCircle, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';
import HumanVerify from '../../components/HumanVerify';
import { COMMON_SPECIALTIES, ALL_CITIES, ALL_DISEASES } from '../../lib/constants';

// --- HELPERS (LOGIC PORTED FROM PYTHON) ---

const generarSlug = (nombre: string, especialidad: string) => {
  if (!nombre) return "";
  let n = nombre.replace(/^(?:dr|dra|lic|mtra|mtro|p\.s\.|psic\.)\.?\s+/gi, '');
  const words = n.split(/\s+/);
  const shortName = words.length > 6 ? words.slice(0, 6).join(' ') : n;
  const primary = especialidad.split(/[;,]/)[0].trim();
  const specTokens = primary.split(/\s+/);
  const shortSpec = specTokens.length > 3 ? specTokens.slice(0, 3).join(' ') : primary;
  const text = `${shortName} ${shortSpec}`;

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

// --- MAIN COMPONENT ---

export default function PaginaRegistro() {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [esHumano, setEsHumano] = useState(false);

  const [datos, setDatos] = useState({
    nombre: '',
    especialidad: '',
    sub_especialidades: [] as string[],
    cedulas: [''],
    ubicaciones: [{ clinic_name: '', address: '', city: '' }],
    telefonos: [''],
    enfermedades: [] as string[],
    foto: null as File | null,
  });

  // --- STEP VALIDATION ---
  const esPasoValido = () => {
    switch (paso) {
      case 1: return datos.nombre.trim().length > 5;
      case 2: return COMMON_SPECIALTIES.includes(datos.especialidad);
      case 4: return datos.cedulas.every(c => c.trim().length >= 7);
      case 5: return datos.ubicaciones.every(u => u.address.length > 5 && u.city !== '');
      case 6: return datos.telefonos.every(t => t.replace(/\D/g, '').length >= 10);
      case 7: return datos.enfermedades.length > 0;
      case 8: return esHumano;
      default: return true;
    }
  };

  // --- HANDLERS ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBlob = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1000, useWebWorker: true });
      const img = new Image();
      img.src = URL.createObjectURL(compressedBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
            setDatos({ ...datos, foto: webpFile });
          }
        }, 'image/webp', 0.8);
      };
    } catch (err) { setDatos({ ...datos, foto: file }); }
  };

  const manejarEnvio = async () => {
    setCargando(true);
    try {
      let urlImagen = null;
      if (datos.foto) {
        const fileName = `${Date.now()}.webp`;

        // Force convert to a clean Blob
        const imageBlob = new Blob([datos.foto], { type: 'image/webp' });

        const { data: uploadData, error: upErr } = await supabase.storage
          .from('avatars') // Confirm this is lowercase 'avatars'
          .upload(fileName, imageBlob, {
            contentType: 'image/webp',
            upsert: true
          });

        if (upErr) {
          // If this alerts "Object not found", check your NEXT_PUBLIC_SUPABASE_URL
          alert("DETALLE DEL ERROR: " + upErr.message);
          setCargando(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        urlImagen = urlData.publicUrl;
        console.log("Imagen subida con éxito:", urlImagen);
      }

      const info_contacto = {
        phones: datos.telefonos.map(t => formatearTelefono(t)).filter(Boolean),
        locations: datos.ubicaciones.map(u => ({
          clinic_name: u.clinic_name || "Consultorio Privado",
          address: u.address,
          city: u.city,
          map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.address + ' ' + u.city)}`
        }))
      };

      const { error } = await supabase.from('doctors').insert({
        full_name: datos.nombre,
        slug: generarSlug(datos.nombre, datos.especialidad),
        specialties: [datos.especialidad],
        cities: Array.from(new Set(datos.ubicaciones.map(u => u.city))),
        license_numbers: datos.cedulas.filter(c => c.trim() !== ''),
        contact_info: info_contacto,
        medical_profile: { diseases_treated: datos.enfermedades, sub_specialties: [] },
        image_url: urlImagen,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      setPaso(9);
    } catch (err: any) { alert("Error: " + err.message); }
    finally { setCargando(false); }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-xl px-6 pt-12">
        <div className="flex justify-between items-center mb-4 text-[#86868b] font-bold text-[10px] uppercase tracking-widest">
           <Link href="/" className="flex items-center gap-1 text-[#0071e3]"><ArrowLeft size={14}/> Volver</Link>
           <span>Paso {paso} de 8</span>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${(paso / 8) * 100}%` }} className="h-full bg-[#0071e3]" />
        </div>
      </div>

      <main className="flex-1 w-full max-w-xl px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={paso} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            
            {paso === 1 && <Step icon={<User/>} label="Nombre" q="¿Su nombre profesional completo?"><input className="apple-input" value={datos.nombre} onChange={e => setDatos({...datos, nombre: e.target.value})} placeholder="Ej: Dr. Alejandro García" autoFocus /></Step>}

            {paso === 2 && (
              <Step icon={<Stethoscope/>} label="Especialidad" q="Seleccione su especialidad principal">
                <select className="apple-select" value={datos.especialidad} onChange={e => setDatos({...datos, especialidad: e.target.value})}>
                  <option value="">Seleccione una especialidad...</option>
                  {COMMON_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Step>
            )}

            {paso === 4 && (
              <Step icon={<Award/>} label="Cédulas" q="Sus números de Cédula Profesional">
                {datos.cedulas.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-4">
                    <input className="apple-input flex-1" placeholder="Cédula Licencia" value={c} onChange={e => {
                      const next = [...datos.cedulas]; next[i] = e.target.value; setDatos({...datos, cedulas: next});
                    }}/>
                    {i > 0 && <button onClick={() => setDatos({...datos, cedulas: datos.cedulas.filter((_, idx) => idx !== i)})} className="text-red-500"><X size={20}/></button>}
                  </div>
                ))}
                <button onClick={() => setDatos({...datos, cedulas: [...datos.cedulas, '']})} className="add-btn"><Plus size={16}/> Agregar otra cédula</button>
              </Step>
            )}

            {paso === 5 && (
              <Step icon={<MapPin/>} label="Ubicaciones" q="¿Dónde se encuentra su consultorio?">
                {datos.ubicaciones.map((u, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 mb-6 space-y-4 shadow-sm relative">
                    {i > 0 && <button onClick={() => setDatos({...datos, ubicaciones: datos.ubicaciones.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-gray-400"><X size={18}/></button>}
                    <input className="apple-input-sm" placeholder="Nombre Clínica (Ej: Hospital Angeles)" value={u.clinic_name} onChange={e => { const next = [...datos.ubicaciones]; next[i].clinic_name = e.target.value; setDatos({...datos, ubicaciones: next}); }}/>
                    <input className="apple-input-sm" placeholder="Calle, Número y Colonia" value={u.address} onChange={e => { const next = [...datos.ubicaciones]; next[i].address = e.target.value; setDatos({...datos, ubicaciones: next}); }}/>
                    <select className="apple-select-sm" value={u.city} onChange={e => { const next = [...datos.ubicaciones]; next[i].city = e.target.value; setDatos({...datos, ubicaciones: next}); }}>
                      <option value="">Seleccione Ciudad...</option>
                      {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
                <button onClick={() => setDatos({...datos, ubicaciones: [...datos.ubicaciones, {clinic_name:'', address:'', city:''}]})} className="add-btn"><Plus size={16}/> Agregar ubicación</button>
              </Step>
            )}

            {paso === 6 && (
              <Step icon={<Phone/>} label="Contacto" q="Teléfonos para recibir citas">
                {datos.telefonos.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-4">
                    <input className="apple-input flex-1" placeholder="Número con clave lada" value={t} onChange={e => {
                      const next = [...datos.telefonos]; next[i] = e.target.value; setDatos({...datos, telefonos: next});
                    }}/>
                    {i > 0 && <button onClick={() => setDatos({...datos, telefonos: datos.telefonos.filter((_, idx) => idx !== i)})} className="text-red-500"><X size={20}/></button>}
                  </div>
                ))}
                <button onClick={() => setDatos({...datos, telefonos: [...datos.telefonos, '']})} className="add-btn"><Plus size={16}/> Agregar otro teléfono</button>
              </Step>
            )}

            {paso === 7 && (
              <Step icon={<CheckCircle/>} label="Tratamientos" q="Seleccione los padecimientos que trata">
                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-3xl bg-white/50">
                  {ALL_DISEASES.map(d => (
                    <button key={d} onClick={() => {
                      const next = datos.enfermedades.includes(d) ? datos.enfermedades.filter(i => i !== d) : [...datos.enfermedades, d];
                      setDatos({...datos, enfermedades: next});
                    }} className={`chip ${datos.enfermedades.includes(d) ? 'active' : ''}`}>{d}</button>
                  ))}
                </div>
              </Step>
            )}

            {paso === 8 && (
              <Step icon={<Upload/>} label="Finalizar" q="Suba su fotografía profesional">
                <div className="relative border-2 border-dashed rounded-[2.5rem] p-10 bg-white text-center hover:border-[#0071e3] transition-all">
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <Upload className={`w-10 h-10 mx-auto mb-2 ${datos.foto ? 'text-green-500' : 'text-slate-300'}`} />
                  <p className="text-xs font-bold text-slate-500">{datos.foto ? `✓ ${datos.foto.name} (Optimizado)` : "Seleccionar Foto"}</p>
                </div>
                <HumanVerify onVerify={setEsHumano} />
              </Step>
            )}

            {paso === 9 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Check size={40}/></div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Registro Enviado</h2>
                <p className="text-slate-500 mb-10 text-lg">Su perfil está en revisión. Lo activaremos en breve.</p>
                <Link href="/" className="bg-black text-white px-12 py-4 rounded-2xl font-bold shadow-xl">Finalizar</Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {paso < 9 && (
        <footer className="fixed bottom-0 w-full p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-center z-50">
          <div className="max-w-xl w-full flex gap-4">
            {paso > 1 && <button onClick={() => setPaso(paso - 1)} className="flex-1 h-14 rounded-2xl bg-gray-100 font-bold text-[#1d1d1f]">Atrás</button>}
            <button 
              onClick={paso === 8 ? manejarEnvio : () => setPaso(paso + 1)} 
              disabled={cargando || !esPasoValido()} 
              className={`flex-[2] h-14 rounded-2xl font-bold transition-all shadow-lg ${
                !esPasoValido() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0071e3] text-white active:scale-95'
              }`}
            >
              {cargando ? <Loader2 className="animate-spin" /> : (paso === 8 ? 'Finalizar' : 'Siguiente')}
            </button>
          </div>
        </footer>
      )}

      <style jsx global>{`
        .apple-input { width: 100%; font-size: 24px; font-weight: 500; padding: 12px 0; background: transparent; border: none; border-bottom: 2px solid #e5e7eb; outline: none; transition: border-color 0.3s; color: #1d1d1f; }
        .apple-input:focus { border-color: #0071e3; }
        .apple-select { width: 100%; font-size: 18px; padding: 16px; border-radius: 18px; border: 2px solid #e5e7eb; background: white; outline: none; }
        .apple-input-sm { width: 100%; font-size: 15px; border-bottom: 1px solid #e5e7eb; padding: 8px 0; outline: none; }
        .apple-select-sm { width: 100%; font-size: 14px; padding: 10px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f8f8f8; }
        .add-btn { display: flex; align-items: center; gap: 6px; color: #0071e3; font-weight: 700; font-size: 12px; margin-top: 12px; text-transform: uppercase; }
        .chip { padding: 8px 18px; border-radius: 12px; background: white; border: 1px solid #e5e7eb; font-size: 13px; font-weight: 600; color: #4b5563; transition: all 0.2s; }
        .chip.active { background: #0071e3; color: white; border-color: #0071e3; box-shadow: 0 4px 12px rgba(0,113,227,0.3); }
      `}</style>
    </div>
  );
}

function Step({ label, q, icon, children }: any) {
  return (
    <div className="flex flex-col">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0071e3] mb-6 border border-gray-100">{icon}</div>
      <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</h2>
      <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-10 tracking-tight">{q}</h3>
      {children}
    </div>
  );
}