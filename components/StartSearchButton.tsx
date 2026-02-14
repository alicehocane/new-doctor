
'use client';

import React from 'react';

export default function StartSearchButton() {
  return (
    <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="inline-flex items-center justify-center px-8 py-3 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-all shadow-lg"
    >
        Iniciar Búsqueda
    </button>
  );
}
