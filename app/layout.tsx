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
            <Link href="/" className="text-xl font-semibold tracking-tight text-[#1d1d1f] flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" aria-label="MediBusca Inicio">
              MediBusca
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 text-[12px] font-normal text-[#1d1d1f]/80" aria-label="Navegación principal">
              <Link href="/buscar" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Buscar</Link>
              <Link href="/especialidades" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Especialidades</Link>
              <Link href="/enfermedades" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Padecimientos</Link>
              <Link href="/enciclopedia" className="hover:text-primary hover:opacity-100 transition-all cursor-pointer">Enciclopedia</Link>
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
            </nav>
          </div>
        </header>

        {/* Spacer for sticky header */}
        <div className="h-[48px] md:h-[52px]"></div>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#f5f5f7] border-t border-slate-200 text-[#86868b] py-16 mt-auto text-[13px]">
           <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
             
             <div className="space-y-4">
               <Link href="/" className="text-[17px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors block">MediBusca</Link>
               <p className="leading-relaxed">
                 MediBusca es una plataforma informativa de salud. Ayudamos a las personas a encontrar médicos, especialidades y contenido médico claro y confiable.
               </p>
               <div className="bg-white border border-slate-200 p-3 rounded-lg">
                 <p className="font-medium text-[#1d1d1f] text-xs">
                   No brindamos atención médica ni realizamos diagnósticos o tratamientos.
                 </p>
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="font-semibold text-[#1d1d1f]">Enlaces importantes</h3>
               <ul className="space-y-3">
                 <li><Link href="/nosotros" className="hover:text-[#0071e3] hover:underline transition-colors">Sobre nosotros</Link></li>
                 <li><Link href="/privacidad" className="hover:text-[#0071e3] hover:underline transition-colors">Política de privacidad</Link></li>
                 <li><Link href="/terminos" className="hover:text-[#0071e3] hover:underline transition-colors">Términos y condiciones</Link></li>
                 <li><Link href="/contacto" className="hover:text-[#0071e3] hover:underline transition-colors">Contacto</Link></li>
               </ul>
             </div>

             <div className="space-y-4">
               <h3 className="font-semibold text-[#1d1d1f]">Para pacientes</h3>
               <ul className="space-y-3">
                 <li><Link href="/buscar" className="hover:text-[#0071e3] hover:underline transition-colors">Buscar médicos por ciudad</Link></li>
                 <li><Link href="/especialidades" className="hover:text-[#0071e3] hover:underline transition-colors">Buscar por especialidad</Link></li>
                 <li><Link href="/enfermedades" className="hover:text-[#0071e3] hover:underline transition-colors">Explorar enfermedades y síntomas</Link></li>
                 <li><Link href="/buscar" className="hover:text-[#0071e3] hover:underline transition-colors">Conectar con doctores</Link></li>
               </ul>
             </div>

             <div className="space-y-6">
               <div className="space-y-2">
                 <h3 className="font-semibold text-[#1d1d1f]">Compromiso con la información</h3>
                 <p className="leading-relaxed text-xs">
                   El contenido de MediBusca es educativo y no reemplaza la consulta médica profesional. Siempre consulta a un médico calificado ante cualquier problema de salud.
                 </p>
               </div>
               <div className="space-y-2">
                 <h3 className="font-semibold text-[#1d1d1f]">Transparencia y confianza</h3>
                 <p className="leading-relaxed text-xs">
                   MediBusca respeta la privacidad de los usuarios y no solicita información médica personal. La información publicada se revisa con fines educativos y puede actualizarse con el tiempo.
                 </p>
               </div>
             </div>

           </div>

           <div className="max-w-6xl mx-auto px-6 border-t border-slate-200 pt-8">
             <p>&copy; {new Date().getFullYear()} MediBusca. Todos los derechos reservados.</p>
           </div>
        </footer>
    </div>
  );
}