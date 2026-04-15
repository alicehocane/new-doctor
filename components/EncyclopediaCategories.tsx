'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';
import AdUnit from './AdUnit';



// 1. The Curated Static Data
const CATEGORIES = [
  {
    title: "Salud Mental y Emocional",
    description: "Incluye condiciones relacionadas con emociones, conducta y bienestar psicológico.",
    articles: [
      // Format: { name: "Display Text", slug: "exact-database-slug" }
      { name: "Ansiedad Generalizada: Síntomas, Diagnóstico y Tratamiento Integral", slug: "guia-ansiedad-sintomas-tratamiento" }, 
      { name: "Depresión Clínica: Síntomas, Causas y Tratamientos Efectivos", slug: "guia-completa-depresion-sintomas-ayuda" }, // <-- Update with your real DB slug
      { name: "Estrés Crónico: Síntomas, Consecuencias y Manejo Clínico", slug: "guia-estres-sintomas-manejo-salud" },       // <-- Update with your real DB slug
      { name: "Etapas del Duelo: Síntomas Psicológicos y Terapia para Sanar", slug: "guia-duelo-etapas-sanacion-emocional" },
      { name: "Ataques de Pánico: Síntomas, Causas y Tratamiento Inmediato", slug: "ataques-de-panico-sintomas-guia-detenerlos" },
      { name: "Trastorno de Ansiedad: Síntomas Físicos y Terapias Especializadas", slug: "guia-trastorno-ansiedad-sintomas-tratamiento" },
      { name: "Trastorno Bipolar: Síntomas, Fases y Tratamientos Psiquiátricos", slug: "guia-trastorno-bipolar-sintomas-ayuda" },
      { name: "Esquizofrenia: Primeros Síntomas, Diagnóstico y Tratamiento Médico", slug: "guia-esquizofrenia-sintomas-tratamiento-completo" },
      { name: "Bullying Escolar: Síntomas Psicológicos y Prevención Profesional", slug: "guia-bullying-sintomas-prevencion-escolar" },
      { name: "Baja Autoestima: Síntomas, Causas y Terapia Psicológica Efectiva", slug: "guia-baja-autoestima-sintomas-soluciones" },
      { name: "Depresión Posparto: Síntomas, Duración y Apoyo Psicológico", slug: "guia-depresion-posparto-sintomas-ayuda" },
      { name: "Trastornos del Sueño: Síntomas, Clínicas y Tratamiento Médico", slug: "guia-trastornos-del-sueno-sintomas-tratamiento" },
      { name: "Prevención del Suicidio: Señales de Alerta y Ayuda Psiquiátrica", slug: "guia-prevencion-comportamiento-suicida-ayuda" },
      { name: "Autismo (TEA): Primeros Síntomas, Diagnóstico y Terapias", slug: "guia-autismo-sintomas-diagnostico-apoyo" },
      { name: "TDAH en Niños y Adultos: Síntomas, Test y Tratamiento Profesional", slug: "guia-tdah-sintomas-tratamiento-apoyo" }
    ]
  },
  {
    title: "Salud Bucal y Dental",
    description: "Problemas relacionados con dientes, encías y mandíbula.",
    articles: [
      { name: "Caries Dentales: Síntomas, Prevención y Tratamientos Clínicos", slug: "guia-caries-dentales-sintomas-prevencion" },
      { name: "Dolor de Muelas: Causas, Síntomas y Atención de Urgencia Dental", slug: "guia-dolor-de-muelas-sintomas-remedios" },
      { name: "Bruxismo: Síntomas, Consecuencias y Tratamiento con Férula Dental", slug: "guia-bruxismo-sintomas-tratamiento-dental" },
      { name: "Gingivitis: Síntomas, Causas y Tratamiento Odontológico Efectivo", slug: "guia-gingivitis-sintomas-tratamiento" },
      { name: "Periodontitis (Piorrea): Síntomas y Tratamiento Periodontal Avanzado", slug: "periodontitis-sintomas-tratamiento-hueso" },
      { name: "Absceso Dental: Síntomas, Infección y Tratamiento de Urgencia", slug: "guia-absceso-dental-sintomas-tratamiento-urgente" },
      { name: "Sensibilidad Dentaria: Síntomas, Causas y Tratamiento Clínico", slug: "sensibilidad-dentaria-sintomas-tratamiento" },
      { name: "Desgaste Dental: Síntomas, Causas y Tratamientos de Reconstrucción", slug: "desgaste-dental-sintomas-tratamiento" },
      { name: "Dientes Apiñados: Síntomas, Causas y Tratamientos de Ortodoncia", slug: "dientes-apinados-sintomas-tratamiento-ortodoncia" },
      { name: "Diente Impactado: Síntomas, Riesgos y Cirugía de Extracción", slug: "diente-impactado-sintomas-tratamiento" },
      { name: "Muelas del Juicio: Síntomas, Dolor y Cuándo Requieren Extracción", slug: "muelas-del-juicio-sintomas-cirugia" },
      { name: "Halitosis (Mal Aliento): Causas, Síntomas y Tratamiento Definitivo", slug: "halitosis-sintomas-aliento-fresco" },
      { name: "Movilidad Dentaria: Síntomas y Tratamientos para Salvar tus Dientes", slug: "guia-movilidad-dentaria-sintomas-tratamiento" }
    ]
  },
  {
    title: "Enfermedades del Corazón y Circulación",
    description: "Afecciones del corazón, presión arterial y vasos sanguíneos.",
    articles: [
        { name: "Embolia Pulmonar: Síntomas, Causas y Tratamiento de Urgencia", slug: "embolia-pulmonar-senales-de-emergencia-y-tratamiento" },
        { name: "Insuficiencia Cardíaca: Síntomas, Diagnóstico y Tratamiento Cardiológico", slug: "insuficiencia-cardiaca-sintomas-tratamiento" },
        { name: "Angina de Pecho: Síntomas, Causas y Tratamiento Especializado", slug: "guia-angina-de-pecho-sintomas-tratamiento" },
        { name: "Hipertensión Arterial: Síntomas, Riesgos y Tratamiento Médico", slug: "guia-hipertension-arterial-sintomas-tratamiento" },
        { name: "Fibrilación Auricular: Síntomas, Causas y Tratamiento Clínico", slug: "guia-fibrilacion-auricular-sintomas-tratamiento" },
        { name: "Venas Varicosas (Várices): Síntomas, Causas y Tratamiento Vascular", slug: "piernas-cansadas-y-varices-soluciones-efectivas-hoy" },
        { name: "Infarto de Miocardio: Primeros Síntomas, Causas y Atención de Urgencia", slug: "guia-infarto-miocardio-sintomas-prevencion" },
        { name: "Arritmias Cardíacas: Síntomas, Diagnóstico y Tratamiento Médico", slug: "guia-arritmias-sintomas-tratamiento-corazon" },
        { name: "Cardiopatía Hipertensiva: Síntomas, Consecuencias y Tratamiento Cardiológico", slug: "riesgos-corazon-por-presion-alta-guia-completa" }
    ]
  },
  {
    title: "Endocrinología y Metabolismo",
    description: "Trastornos hormonales y metabólicos.",
    articles: [
        { name: "Diabetes Gestacional: Síntomas, Riesgos y Control Médico Especializado", slug: "todo-sobre-diabetes-gestacional-embarazo-y-salud-del-bebe" },
        { name: "Resistencia a la Insulina: Síntomas, Diagnóstico y Tratamiento Clínico", slug: "resistencia-insulina-senales-causas-y-soluciones" },
        { name: "Hipertiroidismo: Primeros Síntomas y Tratamiento Endocrinológico", slug: "tiroides-acelerada-sintomas-y-cuidados-esenciales" },
        { name: "Hipotiroidismo: Síntomas, Causas y Manejo Médico de la Tiroides", slug: "hipotiroidismo-sintomas-causas-y-tratamiento-efectivo" },
        { name: "Diabetes Tipo 2: Síntomas, Prevención y Tratamiento Integral", slug: "todo-sobre-diabetes-tipo-2-prevencion-y-manejo" },
        { name: "Diabetes Tipo 1: Síntomas, Diagnóstico y Manejo Clínico", slug: "diabetes-tipo-1-guia-vida-saludable-y-control" },
        { name: "Síndrome Metabólico: Síntomas, Riesgos y Tratamiento Especializado", slug: "sindrome-metabolico-senales-alerta-y-vida-sana" },
        { name: "Sobrepeso: Causas, Consecuencias y Programas Médicos de Control", slug: "sobrepeso-riesgos-diferencias-y-pasos-para-adelgazar" },
        { name: "Obesidad: Grados, Consecuencias y Opciones de Tratamiento Clínico", slug: "obesidad-causas-consecuencias-y-estilo-de-vida-saludable" },
        { name: "Colesterol Alto (Hipercolesterolemia): Síntomas y Tratamiento Médico", slug: "hipercolesterolemia-senales-alerta-y-vida-sana" }
    ]
  },
  {
    title: "Aparato Digestivo",
    description: "Problemas del estómago, intestinos e hígado.",
    articles: [
        { name: "Diarrea Crónica: Síntomas, Causas y Tratamiento Gastroenterológico", slug: "diarrea-sintomas-causas-y-tratamientos-efectivos" },
        { name: "Pancreatitis: Primeros Síntomas, Causas y Atención Médica de Urgencia", slug: "pancreatitis-sintomas-causas-y-prevencion-emergencia" },
        { name: "Síndrome de Intestino Irritable (SII): Síntomas y Tratamiento Clínico", slug: "colon-irritable-sintomas-dieta-y-control-de-estres" },
        { name: "Colitis Ulcerosa y Nerviosa: Síntomas, Diagnóstico y Manejo Médico", slug: "inflamacion-colon-colitis-tipos-y-tratamiento" },
        { name: "Reflujo Gastroesofágico (ERGE): Síntomas y Tratamiento Clínico Definitivo", slug: "reflujo-gastroesofagico-sintomas-causas-y-remedios-efectivos" },
        { name: "Apendicitis: Primeros Síntomas, Diagnóstico y Cirugía de Urgencia", slug: "apendicitis-sintomas-causas-y-operacion-urgente" },
        { name: "Hígado Graso (Esteatosis): Síntomas, Diagnóstico y Control Médico", slug: "higado-graso-sintomas-causas-y-dieta-para-sanar" },
        { name: "Hemorroides: Grados, Síntomas y Tratamientos Clínicos y Quirúrgicos", slug: "hemorroides-sintomas-causas-y-remedios-para-el-alivio" },
        { name: "Gastritis Crónica: Síntomas, Causas y Tratamiento Médico Efectivo", slug: "gastritis-sintomas-causas-y-dieta-para-sanar" },
        { name: "Estreñimiento Crónico: Causas, Consecuencias y Tratamiento Médico", slug: "guia-para-el-estrenimiento-causas-y-remedios-naturales" }
    ]
  },
  {
    title: "Salud de la Mujer",
    description: "Condiciones ginecológicas y relacionadas con el embarazo.",
    articles: [
        { name: "Quistes Ováricos: Síntomas, Tipos y Tratamiento Ginecológico", slug: "quistes-ovaricos-sintomas-causas-y-tratamiento" },
        { name: "Menopausia: Síntomas Físicos y Terapia de Reemplazo Hormonal", slug: "menopausia-sintomas-causas-y-tratamientos-naturales" },
        { name: "Miomas Uterinos (Fibromas): Síntomas, Diagnóstico y Cirugía", slug: "miomas-uterinos-sintomas-causas-y-tratamientos-efectivos" },
        { name: "Endometriosis: Síntomas, Grados y Tratamiento Especializado", slug: "endometriosis-sintomas-causas-y-tratamientos-para-el-alivio" },
        { name: "Cáncer de Mama: Primeros Síntomas, Mamografía y Tratamiento Oncológico", slug: "cancer-de-mama-sintomas-deteccion-y-tratamientos" },
        { name: "Embarazo Semana a Semana: Cambios y Control Prenatal Especializado", slug: "guia-completa-embarazo-semana-a-semana-y-cuidados" },
        { name: "Ovario Poliquístico (SOP): Síntomas y Tratamiento Endocrinológico", slug: "sindrome-de-ovario-poliquistico-sintomas-causas-y-tratamiento" },
        { name: "Cáncer Cervicouterino y VPH: Síntomas y Tratamiento Ginecológico", slug: "cancer-cervicouterino-sintomas-prevencion-y-vph" },
        { name: "Embarazo de Alto Riesgo: Síntomas y Atención Clínica Materna", slug: "embarazo-de-alto-riesgo-factores-y-cuidados-esenciales" },
        { name: "Sangrado Uterino Anormal: Causas y Diagnóstico Clínico Efectivo", slug: "sangrado-uterino-anormal-sintomas-causas-y-soluciones" }
    ]
  },
  {
    title: "Salud del Hombre",
    description: "Problemas frecuentes en la salud masculina.",
    articles: [
        { name: "Cáncer de Próstata: Primeros Síntomas, Pruebas y Tratamiento Oncológico", slug: "cancer-de-prostata-sintomas-deteccion-y-tratamientos" },
        { name: "Hiperplasia Prostática Benigna (HPB): Síntomas y Tratamiento Urológico", slug: "hipertrofia-prostatica-benigna-sintomas-causas-y-tratamiento" },
        { name: "Disfunción Eréctil: Causas Físicas, Diagnóstico y Tratamiento Médico", slug: "disfuncion-erectil-causas-sintomas-y-tratamientos-modernos" },
        { name: "Varicocele: Síntomas, Infertilidad Masculina y Cirugía Urológica", slug: "varicocele-sintomas-causas-y-tratamientos-para-fertilidad" },
        { name: "Bajo Deseo Sexual Masculino: Causas, Perfil Hormonal y Tratamiento Clínico", slug: "deseo-sexual-inhibido-causas-sintomas-y-tratamientos" },
        { name: "Cáncer Testicular: Primeros Síntomas, Detección y Tratamiento Clínico", slug: "cancer-testicular-sintomas-deteccion-y-autoexamen" }
    ]
  },
  {
    title: "Pediatría y Salud Infantil",
    description: "Condiciones comunes en bebés, niños y adolescentes.",
    articles: [
        { name: "Dermatitis del Pañal: Síntomas Severos y Tratamiento Dermatológico", slug: "dermatitis-del-panal-sintomas-causas-y-remedios-efectivos" },
        { name: "Infección Urinaria Pediátrica: Síntomas y Tratamiento Médico", slug: "infecciones-urinarias-en-ninos-sintomas-causas-y-tratamiento" },
        { name: "Cólico del Lactante: Síntomas, Causas y Manejo Clínico Pediátrico", slug: "colico-infantil-sintomas-causas-y-remedios-efectivos" },
        { name: "Fiebre en Niños: Síntomas de Alarma y Atención Pediátrica de Urgencia", slug: "fiebre-en-ninos-como-bajarla-y-cuando-preocuparse" },
        { name: "Bebé Prematuro: Cuidados Especiales y Atención Neonatal Intensiva", slug: "bebe-prematuro-sintomas-causas-y-cuidados-en-casa" },
        { name: "Autismo Infantil (TEA): Primeros Síntomas y Evaluación Neurológica", slug: "autismo-sintomas-grados-y-deteccion-temprana" },
        { name: "Bullying Escolar: Síntomas de Alerta y Terapia Psicológica Infantil", slug: "bullying-escolar-sintomas-prevencion-y-como-actuar" },
        { name: "Asma Pediátrico: Síntomas, Diagnóstico y Tratamiento Neumológico", slug: "asma-pediatrico-sintomas-causas-y-control-de-crisis" },
        { name: "TDAH Infantil: Síntomas, Diagnóstico y Tratamiento Neuropsicológico", slug: "tdah-sintomas-causas-y-tratamientos-en-ninos-y-adultos" }
    ]    
  },
  {
    title: "Sistema Respiratorio",
    description: "Enfermedades de pulmones y vías respiratorias.",
    articles: [
        { name: "Tuberculosis Pulmonar: Síntomas, Contagio y Tratamiento Neumológico", slug: "tuberculosis-pulmonar-sintomas-causas-y-tratamiento" },
        { name: "EPOC (Enfermedad Pulmonar Obstructiva Crónica): Síntomas y Tratamiento Clínico", slug: "epoc-sintomas-causas-y-tratamiento-guia-pulmonar" },
        { name: "COVID-19 y Secuelas: Síntomas, Variantes y Manejo Médico Especializado", slug: "covid-19-sintomas-variantes-y-tratamientos-actualizados" },
        { name: "Bronquitis Crónica: Síntomas, Complicaciones y Tratamiento Médico", slug: "bronquitis-cronica-sintomas-causas-y-tratamiento-epoc" },
        { name: "Sinusitis Aguda y Crónica: Síntomas, Causas y Tratamiento Especializado", slug: "sinusitis-sintomas-causas-y-remedios-efectivos" },
        { name: "Asma Bronquial: Síntomas, Crisis Asmáticas y Manejo Clínico Efectivo", slug: "asma-sintomas-causas-y-tratamiento-integral" },
        { name: "Neumonía: Primeros Síntomas, Riesgos y Tratamiento de Urgencia", slug: "neumonia-sintomas-causas-y-tratamientos-guia-completa" },
        { name: "Rinitis Alérgica: Síntomas, Diagnóstico y Tratamiento Alergológico", slug: "rinitis-alergica-sintomas-causas-y-tratamientos" }
    ]    
  },
  {
    title: "Sistema Músculo-Esquelético",
    description: "Huesos, músculos y articulaciones.",
    articles: [
        { name: "Lumbalgia (Dolor Lumbar): Síntomas, Causas y Tratamiento Fisioterapéutico", slug: "lumbalgia-sintomas-causas-y-ejercicios-de-recuperacion" },
        { name: "Artrosis: Síntomas, Desgaste Articular y Tratamiento Clínico Especializado", slug: "artrosis-sintomas-causas-y-tratamientos-para-el-desgaste-articular" },
        { name: "Artritis Reumatoide: Síntomas, Diagnóstico y Tratamiento Reumatológico", slug: "artritis-reumatoide-sintomas-causas-y-tratamientos-actualizados" },
        { name: "Hernia de Disco: Síntomas, Diagnóstico y Opciones de Tratamiento Ortopédico", slug: "hernia-de-disco-sintomas-causas-y-tratamientos-efectivos" },
        { name: "Tendinitis: Síntomas, Causas y Terapia de Rehabilitación Física", slug: "tendinitis-sintomas-causas-y-tratamientos-efectivos" },
        { name: "Osteoporosis: Síntomas, Riesgo de Fractura y Tratamiento Médico", slug: "osteoporosis-sintomas-causas-y-prevencion-de-fracturas" },
        { name: "Dolor de Ciática: Síntomas, Causas y Tratamiento Especializado del Dolor", slug: "ciatica-sintomas-causas-y-ejercicios-de-alivio" },
        { name: "Lesiones Deportivas: Síntomas, Diagnóstico y Rehabilitación Traumatológica", slug: "lesiones-deportivas-sintomas-prevencion-y-recuperacion-fisica" },
        { name: "Fracturas Óseas: Síntomas, Tipos y Tratamiento Traumatológico", slug: "fracturas-oseas-sintomas-tipos-y-primeros-auxilios" }
    ]    
  },
  {
    title: "Dermatología y Piel",
    description: "Afecciones de la piel, cabello y uñas.",
    articles: [
        { name: "Vitíligo: Síntomas, Causas y Tratamiento Dermatológico Especializado", slug: "vitiligo-sintomas-causas-y-tratamientos-piel" },
        { name: "Psoriasis: Síntomas, Tipos y Tratamiento Clínico Efectivo", slug: "psoriasis-sintomas-causas-y-tratamientos-avanzados" },
        { name: "Verrugas Virales: Síntomas y Tratamiento Dermatológico Definitivo", slug: "verrugas-sintomas-causas-y-tratamientos-piel" },
        { name: "Alopecia (Caída del Cabello): Síntomas y Tratamiento Clínico Capilar", slug: "alopecia-sintomas-causas-y-tratamientos-caida-cabello" },
        { name: "Cicatrices y Queloides: Síntomas y Tratamiento Dermatológico Avanzado", slug: "cicatrices-sintomas-tipos-y-tratamientos-piel" },
        { name: "Melasma (Manchas en la Piel): Síntomas y Tratamiento Clínico Especializado", slug: "melasma-sintomas-causas-y-tratamientos-manchas-cara" },
        { name: "Dermatitis Atópica: Síntomas Severos y Tratamiento Dermatológico", slug: "dermatitis-atopica-sintomas-causas-y-cuidados-diarios" },
        { name: "Acné Severo y Quístico: Síntomas, Cicatrices y Tratamiento Clínico", slug: "acne-sintomas-causas-y-tratamientos-efectivos" },
        { name: "Cáncer de Piel (Melanoma): Síntomas, Detección y Tratamiento Oncológico", slug: "cancer-de-piel-sintomas-causas-y-tratamientos" }
    ]    
  },
  {
    title: "Neurología",
    description: "Trastornos del cerebro y sistema nervioso.",
    articles: [
        { name: "Tumor Cerebral: Síntomas, Diagnóstico y Tratamiento Neuroquirúrgico", slug: "tumor-cerebral-sintomas-causas-y-tratamientos" },
        { name: "Demencia y Alzheimer: Síntomas, Diagnóstico y Manejo Clínico Especializado", slug: "demencia-sintomas-causas-y-cuidados-familiares" },
        { name: "Epilepsia: Síntomas, Crisis Convulsivas y Tratamiento Neurológico", slug: "epilepsia-sintomas-causas-y-tratamientos-neurologicos" },
        { name: "Enfermedad de Parkinson: Síntomas, Avance y Tratamiento Neurológico", slug: "parkinson-sintomas-causas-y-tratamientos-neurologicos" },
        { name: "Esclerosis Múltiple (EM): Síntomas, Diagnóstico y Tratamiento Especializado", slug: "esclerosis-multiple-sintomas-causas-y-tratamientos-avanzados" },
        { name: "Derrame Cerebral (ACV): Síntomas de Alarma y Atención Médica de Urgencia", slug: "derrame-cerebral-sintomas-causas-y-primeros-auxilios" },
        { name: "Migraña Crónica: Síntomas con Aura y Tratamiento Neurológico Efectivo", slug: "migrana-sintomas-causas-y-tratamientos-efectivos" }
    ]    
  },
  {
    title: "Urología y Riñón",
    description: "Enfermedades urinarias y renales.",
    articles: [
        { name: "Cálculos Renales (Litiasis): Síntomas, Causas y Tratamiento Urológico", slug: "calculos-renales-sintomas-causas-y-tratamientos" },
        { name: "Nefropatía Diabética: Síntomas, Prevención y Manejo Clínico Renal", slug: "nefropatia-diabetica-sintomas-causas-y-tratamientos" },
        { name: "Cistitis Crónica e Intersticial: Síntomas y Tratamiento Especializado", slug: "cistitis-sintomas-causas-y-remedios-efectivos" },
        { name: "Insuficiencia Renal Crónica: Síntomas, Etapas y Tratamiento Nefrológico", slug: "insuficiencia-renal-sintomas-causas-y-tratamientos-guia" },
        { name: "Infección del Tracto Urinario (ITU): Síntomas y Tratamiento Médico", slug: "infeccion-urinaria-sintomas-causas-y-tratamientos" }
    ]    
  },
  {
    title: "Enfermedades Infecciosas",
    description: "Infecciones causadas por virus, bacterias o parásitos.",
    articles: [
        { name: "VPH (Virus del Papiloma Humano): Síntomas, Detección y Tratamiento Clínico", slug: "vph-sintomas-causas-y-vacuna-prevencion" },
        { name: "Otitis (Infección de Oído): Síntomas, Causas y Tratamiento Otorrinolaringológico", slug: "otitis-sintomas-causas-y-tratamientos-dolor-oido" },
        { name: "Gastroenteritis Aguda: Síntomas, Riesgos y Manejo Médico Especializado", slug: "gastroenteritis-sintomas-causas-y-dieta-recuperacion" },
        { name: "Conjuntivitis: Síntomas, Tipos y Tratamiento Oftalmológico Efectivo", slug: "conjuntivitis-sintomas-causas-y-tratamientos-ojo-rojo" },
        { name: "Faringitis Bacteriana: Síntomas, Diagnóstico y Tratamiento con Antibióticos", slug: "faringitis-bacteriana-sintomas-causas-y-tratamientos" },
        { name: "Hepatitis Viral (A, B, C): Síntomas, Diagnóstico y Tratamiento Hepatológico", slug: "hepatitis-sintomas-tipos-causas-y-tratamientos" },
        { name: "ETS (Enfermedades de Transmisión Sexual): Síntomas, Pruebas y Tratamiento Médico", slug: "ets-sintomas-prevencion-y-tratamientos-sexualidad" }
    ]    
  },
  {
    title: "Nutrición y Trastornos Alimentarios",
    description: "Problemas relacionados con la alimentación.",
    articles: [
        { name: "Trastorno por Atracón (TCA): Síntomas, Consecuencias y Terapia Psicológica", slug: "trastorno-por-atracon-sintomas-causas-y-tratamiento" },
        { name: "Obesidad Mórbida: Riesgos, Grados y Opciones de Cirugía Bariátrica", slug: "obesidad-morbida-sintomas-causas-y-tratamientos" },
        { name: "Anorexia Nerviosa: Síntomas de Alerta, Consecuencias y Tratamiento Psiquiátrico", slug: "anorexia-nervosa-sintomas-causas-y-tratamiento" },
        { name: "Bulimia Nerviosa: Síntomas Físicos, Diagnóstico y Rehabilitación Clínica", slug: "bulimia-sintomas-causas-y-tratamiento-guia" },
        { name: "Malnutrición y Deficiencias Nutricionales: Síntomas y Evaluación Clínica", slug: "nutricion-inadecuada-sintomas-causas-y-consecuencias" },
        { name: "Desnutrición Severa: Síntomas, Grados y Rehabilitación Nutricional Médica", slug: "desnutricion-sintomas-causas-y-tratamientos-salud" }
    ]    
  },
   {
    title: "Oncología (Cáncer)",
    description: "Información sobre distintos tipos de cáncer.",
    articles: [
        { name: "Linfoma (Hodgkin y no Hodgkin): Síntomas, Diagnóstico y Tratamiento Oncológico", slug: "linfoma-guia-facil-sintomas-y-tratamiento" },
        { name: "Melanoma y Cáncer de Piel: Síntomas, Biopsia y Tratamiento Clínico", slug: "cancer-de-piel-guia-facil-sintomas" },
        { name: "Cáncer de Colon: Primeros Síntomas, Colonoscopia y Tratamiento Médico", slug: "cancer-de-colon-sintomas-prevencion-y-tratamientos" },
        { name: "Cáncer de Tiroides: Síntomas, Diagnóstico Clínico y Cirugía Oncológica", slug: "cancer-de-tiroides-guia-facil-sintomas-y-cura" },
        { name: "Cáncer de Mama: Detección Temprana, Mamografía y Tratamiento Oncológico", slug: "cancer-de-mama-guia-facil-sintomas-prevencion" },
        { name: "Cáncer de Pulmón: Síntomas, Estadios y Manejo Oncológico Especializado", slug: "cancer-de-pulmon-sintomas-causas-y-tratamientos" }
    ]    
  },
   {
    title: "Salud Visual y Auditiva",
    description: "Ojos y oídos.",
    articles: [
        { name: "Astigmatismo: Síntomas, Diagnóstico Clínico y Cirugía Refractiva", slug: "astigmatismo-guia-facil-ver-bien-formas" },
        { name: "Conjuntivitis: Síntomas, Causas y Tratamiento Oftalmológico Efectivo", slug: "conjuntivitis-guia-facil-sintomas-y-cuidados" },
        { name: "Miopía: Síntomas, Progresión y Tratamiento con Cirugía Láser", slug: "miopia-guia-facil-ver-bien-de-lejos" },
        { name: "Hipoacusia (Pérdida Auditiva): Síntomas, Grados y Tratamiento Audiológico", slug: "hipoacusia-guia-facil-problemas-para-oir" },
        { name: "Glaucoma: Síntomas Silenciosos, Presión Intraocular y Tratamiento Médico", slug: "glaucoma-guia-facil-presion-ojos-sintomas" },
        { name: "Desprendimiento de Retina: Síntomas de Alarma y Cirugía de Urgencia", slug: "desprendimiento-de-retina-guia-facil-sintomas-urgencia" }
    ]    
  },
  {
    title: "Traumatología y Urgencias",
    description: "Lesiones y situaciones urgentes.",
    articles: [
        { name: "Heridas y Laceraciones: Cicatrización, Infección y Tratamiento Clínico", slug: "heridas-guia-facil-primeros-auxilios-y-cicatrizacion" },
        { name: "Luxaciones Articulares: Síntomas, Reducción y Tratamiento Traumatológico", slug: "luxaciones-guia-facil-sintomas-primeros-auxilios" },
        { name: "Quemaduras: Grados, Primeros Auxilios y Tratamiento Especializado", slug: "quemaduras-guia-facil-primeros-auxilios-en-casa" },
        { name: "Fracturas Óseas: Tipos, Cirugía de Consolidación y Rehabilitación", slug: "fracturas-guia-facil-huesos-rotos-primeros-auxilios" },
        { name: "Traumatismo Maxilofacial: Síntomas y Cirugía Reconstructiva Facial", slug: "traumatismo-facial-guia-facil-golpes-cara-primeros-auxilios" }
    ]    
  }
];

export default function EncyclopediaCategories() {
  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-[#1d1d1f] mb-8 flex items-center gap-2">
        <Activity className="w-6 h-6 text-[#0071e3]" />
        Índice Médico Completo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {CATEGORIES.map((cat, index) => (
          <React.Fragment key={index}>
            {/* The Original Category Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-slate-100 bg-[#f8fafc]">
                <h3 className="font-semibold text-[#1d1d1f] text-lg leading-tight mb-1">{cat.title}</h3>
                <p className="text-[13px] text-[#86868b] leading-relaxed line-clamp-2">{cat.description}</p>
              </div>

              <div className="flex-1 bg-white">
                {cat.articles.map((article, i) => (
                  <Link 
                    key={i}
                    href={`/enciclopedia/${article.slug}`} 
                    className="flex items-center justify-between p-3.5 pl-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-[14px] font-medium text-[#1d1d1f]/80 group-hover:text-[#0071e3] transition-colors line-clamp-1 pr-4">
                      {article.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* INJECT VERTICAL AD CARD AFTER THE 3rd and 9th ITEMS */}
            {/* On Desktop this puts them at the end of the 1st and 3rd rows */}
            {((index + 1) === 3 || (index + 1) === 9) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center h-full min-h-[450px] p-4 text-center">
                 {/* Using your specific Sidebar Slot for vertical height */}
                <AdUnit 
                  slot="9693350353" 
                  format="autorelaxed" 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}