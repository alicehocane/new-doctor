import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor, Article } from '../../../types';
import { MapPin, Loader2, User, Phone, CheckCircle, ArrowRight, AlertCircle, Stethoscope, Plus, Search, Info, BookOpen, ShieldCheck, Activity, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, ALL_DISEASES } from '../../../lib/constants';

const PAGE_SIZE = 20;

// Curated list of top cities for SEO sections to avoid keyword stuffing
const TOP_CITIES = ['Ciudad de México', 'Monterrey', 'Guadalajara', 'Puebla', 'Tijuana', 'León'];

// Mapping of disease slugs to their primary specialty
const DISEASE_MAPPING: Record<string, string> = {
  'diabetes': 'Endocrinólogo',
  'hipertension': 'Cardiólogo',
  'acne': 'Dermatólogo',
  'ansiedad': 'Psiquiatra',
  'dolor-de-espalda': 'Traumatólogo',
  'embarazo': 'Ginecólogo',
  'gastritis': 'Gastroenterólogo',
  'migrana': 'Neurólogo',
  'alergias': 'Alergólogo',
  'varices': 'Angiólogo',
  'calculos-renales': 'Urólogo',
  'gripe': 'Médico General',
  'artritis': 'Reumatólogo',
  'cancer': 'Oncólogo',
  'obesidad': 'Bariatra',
  'asma': 'Neumólogo',
  'depresion': 'Psiquiatra',
  'fracturas': 'Traumatólogo',
  'cataratas': 'Oftalmólogo',
  'caries': 'Dentista',
  'infeccion-urinaria': 'Urólogo',
  'psoriasis': 'Dermatólogo',
  'hipotiroidismo': 'Endocrinólogo',
  'arritmia': 'Cardiólogo',
  'osteoporosis': 'Reumatólogo',
  'menopausia': 'Ginecólogo',
  'hemorroides': 'Proctólogo',
  'apendicitis': 'Cirujano General',
  'insomnio': 'Psiquiatra'
};

// Data for SEO Section
const DISEASE_DETAILS: Record<string, { symptoms: string[], causes: string[] }> = {
  'Ansiedad': {
    symptoms: ['Nerviosismo persistente', 'Sensación de peligro inminente', 'Aumento del ritmo cardíaco', 'Sudoración y temblores'],
    causes: ['Factores genéticos', 'Estrés acumulado', 'Traumas infantiles', 'Desequilibrios químicos en el cerebro']
  },
  'Depresión': {
    symptoms: ['Tristeza profunda y constante', 'Pérdida de interés en actividades', 'Cambios en el apetito', 'Dificultad para dormir'],
    causes: ['Bioquímica cerebral', 'Eventos traumáticos', 'Antecedentes familiares', 'Enfermedades crónicas']
  },
  'Duelo': {
    symptoms: ['Sensación de vacío', 'Shock emocional', 'Llanto frecuente', 'Retraimiento social'],
    causes: ['Pérdida de un ser querido', 'Ruptura significativa', 'Cambios drásticos de vida']
  },
  'Estrés': {
    symptoms: ['Tensión muscular', 'Irritabilidad', 'Dolores de cabeza', 'Dificultad para concentrarse'],
    causes: ['Presión laboral o académica', 'Problemas financieros', 'Relaciones interpersonales difíciles']
  },
  'Codependencia': {
    symptoms: ['Necesidad excesiva de aprobación', 'Dificultad para establecer límites', 'Descuidar necesidades propias por otros', 'Miedo al abandono'],
    causes: ['Dinámicas familiares disfuncionales', 'Baja autoestima', 'Historia de abuso o negligencia']
  },
  'Hipertensión': {
    symptoms: ['Dolor de cabeza intenso', 'Visión borrosa', 'Zumbido en los oídos', 'Dolor en el pecho'],
    causes: ['Consumo excesivo de sal', 'Sedentarismo', 'Obesidad', 'Factores hereditarios']
  },
  'Caries': {
    symptoms: ['Dolor al masticar', 'Sensibilidad a lo dulce/caliente', 'Manchas oscuras en los dientes', 'Agujeros visibles'],
    causes: ['Mala higiene bucal', 'Consumo frecuente de azúcares', 'Bacterias en la placa dental']
  },
  'Estrés postraumático': {
    symptoms: ['Flashbacks o recuerdos vívidos', 'Pesadillas recurrentes', 'Evitación de lugares asociados', 'Hipervigilancia'],
    causes: ['Exposición a eventos violentos', 'Accidentes graves', 'Catástrofes naturales']
  },
  'Trastorno de conducta': {
    symptoms: ['Agresión a personas o animales', 'Destrucción de propiedad', 'Engaño o robo', 'Violación grave de normas'],
    causes: ['Factores neurobiológicos', 'Entorno familiar inestable', 'Maltrato infantil']
  },
  'Diabetes': {
    symptoms: ['Aumento de la sed (polidipsia)', 'Ganas frecuentes de orinar', 'Cansancio extremo', 'Visión borrosa'],
    causes: ['Resistencia a la insulina', 'Factores genéticos', 'Sobrepeso', 'Páncreas ineficiente']
  },
  'Dislipidemia': {
    symptoms: ['Generalmente asintomática', 'Mareos ocasionales', 'Xantomas (depósitos de grasa en piel)', 'Fatiga'],
    causes: ['Dieta alta en grasas saturadas', 'Sedentarismo', 'Tabaquismo', 'Genética']
  },
  'Depresión en adolescentes': {
    symptoms: ['Irritabilidad extrema', 'Bajo rendimiento escolar', 'Sentimientos de inutilidad', 'Aislamiento de amigos'],
    causes: ['Cambios hormonales', 'Presión social y académica', 'Conflictos familiares']
  },
  'Bruxismo': {
    symptoms: ['Dolor en la mandíbula', 'Dientes desgastados o planos', 'Dolor de cabeza al despertar', 'Sensibilidad dental'],
    causes: ['Estrés y ansiedad', 'Maloclusión dental', 'Trastornos del sueño']
  },
  'Síndrome metabólico': {
    symptoms: ['Gran circunferencia de cintura', 'Niveles altos de azúcar', 'Fatiga', 'Presión arterial elevada'],
    causes: ['Resistencia a la insulina', 'Obesidad abdominal', 'Inactividad física']
  },
  'Dolor de muelas': {
    symptoms: ['Dolor punzante', 'Inflamación de las encías', 'Mal aliento', 'Fiebre leve'],
    causes: ['Caries profundas', 'Abscesos dentales', 'Fracturas dentales']
  },
  'Obesidad': {
    symptoms: ['Aumento de masa corporal (IMC > 30)', 'Dificultad respiratoria al esfuerzo', 'Sudoración excesiva', 'Dolor articular'],
    causes: ['Ingesta calórica excesiva', 'Falta de actividad física', 'Factores metabólicos', 'Genética']
  },
  'Trastorno obsesivo compulsivo (TOC)': {
    symptoms: ['Pensamientos intrusivos y repetitivos', 'Necesidad de orden excesivo', 'Rituales de limpieza', 'Verificación constante'],
    causes: ['Química cerebral alterada', 'Genética', 'Factores ambientales']
  },
  'Infección dental': {
    symptoms: ['Dolor severo y persistente', 'Inflamación de mejilla o ganglios', 'Sabor amargo en la boca', 'Sensibilidad a la presión'],
    causes: ['Caries no tratadas', 'Enfermedad periodontal', 'Trauma dental']
  },
  'Sobrepeso': {
    symptoms: ['Ropa que ya no queda', 'Cansancio más rápido de lo habitual', 'Ligero aumento de grasa abdominal'],
    causes: ['Dieta desequilibrada', 'Baja actividad física', 'Metabolismo lento']
  },
  'Fracturas de dientes': {
    symptoms: ['Dolor agudo al morder', 'Sensibilidad a temperaturas extremas', 'Bordes ásperos en la lengua'],
    causes: ['Golpes o traumas', 'Masticar objetos duros', 'Dientes debilitados por caries']
  },
  'Desgaste dental': {
    symptoms: ['Dientes más cortos o amarillentos', 'Bordes transparentes', 'Sensibilidad al frío'],
    causes: ['Bruxismo', 'Consumo de alimentos ácidos', 'Cepillado demasiado agresivo']
  },
  'Ataques de pánico': {
    symptoms: ['Sensación de muerte inminente', 'Palpitaciones fuertes', 'Falta de aire', 'Escalofríos'],
    causes: ['Estrés intenso', 'Predisposición genética', 'Cambios en la función cerebral']
  },
  'Bullying (acoso escolar)': {
    symptoms: ['Miedo de ir a la escuela', 'Lesiones físicas inexplicables', 'Pérdida de pertenencias', 'Cambios de humor'],
    causes: ['Dinámicas de poder social', 'Falta de supervisión', 'Problemas de conducta en el agresor']
  },
  'Pérdida de dientes': {
    symptoms: ['Espacios vacíos en la encía', 'Dificultad para hablar o masticar', 'Desplazamiento de dientes vecinos'],
    causes: ['Periodontitis avanzada', 'Traumatismos', 'Falta de higiene'],
  },
  'Dientes desalineados': {
    symptoms: ['Dificultad para limpiar entre dientes', 'Mordida incómoda', 'Problemas de pronunciación'],
    causes: ['Genética', 'Uso prolongado de chupón/biberón', 'Pérdida prematura de dientes de leche']
  },
  'Dientes apiñados': {
    symptoms: ['Dientes montados unos sobre otros', 'Inflamación de encías en zonas de difícil acceso', 'Desgaste desigual'],
    causes: ['Mandíbula pequeña', 'Dientes demasiado grandes para el espacio disponible']
  },
  'Estrés laboral': {
    symptoms: ['Agotamiento mental', 'Cinismo hacia el trabajo', 'Falta de productividad', 'Insomnio'],
    causes: ['Carga excesiva de trabajo', 'Falta de control sobre tareas', 'Ambiente laboral hostil']
  },
  'Angustia': {
    symptoms: ['Opresión en el pecho', 'Nudo en la garganta', 'Inquietud constante', 'Miedo indefinido'],
    causes: ['Incertidumbre futura', 'Conflictos internos', 'Situaciones de crisis']
  },
  'Enfermedad periodontal - piorrea': {
    symptoms: ['Encías que sangran fácilmente', 'Mal aliento persistente', 'Dientes flojos', 'Encías retraídas'],
    causes: ['Placa bacteriana acumulada', 'Tabaquismo', 'Diabetes no controlada']
  },
  'Lesiones deportivas': {
    symptoms: ['Dolor repentino', 'Hinchazón e inflamación', 'Incapacidad de mover la articulación'],
    causes: ['Entrenamiento inadecuado', 'Accidentes durante el juego', 'Falta de calentamiento']
  },
  'Trastorno de ansiedad generalizada': {
    symptoms: ['Preocupación excesiva por todo', 'Tensión muscular', 'Fatiga', 'Problemas para dormir'],
    causes: ['Diferencias en la química cerebral', 'Genética', 'Ambiente estresante']
  },
  'Gastritis': {
    symptoms: ['Ardor en el estómago', 'Náuseas y vómitos', 'Sensación de llenura tras comer poco'],
    causes: ['Infección por H. pylori', 'Uso excesivo de analgésicos (AINEs)', 'Consumo excesivo de alcohol', 'Estrés']
  },
  'Colon irritable': {
    symptoms: ['Dolor abdominal y cólicos', 'Hinchazón (gases)', 'Diarrea o estreñimiento alternado'],
    causes: ['Contracciones musculares en el intestino', 'Anomalías nerviosas digestivas', 'Estrés', 'Sensibilidad alimentaria']
  },
  'Virus del papiloma humano (VPH)': {
    symptoms: ['Verrugas genitales', 'A veces asintomático', 'Cambios en el tejido del cuello uterino'],
    causes: ['Contacto sexual con persona infectada', 'Sistema inmunológico debilitado']
  },
  'Diabetes gestacional': {
    symptoms: ['A menudo asintomática', 'Sed inusual', 'Fatiga'],
    causes: ['Cambios hormonales del embarazo', 'Sobrepeso previo al embarazo']
  },
  'Miomas uterinos': {
    symptoms: ['Sangrado menstrual abundante', 'Periodos que duran más de una semana', 'Presión o dolor pélvico'],
    causes: ['Factores genéticos', 'Hormonas (estrógeno y progesterona)', 'Factores de crecimiento']
  },
  'Embarazo': {
    symptoms: ['Ausencia de menstruación', 'Náuseas matutinas', 'Sensibilidad en los senos', 'Fatiga'],
    causes: ['Fertilización de un óvulo por un espermatozoide']
  },
  'Trastornos de la personalidad': {
    symptoms: ['Patrones de pensamiento inflexibles', 'Dificultades en relaciones sociales', 'Comportamientos impulsivos'],
    causes: ['Genética', 'Traumas infantiles', 'Entorno social']
  },
  'Menopausia': {
    symptoms: ['Sofocos (calores)', 'Sudores nocturnos', 'Sequedad vaginal', 'Cambios de humor'],
    causes: ['Disminución natural de hormonas reproductivas con la edad']
  },
  'Ciática': {
    symptoms: ['Dolor que irradia desde la espalda a la pierna', 'Entumecimiento', 'Hormigueo'],
    causes: ['Hernia de disco', 'Estenosis espinal', 'Compresión del nervio ciático']
  },
  'TDAH': {
    symptoms: ['Dificultad para mantener la atención', 'Hiperactividad', 'Impulsividad', 'Desorganización'],
    causes: ['Genética', 'Factores ambientales durante el desarrollo', 'Diferencias en la estructura cerebral']
  },
  'Depresión crónica (Distimia)': {
    symptoms: ['Estado de ánimo bajo por más de 2 años', 'Baja autoestima', 'Falta de energía', 'Sentimientos de desesperanza'],
    causes: ['Química cerebral', 'Antecedentes familiares', 'Situaciones de vida estresantes']
  },
  'Conducta agresiva': {
    symptoms: ['Uso de la fuerza física', 'Insultos constantes', 'Hostilidad'],
    causes: ['Problemas de regulación emocional', 'Modelado de conducta en el hogar', 'Trastornos mentales subyacentes']
  },
  'Embarazo de alto riesgo': {
    symptoms: ['Dolor abdominal severo', 'Sangrado vaginal', 'Mareos extremos'],
    causes: ['Edad materna avanzada', 'Condiciones preexistentes (diabetes, hipertensión)', 'Embarazo múltiple']
  },
  'Desnutrición': {
    symptoms: ['Pérdida de peso extrema', 'Debilidad', 'Piel seca', 'Cicatrización lenta'],
    causes: ['Falta de acceso a alimentos nutritivos', 'Trastornos de absorción', 'Trastornos alimentarios']
  },
  'Endometriosis': {
    symptoms: ['Dolor pélvico severo durante el periodo', 'Dolor durante las relaciones sexuales', 'Infertilidad'],
    causes: ['Menstruación retrógrada', 'Transformación de células embrionarias', 'Genética']
  },
  'Insuficiencia cardíaca': {
    symptoms: ['Falta de aire al hacer esfuerzo', 'Hinchazón en piernas y tobillos', 'Fatiga persistente'],
    causes: ['Enfermedad de las arterias coronarias', 'Presión arterial alta', 'Ataques cardíacos previos']
  },
  'Amenaza de aborto': {
    symptoms: ['Sangrado vaginal leve', 'Cólicos abdominales', 'Dolor lumbar'],
    causes: ['Anomalías cromosómicas', 'Infecciones', 'Problemas hormonales']
  },
  'Adicciones': {
    symptoms: ['Incapacidad para dejar de consumir', 'Síndrome de abstinencia', 'Descuido de responsabilidades'],
    causes: ['Genética', 'Presión social', 'Uso de sustancias como mecanismo de escape']
  },
  'Apendicitis': {
    symptoms: ['Dolor repentino en el lado inferior derecho del abdomen', 'Fiebre', 'Náuseas y vómitos'],
    causes: ['Obstrucción en el revestimiento del apéndice por heces o tumores']
  },
  'Comportamiento suicida': {
    symptoms: ['Hablar sobre querer morir', 'Regalar pertenencias', 'Búsqueda de métodos letales'],
    causes: ['Depresión severa', 'Trauma no resuelto', 'Abuso de sustancias']
  },
  'Faringitis': {
    symptoms: ['Dolor de garganta', 'Dificultad para tragar', 'Amígdalas rojas o inflamadas'],
    causes: ['Infecciones virales (resfriado)', 'Infecciones bacterianas (estreptococo)', 'Alergias']
  },
  'Asma': {
    symptoms: ['Dificultad para respirar', 'Opresión en el pecho', 'Sibilancias (silbidos)', 'Tos nocturna'],
    causes: ['Alergias', 'Contaminación ambiental', 'Genética', 'Infecciones respiratorias']
  },
  'Gingivitis': {
    symptoms: ['Encías rojas e inflamadas', 'Sangrado al cepillarse', 'Mal aliento'],
    causes: ['Higiene bucal deficiente', 'Acumulación de placa bacteriana']
  },
  'Abdomen agudo': {
    symptoms: ['Dolor abdominal intenso y súbito', 'Rigidez de la pared abdominal', 'Vómitos'],
    causes: ['Apendicitis', 'Perforación de úlcera', 'Obstrucción intestinal']
  },
  'Hernia de disco': {
    symptoms: ['Dolor de espalda', 'Debilidad en extremidades', 'Hormigueo en piernas o brazos'],
    causes: ['Desgaste por la edad', 'Levantamiento de objetos pesados', 'Lesiones físicas']
  },
  'Neumonía': {
    symptoms: ['Tos con flema', 'Fiebre y escalofríos', 'Dificultad para respirar'],
    causes: ['Infección por bacterias, virus u hongos']
  },
  'Reflujo gastroesofágico': {
    symptoms: ['Acidez estomacal (pirosis)', 'Regurgitación de alimentos', 'Dolor en el pecho'],
    causes: ['Debilidad del esfínter esofágico inferior', 'Obesidad', 'Tabaquismo']
  },
  'Osteoporosis': {
    symptoms: ['Fracturas fáciles', 'Pérdida de estatura', 'Postura encorvada'],
    causes: ['Disminución de masa ósea', 'Baja ingesta de calcio', 'Cambios hormonales (menopausia)']
  },
  'Anorexia nerviosa': {
    symptoms: ['Pérdida de peso extrema', 'Miedo intenso a engordar', 'Imagen corporal distorsionada'],
    causes: ['Factores biológicos', 'Presión social estética', 'Problemas psicológicos']
  },
  'Cáncer de piel': {
    symptoms: ['Cambios en un lunar', 'Bulto perlado en la piel', 'Lesión que no sana'],
    causes: ['Exposición excesiva al sol', 'Uso de camas de bronceado', 'Genética']
  }
};

// Extended mapping for "Specialties that treat X" section (1-to-many)
const DISEASE_RELATED_SPECIALTIES: Record<string, string[]> = {
 'Ansiedad': ['Psicólogo', 'Psiquiatra'],
  'Depresión': ['Psicólogo', 'Psiquiatra'],
  'Duelo': ['Psicólogo'],
  'Estrés': ['Psicólogo'],
  'Codependencia': ['Psicólogo'],
  'Hipertensión': ['Cardiólogo', 'Internista'],
  'Caries': ['Dentista - Odontólogo'],
  'Estrés postraumático': ['Psicólogo', 'Psiquiatra'],
  'Trastorno de conducta': ['Psiquiatra', 'Psicólogo'],
  'Diabetes': ['Endocrinólogo', 'Diabetólogo', 'Internista'],
  'Dislipidemia': ['Internista', 'Endocrinólogo', 'Cardiólogo'],
  'Depresión en adolescentes': ['Psiquiatra infantil', 'Psicólogo'],
  'Bruxismo': ['Dentista - Odontólogo', 'Fisioterapeuta'],
  'Síndrome metabólico': ['Endocrinólogo', 'Internista', 'Nutriólogo clínico'],
  'Dolor de muelas': ['Dentista - Odontólogo'],
  'Obesidad': ['Especialista en Obesidad y Delgadez', 'Nutriólogo clínico', 'Endocrinólogo'],
  'Trastorno obsesivo compulsivo (TOC)': ['Psiquiatra', 'Psicólogo'],
  'Infección dental': ['Dentista - Odontólogo'],
  'Sobrepeso': ['Nutriólogo clínico', 'Especialista en Obesidad y Delgadez'],
  'Fracturas de dientes': ['Dentista - Odontólogo', 'Cirujano maxilofacial'],
  'Desgaste dental': ['Dentista - Odontólogo'],
  'Ataques de pánico': ['Psicólogo', 'Psiquiatra'],
  'Bullying (acoso escolar)': ['Psicólogo', 'Psicopedagogo'],
  'Pérdida de dientes': ['Dentista - Odontólogo'],
  'Dientes desalineados': ['Dentista - Odontólogo'],
  'Dientes apiñados': ['Dentista - Odontólogo'],
  'Estrés laboral': ['Psicólogo'],
  'Angustia': ['Psicólogo', 'Psiquiatra'],
  'Enfermedad periodontal - piorrea': ['Dentista - Odontólogo'],
  'Lesiones deportivas': ['Especialista en Medicina del Deporte', 'Traumatólogo', 'Fisioterapeuta'],
  'Trastorno de ansiedad': ['Psicólogo', 'Psiquiatra'],
  'Trastorno de ansiedad generalizada': ['Psicólogo', 'Psiquiatra'],
  'Gastritis': ['Gastroenterólogo', 'Internista'],
  'Colon irritable': ['Gastroenterólogo', 'Internista'],
  'Virus del papiloma humano (VPH)': ['Ginecólogo', 'Urólogo', 'Dermatólogo'],
  'Diabetes gestacional': ['Ginecólogo', 'Endocrinólogo'],
  'Miomas uterinos': ['Ginecólogo'],
  'Embarazo': ['Ginecólogo'],
  'Trastornos de la personalidad': ['Psiquiatra', 'Psicólogo'],
  'Menopausia': ['Ginecólogo', 'Endocrinólogo'],
  'Ciática': ['Traumatólogo', 'Ortopedista', 'Fisioterapeuta'],
  'Trastorno de hiperactividad y déficit de atención (TDAH)': ['Neurólogo pediatra', 'Psiquiatra infantil', 'Psicopedagogo'],
  'Depresión crónica': ['Psiquiatra', 'Psicólogo'],
  'Conducta agresiva': ['Psicólogo', 'Psiquiatra'],
  'Embarazo de alto riesgo': ['Ginecólogo'],
  'Desnutrición': ['Nutriólogo clínico', 'Pediatra'],
  'Endometriosis': ['Ginecólogo'],
  'Insuficiencia cardíaca': ['Cardiólogo'],
  'Amenaza de aborto': ['Ginecólogo'],
  'Adicciones': ['Psiquiatra', 'Psicólogo'],
  'Apendicitis': ['Cirujano general'],
  'Comportamiento suicida': ['Psiquiatra', 'Psicólogo'],
  'Síndrome de pinzamiento del hombro': ['Traumatólogo', 'Ortopedista', 'Fisioterapeuta'],
  'Faringitis': ['Otorrinolaringólogo', 'Médico general'],
  'Diabetes tipo 2': ['Endocrinólogo', 'Diabetólogo', 'Internista'],
  'Sangrado uterino disfuncional': ['Ginecólogo'],
  'Asma': ['Neumólogo', 'Alergólogo'],
  'Gingivitis': ['Dentista - Odontólogo'],
  'Maltrato psicológico y abandono infantil': ['Psicólogo', 'Pediatra'],
  'Abdomen agudo': ['Cirujano general', 'Urgenciólogo'],
  'Desorden de ansiedad por separación': ['Psiquiatra infantil', 'Psicólogo'],
  'Hernia de disco': ['Traumatólogo', 'Neurocirujano'],
  'Tendinitis del manguito de los rotadores': ['Traumatólogo', 'Fisioterapeuta'],
  'Fobia específica o simple': ['Psicólogo'],
  'Hernia inguinal': ['Cirujano general'],
  'Neumonía': ['Neumólogo', 'Internista'],
  'Colecistitis aguda': ['Cirujano general'],
  'Cataratas': ['Oftalmólogo'],
  'Reflujo gastroesofágico': ['Gastroenterólogo', 'Internista'],
  'Diverticulitis': ['Gastroenterólogo', 'Cirujano general'],
  'Enfermedad articular degenerativa': ['Reumatólogo', 'Ortopedista'],
  'Tendinitis': ['Traumatólogo', 'Fisioterapeuta'],
  'Radiculopatía lumbar': ['Traumatólogo', 'Neurocirujano'],
  'Depresión neurótica (distimia)': ['Psiquiatra', 'Psicólogo'],
  'Infertibilidad': ['Ginecólogo', 'Urólogo'],
  'Rinitis alérgica': ['Alergólogo', 'Otorrinolaringólogo'],
  'Cálculos biliares': ['Cirujano general', 'Gastroenterólogo'],
  'Periodontitis': ['Dentista - Odontólogo'],
  'Manchas en dientes': ['Dentista - Odontólogo'],
  'Absceso dental': ['Dentista - Odontólogo'],
  'Dolor abdominal': ['Gastroenterólogo', 'Médico general'],
  'Miopía': ['Oftalmólogo', 'Optometrista'],
  'Osteoporosis': ['Reumatólogo', 'Endocrinólogo', 'Internista'],
  'Diente retenido': ['Dentista - Odontólogo', 'Cirujano maxilofacial'],
  'Lesión de Ligamentarias de Rodilla': ['Traumatólogo', 'Ortopedista'],
  'Contractura cervical': ['Fisioterapeuta', 'Ortopedista'],
  'Lesiones de cartílago articular': ['Traumatólogo', 'Ortopedista'],
  'Anorexia nerviosa': ['Psiquiatra', 'Nutriólogo clínico', 'Psicólogo'],
  'Asma pediátrico': ['Neumólogo pediatra', 'Pediatra'],
  'Trastornos de la articulación temporomandibular': ['Dentista - Odontólogo', 'Cirujano maxilofacial'],
  'Lesiones de Menisco': ['Traumatólogo', 'Ortopedista'],
  'Luto': ['Psicólogo'],
  'Dermatitis atópica': ['Dermatólogo', 'Alergólogo'],
  'Astigmatismo': ['Oftalmólogo', 'Optometrista'],
  'Depresión grave': ['Psiquiatra', 'Psicólogo'],
  'Colecistitis crónica': ['Cirujano general'],
  'Hernia hiatal': ['Gastroenterólogo', 'Cirujano general'],
  'Faringitis bacteriana': ['Otorrinolaringólogo', 'Infectólogo'],
  'Sensibilidad dentaria': ['Dentista - Odontólogo']
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

const formatDiseaseName = (slug: string) => {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    // Check if valid phone exists (non-empty string)
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function DiseasePage({ params }: { params: { disease: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const diseaseSlug = params.disease;
  const diseaseName = formatDiseaseName(diseaseSlug);
  const targetSpecialty = DISEASE_MAPPING[diseaseSlug];
  
  // Try to find exact match in constants, fallback to formatted name
  const exactDiseaseName = ALL_DISEASES.find(d => slugify(d) === diseaseSlug) || diseaseName;
  
  // Get related specialties list, falling back to just the primary specialty if no detailed list exists
  const relatedSpecialties = DISEASE_RELATED_SPECIALTIES[diseaseSlug] || (targetSpecialty ? [targetSpecialty] : []);

  // Get dynamic details or fallbacks
  const details = DISEASE_DETAILS[diseaseSlug] || {
    symptoms: ['Los síntomas varían según el paciente', 'Malestar general', 'Cambios en la salud física o mental'],
    causes: ['Factores genéticos', 'Factores ambientales', 'Estilo de vida', 'Condiciones preexistentes']
  };

  // SEO
  useEffect(() => {
    document.title = `Tratamiento para ${diseaseName} - Especialistas y Causas | MediBusca`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Información sobre ${diseaseName}: síntomas, causas y tratamiento. Encuentra doctores especialistas en ${diseaseName} cerca de ti.`);
  }, [diseaseName]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        // 1. Fetch Doctors
        let query = supabase.from('doctors').select('*');

        if (targetSpecialty) {
             // Primary strategy: Filter by specialty if mapped
            query = query.contains('specialties', [targetSpecialty]);
        } else {
             // Fallback strategy: Search by disease tag in medical_profile
            query = query.contains('medical_profile', { diseases_treated: [exactDiseaseName] });
        }

        const { data } = await query.range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }

        // 2. Fetch Related Articles
        const searchTerm = exactDiseaseName || diseaseName;
        const { data: articlesData } = await supabase
            .from('articles')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
            .order('published_at', { ascending: false })
            .limit(3);
        
        if (articlesData) {
            setRelatedArticles(articlesData as Article[]);
        }

        setLoading(false);
    }
    if (params.disease) fetchInitial();
  }, [params.disease, targetSpecialty, exactDiseaseName, diseaseName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('doctors').select('*');

    if (targetSpecialty) {
        query = query.contains('specialties', [targetSpecialty]);
    } else {
        query = query.contains('medical_profile', { diseases_treated: [exactDiseaseName] });
    }

    const { data } = await query.range(from, to);

    if (data) {
        if (data.length > 0) {
            const sortedNew = sortDoctorsByPhone(data as Doctor[]);
            setDoctors(prev => [...prev, ...sortedNew]);
            setPage(nextPage);
        }
        if (data.length < PAGE_SIZE) {
            setHasMore(false);
        }
    }
    setLoadingMore(false);
  };

  // Schema Markup
  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": diseaseName,
    "alternateName": exactDiseaseName,
    "description": `Información sobre síntomas, causas y especialistas para ${diseaseName}.`,
    "possibleTreatment": targetSpecialty ? {
      "@type": "MedicalTherapy",
      "name": `Consulta con ${targetSpecialty}`
    } : undefined,
    "signOrSymptom": details.symptoms.map(s => ({
      "@type": "MedicalSymptom",
      "name": s
    })),
    "riskFactor": details.causes.map(c => ({
      "@type": "MedicalRiskFactor",
      "name": c
    }))
  };

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/enfermedades" className="hover:text-[#0071e3] transition-colors">Padecimientos</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{diseaseName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
              <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                {diseaseName}
              </h1>
              {targetSpecialty && (
                <Link href={`/especialidad/${slugify(targetSpecialty)}`} className="mb-1.5">
                    <span className="px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-sm font-semibold hover:bg-[#0071e3]/20 transition-colors">
                        Especialista sugerido: {targetSpecialty}
                    </span>
                </Link>
              )}
          </div>
          <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Encuentra especialistas médicos expertos en el diagnóstico y tratamiento de {diseaseName}.
          </p>
        </div>

        {/* Show alert ONLY if NO specialty mapped AND NO doctors found via fallback */}
        {!targetSpecialty && doctors.length === 0 && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-amber-800 flex gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                    <h3 className="font-semibold">Búsqueda limitada</h3>
                    <p className="text-sm mt-1">
                        No encontramos doctores que traten específicamente "{diseaseName}" en este momento. 
                        Intenta buscar directamente por una especialidad relacionada en nuestro <Link href="/buscar" className="underline font-medium">buscador</Link>.
                    </p>
                </div>
            </div>
        )}

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {doctors.map((doc, idx) => (
              <div 
                key={doc.id} 
                className={`
                  bg-white p-6 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 border border-transparent hover:border-[#0071e3]/20
                  flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                  {/* Content */}
                  <div className="flex-1 min-w-0 mb-5">
                      <div className="flex justify-between items-start gap-3">
                         <Link href={`/medico/${doc.slug}`} className="flex-1">
                            <h2 className="text-lg md:text-xl font-bold text-[#1d1d1f] leading-snug hover:text-[#0071e3] transition-colors tracking-tight cursor-pointer">
                                {doc.full_name}
                            </h2>
                         </Link>
                         {doc.license_numbers.length > 0 && (
                             <CheckCircle className="w-5 h-5 text-[#0071e3] shrink-0 mt-1" />
                         )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                           {doc.specialties.slice(0, 3).map(s => (
                               <span key={s} className={`
                                 px-2.5 py-1 text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide
                                 ${s === targetSpecialty ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#f5f5f7] text-[#86868b]'}
                               `}>
                                  {s}
                               </span>
                           ))}
                      </div>

                      {/* Location */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm font-medium text-[#86868b]">
                           {doc.cities.map((c, i) => (
                               <span key={i} className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-[#86868b]/70" /> {c}
                               </span>
                           ))}
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <Link 
                        href={`/medico/${doc.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#f5f5f7] text-[#1d1d1f] rounded-xl font-medium text-sm hover:bg-[#e5e5ea] transition-colors active:scale-95"
                      >
                        <User className="w-4 h-4" />
                        Ver Perfil
                      </Link>
                      
                      {doc.contact_info.phones?.[0] ? (
                        <a 
                          href={`tel:${doc.contact_info.phones[0]}`}
                          className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#0071e3] text-white rounded-xl font-medium text-sm hover:bg-[#0077ED] transition-colors active:scale-95"
                        >
                          <Phone className="w-4 h-4" />
                          Llamar
                        </a>
                      ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed">
                           <Phone className="w-4 h-4" />
                           Llamar
                        </button>
                      )}
                  </div>
              </div>
          ))}
          
          {doctors.length === 0 && targetSpecialty && (
            <div className="col-span-full py-20 text-center text-[#86868b]">
               <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-[#d2d2d7]" />
               </div>
               <p className="text-lg">No encontramos doctores verificados para {diseaseName} en este momento.</p>
               <Link href="/especialidades" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">
                 Ver todas las especialidades
               </Link>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && doctors.length > 0 && (
          <div className="pt-12 flex justify-center">
              <button 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="
                    flex items-center gap-2 px-8 py-3.5 
                    bg-white border border-[#d2d2d7] rounded-full 
                    font-medium text-[#1d1d1f] text-[15px]
                    hover:bg-[#f5f5f7] hover:border-[#86868b] transition-all 
                    disabled:opacity-50 active:scale-95 shadow-sm
                  "
              >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Ver más doctores
              </button>
          </div>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
            <section className="mt-20 mb-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[#0071e3]" />
                        Guías y Artículos sobre {diseaseName}
                    </h2>
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium hover:underline text-sm hidden md:block">
                        Ver enciclopedia
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/enciclopedia/${article.slug}`}>
                            <div className="group h-full bg-white rounded-[20px] p-6 border border-[#d2d2d7]/60 hover:border-[#0071e3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden">
                                {/* Decorative gradient blob */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0071e3]/5 rounded-full blur-2xl group-hover:bg-[#0071e3]/10 transition-all"></div>
                                
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                        Artículo
                                    </span>
                                    <span className="text-[11px] text-[#86868b] flex items-center gap-1 ml-auto shrink-0">
                                        <Clock className="w-3 h-3" /> {article.read_time}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2 relative z-10">
                                    {article.title}
                                </h3>
                                
                                <p className="text-[#86868b] text-[14px] leading-relaxed mb-6 line-clamp-3 flex-1 relative z-10">
                                    {article.excerpt}
                                </p>
                                
                                <div className="flex items-center text-[#0071e3] font-semibold text-[14px] mt-auto relative z-10 group-hover:translate-x-1 transition-transform">
                                    Leer artículo completo <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="mt-6 md:hidden text-center">
                    <Link href="/enciclopedia" className="text-[#0071e3] font-medium hover:underline text-sm">
                        Ver enciclopedia
                    </Link>
                </div>
            </section>
        )}

        {/* Specialties that treat {Disease} Section */}
        {relatedSpecialties.length > 0 && (
          <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-[#0071e3]" />
                Especialidades que tratan {diseaseName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedSpecialties.map((spec) => (
                    <Link 
                        key={spec} 
                        href={`/especialidad/${slugify(spec)}`}
                        className="
                           group flex items-center justify-between p-5
                           bg-white border border-[#d2d2d7]/60 rounded-xl
                           hover:border-[#0071e3] hover:shadow-md
                           transition-all duration-300 cursor-pointer
                        "
                    >
                        <span className="font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                            {spec}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
                    </Link>
                ))}
            </div>
          </section>
        )}

        {/* NEW: SEO / Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-16 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Intro */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        {diseaseName} – Síntomas, Causas e Información de Cuidado | MediBusca
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-3xl mx-auto">
                        {diseaseName} afecta a cada persona de manera diferente. MediBusca ofrece recursos informativos para ayudar a los pacientes a comprender los síntomas, las causas y las opciones de atención disponibles, y conectar directamente con doctores para recibir orientación.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Symptoms */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Síntomas Comunes</h3>
                        </div>
                        <ul className="space-y-3">
                            {details.symptoms.map((symptom, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{symptom}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Causes */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Causas y Factores de Riesgo</h3>
                        </div>
                         <ul className="space-y-3">
                            {details.causes.map((cause, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7] mt-2 shrink-0"></div>
                                    <span className="leading-relaxed">{cause}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Care & Diagnosis */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#86868b]" />
                            Diagnóstico y Cuidado
                        </h3>
                        <div className="space-y-3 text-[#86868b] leading-relaxed text-[15px]">
                            <p><strong>Diagnóstico:</strong> Los doctores pueden diagnosticar esta condición mediante el historial médico, examen físico y las pruebas apropiadas.</p>
                            <p><strong>Cuidado y Manejo:</strong> El manejo puede incluir cambios en el estilo de vida, medicamentos u orientación médica, dependiendo de las recomendaciones del doctor.</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             <Info className="w-5 h-5 text-[#86868b]" />
                             Cuándo contactar a un Doctor
                        </h3>
                         <div className="space-y-3 text-[#86868b] leading-relaxed text-[15px]">
                            <p>Los pacientes deben conectar con doctores calificados listados en MediBusca para una evaluación y orientación adecuada si los síntomas persisten.</p>
                            <p><strong>Encuentra Doctores para {diseaseName}:</strong> Explora los perfiles de doctores en MediBusca relacionados con esta condición y conecta directamente con ellos para consulta.</p>
                         </div>
                     </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900/80">
                        <strong>Aviso Médico:</strong> MediBusca proporciona solo información. La plataforma no ofrece consejo médico, diagnóstico, tratamiento ni reserva de citas. Siempre consulta a un profesional de la salud calificado.
                    </div>
                </div>

            </div>
        </section>

        {/* Cities Section (Specialty Focused) - LIMIT TO TOP CITIES */}
        {relatedSpecialties.length > 0 ? (
          relatedSpecialties.map((spec) => (
             <section key={spec} className="mt-16 pt-12 border-t border-[#d2d2d7]/30">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                    {spec.startsWith('Medicina') || spec.includes('Cirujano') 
                        ? `Encuentra especialistas en ${spec} en las principales ciudades`
                        : `Encuentra ${spec}s en las principales ciudades`
                    }
                </h2>
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {TOP_CITIES.map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}/${slugify(spec)}`}
                            className="
                                inline-flex items-center px-6 py-3.5
                                bg-white border border-[#d2d2d7]/60 rounded-full
                                text-[#1d1d1f] font-medium text-[15px]
                                hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white
                                active:scale-[0.98] transition-all duration-200
                                shadow-sm hover:shadow-md
                            "
                        >
                            {spec} en {city}
                        </Link>
                    ))}
                </div>
            </section>
          ))
        ) : (
            <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                    Encuentra especialistas en las principales ciudades
                </h2>
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {TOP_CITIES.map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="
                                inline-flex items-center px-6 py-3.5
                                bg-white border border-[#d2d2d7]/60 rounded-full
                                text-[#1d1d1f] font-medium text-[15px]
                                hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white
                                active:scale-[0.98] transition-all duration-200
                                shadow-sm hover:shadow-md
                            "
                        >
                            Doctores en {city}
                        </Link>
                    ))}
                </div>
            </section>
        )}

        {/* Disease in Cities Section (Updated to use new Route) - LIMIT TO TOP CITIES */}
        <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30">
             <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#86868b]" />
                Encuentra tratamiento para {diseaseName} en tu ciudad
            </h2>
            <div className="flex flex-wrap gap-3">
                {TOP_CITIES.map((city) => (
                    <Link 
                        key={city}
                        href={`/enfermedad/${diseaseSlug}/${slugify(city)}`}
                        className="
                            px-4 py-2 bg-white rounded-lg border border-slate-200
                            text-sm font-medium text-[#1d1d1f] 
                            hover:border-[#0071e3] hover:text-[#0071e3] 
                            transition-colors
                        "
                    >
                        {diseaseName} en {city}
                    </Link>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}