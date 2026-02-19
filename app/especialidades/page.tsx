
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, MapPin, Search, Phone, ShieldCheck, UserCheck, User, HelpCircle, HeartPulse } from 'lucide-react';
import { COMMON_SPECIALTIES, POPULAR_CITIES, POPULAR_SPECIALTIES } from '../../lib/constants';
import SpecialtiesList from '../../components/SpecialtiesList';
import { Metadata } from 'next';

const COMMON_DISEASES = [
  { name: 'Diabetes', category: 'Endocrinología' },
  { name: 'Hipertensión', category: 'Cardiología' },
  { name: 'Acné', category: 'Dermatología' },
  { name: 'Ansiedad', category: 'Psiquiatría' },
  { name: 'Dolor de espalda', category: 'Traumatología' },
  { name: 'Embarazo', category: 'Ginecología' },
  { name: 'Gastritis', category: 'Gastroenterología' },
  { name: 'Migraña', category: 'Neurología' },
  { name: 'Alergias', category: 'Alergología' },
  { name: 'Varices', category: 'Angiología' },
  { name: 'Obesidad', category: 'Bariatría' },
  { name: 'Asma', category: 'Neumología' }
];

const FEATURED_CITIES = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey'
];

const TOP_SPECIALTIES_DATA = [
  { name: 'Dentista - Odontólogo', tag: 'Salud Bucal', description: 'Cuidado dental y encías' },
  { name: 'Psicólogo', tag: 'Salud Mental', description: 'Terapia emocional' },
  { name: 'Pediatra', tag: 'Infantil', description: 'Desarrollo de niños' },
  { name: 'Médico general', tag: 'Atención Primaria', description: 'Primer contacto médico' },
  { name: 'Ginecólogo', tag: 'Salud Femenina', description: 'Embarazo y mujer' },
  { name: 'Internista', tag: 'Adultos', description: 'Diagnóstico integral' }
];

export const metadata: Metadata = {
  title: "Especialidades Médicas - Directorio Completo",
  description: "Explora todas las especialidades médicas disponibles en MediBusca. Encuentra expertos para cada necesidad de salud en México.",
};

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function SpecialtiesIndexPage() {
  
  // Merge and Deduplicate Specialties for Client List
  const allSpecialties = Array.from(new Set([...POPULAR_SPECIALTIES, ...COMMON_SPECIALTIES]));

  // Schema Markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://medibusca.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Especialidades",
        "item": "https://medibusca.com/especialidades"
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Especialidades Médicas Populares",
    "description": "Lista de las especialidades médicas más buscadas en México.",
    "itemListElement": TOP_SPECIALTIES_DATA.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": `https://medibusca.com/especialidad/${slugify(item.name)}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6 tracking-tight">
                Especialidades Médicas.
            </h1>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
                Explora nuestra lista completa de especialistas y encuentra al médico ideal para tu necesidad de salud.
            </p>
        </div>

        {/* Introduction & Responsibility Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-3">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0071e3] to-transparent opacity-20"></div>
                
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Directorio Médico en México</h2>
                <p className="text-[#86868b] leading-relaxed text-lg mb-6">
                    En MediBusca, te ayudamos a encontrar al médico adecuado de forma rápida y sencilla. 
                    Organizamos la oferta de salud por especialidad para facilitar tu acceso a un <strong>Consultorio Médico Privado</strong> confiable.
                </p>

                <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-100 mb-8">
                    <p className="text-[#1d1d1f] text-sm leading-relaxed font-medium">
                        <strong>Nota de Responsabilidad:</strong> MediBusca no es un intermediario de salud ni cobramos comisiones. Nuestra labor es la transcripción y organización de datos públicos y profesionales para que los pacientes en México puedan tomar decisiones informadas.
                    </p>
                </div>

                {/* SEP Verification Standard Block */}
                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-green-100 p-2 rounded-full shrink-0">
                        <ShieldCheck className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1d1d1f] text-sm uppercase tracking-wide mb-1">Nuestro Estándar de Verificación</h3>
                        <p className="text-[#86868b] text-sm leading-relaxed">
                            Todos los especialistas listados en este directorio cuentan con cédulas profesionales verificables ante el <strong>Registro Nacional de Profesionistas (SEP)</strong>. Filtramos nuestra base de datos para asegurar que solo profesionales con la <strong>Cédula de Especialidad Médica</strong> adecuada sean mostrados.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* High Demand Specialties Grid */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">Especialidades de Alta Demanda</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {TOP_SPECIALTIES_DATA.map((spec) => (
                    <Link
                        key={spec.name}
                        href={`/especialidad/${slugify(spec.name)}`}
                        className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#0071e3] hover:shadow-md transition-all text-center flex flex-col justify-between h-full"
                    >
                        <div>
                            <span className="block text-xs font-bold text-[#0071e3] uppercase tracking-wider mb-2">{spec.tag}</span>
                            <h3 className="font-semibold text-[#1d1d1f] leading-tight mb-2 group-hover:text-[#0071e3] transition-colors">{spec.name}</h3>
                        </div>
                        <p className="text-xs text-[#86868b] leading-snug">{spec.description}</p>
                    </Link>
                ))}
            </div>
        </section>

        {/* Interactive List Component */}
        <SpecialtiesList specialties={allSpecialties} />

        {/* How It Works Section */}
        <section className="mt-24 py-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Cómo encontrar a tu especialista</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Search className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Elige una especialidad</h3>
                    <p className="text-[#86868b] leading-relaxed">Haz clic en el campo médico que necesitas de nuestra lista completa.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Selecciona tu ciudad</h3>
                    <p className="text-[#86868b] leading-relaxed">Mira los doctores verificados que están cerca de ti.</p>
                </div>
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mb-5">
                        <Phone className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#1d1d1f] mb-3 text-lg">Llama directamente</h3>
                    <p className="text-[#86868b] leading-relaxed">Usa el botón de contacto para hablar con el consultorio y agendar tu cita.</p>
                </div>
            </div>
        </section>


         {/* 3️⃣ How to Choose (Educational) */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 mb-20 shadow-sm animate-in fade-in slide-in-from-bottom-5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">¿Cómo Saber Qué Especialidad Necesitas?</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Entender qué hace cada especialista te ayuda a tomar decisiones informadas sobre tu salud. Antes de buscar un doctor, revisa esta guía para identificar la especialidad correcta según tus síntomas o necesidades médicas.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Link href="/especialidad/ginecologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 mt-1">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Ginecólogo</h4>
                            <p className="text-sm text-[#86868b]">Para salud femenina, embarazo y control hormonal.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/cardiologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-1">
                            <HeartPulse className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Cardiólogo</h4>
                            <p className="text-sm text-[#86868b]">Para problemas del corazón, presión arterial y dolor de pecho.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/pediatra" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Pediatra</h4>
                            <p className="text-sm text-[#86868b]">Para el cuidado infantil, vacunas y enfermedades en niños.</p>
                        </div>
                    </Link>
                    
                    <Link href="/especialidad/dermatologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-1">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Dermatólogo</h4>
                            <p className="text-sm text-[#86868b]">Para acné, manchas, caída del cabello y problemas de la piel.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/traumatologo" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Traumatólogo</h4>
                            <p className="text-sm text-[#86868b]">Para fracturas, dolor de huesos, articulaciones y lesiones deportivas.</p>
                        </div>
                    </Link>

                    <Link href="/especialidad/medico-general" className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-1">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">Médico General</h4>
                            <p className="text-sm text-[#86868b]">Para chequeos anuales, malestares generales y primera opinión.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>



        {/* 4️⃣ Local Bridge */}
        <section className="mb-20 border-t border-slate-200 pt-16 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Encuentra Especialistas en Tu Ciudad</h2>
                    <p className="text-lg text-[#86868b] leading-relaxed">
                        Una vez que conozcas la especialidad que necesitas, explora nuestros listados de doctores en tu ciudad para recibir atención cercana y confiable.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {POPULAR_CITIES.map((city) => {
                    return (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="
                                group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl
                                hover:border-[#0071e3] hover:shadow-md transition-all
                            "
                        >
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-[#1d1d1f]">{city}</span>
                        </Link>
                    );
                })}
            </div>
        </section>


      </div>
    </div>
  );
}
