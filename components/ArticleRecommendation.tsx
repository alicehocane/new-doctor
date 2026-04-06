'use client';

import { useState, useEffect, TouchEvent } from 'react';
import { X, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Article {
  title: string;
  slug: string;
  read_time: string;
}

interface ArticleRecommendationProps {
  articles: Article[]; // Now accepts the full list
}

export default function ArticleRecommendation({ articles }: ArticleRecommendationProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    // If no articles or already dismissed, stop
    if (!articles || articles.length === 0 || isDismissed) return;
    
    // Pick a random article from the list on the client side
    // This ensures true randomness on every refresh
    const randomIndex = Math.floor(Math.random() * articles.length);
    setSelectedArticle(articles[randomIndex]);
    
    // 4-second delay before sliding down
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [articles, isDismissed]);

  // --- Swipe Gesture Logic ---
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 500); 
  };

  // Only render if we have a selected article and it's not dismissed
  if (!selectedArticle || isDismissed) return null;

  return (
    <div 
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
              Sugerencia de lectura • {selectedArticle.read_time}
            </span>
            <Link 
              href={`/enciclopedia/${selectedArticle.slug}`} 
              className="text-white font-medium text-[13px] leading-snug line-clamp-2 mt-0.5"
              onClick={() => setIsVisible(false)}
            >
              {selectedArticle.title}
            </Link>
          </div>
        </div>

        <button 
          onClick={handleDismiss}
          className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}