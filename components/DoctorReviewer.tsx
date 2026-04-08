'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, MapPin, Award, Phone, Loader2, User, ExternalLink } from 'lucide-react';

export function DoctorReviewer() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setDoctors(data || []);
    setLoading(false);
  }

  async function approve(id: string) {
    const { error } = await supabase.from('doctors').update({ status: 'published' }).eq('id', id);
    if (!error) fetchPending();
  }

  // --- UPDATED REMOVE FUNCTION ---
  async function remove(doc: any) {
    if (confirm("¿Confirmar eliminación permanente?")) {
      
      // 1. If the doctor has an image, delete it from the bucket first
      if (doc.image_url) {
        // Extract just the filename from the end of the URL
        const fileName = doc.image_url.split('/').pop(); 
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('avatars')
            .remove([fileName]);
            
          if (storageError) {
             console.error("Error al borrar la imagen:", storageError);
             // We still continue to delete the DB record even if image deletion fails
          }
        }
      }

      // 2. Delete the record from the database
      const { error } = await supabase.from('doctors').delete().eq('id', doc.id);
      if (!error) fetchPending();
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      {doctors.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-300 text-center">
          <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay registros pendientes</p>
        </div>
      ) : (
        doctors.map((doc) => {
          const contact = doc.contact_info; 
          const location = contact?.locations?.[0] || {};

          return (
            <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-6 items-center">
              <div className="flex gap-5 w-full">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                  {doc.image_url ? (
                    <img src={doc.image_url} className="w-full h-full object-cover" alt="Perfil" />
                  ) : (
                    <User className="text-slate-200 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{doc.full_name}</h3>
                    {/* BUG FIXED HERE: Changed doctor.slug to doc.slug */}
                    <a href={`/admin/preview/${doc.slug}`} target="_blank" className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-indigo-600 text-xs font-bold uppercase tracking-tight mb-3">{doc.specialties?.join(', ')}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-[13px] text-slate-500 font-medium">
                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" /> {doc.license_numbers?.[0]}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {contact?.phones?.[0]}</div>
                    <div className="flex items-start gap-2 col-span-full"><MapPin className="w-4 h-4 mt-0.5 text-slate-400" /> {location.address}</div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 w-full md:w-40">
                <button onClick={() => approve(doc.id)} className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-100">
                  <Check className="w-4 h-4" /> Aprobar
                </button>
                {/* UPDATED HERE: Passing the entire 'doc' object instead of just the ID */}
                <button onClick={() => remove(doc)} className="flex-1 bg-white text-red-600 border border-red-100 px-4 py-2.5 rounded-xl font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <X className="w-4 h-4" /> Rechazar
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}