
import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Doctor } from '../../../types';
import { MapPin, Search, ShieldCheck, HeartPulse, ChevronDown, Building, HelpCircle, ArrowRight, Ambulance, Bus, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { POPULAR_CITIES, POPULAR_SPECIALTIES as GLOBAL_POPULAR_SPECIALTIES, ALL_CITIES, COMMON_SPECIALTIES, CITY_HEALTH_DATA, POPULAR_SPECIALTIES } from '../../../lib/constants';
import CityDoctorList from '../../../components/CityDoctorList';


export const revalidate = 86400;
const PAGE_SIZE = 12;
const INITIAL_SPECIALTIES_COUNT = 12;

// --- Constants & Helpers ---

const CITY_MEDICAL_ZONES: Record<string, { title: string, description: string }[]> = {
  'acapulco': [
    { title: 'Avenida Cuauhtémoc', description: 'Corredor principal con una alta concentración de clínicas privadas y hospitales generales.' },
    { title: 'Costera Miguel Alemán', description: 'Zona con servicios médicos orientados al turismo y especialidades diversas.' }
  ],
  'aguascalientes': [
    { title: 'Zona Norte', description: 'Área moderna con hospitales privados de vanguardia y clínicas de especialidades médicas.' },
    { title: 'Centro', description: 'Concentración de laboratorios, consultorios tradicionales y clínicas de atención primaria.' }
  ],
  'apizaco': [
    { title: 'Corredor Médico Centro', description: 'Vías céntricas que agrupan los principales consultorios, farmacias y clínicas locales.' }
  ],
  'apodaca': [
    { title: 'Zona Industrial', description: 'Clínicas de medicina laboral y atención de urgencias para el sector industrial.' },
    { title: 'Centro', description: 'Clínicas familiares y servicios de atención primaria para residentes locales.' }
  ],
  'baja-california-sur': [
    { title: 'Corredor Turístico', description: 'Infraestructura médica bilingüe enfocada en urgencias y turismo médico.' },
    { title: 'Distrito Médico Estatal', description: 'Hospitales generales y centros de salud públicos de referencia estatal.' }
  ],
  'benito-juarez': [
    { title: 'Del Valle - Narvarte', description: 'Alta densidad de hospitales privados, clínicas especializadas y torres médicas.' },
    { title: 'Nápoles', description: 'Clínicas de cirugía plástica, odontología y consultorios particulares de prestigio.' }
  ],
  'buenavista': [
    { title: 'Zona Hospitalaria Central', description: 'Área con hospitales públicos de especialidades y alta afluencia de pacientes.' }
  ],
  'cabo-san-lucas': [
    { title: 'Zona Turística', description: 'Hospitales privados con certificación internacional orientados al turismo médico.' },
    { title: 'Centro', description: 'Clínicas locales y servicios de atención primaria y urgencias.' }
  ],
  'cadereyta-jimenez': [
    { title: 'Zona Centro', description: 'Área principal de atención con clínicas familiares y medicina general.' }
  ],
  'campeche': [
    { title: 'Barrio de San Román', description: 'Sector tradicional con presencia de clínicas privadas y consultorios.' },
    { title: 'Zona Institucional', description: 'Área que concentra los principales hospitales públicos y de gobierno.' }
  ],
  'cancun': [
    { title: 'Supermanzana 20 y Centro', description: 'Concentración de hospitales privados, laboratorios y atención especializada.' },
    { title: 'Zona Hotelera', description: 'Clínicas de urgencias y consultorios orientados al turismo internacional.' }
  ],
  'chalco': [
    { title: 'Corredor Solidaridad', description: 'Clínicas de atención general y hospitales regionales para la población del oriente.' }
  ],
  'chiapas': [
    { title: 'Red Hospitalaria Tuxtla', description: 'Concentración de especialidades médicas y atención de tercer nivel en la capital.' },
    { title: 'Zona Altos', description: 'Clínicas comunitarias y hospitales de atención general y medicina preventiva.' }
  ],
  'chicoloapan': [
    { title: 'Cabecera Municipal', description: 'Clínicas de primer nivel, consultorios médicos y atención materno-infantil.' }
  ],
  'chihuahua': [
    { title: 'Distrito Uno / Periférico', description: 'Zona moderna con hospitales privados y complejos médicos de alta especialidad.' },
    { title: 'Zona Centro', description: 'Hospitales tradicionales y gran cantidad de laboratorios clínicos.' }
  ],
  'chilpancingo': [
    { title: 'Corredor Salud', description: 'Concentración de instituciones de salud pública, hospitales generales y consultorios.' }
  ],
  'chimalhuacan': [
    { title: 'Avenida del Peñón', description: 'Área con unidades médicas de atención básica, urgencias y clínicas privadas.' }
  ],
  'ciudad-acuna': [
    { title: 'Zona Fronteriza', description: 'Clínicas dentales y servicios de salud orientados a pacientes transfronterizos.' }
  ],
  'ciudad-benito-juarez': [
    { title: 'Centro Médico Local', description: 'Clínicas de atención primaria y centros de salud para la creciente población.' }
  ],
  'ciudad-de-mexico': [
    { title: 'Zona de Hospitales Tlalpan', description: 'El clúster médico más importante del país con institutos nacionales de salud y especialidades.' },
    { title: 'Roma - Condesa', description: 'Hospitales privados de tradición, clínicas boutique y múltiples consultorios de especialidades.' }
  ],
  'ciudad-del-carmen': [
    { title: 'Zona Petrolera', description: 'Servicios de atención médica privada, urgencias y medicina del trabajo.' }
  ],
  'ciudad-juarez': [
    { title: 'Pronaf / Zona Médica', description: 'Alta concentración de hospitales privados, clínicas dentales y turismo médico fronterizo.' },
    { title: 'Corredor Gómez Morín', description: 'Torres médicas modernas y servicios de especialidad de vanguardia.' }
  ],
  'ciudad-lopez-mateos': [
    { title: 'Zona Centro', description: 'Clínicas de atención general, consultorios dentales y laboratorios de análisis clínicos.' }
  ],
  'ciudad-madero': [
    { title: 'Zona de Hospitales', description: 'Concentración de infraestructura hospitalaria regional y servicios especializados.' }
  ],
  'ciudad-obregon': [
    { title: 'Zona Médica Norte', description: 'Clúster regional de hospitales especializados y centros de atención integral.' }
  ],
  'ciudad-victoria': [
    { title: 'Corredor Hospitalario', description: 'Área principal de infraestructura médica gubernamental y clínicas privadas de especialidad.' }
  ],
  'coahuila': [
    { title: 'Eje Médico Saltillo-Torreón', description: 'Red de hospitales privados y públicos que abarcan servicios de alta complejidad.' }
  ],
  'coatzacoalcos': [
    { title: 'Malecón y Centro', description: 'Zona que alberga hospitales generales, clínicas especializadas y servicios de salud privada.' }
  ],
  'colima': [
    { title: 'Zona Norte', description: 'Hospitales de reciente creación y clínicas de especialidad privada.' },
    { title: 'Centro Histórico', description: 'Área con servicios médicos tradicionales y unidades de atención familiar.' }
  ],
  'coyoacan': [
    { title: 'Miguel Ángel de Quevedo', description: 'Corredor con clínicas de rehabilitación, especialidades privadas y consultorios.' },
    { title: 'Zona de Hospitales Pedregal', description: 'Hospitales privados de alta gama y atención de tercer nivel.' }
  ],
  'cuauhtemoc': [
    { title: 'Doctores / Roma', description: 'Gran conglomerado de hospitales públicos emblemáticos y clínicas privadas de especialidad.' }
  ],
  'cuautitlan-izcalli': [
    { title: 'Centro Urbano', description: 'Hospitales zonales, laboratorios y múltiples torres de consultorios.' }
  ],
  'cuautla': [
    { title: 'Centro y Norte', description: 'Clínicas privadas de atención general y hospitales de referencia regional.' }
  ],
  'cuernavaca': [
    { title: 'Avenida Teopanzolco / Vista Hermosa', description: 'Zona residencial que alberga prestigiosos hospitales privados y clínicas de belleza.' },
    { title: 'Centro Médico Estatal', description: 'Concentración de infraestructura de salud pública y atención regional.' }
  ],
  'culiacan': [
    { title: 'Desarrollo Urbano Tres Ríos', description: 'Clúster de alta gama con hospitales privados y clínicas de cirugía especializada.' },
    { title: 'Centro', description: 'Avenidas principales con servicios médicos generales, ópticas y laboratorios.' }
  ],
  'durango': [
    { title: 'Corredor 20 de Noviembre', description: 'Eje central que concentra hospitales generales, sanatorios y laboratorios clínicos.' }
  ],
  'ecatepec': [
    { title: 'Vía Morelos', description: 'Corredor hospitalario con clínicas públicas de alta afluencia y atención de trauma.' },
    { title: 'Las Américas', description: 'Hospitales privados y centros de diagnóstico integral de reciente desarrollo.' }
  ],
  'ensenada': [
    { title: 'Zona Centro / Turística', description: 'Clínicas enfocadas en turismo médico transfronterizo y servicios de medicina general.' }
  ],
  'fresnillo': [
    { title: 'Zona Centro', description: 'Avenidas principales que aglomeran clínicas familiares y servicios de urgencia básicos.' }
  ],
  'garcia': [
    { title: 'Corredor Lincoln', description: 'Clínicas de atención primaria y urgencias periféricas para la zona poniente.' }
  ],
  'general-escobedo': [
    { title: 'Zona Centro y Barragán', description: 'Hospitales universitarios, clínicas de especialidad y servicios médicos accesibles.' }
  ],
  'gomez-palacio': [
    { title: 'Zona Industrial / Centro', description: 'Centros de atención médica general y medicina del trabajo.' }
  ],
  'guadalajara': [
    { title: 'Zona Centro Médico', description: 'Gran concentración de centros de salud públicos de alta especialidad y clínicas aledañas.' },
    { title: 'Ladrón de Guevara / Providencia', description: 'Torres de consultorios modernos, hospitales privados de prestigio y especialidades.' }
  ],
  'guadalupe': [
    { title: 'Avenida Juárez', description: 'Clínicas de atención familiar, consultorios privados y laboratorios de diagnóstico.' }
  ],
  'guanajuato': [
    { title: 'Zona Sur', description: 'Centros hospitalarios de alta especialidad y clínicas de atención pública.' }
  ],
  'guaymas': [
    { title: 'Centro Comercial / Puerto', description: 'Servicios médicos generales, atención a urgencias locales y turismo.' }
  ],
  'guerrero': [
    { title: 'Red de Salud Estatal', description: 'Distribución de hospitales regionales y centros de especialidad en los municipios clave.' }
  ],
  'gustavo-a-madero': [
    { title: 'Lindavista', description: 'Zona con emblemáticos hospitales de traumatología, maternidad y servicios privados de alto nivel.' }
  ],
  'hermosillo': [
    { title: 'Vado del Río', description: 'Distrito médico de rápido crecimiento con hospitales de vanguardia y clínicas privadas.' },
    { title: 'Proyecto Río Sonora', description: 'Centros de diagnóstico modernos y torres de especialidades.' }
  ],
  'huixquilucan': [
    { title: 'Interlomas', description: 'Complejos médicos privados de muy alta especialidad, exclusividad y tecnología de punta.' }
  ],
  'irapuato': [
    { title: 'Corredor Villas', description: 'Hospitales privados y clínicas especializadas que atienden a la población central del estado.' }
  ],
  'ixtapaluca': [
    { title: 'Zona de Alta Especialidad', description: 'Área que aloja hospitales regionales de alta complejidad y servicios de salud públicos.' }
  ],
  'iztacalco': [
    { title: 'Corredor Churubusco', description: 'Unidades de medicina familiar y clínicas deportivas o de especialidad general.' }
  ],
  'iztapalapa': [
    { title: 'Ermita Iztapalapa', description: 'Corredor con amplia oferta de hospitales generales, clínicas de atención comunitaria y urgencias.' }
  ],
  'jiutepec': [
    { title: 'Boulevard Cuauhnáhuac', description: 'Eje que concentra laboratorios clínicos, sanatorios privados y atención primaria.' }
  ],
  'juriquilla': [
    { title: 'Zona Médica Juriquilla', description: 'Nuevos y modernos hospitales privados con amplias especialidades y turismo médico.' }
  ],
  'la-paz': [
    { title: 'Malecón y Centro', description: 'Consultorios privados y atención médica bilingüe para residentes y turistas.' },
    { title: 'Sur', description: 'Hospitales de especialidad y servicios de referencia estatal.' }
  ],
  'la-piedad': [
    { title: 'Zona Centro', description: 'Sanatorios tradicionales y clínicas de atención primaria.' }
  ],
  'leon': [
    { title: 'San Lázaro / Cerro Gordo', description: 'Concentración de grandes hospitales privados y torres de consultorios.' },
    { title: 'Centro', description: 'Clínicas de medicina tradicional, oftalmología y odontología.' }
  ],
  'linares': [
    { title: 'Zona Hospitalaria Centro', description: 'Hospital general y clínicas de atención básica que sirven a la región citrícola.' }
  ],
  'magdalena-contreras': [
    { title: 'San Jerónimo', description: 'Área que conecta con importantes hospitales de especialidad y maternidad privados.' }
  ],
  'manzanillo': [
    { title: 'Boulevard Costero', description: 'Servicios de emergencias, atención para turismo y medicina general privada.' }
  ],
  'matamoros': [
    { title: 'Zona Centro / Frontera', description: 'Gran cantidad de clínicas dentales, cirugía plástica y medicina general para turismo extranjero.' }
  ],
  'mazatlan': [
    { title: 'La Marina / Zona Dorada', description: 'Hospitales nuevos con enfoque en turismo médico y residentes extranjeros.' },
    { title: 'Centro Histórico', description: 'Clínicas tradicionales y hospitales de especialidad para población local.' }
  ],
  'merida': [
    { title: 'Altabrisa / Norte', description: 'Clúster hospitalario de primer mundo con turismo médico, clínicas privadas y torres de especialidad.' },
    { title: 'Centro', description: 'Zona con gran tradición en atención médica, sanatorios privados y consultorios generales.' }
  ],
  'metepec': [
    { title: 'Pino Suárez / Galerías', description: 'Corredor de modernos hospitales privados, maternidades y laboratorios de alta gama.' }
  ],
  'mexicali': [
    { title: 'Distrito Médico / Nueva', description: 'Zona fronteriza altamente especializada en turismo médico, odontología y bariatría.' },
    { title: 'Centro Cívico', description: 'Hospitales generales y principales instituciones de salud estatal.' }
  ],
  'michoacan': [
    { title: 'Corredor de Salud Estatal', description: 'Red de hospitales y sanatorios distribuidos estratégicamente para cobertura general.' }
  ],
  'minatitlan': [
    { title: 'Zona Petrolera', description: 'Clínicas del sector energético y sanatorios enfocados en medicina laboral y general.' }
  ],
  'miramar': [
    { title: 'Corredor Miramar', description: 'Servicios locales de medicina preventiva y atención primaria de urgencia.' }
  ],
  'monclova': [
    { title: 'Pape', description: 'Avenida principal con la mayor concentración de clínicas, especialistas y hospitales locales.' }
  ],
  'monterrey': [
    { title: 'Obispado', description: 'El distrito médico más grande del norte de México, con cientos de consultorios, clínicas y hospitales.' },
    { title: 'Centro Médico Universitario', description: 'Zona de alta especialidad médica, docencia y atención pública y privada.' }
  ],
  'morelia': [
    { title: 'Las Américas / Camelinas', description: 'Hospitales privados de prestigio, clínicas de fertilidad y torres de especialistas.' },
    { title: 'Ciudad Salud', description: 'Polígono que concentra los principales hospitales públicos regionales de alta especialidad.' }
  ],
  'morelos': [
    { title: 'Clúster Salud', description: 'Infraestructura de bienestar, clínicas de rehabilitación y hospitales de referencia.' }
  ],
  'naucalpan': [
    { title: 'Ciudad Satélite', description: 'Alta densidad de hospitales privados emblemáticos, clínicas de trauma y múltiples especialidades.' },
    { title: 'Lomas Verdes', description: 'Corredor de servicios médicos de alta especialidad y centros de trauma.' }
  ],
  'nayarit': [
    { title: 'Distrito Tepic', description: 'Concentración estatal de hospitales de salud pública y principales sanatorios.' }
  ],
  'nezahualcoyotl': [
    { title: 'Avenida López Mateos', description: 'Clínicas de maternidad, centros de atención comunitaria y hospitales generales.' }
  ],
  'nogales': [
    { title: 'Zona Fronteriza', description: 'Servicios dedicados al turismo médico, odontología, farmacias y clínicas privadas.' }
  ],
  'nuevo casas grandes': [
    { title: 'Centro Médico Regional', description: 'Hospitales comunitarios y servicios médicos para la región del noroeste del estado.' }
  ],
  'nuevo-laredo': [
    { title: 'Sector Centro', description: 'Clínicas de especialidades transfronterizas y fuerte presencia de odontología y cirugía.' }
  ],
  'oaxaca': [
    { title: 'Reforma / Norte', description: 'Alta concentración de sanatorios privados, clínicas especializadas y laboratorios.' },
    { title: 'San Bartolo', description: 'Zona de hospitales de salud pública y especialidades regionales.' }
  ],
  'ojo-de-agua': [
    { title: 'Boulevard Ojo de Agua', description: 'Clínicas de atención familiar, diagnóstico y consultorios dentales.' }
  ],
  'pachuca': [
    { title: 'Zona Plateada', description: 'Hospitales de reciente apertura con tecnología de punta y especialidades médicas.' },
    { title: 'Corredor Hospitalario Sur', description: 'Instalaciones de salud pública y hospitales de la mujer y el niño.' }
  ],
  'poza-rica': [
    { title: 'Zona 20 de Noviembre', description: 'Área médica que agrupa servicios públicos, privados y de medicina del trabajo petrolero.' }
  ],
  'puebla': [
    { title: 'Angelópolis / Reserva Territorial', description: 'Hospitales privados de altísima especialidad y torres médicas ultramodernas.' },
    { title: 'Zona de la Salud', description: 'Centro médico universitario y hospitales de referencia estatal en el centro.' }
  ],
  'puerto-vallarta': [
    { title: 'Zona Hotelera / Fluvial', description: 'Infraestructura de clase mundial orientada al turismo médico internacional y residencias.' },
    { title: 'Versalles', description: 'Clínicas locales, especialistas y servicios de atención primaria.' }
  ],
  'queretaro': [
    { title: 'Centro Histórico / Zaragoza', description: 'Sanatorios tradicionales, maternidades y clínicas de medicina general.' },
    { title: 'Bernardo Quintana / Juriquilla', description: 'Hospitales privados de gran tamaño con las más altas certificaciones.' }
  ],
  'quintana-roo': [
    { title: 'Red de Turismo Médico', description: 'Instalaciones a lo largo del estado enfocadas en medicina preventiva, cirugía y extranjeros.' }
  ],
  'reynosa': [
    { title: 'Zona Progreso / Las Fuentes', description: 'Alta concentración de hospitales, clínicas dentales y servicios de salud para residentes y frontera.' }
  ],
  'salamanca': [
    { title: 'Zona Faja de Oro', description: 'Clínicas de urgencias, medicina preventiva y atención hospitalaria regional.' }
  ],
  'saltillo': [
    { title: 'Norte / Venustiano Carranza', description: 'Hospitales privados de vanguardia, clínicas especializadas y turismo médico.' }
  ],
  'san-cristobal': [
    { title: 'Barrio de San Diego', description: 'Zona de hospitales de atención general y clínicas que sirven a comunidades de los altos.' }
  ],
  'san-francisco-coacalco': [
    { title: 'Vía José López Portillo', description: 'Corredor con importante oferta de clínicas oftalmológicas, dentales y hospitales zonales.' }
  ],
  'san-juan-del-rio': [
    { title: 'Corredor Céntrico', description: 'Clínicas de especialidades básicas y hospitales que cubren emergencias locales y carreteras.' }
  ],
  'san-luis-potosi': [
    { title: 'Carranza / Lomas', description: 'Zona residencial comercial con hospitales privados de alto perfil y torres de consultorios.' },
    { title: 'Zona Hospitalaria Sur', description: 'Hospitales universitarios y centros de especialidades médicas públicas.' }
  ],
  'san-nicolas': [
    { title: 'Universidad / Barragán', description: 'Clínicas de especialidad, radiología, atención universitaria y medicina general.' }
  ],
  'san-pedro-garza-garcia': [
    { title: 'Valle Oriente', description: 'El distrito con los hospitales privados más exclusivos e innovadores de la región.' },
    { title: 'Campestre', description: 'Clínicas boutique, cirugía plástica, dermatología y especialidades premium.' }
  ],
  'santa-catarina': [
    { title: 'Centro', description: 'Servicios de salud de primer nivel, emergencias y clínicas familiares.' }
  ],
  'sinaloa': [
    { title: 'Eje Médico Pacífico', description: 'Conjunto de centros médicos de alta especialidad ubicados en las principales capitales y puertos.' }
  ],
  'soledad': [
    { title: 'Carretera a Matehuala', description: 'Clínicas de urgencias periféricas y atención de primer contacto.' }
  ],
  'sonora': [
    { title: 'Red Médica Fronteriza', description: 'Instalaciones hospitalarias de especialidad centradas en salud general y turismo.' }
  ],
  'tabasco': [
    { title: 'Villahermosa Centro / Tabasco 2000', description: 'Servicios especializados, imagenología y hospitales corporativos.' }
  ],
  'tamaulipas': [
    { title: 'Distrito Médico Transfronterizo', description: 'Red de clínicas de corta estancia y atención ambulatoria en la franja norte.' }
  ],
  'tapachula': [
    { title: 'Zona Sur / Libramiento', description: 'Hospitales regionales de referencia, servicios médicos transfronterizos y clínicas privadas.' }
  ],
  'tehuacan': [
    { title: 'Centro Histórico', description: 'Zonas con sanatorios de tradición, clínicas generales y laboratorios de análisis clínicos.' }
  ],
  'tepic': [
    { title: 'Ciudad de la Salud', description: 'Área urbana que concentra hospitales de alta especialidad del estado y clínicas de rehabilitación.' }
  ],
  'tijuana': [
    { title: 'Zona Río', description: 'Capital del turismo médico: gran cantidad de torres médicas, bariatría, cirugía plástica y odontología.' },
    { title: 'NewCity Medical', description: 'Complejo médico integral ultramoderno enfocado en pacientes de Estados Unidos y locales.' }
  ],
  'tlalnepantla': [
    { title: 'Centro / Gustavo Baz', description: 'Hospitales de zona de alta capacidad, clínicas privadas y medicina laboral.' }
  ],
  'tlalpan': [
    { title: 'Zona de Hospitales (San Fernando)', description: 'El conjunto más grande de Institutos Nacionales de Salud (Cardiología, Nutrición, Cáncer) de México.' },
    { title: 'Coapa', description: 'Clínicas periféricas, laboratorios especializados y servicios médicos privados.' }
  ],
  'tlaquepaque': [
    { title: 'Revolución', description: 'Clínicas de asistencia médica primaria, maternidades y servicios de urgencias básicas.' }
  ],
  'toluca': [
    { title: 'Paseo Tollocan', description: 'Gran corredor de hospitales generales, materno-infantiles y centros médicos del gobierno.' },
    { title: 'Colón / Ciprés', description: 'Hospitales y consultorios de medicina privada con variedad de especialidades.' }
  ],
  'tonala': [
    { title: 'Zona Centro Tonalá', description: 'Centros de salud comunitaria y clínicas familiares.' }
  ],
  'torreon': [
    { title: 'Centro / Senderos', description: 'Modernos sanatorios privados de especialidades, complejos hospitalarios e imagenología avanzada.' },
    { title: 'Corredor Universitario', description: 'Hospitales escuela y servicios médicos de referencia para la zona de la laguna.' }
  ],
  'tuxtla-gutierrez': [
    { title: 'Zona Poniente / Moctezuma', description: 'Clúster de servicios médicos privados, pediatría y hospitales de especialidad.' }
  ],
  'uruapan': [
    { title: 'Paseo Lázaro Cárdenas', description: 'Principal corredor que agrupa hospitales privados, urgencias y clínicas especialistas locales.' }
  ],
  'veracruz': [
    { title: 'Boca del Río / Costa de Oro', description: 'Servicios de medicina privada con hospitales de alta tecnología y torres médicas corporativas.' },
    { title: 'Avenida 20 de Noviembre', description: 'Tradicional corredor médico que alberga a los principales hospitales públicos y generales.' }
  ],
  'villahermosa': [
    { title: 'Tabasco 2000', description: 'Hospitales privados de primer nivel, especialistas y atención a corporativos.' },
    { title: 'Corredor Hospitalario de Especialidades', description: 'Alta concentración de hospitales regionales, del niño, de la mujer y alta especialidad.' }
  ],
  'xalapa': [
    { title: 'Avenida Ruiz Cortines', description: 'Gran complejo de infraestructura médica, incluyendo centro de especialidades y urgencias.' },
    { title: 'Zona Centro / Ánimas', description: 'Sanatorios tradicionales y nuevas clínicas boutique de atención privada.' }
  ],
  'yucatan': [
    { title: 'Ecosistema de Salud Mérida', description: 'Infraestructura médica que conecta turismo de salud con hospitales de alta complejidad.' }
  ],
  'zacatecas': [
    { title: 'Zona Guadalupe-Zacatecas', description: 'Corredor que reúne atención médica de gobierno, especialidades e iniciativa privada.' }
  ],
  'zamora': [
    { title: 'Centro', description: 'Clínicas tradicionales, servicios de diagnóstico y atención general para la zona agrícola.' }
  ],
  'zapopan': [
    { title: 'Puerta de Hierro', description: 'Uno de los centros médicos privados más prestigiosos del país con atención premium y especialistas.' },
    { title: 'Avenida Patria / Guadalupe', description: 'Centros de urgencias, clínicas deportivas y consultorios pediátricos de alta demanda.' }
  ],
  'zapotlanejo': [
    { title: 'Centro de Salud Zapotlanejo', description: 'Servicios enfocados en atención médica de urgencias primarias y clínicas familiares.' }
  ]
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

const getCanonicalCity = (slug: string) => {
  return ALL_CITIES.find(c => slugify(c) === slug) || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getCityHealthData = (citySlug: string, cityName: string) => {
  const data = CITY_HEALTH_DATA[citySlug];
  if (data) return data;
  
  // Generic Template for cities without specific data
  return {
    overview: `La ciudad de ${cityName} cuenta con una red de servicios médicos en crecimiento, compuesta por hospitales públicos, clínicas privadas y consultorios de especialidad. Los pacientes pueden encontrar atención para diversas condiciones de salud sin necesidad de trasladarse a otras regiones.`,
    hospitals: [`Hospital General de ${cityName}`, 'Clínica de Especialidades Médicas', 'Cruz Roja Mexicana'],
    transport: `El acceso a los servicios médicos en ${cityName} es generalmente sencillo a través del transporte público local y taxis. Se recomienda verificar la disponibilidad de estacionamiento si se acude en vehículo propio a la zona centro.`
  };
};

const sortDoctorsByPhone = (doctors: Doctor[]) => {
  return [...doctors].sort((a, b) => {
    const aHas = Boolean(a.contact_info?.phones?.some(p => p && p.trim().length > 0));
    const bHas = Boolean(b.contact_info?.phones?.some(p => p && p.trim().length > 0));
    if (aHas === bHas) return 0;
    return aHas ? -1 : 1;
  });
};

// --- Metadata ---

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = getCanonicalCity(params.city);
  return {
    title: `Doctores en ${cityName} - Directorio Médico Verificado`,
    description: `Encuentra los mejores doctores y hospitales en ${cityName}. Información sobre zonas médicas, emergencias y transporte. Contacta directamente sin comisiones.`,
  };
}

// --- Server Component ---

export default async function CityPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;
  const cityName = getCanonicalCity(citySlug);
  const medicalZones = CITY_MEDICAL_ZONES[citySlug] || [];
  const healthData = getCityHealthData(citySlug, cityName);

  // Fetch initial batch of doctors
  const { data: rawDoctors } = await supabase
    .from('doctors')
    .select('*')
    .contains('cities', [cityName])
    .range(0, PAGE_SIZE - 1);

  const doctors = rawDoctors ? sortDoctorsByPhone(rawDoctors as Doctor[]) : [];

  // Logic to prevent Thin Content indexing
  const isKnownCity = ALL_CITIES.includes(cityName);
  if (doctors.length === 0 && !isKnownCity) {
    notFound();
  }

  // FAQs
  const faqs = [
   {
    question: `¿Cómo puedo contactar a un doctor en ${cityName} a través de MediBusca?`,
    answer: "Es muy sencillo. Solo elige un especialista, revisa su perfil verificado y utiliza la información de contacto disponible (como teléfono o WhatsApp) para comunicarte directamente con su consultorio. No necesitas crear una cuenta ni realizar pagos por usar la plataforma."
    },
    {
    question: "¿MediBusca cobra alguna comisión o gestiona citas médicas?",
    answer: "No. MediBusca es una plataforma informativa gratuita para los pacientes. No gestionamos citas ni cobramos comisiones; la comunicación y atención se realizan directamente entre tú y el doctor."
    },
    {
    question: `¿Qué tipos de especialistas médicos puedo encontrar en ${cityName}?`,
    answer: `Puedes encontrar una amplia variedad de especialistas como cardiólogos, ginecólogos, pediatras, psicólogos y muchos más. También ofrecemos información sobre especialidades y enfermedades para ayudarte a identificar al doctor adecuado en ${cityName}.`
    }
  ];

  // Schema Generation
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

  const displayedSpecialties = COMMON_SPECIALTIES.slice(0, INITIAL_SPECIALTIES_COUNT);

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
            Explora los mejores especialistas médicos verificados en {cityName}. Accede a información sobre especialidades y enfermedades y descubre doctores recomendados.
            </p>
        </div>

        {/* Local Healthcare Overview - Added Section */}
        <section className="bg-white rounded-[24px] p-8 border border-slate-200 mb-12 animate-in fade-in slide-in-from-bottom-3 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <HeartPulse className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-xl font-bold text-[#1d1d1f]">Infraestructura de Salud en {cityName}</h2>
            </div>
            <p className="text-[#86868b] leading-relaxed text-lg mb-0">
                {healthData.overview}
            </p>
        </section>

        {/* Client Side List & Pagination */}
        <CityDoctorList initialDoctors={doctors} city={cityName} />

      </div>

      {/* Specialties in {City} */}
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

            <div className="mt-10 text-center">
                <Link 
                    href="/especialidades"
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
                </Link>
            </div>
        </div>
      </section>

      {/* Essential City Information Section - Added */}
      <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-2">Guía Médica de {cityName}</h2>
                <p className="text-[#86868b]">Información útil para pacientes y familiares</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Emergency Card */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-200/60 shadow-sm hover:border-[#0071e3]/30 transition-all">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                            <Ambulance className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1d1d1f]">Hospitales y Emergencias</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-100">
                            <span className="font-semibold text-red-800 text-sm">Emergencias Generales</span>
                            <span className="font-bold text-red-600 text-lg">911</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#1d1d1f] mb-2 uppercase tracking-wide">Hospitales Principales:</p>
                            <ul className="space-y-2">
                                {healthData.hospitals.map((hospital, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#86868b]">
                                        <Building className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                                        {hospital}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="text-xs text-[#86868b] italic pt-2">
                            *Esta lista es informativa. En caso de emergencia grave acude al hospital más cercano.
                        </p>
                    </div>
                </div>

                {/* Transport Card */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-200/60 shadow-sm hover:border-[#0071e3]/30 transition-all">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center">
                            <Bus className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1d1d1f]">Movilidad y Acceso</h3>
                    </div>
                    <p className="text-[#86868b] leading-relaxed mb-6">
                        {healthData.transport}
                    </p>
                    <div className="bg-[#f5f5f7] p-4 rounded-xl flex gap-3">
                        <Info className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#86868b] leading-relaxed">
                            Te recomendamos planificar tu ruta con anticipación, especialmente si tienes citas en horas pico. Muchas clínicas ofrecen estacionamiento o convenios cercanos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Medical Zones Section */}
      {medicalZones.length > 0 && (
        <section className="py-16 bg-[#f5f5f7] border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-[#0071e3]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f]">Zonas médicas destacadas en {cityName}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {medicalZones.map((zone, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#0071e3]/20 transition-colors">
                            <h3 className="font-bold text-[#1d1d1f] text-lg mb-2">{zone.title}</h3>
                            <p className="text-[#86868b] text-sm leading-relaxed">{zone.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8 justify-center">
                <HelpCircle className="w-6 h-6 text-[#0071e3]" />
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f]">Preguntas Frecuentes</h2>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#f5f5f7] p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-3">{faq.question}</h3>
                        <p className="text-[#86868b] leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SEO & Other Cities Footer */}
      <section className="bg-[#f5f5f7] py-12 border-t border-slate-200">
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
                      {GLOBAL_POPULAR_SPECIALTIES.slice(0, 8).flatMap((spec, idx) => (
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
