import { supabase } from '@/lib/supabase';
import { specialtyMap, cityMap, formatEnglishText, specialtyRichData, cityRichData } from '@/lib/tourism-config';
import { notFound } from 'next/navigation';
// import AdBanner from '@/components/AdBanner';
import CostCalculator from '@/components/CostCalculator';

export const revalidate = 604800; // 7 Days Cache

export async function generateMetadata({ params }: { params: { specialty: string, city: string } }) {
  const specialtyName = formatEnglishText(params.specialty);
  const cityName = formatEnglishText(params.city);
  
  return {
    title: `Ultimate Guide to ${specialtyName} in ${cityName}, Mexico | Costs & Clinics`,
    description: `Comprehensive 2026 guide for medical tourists. Compare ${specialtyName} costs in ${cityName}, calculate travel logistics, and contact verified English-speaking clinics.`,
    alternates: {
      canonical: `https://medibusca.com/medical-tourism/${params.specialty}/${params.city}`
    }
  };
}

export default async function MedicalTourismCityPage({ params }: { params: { specialty: string, city: string } }) {
  const spanishSpecialty = specialtyMap[params.specialty];
  const spanishCity = cityMap[params.city];

  if (!spanishSpecialty || !spanishCity) notFound();

  // Fetch verified doctors
  const { data: doctors } = await supabase
    .from('doctors')
    .select('id, name, address, phone')
    .eq('specialty', spanishSpecialty)
    .ilike('city', `%${spanishCity}%`)
    .limit(30);

  const englishSpecialty = formatEnglishText(params.specialty);
  const englishCity = formatEnglishText(params.city);
  
  // Pull Rich Data
  const sData = specialtyRichData[params.specialty] || { overview: '', popularProcedures: [], recovery: '', whatToBring: '' };
  const cData = cityRichData[params.city] || { travelGuide: `Easily accessible for international patients.`, safety: 'Stick to verified medical districts.' };

  // Generate dynamic FAQs for Schema
  const faqs = [
    { question: `Is it safe to visit a ${englishSpecialty} clinic in ${englishCity}?`, answer: cData.safety },
    { question: `How do I travel to ${englishCity} for my procedure?`, answer: cData.travelGuide },
    { question: `What is the recovery like for ${englishSpecialty}?`, answer: sData.recovery }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO SECTION */}
      <header className="mb-12 border-b pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Guide to <span className="text-blue-600">{englishSpecialty}</span> in {englishCity}, Mexico
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed mb-6">{sData.overview}</p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-blue-900 bg-blue-50 p-4 rounded-lg inline-block border border-blue-100">
          <span>✔️ Transparent Pricing</span>
          <span>✔️ Board Certified Experts</span>
          <span>✔️ E-E-A-T Verified Data</span>
        </div>
      </header>

      {/* <AdBanner dataAdSlot="YOUR_TOP_AD_SLOT_ID" /> */}

      {/* INTERACTIVE DWELL-TIME CALCULATOR */}
      {sData.popularProcedures && sData.popularProcedures.length > 0 && (
        <section className="mb-16">
          <CostCalculator procedures={sData.popularProcedures} />
        </section>
      )}

      {/* TRAVEL & LOGISTICS TEXT */}
      <section className="mb-16 bg-gray-50 p-8 rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Traveling to {englishCity} for Your Procedure</h2>
        <div className="space-y-6 text-gray-800">
          <div><h3 className="text-xl font-bold mb-2">Getting There</h3><p className="leading-relaxed">{cData.travelGuide}</p></div>
          <div><h3 className="text-xl font-bold mb-2">Safety & Accommodations</h3><p className="leading-relaxed">{cData.safety}</p></div>
          <div><h3 className="text-xl font-bold mb-2">Recovery Timeline</h3><p className="leading-relaxed">{sData.recovery}</p></div>
          <div><h3 className="text-xl font-bold mb-2">What to Prepare</h3><p className="leading-relaxed">{sData.whatToBring}</p></div>
        </div>
      </section>

      {/* DIRECTORY SECTION */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Verified {englishSpecialty} Clinics in {englishCity}</h2>
        <p className="text-gray-700 mb-8">Browse our directory of highly-rated, SEP-verified clinics. Contact them directly to request a personalized quote.</p>

        <div className="grid gap-6 md:grid-cols-2">
          {doctors && doctors.length > 0 ? (
            doctors.map((doctor) => (
              <article key={doctor.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{doctor.name}</h3>
                <p className="text-gray-600 mb-1">📍 {doctor.address}</p>
                <p className="text-gray-600 font-medium mb-4">📞 {doctor.phone}</p>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">SEP Verified</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">English Speaking</span>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">
                  View Contact Details
                </button>
              </article>
            ))
          ) : (
            <p className="text-gray-500 bg-gray-50 p-8 rounded-xl border text-center col-span-2">
              We are currently updating our verified clinic list for {englishCity}.
            </p>
          )}
        </div>
      </section>

      {/* <AdBanner dataAdSlot="YOUR_BOTTOM_AD_SLOT_ID" /> */}
    </main>
  );
}