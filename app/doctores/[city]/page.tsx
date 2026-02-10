import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Loader2, Plus, CheckCircle, Phone, User, Stethoscope, ArrowRight, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle } from 'lucide-react';
import { Link } from 'wouter';
import { POPULAR_CITIES, POPULAR_SPECIALTIES as GLOBAL_POPULAR_SPECIALTIES, ALL_CITIES, COMMON_SPECIALTIES } from '../../../lib/constants';

const PAGE_SIZE = 12;
const INITIAL_SPECIALTIES_COUNT = 12;

// Filter Common Specialties to create a local popular list if needed, or just use slice
const LOCAL_POPULAR_SPECIALTIES = COMMON_SPECIALTIES.filter(s => 
  ['Angiólogo', 'Cardiólogo', 'Dermatólogo', 'Ginecólogo', 'Pediatra', 'Traumatólogo', 'Cirujano Plástico', 'Médico General'].includes(s)
).concat(COMMON_SPECIALTIES.slice(0, 20)).filter((v, i, a) => a.indexOf(v) === i).sort();

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const getCanonicalCity = (slug: string) => {
  return ALL_CITIES.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

const CITY_MEDICAL_ZONES: Record<string, { title: string, description: string }[]> = {
  'acapulco': [
    { title: 'Avenida Cuauhtémoc', description: 'Corredor principal con una alta concentración de clínicas privadas y hospitales generales.' },
    { title: 'Costera Miguel Alemán', description: 'Zona con servicios médicos orientados al turismo y especialidades diversas.' }
  ],
  'aguascalientes': [
    { title: 'Zona Norte / Campestre', description: 'Área moderna con hospitales de prestigio y centros de alta especialidad.' },
    { title: 'Zona Centro', description: 'Concentración histórica de consultorios privados y laboratorios clínicos.' }
  ],
  'apizaco': [
    { title: 'Zona Centro y Ferrocarrilera', description: 'Punto de referencia para servicios médicos generales en la región de Tlaxcala.' }
  ],
  'apodaca': [
    { title: 'Centro de Apodaca', description: 'Centros de medicina familiar y clínicas de atención primaria accesibles.' },
    { title: 'Zona Industrial / Miguel Alemán', description: 'Atención especializada en medicina del trabajo y urgencias.' }
  ],
  'baja-california': [
    { title: 'Zona Río (Tijuana)', description: 'El centro más importante de turismo médico en el país con tecnología de punta.' },
    { title: 'Centro Cívico (Mexicali)', description: 'Distrito administrativo y de salud con importantes hospitales estatales.' }
  ],
  'baja-california-sur': [
    { title: 'Distrito La Paz Centro', description: 'Sede de los principales hospitales generales y de especialidades del estado.' },
    { title: 'Corredor Médico Cabo San Lucas', description: 'Servicios internacionales de alta gama orientados a residentes y turistas.' }
  ],
  'benito-juarez': [
    { title: 'Colonia Del Valle', description: 'Zona residencial con una de las mayores densidades de consultorios privados en la capital.' },
    { title: 'Nápoles y Mixcoac', description: 'Clínicas modernas y especialistas de reconocido prestigio.' }
  ],
  'buenavista': [
    { title: 'Eje Guerrero', description: 'Acceso a importantes centros de salud pública y clínicas de primer contacto.' }
  ],
  'cabo-san-lucas': [
    { title: 'Centro y Marina', description: 'Clínicas privadas con atención bilingüe y servicios de urgencias 24/7.' }
  ],
  'cadereyta-jimenez': [
    { title: 'Zona Centro', description: 'Servicios de salud locales enfocados en atención general y ginecología.' }
  ],
  'campeche': [
    { title: 'Avenida Lázaro Cárdenas', description: 'Ubicación de los principales hospitales estatales y centros de diagnóstico.' }
  ],
  'cancun': [
    { title: 'Centro - Avenida Tulum', description: 'Hub de salud local con hospitales generales y laboratorios.' },
    { title: 'Zona Hotelera', description: 'Centros médicos de lujo enfocados en atención internacional y urgencias.' }
  ],
  'chalco': [
    { title: 'Centro de Chalco', description: 'Alta disponibilidad de farmacias con consultorio y clínicas de especialidades básicas.' }
  ],
  'chiapas': [
    { title: 'Zona de Hospitales (Tuxtla Gutiérrez)', description: 'Área de referencia regional con institutos de especialidades pediátricas y generales.' }
  ],
  'chicoloapan': [
    { title: 'Cabecera Municipal', description: 'Centros de salud comunitaria y servicios médicos de primer nivel.' }
  ],
  'chihuahua': [
    { title: 'Distrito Uno / Periférico de la Juventud', description: 'Zona médica de vanguardia con hospitales privados de clase mundial.' },
    { title: 'Zona Centro', description: 'Tradición médica con clínicas de larga trayectoria y laboratorios.' }
  ],
  'chilpancingo': [
    { title: 'Avenida Lázaro Cárdenas', description: 'Concentración de servicios estatales de salud y clínicas de especialistas.' }
  ],
  'chimalhuacan': [
    { title: 'Zona de Hospitales San Agustín', description: 'Clúster de salud pública que atiende a la zona oriente del Estado de México.' }
  ],
  'ciudad-acuna': [
    { title: 'Zona Centro y Frontera', description: 'Servicios médicos con alto flujo de pacientes internacionales.' }
  ],
  'ciudad-apodaca': [
    { title: 'Concordia', description: 'Área de rápido crecimiento con nuevas clínicas y centros de diagnóstico.' }
  ],
  'ciudad-benito-juarez': [
    { title: 'Centro de Juárez', description: 'Atención médica comunitaria y clínicas de medicina familiar.' }
  ],
  'ciudad-de-mexico': [
    { title: 'Roma - Condesa', description: 'Consultorios modernos y accesibles en el corazón de la ciudad.' },
    { title: 'Zona de Hospitales Tlalpan', description: 'Área de referencia con institutos nacionales de salud.' },
    { title: 'Polanco', description: 'Servicios médicos exclusivos y tecnología avanzada.' }
  ],
  'ciudad-del-carmen': [
    { title: 'Colonia Petrolera', description: 'Zona con hospitales especializados en atención para el sector energético y general.' }
  ],
  'ciudad-juarez': [
    { title: 'Zona PRONAF', description: 'Reconocida por su infraestructura dedicada al turismo médico y cirugía estética.' },
    { title: 'Misiones / Paseo de la Victoria', description: 'Hospitales modernos con especialistas certificados.' }
  ],
  'ciudad-lopez-mateos': [
    { title: 'Atizapán Centro', description: 'Clínicas generales y hospitales regionales de alta afluencia.' }
  ],
  'ciudad-madero': [
    { title: 'Zona Centro y Playa', description: 'Servicios médicos integrados a la zona metropolitana de Tampico.' }
  ],
  'ciudad-nicolas-romero': [
    { title: 'Libertad', description: 'Centros médicos locales y consultorios de especialidades básicas.' }
  ],
  'ciudad-obregon': [
    { title: 'Zona Norte', description: 'Clúster médico importante con hospitales de especialidades y oncología.' }
  ],
  'ciudad-victoria': [
    { title: 'Fraccionamiento San José', description: 'Ubicación de hospitales generales y centros de salud de alta capacidad.' }
  ],
  'coahuila': [
    { title: 'Centro Médico (Saltillo)', description: 'Concentración de los principales especialistas del estado.' },
    { title: 'Zona Norte (Torreón)', description: 'Hospitales modernos con cobertura regional en La Laguna.' }
  ],
  'coatzacoalcos': [
    { title: 'Colonia Centro', description: 'Servicios médicos consolidados con hospitales regionales y privados.' }
  ],
  'colima': [
    { title: 'Tercer Anillo Periférico', description: 'Zona de expansión con hospitales nuevos y centros especializados.' }
  ],
  'coyoacan': [
    { title: 'Zona de Hospitales / San Ángel', description: 'Área colindante con importantes centros de traumatología y neurología.' },
    { title: 'Coyoacán Centro', description: 'Clínicas boutique y especialistas en medicina alternativa y general.' }
  ],
  'cuautitlan-izcalli': [
    { title: 'Centro Urbano', description: 'Gran oferta de clínicas privadas y hospitales de mediana complejidad.' }
  ],
  'cuautla': [
    { title: 'Zona Centro', description: 'Punto central de salud para la zona oriente del estado de Morelos.' }
  ],
  'cuauhtemoc': [
    { title: 'Colonia Doctores', description: 'Sede del Centro Médico Nacional y el Hospital General de México.' },
    { title: 'Juárez / Cuauhtémoc', description: 'Clínicas privadas de alta gama sobre el corredor Reforma.' }
  ],
  'cuernavaca': [
    { title: 'Lomas de Cortés', description: 'Zona residencial con hospitales privados de alto nivel.' },
    { title: 'Avenida Plan de Ayala', description: 'Corredor principal con alta densidad de laboratorios y especialistas.' }
  ],
  'culiacan': [
    { title: 'Zona Tres Ríos', description: 'Modernos complejos médicos y torres de consultorios de especialidades.' },
    { title: 'Centro / Humaya', description: 'Hospitales con larga tradición y servicios de urgencias.' }
  ],
  'durango': [
    { title: 'Zona de Hospitales (Centro)', description: 'Ubicación de los centros estatales de salud y oncología.' }
  ],
  'ecatepec-de-morelos': [
    { title: 'Avenida Central / Las Américas', description: 'Clúster de salud moderno con centros comerciales y hospitalarios integrados.' },
    { title: 'San Cristóbal Centro', description: 'Servicios médicos tradicionales y hospitales de zona.' }
  ],
  'ensenada': [
    { title: 'Zona Centro', description: 'Hospitales con servicios especializados para la comunidad local y extranjera.' }
  ],
  'estado-de-mexico': [
    { title: 'Zona Esmeralda (Atizapán)', description: 'Servicios de salud exclusivos de alta gama.' },
    { title: 'Metepec (Toluca)', description: 'Zona moderna con hospitales de especialidades certificados.' }
  ],
  'fresnillo': [
    { title: 'Zona Centro', description: 'Principales servicios médicos para la región minera del estado.' }
  ],
  'garcia': [
    { title: 'Mitras Poniente', description: 'Zona de crecimiento habitacional con servicios médicos de primer contacto.' }
  ],
  'general-escobedo': [
    { title: 'Nexxus', description: 'Complejo médico moderno que atiende al norte de la zona metropolitana de Monterrey.' }
  ],
  'gomez-palacio': [
    { title: 'Zona Centro', description: 'Servicios de salud integrados a la red médica de la Comarca Lagunera.' }
  ],
  'guadalajara': [
    { title: 'Puerta de Hierro', description: 'Reconocida por sus hospitales de alta especialidad.' },
    { title: 'Providencia y Country Club', description: 'Cuenta con clínicas de vanguardia con fácil acceso.' },
    { title: 'Zona Centro y Chapultepec', description: 'Amplia gama de médicos generales y especialistas con gran experiencia.' }
  ],
  'guadalupe': [
    { title: 'Lindavista / Eloy Cavazos', description: 'Corredores con hospitales privados y clínicas de medicina familiar.' }
  ],
  'guanajuato': [
    { title: 'Noria Alta / Marfil', description: 'Zonas con clínicas privadas y hospitales estatales de referencia.' }
  ],
  'guaymas': [
    { title: 'Zona Centro', description: 'Servicios médicos costeros con atención a residentes y sector marítimo.' }
  ],
  'guerrero': [
    { title: 'Acapulco Diamante', description: 'Atención médica de nivel premium y servicios de emergencia.' }
  ],
  'gustavo-a-madero': [
    { title: 'Lindavista', description: 'Importante centro médico con hospitales públicos y privados de alta capacidad.' }
  ],
  'hermosillo': [
    { title: 'Proyecto Río Sonora', description: 'El distrito médico más moderno del estado con tecnología avanzada.' },
    { title: 'Centro', description: 'Clínicas tradicionales y especialistas con amplia trayectoria.' }
  ],
  'hidalgo': [
    { title: 'Pachuca - Zona Plateada', description: 'Área moderna con hospitales de especialidad y servicios exclusivos.' }
  ],
  'huixquilucan': [
    { title: 'Interlomas', description: 'Servicios médicos de élite y hospitales de prestigio internacional.' }
  ],
  'irapuato': [
    { title: 'Villas de Irapuato / Paseo de la Solidaridad', description: 'Zonas con hospitales privados de alto nivel y centros de diagnóstico.' }
  ],
  'ixtacalco': [
    { title: 'Santa Anita / Viaducto', description: 'Clínicas de atención primaria y especialistas locales.' }
  ],
  'ixtapaluca': [
    { title: 'Zona de Hospitales (Alta Especialidad)', description: 'Referencia regional para tratamientos complejos en el oriente.' }
  ],
  'iztapalapa': [
    { title: 'Ermita Iztapalapa', description: 'Corredor con hospitales generales y una vasta oferta de servicios dentales y de diagnóstico.' }
  ],
  'jalisco': [
    { title: 'Zapopan / Puerta de Hierro', description: 'Epicentro de la medicina privada en el occidente de México.' }
  ],
  'jiutepec': [
    { title: 'Tejalpa', description: 'Centros médicos industriales y de atención general.' }
  ],
  'juriquilla': [
    { title: 'Santa Rosa / Juriquilla Centro', description: 'Clínicas de alta especialidad en una de las zonas más exclusivas de Querétaro.' }
  ],
  'la-paz': [
    { title: 'Malecón / Centro', description: 'Servicios médicos generales con vista al mar y atención al turista.' }
  ],
  'la-piedad': [
    { title: 'Centro de la Piedad', description: 'Atención médica regional que sirve a Michoacán, Jalisco y Guanajuato.' }
  ],
  'leon': [
    { title: 'Zona Campestre / Cerro Gordo', description: 'Hospitales de clase mundial y centros de investigación médica.' },
    { title: 'Centro Historico / Madero', description: 'Larga tradición médica con especialistas reconocidos.' }
  ],
  'linares': [
    { title: 'Zona Centro', description: 'Servicios de salud principales para la región citrícola.' }
  ],
  'magdalena-contreras': [
    { title: 'San Jerónimo', description: 'Zona residencial con hospitales privados de alta calidad.' }
  ],
  'manzanillo': [
    { title: 'Zona Turística / Playa Azul', description: 'Clínicas privadas con atención especializada en medicina subacuática y urgencias.' }
  ],
  'matamoros': [
    { title: 'Zona Frontera / Centro', description: 'Servicios de salud con fuerte demanda internacional.' }
  ],
  'mazatlan': [
    { title: 'Marina Mazatlán', description: 'Hospitales nuevos con servicios internacionales.' },
    { title: 'Centro Histórico', description: 'Clínicas consolidadas y médicos especialistas.' }
  ],
  'metepec': [
    { title: 'Providencia / Av. Tecnológico', description: 'Clúster médico de alta gama con hospitales de reciente creación.' }
  ],
  'merida': [
    { title: 'Altabrisa', description: 'Zona de hospitales de alta especialidad y centros comerciales médicos.' },
    { title: 'Zona Norte / Montejo', description: 'Clínicas privadas de prestigio y estética.' }
  ],
  'mexicali': [
    { title: 'Zona Médica (Frontera)', description: 'Dedicada casi exclusivamente al turismo médico internacional.' }
  ],
  'michoacan': [
    { title: 'Tres Marías (Morelia)', description: 'Nueva zona de desarrollo médico con hospitales de vanguardia.' }
  ],
  'minatitlan': [
    { title: 'Colonia Petrolera', description: 'Servicios de salud especializados para el sector industrial.' }
  ],
  'miramar': [
    { title: 'Zona Costera', description: 'Servicios de salud generales integrados a la zona metropolitana.' }
  ],
  'monclova': [
    { title: 'Zona Centro', description: 'Infraestructura hospitalaria clave para la región centro de Coahuila.' }
  ],
  'monterrey': [
    { title: 'San Pedro Garza García', description: 'Hospitales de clase mundial y especialistas certificados.' },
    { title: 'Zona Obispado', description: 'Tradición médica con alta concentración de clínicas.' },
    { title: 'Centro', description: 'Accesibilidad a servicios de salud generales y especializados.' }
  ],
  'morelia': [
    { title: 'Las Américas', description: 'Clínicas modernas y especialistas de alto nivel.' },
    { title: 'Bosque Camelinas', description: 'Zona tradicional con hospitales privados consolidados.' }
  ],
  'morelos': [
    { title: 'Cuernavaca Norte', description: 'Clima ideal y servicios médicos de primer nivel.' }
  ],
  'naucalpan': [
    { title: 'Ciudad Satélite', description: 'Hub médico principal del norte del Estado de México con hospitales icónicos.' },
    { title: 'Lomas Verdes', description: 'Especialización reconocida en traumatología y ortopedia.' }
  ],
  'nayarit': [
    { title: 'Tepic Ciudad Valle', description: 'Principal centro de salud del estado con hospitales generales.' }
  ],
  'nezahualcoyotl': [
    { title: 'Ciudad Neza Centro', description: 'Vasta red de consultorios privados y laboratorios clínicos.' }
  ],
  'nogales': [
    { title: 'Zona Fronteriza', description: 'Servicios médicos enfocados en atención binacional.' }
  ],
  'nuevo-casas-grandes': [
    { title: 'Zona Centro', description: 'Servicios médicos generales para la zona noroeste de Chihuahua.' }
  ],
  'nuevo-laredo': [
    { title: 'Distrito Médico (Frontera)', description: 'Especialización en servicios dentales y quirúrgicos para el extranjero.' }
  ],
  'nuevo-leon': [
    { title: 'Distrito Tec / Obispado', description: 'Corazón educativo y médico del norte de México.' }
  ],
  'oaxaca': [
    { title: 'Colonia Reforma', description: 'Zona con los hospitales privados más importantes y consultorios especializados.' }
  ],
  'ojo-de-agua': [
    { title: 'Boulevard Ojo de Agua', description: 'Clínicas locales y servicios de salud comunitaria.' }
  ],
  'pachuca': [
    { title: 'San Javier', description: 'Zona residencial con hospitales de especialidades y clínicas modernas.' }
  ],
  'poza-rica': [
    { title: 'Colonia Obrera', description: 'Histórico centro de servicios médicos para el norte de Veracruz.' }
  ],
  'puebla': [
    { title: 'Angelópolis', description: 'Zona moderna con hospitales privados de alto nivel.' },
    { title: 'Zona Esmeralda', description: 'Clínicas especializadas y consultorios privados.' }
  ],
  'puerto-vallarta': [
    { title: 'Marina Vallarta', description: 'Atención internacional con certificaciones extranjeras.' },
    { title: 'Centro / Emiliano Zapata', description: 'Servicios médicos accesibles para locales y residentes.' }
  ],
  'queretaro': [
    { title: 'Centro Sur', description: 'Nueva zona de hospitales inteligentes y corporativos médicos.' },
    { title: 'Juriquilla', description: 'Servicios exclusivos de salud en el norte de la ciudad.' }
  ],
  'quintana-roo': [
    { title: 'Playa del Carmen / Riviera Maya', description: 'Medicina hiperbárica y urgencias de clase mundial.' }
  ],
  'reynosa': [
    { title: 'Zona Centro / Puente Internacional', description: 'Especialización en turismo de salud y farmacia.' }
  ],
  'salamanca': [
    { title: 'Zona Centro', description: 'Atención médica vinculada al sector energético y general.' }
  ],
  'saltillo': [
    { title: 'Zona Norte / Venustiano Carranza', description: 'Corredor médico con infraestructura de alta especialidad.' }
  ],
  'san-cristobal': [
    { title: 'Barrio de Guadalupe', description: 'Clínicas privadas que conservan la estética colonial con servicios modernos.' }
  ],
  'san-francisco-coacalco': [
    { title: 'Vía López Portillo', description: 'Corredor con múltiples opciones de clínicas y centros de salud.' }
  ],
  'san-juan-del-rio': [
    { title: 'Zona Centro', description: 'Servicios de salud de referencia para el sur de Querétaro.' }
  ],
  'san-luis-potosi': [
    { title: 'Lomas (I a IV Sección)', description: 'Hospitales privados líderes y torres de consultorios.' },
    { title: 'Zona Universitaria', description: 'Centros hospitalarios de alta tradición y enseñanza.' }
  ],
  'san-luis-rio-colorado': [
    { title: 'Zona Fronteriza', description: 'Servicios dentales y ópticos altamente competitivos.' }
  ],
  'san-nicolas': [
    { title: 'Anáhuac', description: 'Zona con hospitales generales y servicios de medicina del deporte.' }
  ],
  'san-pablo-de-las-salinas': [
    { title: 'Zona Centro', description: 'Centros médicos locales y servicios de atención primaria.' }
  ],
  'san-pedro-garza-garcia': [
    { title: 'Valle del Campestre', description: 'La zona de salud más exclusiva de México con hospitales de primer orden.' }
  ],
  'santa-catarina': [
    { title: 'La Fama / Centro', description: 'Atención médica general y clínicas de rehabilitación.' }
  ],
  'sinaloa': [
    { title: 'Mazatlán Marina / Culiacán Tres Ríos', description: 'Polos de salud con tecnología de última generación.' }
  ],
  'soledad': [
    { title: 'Acceso Norte', description: 'Clínicas de atención rápida y servicios médicos integrados a SLP.' }
  ],
  'sonora': [
    { title: 'Puerto Peñasco / Hermosillo Río', description: 'Referencia en salud para el noroeste de México.' }
  ],
  'tabasco': [
    { title: 'Tabasco 2000 (Villahermosa)', description: 'Zona ejecutiva con los mejores hospitales privados del estado.' }
  ],
  'tamaulipas': [
    { title: 'Tampico Zona Dorada', description: 'Concentración de los mejores especialistas del sur del estado.' }
  ],
  'tapachula': [
    { title: 'Zona Centro', description: 'Referencia médica para la región del Soconusco y frontera sur.' }
  ],
  'tehuacan': [
    { title: 'Centro de Tehuacán', description: 'Servicios médicos de especialidad para el sur de Puebla.' }
  ],
  'tepic': [
    { title: 'San Juan', description: 'Zona con hospitales estatales y clínicas privadas modernas.' }
  ],
  'tijuana': [
    { title: 'Zona Río', description: 'El clúster de turismo médico más grande del mundo.' },
    { title: 'Playas de Tijuana', description: 'Centros de salud holísticos y clínicas de recuperación.' }
  ],
  'tlalnepantla': [
    { title: 'Centro / Tlalnepantla', description: 'Hospitales de zona con gran capacidad de atención.' }
  ],
  'tlalpan': [
    { title: 'Zona de Institutos', description: 'Sede de los Institutos Nacionales de Salud (Nutrición, Cardiología, etc.).' }
  ],
  'tlaquepaque': [
    { title: 'Centro / El Álamo', description: 'Clínicas de medicina general y servicios de especialidad.' }
  ],
  'toluca': [
    { title: 'Colonia Universidad', description: 'Zona con hospitales de alta especialidad y centros de diagnóstico.' }
  ],
  'tonala': [
    { title: 'Centro de Tonalá', description: 'Servicios médicos de primer contacto y clínicas locales.' }
  ],
  'torreon': [
    { title: 'Torreón Jardín', description: 'Zona residencial con hospitales privados tradicionales y modernos.' }
  ],
  'tuxtla-gutierrez': [
    { title: 'Paso Limón / Zona de Hospitales', description: 'Concentración de salud pública y privada del estado.' }
  ],
  'uruapan': [
    { title: 'Zona Centro', description: 'Servicios de salud especializados para la región aguacatera.' }
  ],
  'veracruz': [
    { title: 'Boca del Río', description: 'Zona de hospitales modernos y torres médicas con vista al mar.' },
    { title: 'Puerto Centro', description: 'Clínicas con larga historia y especialistas de renombre.' }
  ],
  'villahermosa': [
    { title: 'Altabrisa Villahermosa', description: 'Clúster médico moderno con hospitales de alta gama.' }
  ],
  'xalapa': [
    { title: 'Zona Centro / Ánimas', description: 'Concentración de especialistas en un entorno académico y profesional.' }
  ],
  'yucatan': [
    { title: 'Mérida Norte', description: 'Referencia médica absoluta para todo el sureste de México.' }
  ],
  'zacatecas': [
    { title: 'Bernárdez', description: 'Zona residencial con hospitales privados de alto nivel.' }
  ],
  'zamora': [
    { title: 'Zona Centro', description: 'Atención médica de especialidad para el occidente de Michoacán.' }
  ],
  'zapopan': [
    { title: 'Puerta de Hierro / Real de Acueducto', description: 'Infraestructura hospitalaria de lujo y ultra-especializada.' }
  ],
  'zapotlanejo': [
    { title: 'Zona Centro', description: 'Servicios de salud locales y regionales.' }
  ]
};

export default function CityPage({ params }: { params: { city: string } }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  const cityName = getCanonicalCity(params.city);
  const citySlug = params.city;
  const medicalZones = CITY_MEDICAL_ZONES[citySlug] || [];

  // FAQs for SEO
  const faqs = [
    {
      question: `¿Cómo puedo contactar a un doctor en ${cityName} a través de MediBusca?`,
      answer: "Es muy sencillo. Solo elige un especialista, revisa su perfil verificado y utiliza el botón de 'Llamar' para comunicarte directamente con su consultorio. No necesitas crear una cuenta ni realizar pagos adicionales por el uso de la plataforma."
    },
    {
      question: "¿MediBusca cobra alguna comisión por agendar una cita?",
      answer: "No. MediBusca es una plataforma informativa 100% gratuita para los pacientes. La relación es directa entre tú y el doctor; nosotros solo facilitamos la conexión segura."
    },
    {
      question: `¿Qué tipos de especialistas médicos puedo encontrar en ${cityName}?`,
      answer: `Contamos con una extensa red que incluye cardiólogos, ginecólogos, pediatras, psicólogos y más, ubicados en las zonas médicas más importantes de ${cityName}.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  // SEO
  useEffect(() => {
    if (cityName) {
        document.title = `Doctores en ${cityName} | MediBusca`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', `Encuentra los mejores doctores y especialistas en ${cityName} sin intermediarios. Revisa perfiles verificados y contacta directamente.`);
    }
  }, [cityName]);

  useEffect(() => {
    async function fetchInitial() {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        setDoctors([]);

        const { data } = await supabase
            .from('doctors')
            .select('*')
            .contains('cities', [cityName])
            .range(0, PAGE_SIZE - 1);
        
        if (data) {
            setDoctors(sortDoctorsByPhone(data as Doctor[]));
            if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
    }
    if (params.city) fetchInitial();
  }, [params.city, cityName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
        .from('doctors')
        .select('*')
        .contains('cities', [cityName])
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

  const displayedSpecialties = showAllSpecialties 
    ? COMMON_SPECIALTIES 
    : COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

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
        "name": `Doctores en ${cityName}`,
        "item": `https://medibusca.com/doctores/${citySlug}`
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `Doctores en ${cityName} | MediBusca`,
    "description": `Encuentra los mejores doctores y especialistas en ${cityName} sin intermediarios. Revisa perfiles verificados y contacta directamente.`,
    "url": `https://medibusca.com/doctores/${citySlug}`,
    "contentLocation": {
        "@type": "City",
        "name": cityName
    },
    "audience": {
        "@type": "Patient",
        "geographicArea": {
            "@type": "Country",
            "name": "Mexico"
        }
    }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Doctores en ${cityName}`,
    "itemListElement": doctors.map((doc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://medibusca.com/medico/${doc.slug}`,
      "name": doc.full_name
    }))
  };

  if (loading) {
    return <div className="flex justify-center py-20 min-h-screen bg-[#f5f5f7]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Schema Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {doctors.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-[#86868b] mb-8 flex items-center animate-in fade-in slide-in-from-bottom-1">
            <Link href="/" className="hover:text-[#0071e3] transition-colors">Inicio</Link> 
            <span className="mx-2 text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] capitalize">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">
            Doctores en {cityName}
            </h1>
            <p className="text-xl text-[#86868b] font-normal max-w-3xl leading-relaxed">
            Explora los mejores especialistas médicos verificados en {cityName}. Agenda tu cita hoy mismo.
            </p>
        </div>

        {/* Doctor Grid (Consistent Design) */}
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
                                <span key={s} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] md:text-xs font-bold rounded-lg uppercase tracking-wide">
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#86868b]">
                            <MapPin className="w-4 h-4 text-[#86868b]/70" /> 
                            {cityName}
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
                <div className="col-span-full py-20 text-center">
                    <p className="text-[#86868b] text-lg">No hay doctores registrados en esta ciudad aún.</p>
                </div>
            )}
        </div>

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
      </div>

      {/* NEW: Specialties in {City} */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                Especialidades médicas en {cityName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayedSpecialties.map((spec) => (
                    <Link 
                        key={spec} 
                        href={`/doctores/${citySlug}/${slugify(spec)}`}
                        className="
                           group flex flex-col items-center justify-center p-6
                           bg-[#f5f5f7] rounded-2xl hover:bg-[#0071e3] hover:text-white
                           transition-all duration-300 text-center cursor-pointer min-h-[80px]
                        "
                    >
                        <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-white transition-colors">
                            {spec}
                        </span>
                    </Link>
                ))}
            </div>

            {!showAllSpecialties && (
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => setShowAllSpecialties(true)}
                        className="
                            inline-flex items-center gap-2 px-6 py-2.5 
                            bg-white border border-slate-200 rounded-full 
                            text-sm font-medium text-[#1d1d1f] 
                            hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-[#0071e3]/5
                            transition-all duration-300 shadow-sm
                        "
                    >
                        Ver todas las especialidades
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </section>

      {/* NEW: Informational Sections (Transparency & How) */}
      <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            
            {/* Mission / Transparency */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Encuentra Especialistas en {cityName} sin Costo</h2>
                </div>
                <div className="prose text-[#86868b] leading-relaxed">
                    <p className="font-medium text-[#1d1d1f] mb-3">
                        Sin intermediarios ni comisiones ocultas.
                    </p>
                    <p>
                        En MediBusca, nuestra misión es facilitar el acceso a la salud. No somos una plataforma de reservas ni cobramos por agendar. Ofrecemos un directorio verificado de doctores en {cityName} para que puedas contactarlos directamente por teléfono o a través de su perfil profesional. 
                    </p>
                    <p className="mt-4">
                        Información transparente, gratuita y actualizada para tu bienestar.
                    </p>
                </div>
            </div>

            {/* How to find a doctor */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Cómo encontrar doctor en {cityName}</h2>
                </div>
                <ul className="space-y-4">
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f] Selecciona la especialidad">Selecciona la especialidad</h3>
                            <p className="text-sm text-[#86868b] mt-1">Usa nuestros filtros para encontrar cardiólogos, pediatras o cualquier especialista que necesites en {cityName}.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Revisa perfiles verificados</h3>
                            <p className="text-sm text-[#86868b] mt-1">Consulta la experiencia, cédulas profesionales y ubicaciones de consultorios de cada doctor.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                            <h3 className="font-semibold text-[#1d1d1f]">Contacta directamente</h3>
                            <p className="text-sm text-[#86868b] mt-1">Llama directamente al consultorio desde MediBusca para agendar tu cita sin intermediarios.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* NEW: Medical Zones Section */}
      {medicalZones.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Zonas médicas destacadas en {cityName}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {medicalZones.map((zone, idx) => (
                        <div key={idx} className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100 hover:border-[#0071e3]/20 transition-colors">
                            <h3 className="font-bold text-[#1d1d1f] text-lg mb-2">{zone.title}</h3>
                            <p className="text-[#86868b] text-sm leading-relaxed">{zone.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* NEW: FAQ Section (Rich Snippets) */}
      <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8 justify-center">
                <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f]">Preguntas Frecuentes</h2>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-3">{faq.question}</h3>
                        <p className="text-[#86868b] leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SEO & Other Cities Footer */}
      <section className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
            
            {/* Other Cities */}
            <div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#86868b]" />
                    Explora doctores en otras ciudades populares
                </h3>
                <div className="flex flex-wrap gap-3">
                    {POPULAR_CITIES.filter(c => slugify(c) !== citySlug).map((city) => (
                        <Link 
                            key={city}
                            href={`/doctores/${slugify(city)}`}
                            className="
                                group flex items-center gap-2 px-5 py-2.5 
                                bg-white border border-slate-200 rounded-full 
                                text-[#1d1d1f] font-medium text-sm 
                                hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-[#0071e3]/5
                                transition-all duration-300
                            "
                        >
                            {city}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Searches SEO Text Links */}
            <div>
                 <h3 className="text-xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                    Búsquedas populares en {cityName}
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-3">
                    {GLOBAL_POPULAR_SPECIALTIES.map((spec, idx) => (
                        <Link 
                            key={idx}
                            href={`/doctores/${citySlug}/${slugify(spec)}`}
                            className="flex items-center gap-2 text-[14px] md:text-[13px] text-[#0066cc] bg-[#f5f5f7] px-3 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors group"
                        >
                          <Search className="w-3.5 h-3.5 text-[#86868b] group-hover:text-[#0066cc] transition-colors" />
                          <span>{spec} en {cityName}</span>  
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}