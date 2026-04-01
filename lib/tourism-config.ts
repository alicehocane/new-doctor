// lib/tourism-config.ts

export const specialtyMap: Record<string, string> = {
  'dentist': 'Odontología',
  'plastic-surgery': 'Cirugía Plástica',
  'weight-loss-surgery': 'Cirugía Bariátrica',
  'eye-surgery': 'Oftalmología',
};

export const cityMap: Record<string, string> = {
  'tijuana': 'Tijuana',
  'mexicali': 'Mexicali',
  'ciudad-juarez': 'Ciudad Juárez',
  'nuevo-laredo': 'Nuevo Laredo',
  'monterrey': 'Monterrey',
  'cancun': 'Cancún'
};

export const specialtyRichData: Record<string, any> = {
  'dentist': {
    name: 'Dentistry & Oral Surgery',
    overview: 'Dental care in the United States is notoriously expensive, with many employer-sponsored insurance plans capping out at just $1,000 to $2,000 annually. This barely covers a single crown, let alone full-mouth restorations. By traveling across the border, patients can access world-class dental implants, veneers, and complex oral surgery utilizing the exact same FDA-approved materials used in US clinics.',
    popularProcedures: [
      { name: 'All-on-4 Dental Implants', usPrice: 28000, mxPrice: 9000 },
      { name: 'Porcelain Veneers (Full Set)', usPrice: 15000, mxPrice: 4500 },
      { name: 'Root Canal & Crown', usPrice: 2500, mxPrice: 650 }
    ],
    recovery: 'Most cosmetic dental procedures require minimal downtime. For implants, patients typically make two trips (one for placement, one for the final crowns months later), while veneers can often be completed in a single 3-to-5 day trip.',
    whatToBring: 'If you have recent panoramic X-rays or a 3D CBCT scan, email them to your chosen clinic beforehand. Many top clinics offer free virtual consultations based on these scans.'
  },
  'plastic-surgery': {
    name: 'Cosmetic & Plastic Surgery',
    overview: 'Elective cosmetic procedures are almost never covered by US health insurance. Board-certified plastic surgeons in Mexico offer life-changing procedures—such as mommy makeovers, rhinoplasty, and body contouring—at a fraction of the cost. Many of these surgeons have completed fellowships in the US or Europe and operate in state-of-the-art, internationally accredited hospitals.',
    popularProcedures: [
      { name: 'Mommy Makeover', usPrice: 22000, mxPrice: 7500 },
      { name: 'Rhinoplasty (Nose Job)', usPrice: 12000, mxPrice: 4000 },
      { name: 'Liposuction (3 Areas)', usPrice: 9000, mxPrice: 3500 }
    ],
    recovery: 'Depending on the procedure, expect to stay in Mexico for 7 to 14 days post-op. Many surgeons require you to stay in specialized recovery boutiques where registered nurses monitor your healing before you are cleared to fly or drive home.',
    whatToBring: 'Bring comfortable, loose-fitting button-down clothing, your complete medical history, and a dedicated travel companion to assist you during the first 48 hours of recovery.'
  },
  'weight-loss-surgery': {
    name: 'Bariatric Surgery',
    overview: 'Weight loss surgery is a major medical decision that is often blocked by strict US insurance requirements and long waiting periods. Mexican bariatric centers specialize in fast-tracked, incredibly safe gastric sleeve and bypass procedures. The facilities are tailored specifically for international bariatric patients.',
    popularProcedures: [
      { name: 'Gastric Sleeve', usPrice: 18000, mxPrice: 4500 },
      { name: 'Gastric Bypass', usPrice: 24000, mxPrice: 6000 },
      { name: 'Revision Surgery', usPrice: 26000, mxPrice: 6500 }
    ],
    recovery: 'Patients generally spend 2 nights in the hospital and 2 nights in a recovery hotel before flying home. You will be walking within hours of surgery to promote healing.',
    whatToBring: 'Bring comfortable walking shoes, a companion, and any preoperative medical clearances requested by your surgeon.'
  },
  'eye-surgery': {
    name: 'Ophthalmology & Eye Surgery',
    overview: 'Vision correction and cataract surgeries are highly advanced in Mexico. Utilizing the exact same laser technology (like LASIK and SMILE) found in the US, Mexican ophthalmologists can restore your vision for less than half the out-of-pocket cost.',
    popularProcedures: [
      { name: 'LASIK (Both Eyes)', usPrice: 4500, mxPrice: 1500 },
      { name: 'Cataract Surgery (Per Eye)', usPrice: 3500, mxPrice: 1200 },
      { name: 'Premium Lens Implants', usPrice: 6000, mxPrice: 2500 }
    ],
    recovery: 'Vision procedures have incredibly fast recovery times. Most LASIK patients notice improved vision within 24 hours and can fly home the day after their post-op checkup.',
    whatToBring: 'Bring dark UV-blocking sunglasses, someone to assist you immediately after the procedure, and avoid wearing eye makeup or contacts for a week prior.'
  }
};

export const cityRichData: Record<string, any> = {
  'tijuana': {
    travelGuide: 'As the undisputed capital of medical tourism, Tijuana caters to hundreds of thousands of US patients annually. The logistics are incredibly simple: fly into San Diego International Airport (SAN), and take a 20-minute rideshare to the border. Many premium clinics offer a concierge service that picks you up directly from the airport, drives you across the border through a dedicated medical lane, and takes you straight to your hotel or clinic.',
    safety: 'Medical tourism is a massive pillar of the local economy. Stick to the Zona Río district (the medical and business hub) and NewCity Medical Plaza, which are heavily secured and designed entirely for international visitors.'
  },
  'cancun': {
    travelGuide: 'Cancun combines world-class healthcare with a tropical recovery environment. Fly directly into Cancun International Airport (CUN) from almost any major US city. The top hospitals are located just minutes from the Hotel Zone, allowing you to recover in a resort setting.',
    safety: 'Cancun is one of the safest tourist destinations in Mexico. Most medical facilities are clustered in modern, upscale areas with excellent infrastructure and bilingual staff.'
  },
  'monterrey': {
    travelGuide: 'Monterrey is the wealthiest and most modern city in Mexico, boasting hospitals affiliated with major US institutions (like Houston Methodist). It is a short, direct flight from Texas and the US Midwest.',
    safety: 'Monterrey has world-class infrastructure. The San Pedro Garza García municipality, where many top clinics are located, is recognized as one of the safest and most affluent areas in all of Latin America.'
  }
};

export function formatEnglishText(slug: string) {
  if (!slug) return '';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}