'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[48px] md:h-[52px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight text-[#1d1d1f] flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" aria-label="MediBusca Inicio">
          MediBusca
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-[12px] font-normal text-[#1d1d1f]/80" aria-label="Navegación principal">
          <Link href="/buscar" className="hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">Buscar</Link>
          <Link href="/especialidades" className="hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">Especialidades</Link>
          <Link href="/enfermedades" className="hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">Padecimientos</Link>
          <Link href="/enciclopedia" className="hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">Enciclopedia</Link>
          <Link href="/admin/upload" className="hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">Admin</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#1d1d1f] p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        id="mobile-menu"
        className={`
        md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl
        transition-all duration-300 ease-in-out overflow-hidden
        ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <nav className="flex flex-col px-6 py-4 space-y-4 text-[17px] font-medium text-[#1d1d1f]" aria-label="Navegación móvil">
          <Link href="/buscar" className="py-2 border-b border-slate-100">Buscar</Link>
          <Link href="/especialidades" className="py-2 border-b border-slate-100">Especialidades</Link>
          <Link href="/enfermedades" className="py-2 border-b border-slate-100">Padecimientos</Link>
          <Link href="/enciclopedia" className="py-2 border-b border-slate-100">Enciclopedia</Link>
          <Link href="/admin/upload" className="py-2 text-slate-500">Admin</Link>
        </nav>
      </div>
    </header>
  );
}