import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f5f7]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-[#1d1d1f] mb-2">404</h1>
        <p className="text-[#86868b] text-lg mb-6">Página no encontrada</p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}