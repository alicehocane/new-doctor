'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database, Trash2, RefreshCw, Loader2, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react';
import { ALL_CITIES, COMMON_SPECIALTIES, ALL_DISEASES } from '../lib/constants';
import { Doctor } from '../types';

export const DataTools: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Doctor Management State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [manageMode, setManageMode] = useState(false);

  // --- Seeding Logic ---

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const seedDoctors = async () => {
    if (!confirm("This will insert 20 sample doctors into your database. Continue?")) return;
    
    setLoading(true);
    setStatus("Generating sample doctors...");
    setError(null);

    try {
      const sampleDoctors = [];
      const firstNames = ['Alejandro', 'Maria', 'Jose', 'Ana', 'Carlos', 'Sofia', 'Miguel', 'Laura', 'David', 'Paula'];
      const lastNames = ['Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];

      for (let i = 0; i < 20; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const city = ALL_CITIES[Math.floor(Math.random() * ALL_CITIES.length)];
        const specialty = COMMON_SPECIALTIES[Math.floor(Math.random() * COMMON_SPECIALTIES.length)];
        
        const fullName = `Dr. ${fn} ${ln}`;
        const slug = generateSlug(`${fullName} ${specialty} ${city} ${Math.floor(Math.random() * 1000)}`);

        const doc: any = {
          full_name: fullName,
          slug: slug,
          specialties: [specialty],
          cities: [city],
          license_numbers: [`${Math.floor(1000000 + Math.random() * 9000000)}`],
          contact_info: {
            phones: [`55${Math.floor(10000000 + Math.random() * 90000000)}`],
            locations: [{
              clinic_name: `Consultorio ${ln}`,
              address: `Av. Principal ${Math.floor(Math.random() * 100)}, Col. Centro, ${city}`,
              map_url: ''
            }]
          },
          medical_profile: {
            sub_specialties: [],
            diseases_treated: ALL_DISEASES.sort(() => 0.5 - Math.random()).slice(0, 3)
          },
          seo_metadata: {
            meta_title: `${fullName} - ${specialty} en ${city}`,
            meta_description: `Agenda cita con ${fullName}, especialista en ${specialty} en ${city}.`,
            keywords: `${specialty}, ${city}, doctor`
          },
          updated_at: new Date().toISOString()
        };
        sampleDoctors.push(doc);
      }

      const { error: insertError } = await supabase.from('doctors').insert(sampleDoctors);
      if (insertError) throw insertError;

      setStatus("Success! 20 Doctors added.");
      if (manageMode) fetchDoctors(); // Refresh list if open

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Management Logic ---

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (searchQuery) {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDoctors(data as Doctor[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      if (error) throw error;
      setDoctors(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Seeder Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Database className="w-6 h-6" />
            <h3 className="text-lg font-bold text-slate-900">Database Seeder</h3>
          </div>
          <p className="text-slate-600 text-sm mb-6">
            Automatically populate your database with dummy data for testing purposes. 
            Useful if you are seeing 404 errors due to empty content.
          </p>
          <div className="flex gap-3">
            <button
              onClick={seedDoctors}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Seed 20 Doctors
            </button>
          </div>
          {status && <p className="mt-3 text-xs font-medium text-green-600">{status}</p>}
          {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
        </div>

        {/* Manager Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-700">
            <Search className="w-6 h-6" />
            <h3 className="text-lg font-bold text-slate-900">Quick Doctor Manager</h3>
          </div>
          <p className="text-slate-600 text-sm mb-6">
            View the most recently added doctors, search by name, and delete records if needed.
          </p>
          <button
            onClick={() => { setManageMode(true); fetchDoctors(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Open Manager
          </button>
        </div>
      </div>

      {/* Doctor Manager Interface */}
      {manageMode && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Doctor Database</h3>
            <button 
              onClick={() => setManageMode(false)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Close
            </button>
          </div>
          
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctors by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {doctors.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                {loading ? 'Loading...' : 'No doctors found.'}
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Specialty</th>
                    <th className="px-4 py-2">City</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{doc.full_name}</td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{doc.specialties[0]}</td>
                      <td className="px-4 py-3 text-slate-600">{doc.cities[0]}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <a 
                            href={`/medico/${doc.slug}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="View"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteDoctor(doc.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};