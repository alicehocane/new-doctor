'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdUnitProps {
  slot: string;
  format?: string;
  layout?: string;
}

export default function AdUnit({ slot, format = 'auto', layout }: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Small delay to ensure the DOM has calculated the 'w-full' width
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, 150); // 150ms is the sweet spot for Next.js hydration

    return () => clearTimeout(timer);
  }, [slot, pathname]); // Re-run if the user navigates to a different doctor profile

  return (
    <div className="w-full flex flex-col items-center my-8 overflow-hidden">
      <span className="text-[10px] text-slate-400 mb-2 tracking-widest uppercase font-bold">
        Publicidad
      </span>
      
      {/* 2. Forced width and min-height prevents 'availableWidth=0' */}
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