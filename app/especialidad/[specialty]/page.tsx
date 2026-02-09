import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Loader2, Plus, User, Phone, CheckCircle, ArrowRight, Stethoscope, Search, BookOpen, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, COMMON_SPECIALTIES, POPULAR_SPECIALTIES } from '../../../lib/constants';

const PAGE_SIZE = 20;

const SPECIALTY_DESCRIPTIONS: Record<string, string> = {
  'Dentista - Odontólogo': 'Un odontólogo es el profesional encargado de la salud bucodental, realizando prevención, diagnóstico y tratamiento de enfermedades de los dientes y encías.',
  'Psicólogo': 'Un psicólogo es un profesional de la salud mental que utiliza terapias conductuales y cognitivas para ayudar a los pacientes a gestionar sus emociones y comportamientos.',
  'Pediatra': 'Un pediatra es un médico especializado en la salud y el desarrollo físico, emocional y social de los niños, desde el nacimiento hasta la adolescencia.',
  'Médico general': 'Un médico general proporciona atención primaria, diagnósticos iniciales y coordina tratamientos para una amplia gama de condiciones comunes.',
  'Ginecólogo': 'Un ginecólogo es un especialista en el sistema reproductor femenino y la salud de las mamas, abarcando desde el control preventivo hasta el embarazo.',
  'Internista': 'Un internista se especializa en la prevención, diagnóstico y tratamiento no quirúrgico de enfermedades complejas que afectan a los órganos internos de los adultos.',
  'Cirujano general': 'Un cirujano general es un médico capacitado para realizar procedimientos quirúrgicos, especialmente en los órganos abdominales y tejidos blandos.',
  'Radiólogo': 'Un radiólogo es un especialista que utiliza tecnologías de imagen (como rayos X, TAC y resonancias) para diagnosticar y, en ocasiones, tratar enfermedades.',
  'Ortopedista': 'Un ortopedista se dedica al diagnóstico y tratamiento de trastornos del sistema musculoesquelético, incluyendo huesos, articulaciones y ligamentos.',
  'Traumatólogo': 'Un traumatólogo es un médico que se ocupa de las lesiones provocadas por golpes o accidentes, como fracturas, luxaciones y esguinces.',
  'Oftalmólogo': 'Un oftalmólogo es un médico especializado en la salud ocular, capacitado para recetar lentes, tratar enfermedades de los ojos y realizar cirugías.',
  'Psiquiatra': 'Un psiquiatra es un médico que diagnostica y trata trastornos mentales, utilizando tanto psicoterapia como tratamientos farmacológicos.',
  'Cardiólogo': 'Un cardiólogo es un especialista en el corazón y los vasos sanguíneos, encargado de tratar afecciones como la hipertensión y la insuficiencia cardíaca.',
  'Nutricionista': 'Un nutricionista es un profesional que diseña planes de alimentación y educa sobre hábitos saludables para mejorar la salud general a través de la dieta.',
  'Otorrinolaringólogo': 'Un otorrinolaringólogo se especializa en el diagnóstico y tratamiento de enfermedades del oído, la nariz y la garganta.',
  'Nutriólogo clínico': 'Un nutriólogo clínico es un médico que trata enfermedades a través de la nutrición terapéutica, manejando casos de obesidad, diabetes y malnutrición.',
  'Dermatólogo': 'Un dermatólogo es un médico capacitado para tratar enfermedades de la piel, el cabello y las uñas, así como realizar procedimientos estéticos.',
  'Fisioterapeuta': 'Un fisioterapeuta ayuda a los pacientes a recuperar el movimiento y la función física mediante ejercicios, masajes y técnicas especializadas.',
  'Urólogo': 'Un urólogo trata el sistema urinario de ambos sexos y el aparato reproductor masculino, incluyendo condiciones de los riñones y la próstata.',
  'Cirujano plástico': 'Un cirujano plástico se especializa en la reparación, restauración o alteración del cuerpo humano por razones estéticas o reconstructivas.',
  'Gastroenterólogo': 'Un gastroenterólogo es un médico que trata enfermedades del sistema digestivo, incluyendo el estómago, los intestinos, el hígado y el páncreas.',
  'Terapeuta complementario': 'Un terapeuta complementario utiliza métodos alternativos o naturales (como homeopatía o acupuntura) para apoyar el bienestar del paciente.',
  'Anestesiólogo': 'Un anestesiólogo es el responsable de administrar anestesia y monitorear las funciones vitales del paciente antes, durante y después de una cirugía.',
  'Especialista en Obesidad y Delgadez': 'Este especialista se enfoca en el manejo médico y nutricional de los trastornos del peso corporal y el metabolismo.',
  'Endoscopista': 'Un endoscopista es un médico que utiliza tubos delgados y flexibles con cámaras para visualizar y tratar el interior del tracto digestivo u otros órganos.',
  'Neurocirujano': 'Un neurocirujano es un médico especializado en el tratamiento quirúrgico de trastornos del cerebro, la médula espinal y los nervios periféricos.',
  'Endocrinólogo': 'Un endocrinólogo diagnostica y trata trastornos relacionados con las hormonas y las glándulas que las producen, como la tiroides y el páncreas.',
  'Especialista en Rehabilitación y Medicina Física': 'Se encarga de restaurar las capacidades perdidas por una enfermedad o lesión, mejorando la calidad de vida y autonomía del paciente.',
  'Nefrólogo': 'Un nefrólogo es un médico especializado en la salud de los riñones y el tratamiento de la insuficiencia renal.',
  'Neonatólogo': 'Un neonatólogo es un pediatra especializado en el cuidado médico de los recién nacidos, especialmente aquellos que son prematuros o están enfermos.',
  'Psicoanalista': 'Un psicoanalista es un terapeuta que utiliza el método de investigación del inconsciente para tratar problemas emocionales y de personalidad.',
  'Cirujano pediátrico': 'Un cirujano pediátrico se especializa en realizar operaciones en fetos, bebés, niños y adolescentes.',
  'Alergólogo': 'Un alergólogo determina si los síntomas son causados por alergias y encuentra el tratamiento para reacciones a alimentos, polen o fármacos.',
  'Neumólogo': 'Un neumólogo es un médico que trata enfermedades de los pulmones y el sistema respiratorio, como el asma y la neumonía.',
  'Reumatólogo': 'Un reumatólogo se especializa en enfermedades autoinmunes y trastornos de las articulaciones y los tejidos blandos (como la artritis).',
  'Homeópata': 'Un homeópata utiliza un sistema de medicina alternativa basado en la administración de sustancias diluidas para activar la autocuración del cuerpo.',
  'Neurólogo': 'Un neurólogo diagnostica y trata trastornos del sistema nervioso que no requieren cirugía, como la epilepsia o el Parkinson.',
  'Oncólogo médico': 'Un oncólogo médico es el encargado de tratar el cáncer mediante terapias como la quimioterapia, la inmunoterapia y terapias dirigidas.',
  'Cirujano maxilofacial': 'Un cirujano maxilofacial se especializa en tratar quirúrgicamente enfermedades y lesiones en la cara, la boca y la mandíbula.',
  'Angiólogo': 'Un angiólogo es un médico dedicado al estudio y tratamiento de las enfermedades del sistema vascular (arterias, venas y vasos linfáticos).',
  'Especialista en Medicina Crítica y Terapia Intensiva': 'Es el médico que atiende a pacientes con enfermedades graves o inestables que requieren monitoreo constante en la UCI.',
  'Geriatra': 'Un geriatra se especializa en el cuidado de la salud de los adultos mayores, manejando la complejidad de sus múltiples condiciones.',
  'Cirujano oncólogo': 'Es un cirujano especializado en la extirpación de tumores cancerosos y el manejo quirúrgico de la enfermedad oncológica.',
  'Proctólogo': 'Un proctólogo se encarga de diagnosticar y tratar enfermedades del colon, el recto y el ano.',
  'Audiólogo': 'Un audiólogo es el profesional que evalúa y trata problemas de audición y equilibrio, así como la adaptación de audífonos.',
  'Hematólogo': 'Un hematólogo es un médico especializado en el tratamiento de enfermedades de la sangre y los órganos que la producen.',
  'Médico de familia': 'Un médico de familia brinda atención integral y continua a individuos de todas las edades dentro de su entorno familiar.',
  'Infectólogo': 'Un infectólogo es un médico experto en el diagnóstico y tratamiento de enfermedades causadas por virus, bacterias, parásitos u hongos.',
  'Médico estético': 'Se dedica a la aplicación de tratamientos no invasivos o mínimamente invasivos para mejorar la apariencia física y la salud de la piel.',
  'Diabetólogo': 'Un diabetólogo es un médico enfocado exclusivamente en el tratamiento y control de la diabetes y sus complicaciones.',
  'Acupuntor': 'Un acupuntor utiliza la inserción de agujas finas en puntos específicos del cuerpo para aliviar el dolor y tratar diversas afecciones.',
  'Quiropráctico': 'Se enfoca en el diagnóstico y tratamiento manual de los trastornos del sistema musculoesquelético, especialmente de la columna vertebral.',
  'Optometrista': 'Un optometrista es un profesional de la salud visual que realiza exámenes de la vista, detecta anomalías y prescribe anteojos o lentes de contacto.',
  'Sexólogo': 'Un sexólogo es un profesional que ayuda a resolver dudas y disfunciones relacionadas con la sexualidad y las relaciones de pareja.',
  'Cirujano cardiovascular y torácico': 'Es un médico que realiza cirugías en el corazón, los pulmones y otros órganos dentro del tórax.',
  'Inmunólogo': 'Un inmunólogo trata trastornos del sistema inmunitario, incluyendo inmunodeficiencias y enfermedades autoinmunes.',
  'Psicopedagogo': 'Un psicopedagogo se encarga de orientar y ayudar a personas con dificultades en el aprendizaje y el desarrollo educativo.',
  'Neurólogo pediatra': 'Es un médico que trata los trastornos del cerebro y el sistema nervioso específicamente en bebés y niños.',
  'Cardiólogo pediátrico': 'Se especializa en diagnosticar y tratar problemas cardíacos en niños, incluso antes de nacer.',
  'Enfermero': 'Un enfermero es el profesional responsable del cuidado directo de los pacientes, la administración de medicamentos y el apoyo clínico.',
  'Odontólogo pediatra': 'También llamado odontopediatra, se especializa en el cuidado dental preventivo y terapéutico de los niños.',
  'Algólogo': 'Un algólogo es un médico experto en el manejo y tratamiento del dolor crónico y agudo de difícil control.',
  'Especialista en Medicina del Deporte': 'Se encarga de la prevención y el tratamiento de lesiones relacionadas con la actividad física y la mejora del rendimiento deportivo.',
  'Ginecólogo oncológico': 'Es un especialista dedicado al tratamiento quirúrgico y médico de los cánceres del sistema reproductor femenino.',
  'Radioterapeuta': 'Un radioterapeuta es un oncólogo que utiliza radiación ionizante para tratar el cáncer y reducir tumores.',
  'Neumólogo pediatra': 'Es el médico encargado de tratar los problemas respiratorios crónicos y agudos en la población infantil.',
  'Urgenciólogo': 'Es el médico especializado en la atención inmediata de pacientes con condiciones que ponen en riesgo la vida en salas de emergencia.',
  'Endocrinólogo pediátrico': 'Trata trastornos hormonales, problemas de crecimiento y diabetes específicamente en niños y adolescentes.',
  'Logopeda': 'Un logopeda es el profesional que evalúa y trata problemas de la comunicación, el lenguaje, el habla y la deglución.',
  'Genetista': 'Un genetista estudia la herencia y diagnostica enfermedades causadas por alteraciones en los genes o cromosomas.',
  'Cirujano estético y cosmético': 'Se enfoca exclusivamente en mejorar la apariencia mediante técnicas quirúrgicas y médicas.',
  'Gastroenterólogo pediátrico': 'Médico experto en tratar problemas digestivos, del hígado y de nutrición en niños.',
  'Psiquiatra infantil': 'Médico que diagnostica y trata trastornos mentales y emocionales en niños y adolescentes.',
  'Neurofisiólogo': 'Especialista que estudia la función del sistema nervioso mediante pruebas como electroencefalogramas y electromiogramas.',
  'Cirujano vascular': 'Médico que realiza cirugías para tratar enfermedades de las arterias y venas, excepto las del corazón y cerebro.',
  'Cirujano bariatra': 'Cirujano especializado en procedimientos para el tratamiento de la obesidad mórbida, como el bypass o la manga gástrica.',
  'Dermatólogo pediátrico': 'Se especializa en el diagnóstico y tratamiento de afecciones de la piel propias de la infancia.',
  'Nefrólogo pediatra': 'Médico encargado del cuidado de los riñones y el manejo de la hipertensión arterial en niños.',
  'Analista clínico': 'Profesional responsable de realizar y supervisar los exámenes de laboratorio para el diagnóstico médico.',
  'Infectólogo pediatra': 'Especialista en el tratamiento de enfermedades infecciosas complejas en pacientes infantiles.',
  'Anatomopatólogo': 'Médico que estudia las muestras de tejidos y células para diagnosticar enfermedades, incluyendo el cáncer.',
  'Podólogo': 'Especialista dedicado al estudio, prevención y tratamiento de las afecciones de los pies.',
  'Hematólogo pediatra': 'Médico que trata las enfermedades de la sangre y el cáncer infantil relacionado con la sangre (leucemias).',
  'Radio Oncólogo': 'Médico que utiliza la radioterapia como tratamiento principal para combatir diversos tipos de cáncer.',
  'Especialista en Medicina Integrada': 'Médico que combina la medicina convencional con enfoques complementarios para una atención holística del paciente.',
  'Oncólogo pediátrico': 'Médico especializado en el tratamiento integral del cáncer en niños.',
  'Patólogo clínico': 'Médico que utiliza pruebas de laboratorio sobre fluidos corporales para diagnosticar enfermedades.',
  'Cirujano de la mano': 'Cirujano especializado en el tratamiento de lesiones y afecciones complejas de la mano y la muñeca.',
  'Especialista en Medicina del Trabajo': 'Médico que se encarga de la prevención de riesgos laborales y la salud de los trabajadores en sus empresas.',
  'Ortopedista infantil': 'Especialista en el tratamiento de problemas óseos y musculares que ocurren durante el crecimiento del niño.',
  'Naturista': 'Profesional que utiliza elementos naturales y dietas específicas para promover la salud y prevenir enfermedades.',
  'Foniatra': 'Médico encargado del diagnóstico y tratamiento de los trastornos de la voz, el habla y la audición.',
  'Especialista en Medicina Nuclear': 'Utiliza sustancias radioactivas para obtener imágenes de órganos y tratar ciertas enfermedades.',
  'Reumatólogo pediátrico': 'Médico que trata enfermedades autoinmunes e inflamatorias articulares en niños.',
  'Ortodoncista': 'Odontólogo especializado en corregir la posición de los dientes y los problemas de la mordida mediante brackets o alineadores.',
  'Terapeuta ocupacional': 'Profesional que ayuda a las personas a recuperar autonomía en sus actividades diarias tras una lesión o discapacidad.',
  'Podiatra': 'Profesional especializado en el cuidado médico y quirúrgico de los pies y los tobillos.',
  'gerontologo': 'Profesional que estudia el proceso de envejecimiento desde una perspectiva biológica, psicológica y social.',
  'Otorrinolaringólogo Pediátrico': 'Especialista en el tratamiento de problemas de oído, nariz y garganta específicamente en niños.'
};

const SPECIALTY_CONDITIONS: Record<string, string[]> = {
  'Dentista - Odontólogo': ['Caries', 'Dolor de muelas', 'Infección dental', 'Bruxismo', 'Fracturas de dientes', 'Desgaste dental', 'Enfermedad periodontal - piorrea', 'Gingivitis', 'Sensibilidad dentaria', 'Alveolitis', 'Movilidad dentaria', 'Halitosis', 'Úlceras bucales', 'Impactación dental', 'Atrición dental', 'Fistula dental o en encía', 'Traumatismo dental'],
  'Psicólogo': ['Ansiedad', 'Depresión', 'Duelo', 'Estrés', 'Codependencia', 'Ataques de pánico', 'Bullying (acoso escolar)', 'Estrés laboral', 'Angustia', 'Baja autoestima', 'Luto', 'Tristeza', 'Dependencia emocional', 'Control de emociones', 'Trastorno de adaptación'],
  'Pediatra': ['Fiebre en niños', 'Bronquiolitis', 'Estreñimiento en niños', 'Anemia ferropénica en niños', 'Dermatitis del pañal', 'Cólico infantil', 'Varicela', 'Alergia alimentaria', 'Infección urinaria en niños', 'Convulsiones febriles', 'Crup'],
  'Médico general': ['Resfriado común', 'Gastroenteritis aguda', 'Dolor abdominal', 'Faringitis', 'Heridas', 'Deshidratación', 'Dolor de cabeza'],
  'Ginecólogo': ['Miomas uterinos', 'Embarazo', 'Menopausia', 'Amenaza de aborto', 'Sangrado uterino disfuncional', 'Infertilidad', 'Quistes ováricos', 'Endometriosis', 'Ovarios poliquísticos', 'Cervicitis', 'VPH', 'Candidiasis vaginal'],
  'Internista': ['Hipertensión', 'Diabetes', 'Dislipidemia', 'Insuficiencia cardíaca', 'Neumonía', 'Hígado graso', 'Lupus', 'Fatiga crónica'],
  'Cirujano general': ['Apendicitis', 'Hernia inguinal', 'Hernia umbilical', 'Colecistitis aguda', 'Cálculos biliares', 'Hernia hiatal', 'Abdomen agudo', 'Adherencias'],
  'Radiólogo': ['Diagnóstico de fracturas', 'Detección de tumores', 'Evaluación de órganos internos', 'Seguimiento de embarazo (ultrasonido)'],
  'Ortopedista': ['Escoliosis', 'Juanetes', 'Pie plano', 'Osteoartritis', 'Desgaste de rodilla', 'Curvatura de la columna', 'Postura jorobada', 'Rodilla vara'],
  'Traumatólogo': ['Fracturas', 'Ciática', 'Lesiones deportivas', 'Esguince', 'Hernia de disco', 'Lesiones de Menisco', 'Tendinitis', 'Fractura de fémur', 'Fractura de cadera'],
  'Oftalmólogo': ['Cataratas', 'Miopía', 'Astigmatismo', 'Glaucoma', 'Retinopatía diabética', 'Desprendimiento de retina', 'Conjuntivitis', 'Presbicia', 'Estrabismo'],
  'Psiquiatra': ['Trastorno bipolar', 'Esquizofrenia', 'Trastorno obsesivo compulsivo (TOC)', 'Depresión mayor', 'Psicosis', 'Trastorno de conducta', 'Adicciones'],
  'Cardiólogo': ['Arritmias', 'Infarto agudo de miocardio', 'Insuficiencia cardíaca', 'Angina de pecho', 'Síncope', 'Fibrilación auricular', 'Taquicardia', 'Bradicardia'],
  'Nutricionista': ['Control de peso', 'Dieta equilibrada', 'Educación alimentaria', 'Planificación de comidas'],
  'Otorrinolaringólogo': ['Sinusitis', 'Otitis', 'Amigdalitis', 'Rinitis alérgica', 'Vértigo postural benigno', 'Ronquido', 'Pólipos nasales', 'Cerumen (cera del oído)'],
  'Nutriólogo clínico': ['Obesidad', 'Desnutrición', 'Sobrepeso', 'Resistencia a la insulina', 'Diabetes tipo 2', 'Intolerancia a la lactosa'],
  'Dermatólogo': ['Acné', 'Psoriasis', 'Cáncer de piel', 'Vitiligo', 'Alopecia', 'Rosácea', 'Melasma', 'Dermatitis atópica', 'Verrugas', 'Caspa'],
  'Fisioterapeuta': ['Rehabilitación física', 'Contractura cervical', 'Dolor muscular', 'Parálisis facial', 'Epicondilitis humeral', 'Linfedema'],
  'Urólogo': ['Cáncer de próstata', 'Disfunción eréctil', 'Cálculos renales', 'Varicocele', 'Incontinencia urinaria', 'Eyaculación precoz', 'Fimosis', 'Balanitis'],
  'Cirujano plástico': ['Gigantomastia', 'Cicatriz queloide', 'Labio leporino y paladar hendido', 'Quemaduras', 'Reconstrucción mamaria'],
  'Gastroenterólogo': ['Gastritis', 'Colon irritable', 'Reflujo gastroesofágico', 'Diverticulitis', 'Cirrosis', 'Hepatitis', 'Celiaquía'],
  'Terapeuta complementario': ['Manejo del estrés', 'Bienestar holístico', 'Terapias de relajación'],
  'Anestesiólogo': ['Manejo del dolor perioperatorio', 'Anestesia local', 'Anestesia general', 'Sedación'],
  'Especialista en Obesidad y Delgadez': ['Obesidad mórbida', 'Delgadez extrema', 'Trastorno por atracón', 'Manejo metabólico del peso'],
  'Endoscopista': ['Detección de úlceras', 'Pólipos gástricos', 'Biopsias digestivas', 'Esofagitis'],
  'Neurocirujano': ['Tumor cerebral', 'Aneurisma cerebral', 'Hemorragia cerebral', 'Hidrocefalia', 'Compresión de la médula espinal'],
  'Endocrinólogo': ['Hipertiroidismo', 'Hipotiroidismo', 'Bocio', 'Nódulo tiroideo', 'Síndrome de Cushing', 'Ginecomastia'],
  'Especialista en Rehabilitación y Medicina Física': ['Recuperación post-ictus', 'Manejo de discapacidad', 'Fisiatría', 'Terapia de movilidad'],
  'Nefrólogo': ['Falla renal crónica', 'Insuficiencia renal aguda', 'Glomerulonefritis', 'Síndrome nefrótico', 'Nefropatía diabética'],
  'Neonatólogo': ['Bebé prematuro', 'Ictericia del recién nacido', 'Crisis respiratoria en recién nacidos'],
  'Psicoanalista': ['Neurosis histérica', 'Conflictos inconscientes', 'Análisis de la personalidad'],
  'Cirujano pediátrico': ['Estenosis pilórica', 'Criptorquidia', 'Divertículo de Meckel', 'Ano imperforado', 'Gastrosquisis'],
  'Alergólogo': ['Urticaria', 'Alergia a fármacos', 'Asma bronquial', 'Alergias nasales', 'Alergia alimentaria'],
  'Neumólogo': ['EPOC', 'Asma', 'Bronquitis crónica', 'Fibrosis pulmonar', 'Apnea del sueño'],
  'Reumatólogo': ['Artritis reumatoide', 'Lupus', 'Fibromialgia', 'Esclerosis múltiple', 'Espondilitis anquilosante', 'Gota'],
  'Homeópata': ['Tratamientos naturales', 'Enfoque individualizado', 'Manejo de síntomas crónicos'],
  'Neurólogo': ['Epilepsia', 'Migraña', 'Enfermedad de Parkinson', 'Alzheimer', 'Esclerosis múltiple', 'Derrame cerebral'],
  'Oncólogo médico': ['Cáncer de pulmón', 'Leucemia', 'Linfoma', 'Tratamiento con quimioterapia'],
  'Cirujano maxilofacial': ['Diente impactado', 'Prognatismo', 'Traumatismo facial', 'Asimetría facial'],
  'Angiólogo': ['Venas varicosas', 'Insuficiencia venosa', 'Pie Diabético', 'Trombosis venosa profunda', 'Flebitis'],
  'Especialista en Medicina Crítica y Terapia Intensiva': ['Shock séptico', 'Falla multiorgánica', 'Soporte vital', 'Monitoreo crítico'],
  'Geriatra': ['Demencia', 'Delirium', 'Síndrome de caídas', 'Fragilidad en el anciano'],
  'Cirujano oncólogo': ['Cáncer de mama', 'Cáncer colorrectal', 'Cáncer de tiroides', 'Cáncer del estómago'],
  'Proctólogo': ['Hemorroides', 'Fisura anal', 'Absceso anal', 'Fístula anal', 'Prolapso rectal'],
  'Audiólogo': ['Sordera', 'Hipoacusia relacionada con la edad', 'Tinnitus'],
  'Hematólogo': ['Anemia', 'Hemofilia', 'Trombocitopenia', 'Mieloma múltiple', 'Leucemia'],
  'Médico de familia': ['Seguimiento preventivo', 'Control de salud familiar', 'Vacunación'],
  'Infectólogo': ['Coronavirus COVID-19', 'Tuberculosis pulmonar', 'VIH/Sida', 'Hepatitis infecciosa'],
  'Médico estético': ['Cicatrices de acné', 'Envejecimiento cutáneo', 'Reducción de grasa localizada'],
  'Diabetólogo': ['Diabetes tipo 1', 'Diabetes tipo 2', 'Pie diabético'],
  'Acupuntor': ['Alivio del dolor crónico', 'Equilibrio energético', 'Tratamiento de migrañas'],
  'Quiropráctico': ['Alineación de columna', 'Dolor de espalda', 'Ajustes articulares'],
  'Optometrista': ['Graduación de lentes', 'Examen de agudeza visual', 'Detección de problemas de enfoque'],
  'Sexólogo': ['Disfunción eréctil', 'Eyaculación precoz', 'Deseo sexual inhibido', 'Aversión al sexo'],
  'Cirujano cardiovascular y torácico': ['Estenosis aórtica', 'Estenosis mitral', 'Aneurisma de aorta'],
  'Inmunólogo': ['Trastornos por inmunodeficiencia', 'Inmunoterapia', 'Rechazo al trasplante'],
  'Psicopedagogo': ['Trastornos del aprendizaje', 'Dislexia', 'TDAH'],
  'Neurólogo pediatra': ['Autismo', 'Parálisis cerebral', 'Epilepsia infantil', 'TDAH'],
  'Cardiólogo pediátrico': ['Cardiopatía congénita', 'Comunicación interauricular'],
  'Enfermero': ['Cuidado de heridas', 'Administración de medicamentos', 'Monitoreo de signos vitales'],
  'Odontólogo pediatra': ['Dentición', 'Caries en niños', 'Selladores dentales'],
  'Algólogo': ['Dolor oncológico', 'Dolor neuropático', 'Manejo de dolor terminal'],
  'Especialista en Medicina del Deporte': ['Rendimiento físico', 'Prevención de lesiones', 'Traumatismos deportivos'],
  'Ginecólogo oncológico': ['Cáncer del cuello uterino', 'Cáncer de ovario', 'Cáncer endometrial'],
  'Radioterapeuta': ['Tratamiento de tumores con radiación', 'Radioterapia paliativa'],
  'Neumólogo pediatra': ['Asma pediátrico', 'Bronconeumonía infantil'],
  'Urgenciólogo': ['Abdomen agudo', 'Traumatismos graves', 'Infartos'],
  'Endocrinólogo pediátrico': ['Pubertad precoz', 'Diabetes tipo 1 en niños', 'Problemas de crecimiento'],
  'Logopeda': ['Tartamudeo', 'Dislalia', 'Trastornos de la voz'],
  'Genetista': ['Síndrome de Down', 'Enfermedades raras hereditarias', 'Asesoramiento genético'],
  'Cirujano estético y cosmético': ['Rinoplastia estética', 'Liposucción', 'Aumento de busto'],
  'Gastroenterólogo pediátrico': ['Reflujo en bebés', 'Estreñimiento infantil'],
  'Psiquiatra infantil': ['Trastorno del espectro autista', 'Depresión infantil', 'TDAH'],
  'Neurofisiólogo': ['Electroencefalograma', 'Mapeo cerebral', 'Electromiografía'],
  'Cirujano vascular': ['Aneurismas', 'Bypass vascular', 'Angioplastias'],
  'Cirujano bariatra': ['Bypass gástrico', 'Manga gástrica', 'Cirugía para obesidad'],
  'Dermatólogo pediátrico': ['Dermatitis atópica infantil', 'Hemangiomas'],
  'Nefrólogo pediatra': ['Síndrome nefrótico infantil', 'Infección urinaria recurrente en niños'],
  'Analista clínico': ['Pruebas de glucosa', 'Hemogramas', 'Exámenes de orina y heces']
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

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    // Check if valid phone exists (non-empty string)
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Decode URL param
  const decodedSpecialty = decodeURIComponent(params.specialty);

  // Helper to find the matching canonical specialty name
  const getCanonicalSpecialty = (input: string) => {
    const normalizedInput = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const found = COMMON_SPECIALTIES.find(s => 
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedInput
    );
    return found || input;
  };

  const searchTerm = getCanonicalSpecialty(decodedSpecialty);
  const description = SPECIALTY_DESCRIPTIONS[searchTerm] || `Encuentra a los mejores especialistas en ${searchTerm} verificados en México.`;
  const conditions = SPECIALTY_CONDITIONS[searchTerm] || ['Diagnóstico general', 'Tratamiento especializado', 'Seguimiento de padecimientos', 'Consultas preventivas'];

  // SEO
  useEffect(() => {
    if (searchTerm) {
        document.title = `${searchTerm}s en México | MediBusca`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Encuentra a los mejores ${searchTerm.toLowerCase()}s verificados en México. Información sobre padecimientos, tratamientos y contacto directo.`);
    }
  }, [searchTerm]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        const { data } = await supabase
            .from('doctors')
            .select('*')
            .contains('specialties', [searchTerm])
            .range(0, PAGE_SIZE - 1);
            
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.specialty) fetchInitial();
  }, [params.specialty, searchTerm]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
        .from('doctors')
        .select('*')
        .contains('specialties', [searchTerm])
        .range(from, to);

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
  const medicalSpecialtySchema = {
    "@context": "https://schema.org",
    "@type": "MedicalSpecialty",
    "name": searchTerm,
    "description": description,
    "url": `https://medibusca.com/especialidad/${params.specialty}`
  };

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSpecialtySchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <Link href="/especialidades" className="hover:text-[#0071e3] transition-colors">Especialidades</Link>
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{searchTerm}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 capitalize tracking-tight">
            {searchTerm}s En México
          </h1>
          <div className="space-y-1">
             <p className="text-xl md:text-2xl text-[#86868b] font-normal">
               Encuentra al mejor {searchTerm}.
             </p>
             <p className="text-[#86868b] text-base md:text-lg max-w-3xl font-normal leading-relaxed">
               {description}
             </p>
          </div>
        </div>

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
                           <span className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                              {searchTerm}
                           </span>
                           {doc.specialties.filter(s => s !== searchTerm).slice(0, 2).map(s => (
                               <span key={s} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
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
          
          {doctors.length === 0 && (
            <div className="col-span-full py-20 text-center text-[#86868b]">
               <p className="text-lg">No se encontraron doctores para esta especialidad.</p>
               <Link href="/buscar" className="text-[#0071e3] mt-2 inline-block font-medium hover:underline">Buscar otra especialidad</Link>
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

        {/* NEW: SEO / Informational Content Section */}
        <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#d2d2d7]/50 mt-20 animate-in fade-in slide-in-from-bottom-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Intro */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                        Doctores y Especialistas en {searchTerm} | MediBusca
                    </h2>
                    <p className="text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto">
                        La {searchTerm.toLowerCase()} se enfoca en el diagnóstico y manejo de condiciones en este campo médico. MediBusca lista doctores que ejercen de manera independiente, permitiendo a los pacientes conectar directamente con especialistas para recibir orientación y tratamiento.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* What they do */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">¿Qué hace un {searchTerm}?</h3>
                        </div>
                        <p className="text-[#86868b] leading-relaxed">
                            {SPECIALTY_DESCRIPTIONS[searchTerm] || `El ${searchTerm} es el profesional médico dedicado a la prevención, diagnóstico y tratamiento de enfermedades relacionadas con su área de especialización, brindando atención integral a los pacientes.`}
                        </p>
                    </div>

                    {/* Conditions Managed */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                             </div>
                             <h3 className="text-xl font-semibold text-[#1d1d1f]">Padecimientos Tratados</h3>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {conditions.map((condition, i) => (
                                <li key={i} className="flex items-center gap-2 text-[#86868b]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></div>
                                    {condition}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* When to consult & Find Doctors */}
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-[#f5f5f7]">
                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                            <Info className="w-5 h-5 text-[#86868b]" />
                            ¿Cuándo consultar a un especialista?
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                            Los pacientes deben considerar contactar a un especialista si los síntomas persisten, si requieren una segunda opinión experta o si han sido derivados por un médico general para un tratamiento específico.
                        </p>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#1d1d1f] flex items-center gap-2">
                             <Stethoscope className="w-5 h-5 text-[#86868b]" />
                             Encuentra especialistas en {searchTerm}
                        </h3>
                        <p className="text-[#86868b] leading-relaxed text-[15px]">
                             Explora los perfiles de doctores en MediBusca, revisa la información de sus clínicas y conecta directamente con ellos para agendar una consulta o resolver tus dudas.
                        </p>
                     </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900/80">
                        <strong>Aviso Legal:</strong> El contenido mostrado es únicamente informativo y no sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busque el consejo de su médico u otro proveedor de salud calificado.
                    </div>
                </div>

            </div>
        </section>

        {/* SEO Cities Links - Updated Design */}
        <section className="mt-24 pt-12 border-t border-[#d2d2d7]/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Encuentra {searchTerm}s en las principales ciudades de México
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4">
                {POPULAR_CITIES.map((city) => (
                    <Link 
                        key={city}
                        href={`/doctores/${slugify(city)}/${slugify(searchTerm)}`}
                        className="
                            inline-flex items-center px-6 py-4
                            bg-[#f5f5f7] rounded-full
                            text-[#1d1d1f] font-medium text-[15px]
                            hover:bg-[#e8e8ed] transition-colors
                        "
                    >
                        {searchTerm} en {city}
                    </Link>
                ))}
            </div>
        </section>

        {/* Other Popular Specialties in Cities */}
        <section className="mt-16 pt-12 border-t border-[#d2d2d7]/30 pb-12">
            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#86868b]" />
                Búsquedas populares en otras ciudades
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
                {POPULAR_CITIES.slice(0, 6).flatMap((city, cIdx) => 
                    // Pick different specialties for each city to create variety
                    POPULAR_SPECIALTIES.slice((cIdx % 3), (cIdx % 3) + 3).map(spec => ({
                        city,
                        spec
                    }))
                ).map((item, idx) => (
                     <Link 
                        key={idx}
                        href={`/doctores/${slugify(item.city)}/${slugify(item.spec)}`}
                        className="text-[13px] text-[#86868b] hover:text-[#0071e3] hover:underline truncate transition-colors"
                    >
                        {item.spec} en {item.city}
                    </Link>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}