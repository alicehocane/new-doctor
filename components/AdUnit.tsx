'use client';
import { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: string;
  layout?: string; // New prop for "in-article"
}

export default function AdUnit({ slot, format = 'auto', layout }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [slot]); // Re-run if the slot changes

  return (
    <div className="w-full flex flex-col items-center my-8 overflow-hidden">
      <span className="text-[10px] text-slate-400 mb-2 tracking-widest uppercase font-bold">Publicidad</span>
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-3388571116414842"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}