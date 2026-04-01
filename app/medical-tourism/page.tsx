import Link from 'next/link';
import { specialtyMap, cityMap, formatEnglishText } from '@/lib/tourism-config';
// import AdBanner from '@/components/AdBanner';

export const metadata = {
  title: 'Medical Tourism in Mexico | Affordable Healthcare Directory | MediBusca',
  description: 'The ultimate guide to medical tourism in Mexico. Find top-rated, English-speaking doctors in border cities and save up to 70%.',
};

export default function MedicalTourismHub() {
  const specialties = Object.keys(specialtyMap);
  const cities = Object.keys(cityMap);

  return (
    <main className="bg-white">
      <section className="bg-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-extrabold mb-6">Premium Healthcare, <span className="text-blue-300">Without the US Price Tag</span></h1>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Welcome to the most comprehensive directory for Medical Tourism in Mexico. Connect directly with highly-trained specialists in top border cities.
          </p>
        </div>
      </section>

      {/* <div className="container mx-auto px-4 max-w-5xl my-8"><AdBanner dataAdSlot="YOUR_TOP_AD_SLOT_ID" /></div> */}

      <section className="bg-gray-50 py-16 border-t border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Browse Procedures & Destinations</h2>
          <div className="space-y-10">
            {specialties.map((specialty) => (
              <div key={specialty} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-blue-900 capitalize mb-6 border-b pb-4">
                  {formatEnglishText(specialty)}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {cities.map((city) => (
                    <Link 
                      key={`${specialty}-${city}`} 
                      href={`/medical-tourism/${specialty}/${city}`}
                      className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                    >
                      <span className="text-2xl mb-2">🇲🇽</span>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                        {formatEnglishText(city)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* <div className="container mx-auto px-4 max-w-5xl my-12"><AdBanner dataAdSlot="YOUR_BOTTOM_AD_SLOT_ID" /></div> */}
    </main>
  );
}