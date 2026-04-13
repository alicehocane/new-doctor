'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 1. THIS IS THE FIX: Tell TypeScript window.adsbygoogle is allowed
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
  const [hasMounted, setHasMounted] = useState(false); // Track mounting

  useEffect(() => {
    setHasMounted(true); // Tell React we are now on the client
    
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [slot, pathname]);

  return (
    <div className="w-full flex flex-col items-center my-8 overflow-hidden">
      <span className="text-[10px] text-slate-400 mb-2 tracking-widest uppercase font-bold">
        Publicidad
      </span>
      
      <div style={{ width: '100%', textAlign: 'center', minHeight: '280px' }}>
        {/* Only render the <ins> tag once we are on the client */}
        {hasMounted && (
          <ins
            key={pathname}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="ca-pub-3388571116414842"
            data-ad-slot={slot}
            data-ad-format={format}
            {...(layout ? { 'data-ad-layout': layout } : {})}
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}