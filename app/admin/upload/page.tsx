'use client';
import React, { useState, useEffect } from 'react';
import { DoctorUploader } from '../../../components/DoctorUploader';
import { ArticleUploader } from '../../../components/ArticleUploader';
import { SitemapGenerator } from '../../../components/SitemapGenerator';
// 1. Import the new Reviewer component
import { DoctorReviewer } from '../../../components/DoctorReviewer'; 
import { Database, BookOpen, LogOut, Loader2, AlertCircle, Shield, Globe, UserCheck } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function AdminUploadPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // 2. Added 'review' to the activeTab state type
  const [activeTab, setActiveTab] = useState<'doctors' | 'articles' | 'sitemaps' | 'review'>('doctors');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    /* Login view remains the same */
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Access</h2>
        </div>
        <div className="w-full max-w-md bg-white py-10 px-8 shadow-xl rounded-2xl border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm text-slate-900" />
            </div>
            {loginError && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 font-medium">{loginError}</div>}
            <button type="submit" disabled={loginLoading} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all">
                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-1.5 rounded-lg"><Shield className="w-5 h-5 text-white" /></div>
                    <span className="font-bold text-slate-900 tracking-tight">Admin Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 hidden sm:block">{session.user.email}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Database Management</h1>
          <p className="mt-2 text-lg text-slate-600">Review registrations, import doctors, or manage sitemaps.</p>
        </div>

        {/* --- TAB SWITCHER --- */}
        <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-1">
                {/* 3. New 'Review' Tab Button */}
                <button
                    onClick={() => setActiveTab('review')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'review' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <UserCheck className="w-4 h-4" />
                    Review Pending
                </button>

                <button
                    onClick={() => setActiveTab('doctors')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'doctors' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Database className="w-4 h-4" />
                    Doctors Import
                </button>

                <button
                    onClick={() => setActiveTab('articles')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'articles' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Articles
                </button>

                <button
                    onClick={() => setActiveTab('sitemaps')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'sitemaps' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Globe className="w-4 h-4" />
                    Sitemaps
                </button>
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 4. Display the DoctorReviewer component when tab is active */}
            {activeTab === 'review' && <DoctorReviewer />}
            {activeTab === 'doctors' && <DoctorUploader />}
            {activeTab === 'articles' && <ArticleUploader />}
            {activeTab === 'sitemaps' && <SitemapGenerator />}
        </div>
      </div>
    </div>
  );
}