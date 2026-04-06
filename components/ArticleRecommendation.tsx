'use client';

import { useState, useEffect, TouchEvent } from 'react';
import { X, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface ArticleRecommendationProps {
  article: {
    title: string;
    slug: string;
    read_time: string;
  } | null;
}

export default function ArticleRecommendation({ article }: ArticleRecommendationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    // If there is no article, or the user already dismissed it, do nothing
    if (!article || isDismissed) return;
    
    // 4-second delay before sliding down
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [article, isDismissed]);

  // --- Swipe Gesture Logic ---
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    
    // If the user swiped left or right more than 50px, dismiss the banner
    if (Math.abs(distance) > 50) {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for the slide-up animation to finish before removing from DOM
    setTimeout(() => setIsDismissed(true), 500); 
  };

  if (!article || isDismissed) return null;

  return (
    <div 
      // md:hidden ensures it NEVER shows on desktop
      // z-[300] ensures it sits above your mobile action dock
      className={`md:hidden fixed top-4 left-4 right-4 z-[300] transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-[150%]'
      }`}
    >
      <div 
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="bg-[#1d1d1f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-3 flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="bg-[#0071e3]/20 p-2 rounded-full flex-shrink-0">
            <BookOpen className="w-4 h-4 text-[#47a1ff]" />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#47a1ff] uppercase tracking-wider leading-tight">
              Sugerencia de lectura • {article.read_time}
            </span>
            <Link 
              href={`/enciclopedia/${article.slug}`} 
              className="text-white font-medium text-[13px] leading-snug line-clamp-2 mt-0.5"
              onClick={() => setIsVisible(false)} // Close immediately if clicked
            >
              {article.title}
            </Link>
          </div>
        </div>

        <button 
          onClick={handleDismiss}
          className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          aria-label="Cerrar sugerencia"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}