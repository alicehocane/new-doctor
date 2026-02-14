
import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Brain, BookOpen, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política Editorial Médica | MediBusca",
  description: "Conoce nuestros estándares de calidad, fuentes de información y política sobre el uso de tecnología en la información médica de MediBusca.",
};

export default function EditorialPolicyPage() {
  
  // Schema Markup
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Política Editorial Médica | MediBusca",
    "description": "Estándares editoriales y procesos de verificación de información médica en MediBusca.",
    "url": "https://medibusca.com/politica-editorial"
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Header */}
      <div className="bg-[#f5f5f7] border-b border-slate-200 py-16 md:py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0071e3]">
              <FileText className="w-8 h-8" />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">Política Editorial Médica</h1>
           <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium">
             Nuestro compromiso con la veracidad, la transparencia y la seguridad del paciente.
           </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Intro */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-6">
            <p className="text-xl text-[#1d1d1f] leading-relaxed max-w-3xl mx-auto">
                En MediBusca, entendemos que la información de salud impacta vidas. Por eso, nos regimos por estándares estrictos para asegurar que el contenido que encuentras aquí sea útil, claro y, sobre todo, confiable.
            </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Fuentes Oficiales</h3>
                </div>
                <p className="text-[#86868b] leading-relaxed">
                    Nuestro contenido educativo y artículos de enciclopedia se basan en literatura médica establecida y guías de organismos oficiales de salud (como la Secretaría de Salud en México y la OMS). No publicamos rumores, remedios milagrosos sin sustento científico ni teorías no verificadas.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1d1d1f]">Verificación Profesional</h3>
                </div>
                <p className="text-[#86868b] leading-relaxed">
                    Los perfiles de médicos en nuestro directorio pasan por un proceso de validación. Cotejamos las Cédulas Profesionales con el Registro Nacional de Profesionistas para asegurar que quien se anuncia como especialista cuenta con las credenciales legales para hacerlo.
                </p>
            </div>
        </div>

        {/* AI & Technology Disclaimer */}
        <div className="bg-[#f5f5f7] rounded-[32px] p-8 md:p-12 mb-20 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-8 h-8 text-[#0071e3]" />
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">Uso de Tecnología e Inteligencia Artificial</h2>
                    </div>
                    <p className="text-[#86868b] text-lg leading-relaxed mb-6">
                        Utilizamos tecnología para organizar grandes cantidades de datos y hacerlos accesibles. Sin embargo, tenemos una política clara sobre el uso de Inteligencia Artificial (IA) en salud:
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-[#1d1d1f] font-medium">No usamos IA para diagnosticar. Los diagnósticos médicos requieren evaluación humana y presencial.</span>
                        </li>
                        <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-[#1d1d1f] font-medium">Nuestro contenido es supervisado. Aunque usemos herramientas digitales para redactar o estructurar, la revisión final es humana.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Editorial Process Steps */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8 text-center">Nuestro Proceso Editorial</h2>
            <div className="relative">
                <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-slate-200 md:left-1/2 md:-ml-0.5"></div>
                
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row gap-8 mb-12">
                    <div className="md:w-1/2 md:text-right order-2 md:order-1">
                        <h4 className="text-lg font-bold text-[#1d1d1f]">1. Selección del Tema</h4>
                        <p className="text-[#86868b]">Identificamos las necesidades de información más urgentes de los pacientes basándonos en datos de búsqueda y salud pública.</p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 -ml-3.5 md:-ml-3.5 w-7 h-7 rounded-full border-4 border-white bg-[#0071e3] z-10 order-1 md:order-2"></div>
                    <div className="md:w-1/2 order-3"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row gap-8 mb-12">
                    <div className="md:w-1/2 order-3 md:order-1"></div>
                    <div className="absolute left-0 md:left-1/2 -ml-3.5 md:-ml-3.5 w-7 h-7 rounded-full border-4 border-white bg-[#0071e3] z-10 order-1 md:order-2"></div>
                    <div className="md:w-1/2 order-2 md:order-3">
                        <h4 className="text-lg font-bold text-[#1d1d1f]">2. Investigación y Redacción</h4>
                        <p className="text-[#86868b]">Recopilamos datos de fuentes acreditadas y redactamos el contenido utilizando un lenguaje claro, evitando tecnicismos innecesarios.</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2 md:text-right order-2 md:order-1">
                        <h4 className="text-lg font-bold text-[#1d1d1f]">3. Revisión y Actualización</h4>
                        <p className="text-[#86868b]">La información médica cambia. Revisamos nuestros artículos y perfiles periódicamente para mantener su vigencia.</p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 -ml-3.5 md:-ml-3.5 w-7 h-7 rounded-full border-4 border-white bg-[#0071e3] z-10 order-1 md:order-2"></div>
                    <div className="md:w-1/2 order-3"></div>
                </div>
            </div>
        </div>

        {/* Responsibility Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Aviso de Responsabilidad</h3>
                <p className="text-amber-900/80 text-sm leading-relaxed">
                    MediBusca es una plataforma informativa y de enlace. No somos un consultorio médico ni un hospital. La información publicada no sustituye la consulta, diagnóstico o tratamiento profesional. Ante cualquier síntoma o duda sobre su salud, le recomendamos encarecidamente consultar a un médico certificado.
                </p>
            </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center pt-12 border-t border-slate-200">
            <p className="text-[#86868b] mb-4">¿Encontraste un error o tienes dudas sobre nuestra política?</p>
            <Link 
                href="/contacto"
                className="text-[#0071e3] font-medium hover:underline inline-flex items-center gap-1"
            >
                Contáctanos aquí
            </Link>
        </div>

      </div>
    </div>
  );
}
