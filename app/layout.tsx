import React, { useState, PropsWithChildren } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

export default function RootLayout({
  children,
}: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f7]">
        {/* Apple Style Sticky Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[48px] md:h-[52px] flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold tracking-tight text-[#1d1d1f] flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
              MediBusca
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 text-[12px] font-normal text-[#1d1d1f]/80">
              <Link href="/buscar" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Buscar</Link>
              <Link href="/especialidades" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Especialidades</Link>
              <Link href="/enfermedades" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Padecimientos</Link>
              <Link href="/enciclopedia" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Enciclopedia</Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#1d1d1f] p-1"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <div className={`
            md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl
            transition-all duration-300 ease-in-out overflow-hidden
            ${isMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="flex flex-col px-6 py-4 space-y-4 text-[17px] font-medium text-[#1d1d1f]">
              <Link href="/buscar" className="py-2 border-b border-slate-100">Buscar</Link>
              <Link href="/especialidades" className="py-2 border-b border-slate-100">Especialidades</Link>
              <Link href="/enfermedades" className="py-2 border-b border-slate-100">Padecimientos</Link>
              <Link href="/enciclopedia" className="py-2 border-b border-slate-100">Enciclopedia</Link>
              <Link href="/admin/upload" className="py-2 text-slate-500">Admin</Link>
            </div>
          </div>
        </header>

        {/* Spacer for sticky header */}
        <div className="h-[48px] md:h-[52px]"></div>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#f5f5f7] border-t border-slate-200 text-[#86868b] py-12 mt-auto">
           <div className="max-w-5xl mx-auto px-6 text-xs leading-relaxed space-y-2">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p>&copy; {new Date().getFullYear()} MediBusca.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/nosotros" className="cursor-pointer hover:underline transition-colors hover:text-[#1d1d1f]">Nosotros</Link>
                  <Link href="/contacto" className="cursor-pointer hover:underline transition-colors hover:text-[#1d1d1f]">Contacto</Link>
                  <Link href="/privacidad" className="cursor-pointer hover:underline transition-colors hover:text-[#1d1d1f]">Privacidad</Link>
                  <Link href="/terminos" className="cursor-pointer hover:underline transition-colors hover:text-[#1d1d1f]">Términos</Link>
                </div>
             </div>
           </div>
        </footer>
    </div>
  );
}