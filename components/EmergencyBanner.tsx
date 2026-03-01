import React from 'react';
import { Phone, Activity, AlertTriangle, Stethoscope } from 'lucide-react';
import type { EmergencyCategory } from '../lib/constants';

interface EmergencyBannerProps {
  diseaseName: string;
  cityName: string;
  category: EmergencyCategory;
}

export default function EmergencyBanner({ diseaseName, cityName, category }: EmergencyBannerProps) {
  // If there is no emergency category, do not render the banner
  if (!category) return null;

  // Configuration map for different emergency types
  const contentMap = {
    mental_health: {
      icon: <Phone className="w-6 h-6" />,
      wrapperClass: "bg-red-50 border-red-200",
      iconClass: "bg-red-100 text-red-600",
      textClass: "text-red-900",
      title: `¿Crisis por ${diseaseName.toLowerCase()}?`,
      description: "Si tú o un ser querido están en crisis, contacta a la Línea de la Vida nacional (800 911 2000) disponible 24/7, o acude a urgencias."
    },
    cardiac: {
      icon: <Activity className="w-6 h-6" />,
      wrapperClass: "bg-rose-50 border-rose-200",
      iconClass: "bg-rose-100 text-rose-600",
      textClass: "text-rose-900",
      title: `¿Síntomas graves de ${diseaseName.toLowerCase()}?`,
      description: `No esperes a una cita. Si presentas dolor en el pecho o dificultad para respirar, llama al 911 o dirígete a urgencias en ${cityName} de inmediato.`
    },
    general_urgent: {
      icon: <AlertTriangle className="w-6 h-6" />,
      wrapperClass: "bg-amber-50 border-amber-200",
      iconClass: "bg-amber-100 text-amber-600",
      textClass: "text-amber-900",
      title: `Atención urgente para ${diseaseName.toLowerCase()}`,
      description: `Si los síntomas son agudos tras un traumatismo o dolor severo, busca atención médica de urgencia en ${cityName} antes de agendar una consulta.`
    },
    dental: {
      icon: <Stethoscope className="w-6 h-6" />,
      wrapperClass: "bg-blue-50 border-blue-200",
      iconClass: "bg-blue-100 text-blue-600",
      textClass: "text-blue-900",
      title: `¿Emergencia dental por ${diseaseName.toLowerCase()}?`,
      description: `El dolor agudo o infecciones requieren atención rápida. Busca odontólogos con disponibilidad inmediata en ${cityName} para evitar complicaciones mayores.`
    }
  };

  const config = contentMap[category];

  // Safety check in case an unknown category is passed
  if (!config) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className={`border rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center ${config.wrapperClass}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.iconClass}`}>
          {config.icon}
        </div>
        <div>
          <h3 className={`font-bold mb-1 text-lg ${config.textClass}`}>
            {config.title}
          </h3>
          <p className={`text-sm opacity-90 leading-relaxed ${config.textClass}`}>
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}