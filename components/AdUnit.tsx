'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: string;
  layout?: string;
}

export default function AdUnit({ slot, format = 'auto', layout }: AdUnitProps) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  // 1. Set mounted state to true once the browser takes over
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. Handle the AdSense push
  useEffect(() => {
    if (!hasMounted) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, 200); // Slightly longer delay to be safe during hydration

    return () => clearTimeout(timer);
  }, [slot, pathname, hasMounted]);

  // 3. Return null on the server to avoid hydration errors
  if (!hasMounted) {
    return (
      <div 
        className="w-full my-8" 
        style={{ minHeight: '280px' }} 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center my-8 overflow-hidden">
      {/* Aesthetic Tweak: 'Anuncio' with Apple-style spacing */}
      <span className="text-[9px] text-slate-300 mb-3 tracking-[0.2em] uppercase font-medium">
        Anuncio
      </span>
      
      <div style={{ width: '100%', textAlign: 'center', minHeight: '280px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-3388571116414842"
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layout ? { 'data-ad-layout': layout } : {})}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}