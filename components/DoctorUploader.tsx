
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2, X, Play, Database, Link as LinkIcon, Layers } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RawDoctorRecord, DoctorUpsertPayload, LogEntry, UploadStatus } from '../types';

export const DoctorUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [rawRecords, setRawRecords] = useState<RawDoctorRecord[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const normalize = (str: string) => {
    if (!str) return '';
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // --- File Handling ---

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const parseFile = (fileToParse: File) => {
    if (fileToParse.type !== 'application/json' && !fileToParse.name.endsWith('.json')) {
      setError('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error('JSON root must be an array of doctor objects.');
        }
        setRawRecords(json);
        setFile(fileToParse);
        setError(null);
        setLogs([]);
        setProgress({ current: 0, total: json.length });
        setUploadStatus('idle');
      } catch (err: any) {
        setError(`Failed to parse JSON: ${err.message}`);
      }
    };
    reader.readAsText(fileToParse);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setRawRecords([]);
    setError(null);
    setLogs([]);
    setUploadStatus('idle');
    setCurrentStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addLog = (slug: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => [{
      slug,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  // --- Transformation Logic ---

  const transformRecord = (raw: RawDoctorRecord): DoctorUpsertPayload => {
    const fullName = raw.name;
    const specialties = raw.specialty 
      ? raw.specialty.split(';').map(s => s.trim()).filter(Boolean)
      : [];
    const licenses = raw.license 
      ? raw.license.split(' ').map(l => l.trim()).filter(Boolean)
      : [];

    return {
      external_id: raw.id,
      slug: raw.slug || slugify(fullName),
      full_name: fullName,
      specialties: specialties,
      cities: raw.cities || [],
      license_numbers: licenses,
      contact_info: raw.contact,
      medical_profile: raw.medical_info,
      seo_metadata: raw.seo,
      schema_data: raw.schema_json_ld,
      updated_at: new Date().toISOString(),
    };
  };

  // --- Full Import Logic ---

  const startUpload = async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }

    setUploadStatus('uploading');
    const total = rawRecords.length;
    let processed = 0;

    try {
        // --- STEP 1: EXTRACT TAXONOMIES ---
        setCurrentStep('Extracting unique Cities and Specialties...');
        const uniqueCities = new Set<string>();
        const uniqueSpecialties = new Set<string>();

        rawRecords.forEach(rec => {
            if (rec.cities && Array.isArray(rec.cities)) {
                rec.cities.forEach(c => uniqueCities.add(c));
            }
            if (rec.specialty) {
                rec.specialty.split(';').forEach(s => uniqueSpecialties.add(s.trim()));
            }
        });

        // --- STEP 2: UPSERT TAXONOMIES ---
        setCurrentStep(`Syncing ${uniqueCities.size} Cities...`);
        const citiesArray = Array.from(uniqueCities).map(name => ({ name, slug: slugify(name) }));
        if (citiesArray.length > 0) {
            const { error: cityError } = await supabase.from('cities').upsert(citiesArray, { onConflict: 'slug', ignoreDuplicates: true });
            if (cityError) throw cityError;
        }

        setCurrentStep(`Syncing ${uniqueSpecialties.size} Specialties...`);
        const specialtiesArray = Array.from(uniqueSpecialties).map(name => ({ name, slug: slugify(name) }));
        if (specialtiesArray.length > 0) {
            const { error: specError } = await supabase.from('specialties').upsert(specialtiesArray, { onConflict: 'slug', ignoreDuplicates: true });
            if (specError) throw specError;
        }

        // --- STEP 3: UPSERT DOCTORS ---
        setCurrentStep('Upserting Doctor Records...');
        const BATCH_SIZE = 50;
        
        for (let i = 0; i < total; i += BATCH_SIZE) {
            const chunk = rawRecords.slice(i, i + BATCH_SIZE);
            const payloads = chunk.map(rec => {
                const p = transformRecord(rec);
                // Also store raw fields for logic if needed by triggers, though we will manually link in Step 4
                (p as any).raw_cities = p.cities;
                (p as any).raw_specialties = p.specialties;
                return p;
            });

            const { error: dbError } = await supabase.from('doctors').upsert(payloads, { onConflict: 'slug' });
            if (dbError) throw dbError;

            processed += payloads.length;
            setProgress({ current: processed, total });
        }

        // --- STEP 4: FETCH IDS & LINK ---
        setCurrentStep('Fetching IDs for linking...');
        
        // Fetch Maps
        // Note: For massive datasets, this map fetching should be paginated or optimized. 
        // For < 5000 items in taxonomies, fetching all is acceptable for an admin tool.
        const { data: citiesData } = await supabase.from('cities').select('id, name');
        const { data: specialtiesData } = await supabase.from('specialties').select('id, name');
        
        const cityMap: Record<string, number> = {};
        citiesData?.forEach((c: any) => cityMap[normalize(c.name)] = c.id);

        const specialtyMap: Record<string, number> = {};
        specialtiesData?.forEach((s: any) => specialtyMap[normalize(s.name)] = s.id);

        // Fetch inserted doctors to get their UUIDs
        // We fetch doctors updated recently (simplification for "daily upload") 
        // Or we loop through our rawRecords again and match by slug.
        // Matching by slug is safer here.
        
        setCurrentStep('Linking Doctor-City and Doctor-Specialty...');
        
        // We process linking in batches of rawRecords to keep memory low
        let linkProcessed = 0;
        for (let i = 0; i < total; i += BATCH_SIZE) {
            const chunk = rawRecords.slice(i, i + BATCH_SIZE);
            const slugs = chunk.map(r => r.slug || slugify(r.name));
            
            // Fetch UUIDs for this batch
            const { data: docIds } = await supabase
                .from('doctors')
                .select('id, slug')
                .in('slug', slugs);
            
            if (!docIds) continue;

            const docIdMap: Record<string, string> = {};
            docIds.forEach((d: any) => docIdMap[d.slug] = d.id);

            const cityLinks = [];
            const specLinks = [];

            for (const rec of chunk) {
                const slug = rec.slug || slugify(rec.name);
                const docId = docIdMap[slug];
                if (!docId) continue;

                // Cities
                if (rec.cities) {
                    rec.cities.forEach(c => {
                        const cId = cityMap[normalize(c)];
                        if (cId) cityLinks.push({ doctor_id: docId, city_id: cId });
                    });
                }

                // Specialties
                if (rec.specialty) {
                    rec.specialty.split(';').forEach(s => {
                        const sId = specialtyMap[normalize(s.trim())];
                        if (sId) specLinks.push({ doctor_id: docId, specialty_id: sId });
                    });
                }
            }

            if (cityLinks.length > 0) {
                await supabase.from('doctor_cities').upsert(cityLinks, { ignoreDuplicates: true });
            }
            if (specLinks.length > 0) {
                await supabase.from('doctor_specialties').upsert(specLinks, { ignoreDuplicates: true });
            }
            
            linkProcessed += chunk.length;
            // Update progress only visually if needed, but main bar is full already.
        }

        addLog('Global', 'success', `Successfully processed ${total} doctors with full relational linking.`);
        setUploadStatus('completed');

    } catch (err: any) {
        setUploadStatus('error');
        setError(err.message || 'Unknown error occurred');
        addLog('Error', 'error', err.message);
    }
  };

  // --- Render Helpers ---

  const getStatusColor = (status: UploadStatus) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Full Relational Importer
          </h2>
          <p className="text-sm text-slate-500 mt-1">Upload JSON -> Sync Taxonomies -> Upsert Doctors -> Link Tables</p>
        </div>
        {!isSupabaseConfigured() && (
             <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full border border-red-200">
             Supabase Config Missing
           </span>
        )}
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. File Upload Area */}
        {!file ? (
          <div 
            className={`
              relative group cursor-pointer
              border-2 border-dashed rounded-xl p-12
              flex flex-col items-center justify-center text-center
              transition-all duration-200 ease-in-out
              ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}
              ${error ? 'border-red-300 bg-red-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json"
              className="hidden" 
              onChange={handleFileChange}
            />
            
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4
              ${error ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}
            `}>
              {error ? <AlertCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-1">
              {error ? 'Upload Failed' : 'Upload JSON File'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {error || 'Drag and drop your doctor records here. Expects an array of objects.'}
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB • {rawRecords.length} Records found</p>
              </div>
            </div>
            {uploadStatus === 'idle' && (
              <button 
                onClick={clearFile}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 2. Preview & Actions */}
        {file && uploadStatus === 'idle' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Processing Steps:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li>Extract unique Cities and Specialties from the file.</li>
                        <li>Upsert these taxonomies to the database.</li>
                        <li>Upsert Doctor records.</li>
                        <li>Link Doctors to Cities and Specialties via junction tables.</li>
                    </ol>
                </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={startUpload}
                disabled={!isSupabaseConfigured()}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-sm transition-all
                  ${!isSupabaseConfigured() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow active:transform active:scale-95'
                  }
                `}
              >
                <Play className="w-4 h-4 fill-current" />
                Start Full Import
              </button>
            </div>
          </div>
        )}

        {/* 3. Upload Progress */}
        {uploadStatus !== 'idle' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Progress Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className={`text-base font-bold ${getStatusColor(uploadStatus)}`}>
                    {uploadStatus === 'uploading' ? 'Processing...' : 'Process Completed'}
                  </h4>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    {uploadStatus === 'uploading' && <Loader2 className="w-3 h-3 animate-spin" />}
                    {currentStep}
                  </p>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-700">
                  {Math.round((progress.current / progress.total) * 100)}%
                </div>
              </div>
              
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ease-out ${uploadStatus === 'completed' ? 'bg-green-500' : 'bg-indigo-600'}`}
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Logs Console */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Operation Logs</span>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" /> {logs.filter(l => l.status === 'success').length} Success
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-3 h-3" /> {logs.filter(l => l.status === 'error').length} Failed
                  </span>
                </div>
              </div>
              <div className="h-64 overflow-y-auto bg-slate-900 text-slate-300 p-4 font-mono text-xs space-y-1 custom-scrollbar">
                {logs.length === 0 && (
                  <span className="text-slate-600 italic">Waiting for logs...</span>
                )}
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-3 border-b border-slate-800/50 pb-1 mb-1 last:border-0">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={log.status === 'success' ? 'text-green-400' : 'text-red-400 font-bold'}>
                      {log.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400 shrink-0">{log.slug}</span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                  </div>
                ))}
              </div>
              {uploadStatus === 'completed' && (
                 <div className="bg-slate-50 p-3 border-t border-slate-200 text-center">
                    <button 
                        onClick={clearFile}
                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 underline"
                    >
                        Upload another file
                    </button>
                 </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
