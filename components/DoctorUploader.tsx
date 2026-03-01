
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2, X, Play, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RawDoctorRecord, DoctorUpsertPayload, LogEntry, UploadStatus } from '../types';

export const DoctorUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [rawRecords, setRawRecords] = useState<RawDoctorRecord[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Transformation Logic ---

  const transformRecord = (raw: RawDoctorRecord): DoctorUpsertPayload => {
    // 1. Name mapping
    const fullName = raw.name;

    // 2. Specialty split (String "Angiólogo; Pediatra" -> Array ["Angiólogo", "Pediatra"])
    const specialties = raw.specialty 
      ? raw.specialty.split(';').map(s => s.trim()).filter(Boolean)
      : [];

    // 3. License split (String "123 456" -> Array ["123", "456"])
    const licenses = raw.license 
      ? raw.license.split(' ').map(l => l.trim()).filter(Boolean)
      : [];

    return {
      external_id: raw.id, // Maps raw.id ("0") to external_id
      slug: raw.slug,
      full_name: fullName,
      specialties: specialties,
      cities: raw.cities || [],
      license_numbers: licenses,
      // JSONB Fields mapped strictly to Typed Objects
      contact_info: raw.contact,
      medical_profile: raw.medical_info,
      seo_metadata: raw.seo,
      schema_data: raw.schema_json_ld,
      updated_at: new Date().toISOString(), // Update timestamp on upsert
    };
  };

  // --- Upload Logic ---

  const addLog = (slug: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => [{
      slug,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const startUpload = async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }

    setUploadStatus('uploading');
    setLogs([]); 

    // --- 1. TRANSFORMATION & DEDUPLICATION STEP ---
    // We map all raw records to payloads first
    const allPayloads = rawRecords.map(transformRecord);

    // We use a Map to remove duplicates based on 'slug'. 
    // If a slug appears twice, the later one overwrites the earlier one.
    const uniquePayloadsMap = new Map();
    
    allPayloads.forEach(record => {
      if (record.slug) {
        uniquePayloadsMap.set(record.slug, record);
      }
    });

    const uniquePayloads = Array.from(uniquePayloadsMap.values());

    // Log if we removed any duplicates
    if (allPayloads.length > uniquePayloads.length) {
      console.warn(`Removed ${allPayloads.length - uniquePayloads.length} duplicate records.`);
      addLog('System', 'success', `Cleaned ${allPayloads.length - uniquePayloads.length} duplicate records automatically.`);
    }
    // ----------------------------------------------

    // --- CONFIGURATION ---
    const BATCH_SIZE = 100;
    const MAX_CONCURRENCY = 5;
    
    const totalRecords = uniquePayloads.length; // Use the cleaned array length
    let processedCount = 0;
    
    // --- 2. CREATE CHUNKS ---
    // Use the CLEANED 'uniquePayloads' array here, not 'rawRecords'
    const chunks: DoctorUpsertPayload[][] = [];
    for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
      chunks.push(uniquePayloads.slice(i, i + BATCH_SIZE));
    }

    // --- 3. DEFINE WORKER ---
    let currentChunkIndex = 0;

    const processNextChunk = async (): Promise<void> => {
      const index = currentChunkIndex++;
      if (index >= chunks.length) return;

      const batch = chunks[index];

      try {
        const { error: dbError } = await supabase
          .from('doctors')
          .upsert(batch, { onConflict: 'slug' });

        if (dbError) throw dbError;

        processedCount += batch.length;
        setProgress({ current: processedCount, total: totalRecords });
        addLog(`Batch ${index + 1}`, 'success', `Upserted ${batch.length} records`);
      
      } catch (err: any) {
        // If we STILL get the error, it means the database has a constraint we missed,
        // but the map above should fix 99% of cases.
        addLog(`Batch ${index + 1}`, 'error', err.message);
      } finally {
        await processNextChunk();
      }
    };

    // --- 4. IGNITE WORKERS ---
    const workers = Array(Math.min(chunks.length, MAX_CONCURRENCY))
      .fill(null)
      .map(() => processNextChunk());

    await Promise.all(workers);
    setUploadStatus('completed');
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
            <Database className="w-5 h-5 text-primary" />
            Doctor Data Importer
          </h2>
          <p className="text-sm text-slate-500 mt-1">Transform JSON records and upsert to Supabase.</p>
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
              ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
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
              ${error ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}
            `}>
              {error ? <AlertCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-1">
              {error ? 'Upload Failed' : 'Upload JSON File'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {error || 'Drag and drop your doctor records here, or click to browse. Expects an array of objects.'}
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Preview First 5 Records
              </h3>
              <span className="text-xs text-slate-500">
                Will be transformed to DB Schema
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">Raw Name &rarr; Full Name</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Raw Specialty &rarr; Array</th>
                      <th className="px-4 py-3">Raw License &rarr; Array</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rawRecords.slice(0, 5).map((rec, idx) => {
                      const transformed = transformRecord(rec);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-900 font-medium">{transformed.full_name}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs">{transformed.slug}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {transformed.specialties.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-100">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {transformed.license_numbers.map((l, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs border border-slate-200">
                                  {l}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-center text-slate-500">
                + {rawRecords.length > 5 ? rawRecords.length - 5 : 0} more records
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
                Start Upload
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
                    {uploadStatus === 'uploading' ? 'Uploading Data...' : 'Process Completed'}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Processed {progress.current} of {progress.total} records
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
