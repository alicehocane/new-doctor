
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { BookOpen, Clock, ChevronRight, Bookmark, Loader2, Search, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Article } from '../types';

const PAGE_SIZE = 9;

interface EncyclopediaBrowserProps {
  initialArticles: Article[];
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function EncyclopediaBrowser({ initialArticles, children, title, description }: EncyclopediaBrowserProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false); // Loading for search
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchArticles = useCallback(async (isLoadMore = false, query = '') => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const currentPage = isLoadMore ? page + 1 : 0;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let dbQuery = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (query.trim()) {
        const term = query.trim();
        dbQuery = dbQuery.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,category.ilike.%${term}%`);
      }

      const { data, error } = await dbQuery.range(from, to);

      if (error) throw error;

      if (data) {
        if (isLoadMore) {
          setArticles(prev => [...prev, ...data]);
          setPage(currentPage);
        } else {
          setArticles(data);
        }

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  // Effect for Search
  useEffect(() => {
    // Only fetch client side if we have a query or if we cleared it (and need to reset to initial)
    if (debouncedQuery !== '') {
        fetchArticles(false, debouncedQuery);
    } else if (articles !== initialArticles && debouncedQuery === '') {
        // Reset to initial if cleared
        setArticles(initialArticles);
        setPage(0);
        setHasMore(true);
    }
  }, [debouncedQuery]);

  const handleLoadMore = () => {
    fetchArticles(true, debouncedQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const isSearchActive = debouncedQuery.trim().length > 0;
  
  // Featured logic: First article is featured if NO search is active.
  const featuredArticle = !isSearchActive && articles.length > 0 ? articles[0] : null;
  const gridArticles = !isSearchActive ? articles.slice(1) : articles;

  return (
    <>
      {/* Hero & Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-[#1d1d1f] tracking-tight mb-6">
                {title || "Enciclopedia Médica."}
            </h1>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
                {description || "Información verificada, guías de bienestar y artículos escritos por especialistas para ayudarte a tomar mejores decisiones sobre tu salud."}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#86868b]" />
                </div>
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artículos (ej. Diabetes, Nutrición)..."
                    className="
                        w-full h-14 pl-11 pr-12 
                        bg-[#f5f5f7] rounded-2xl border-transparent 
                        text-[#1d1d1f] text-[16px] placeholder-[#86868b] 
                        focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] focus:border-transparent 
                        transition-all shadow-sm
                    "
                />
                {searchQuery && (
                    <button 
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        
        {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" />
             </div>
        ) : (
            <>
                {/* Featured Article */}
                {featuredArticle && (
                    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-[#0071e3]" />
                            Destacado
                        </h2>
                        <NextLink href={`/enciclopedia/${featuredArticle.slug}`}>
                            <div className="group relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 cursor-pointer">
                                <div className="md:flex">
                                    <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8 relative overflow-hidden">
                                        {featuredArticle.image_url ? (
                                             <img src={featuredArticle.image_url} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <BookOpen className="w-20 h-20 text-[#0071e3]/20 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                                        )}
                                    </div>
                                    <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            {featuredArticle.category.split(',').slice(0, 3).map((cat, i) => (
                                                <span key={i} className="px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] text-xs font-bold uppercase tracking-wider rounded-full">
                                                    {cat.trim()}
                                                </span>
                                            ))}
                                            <span className="text-xs text-[#86868b] flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {featuredArticle.read_time} de lectura
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-4 group-hover:text-[#0071e3] transition-colors leading-tight">
                                            {featuredArticle.title}
                                        </h3>
                                        <p className="text-[#86868b] leading-relaxed mb-6 text-lg line-clamp-3">
                                            {featuredArticle.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="text-sm">
                                                <p className="font-semibold text-[#1d1d1f]">{featuredArticle.author}</p>
                                                <p className="text-[#86868b]">{featuredArticle.published_at}</p>
                                            </div>
                                            <span className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NextLink>
                    </section>
                )}

                {/* Articles Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                            {isSearchActive ? 'Resultados de búsqueda' : 'Guías Médicas Destacadas'}
                        </h2>
                        {isSearchActive && (
                             <span className="text-sm text-[#86868b]">{articles.length} resultados encontrados</span>
                        )}
                    </div>
                    
                    {gridArticles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridArticles.map((article) => (
                                <NextLink key={article.id} href={`/enciclopedia/${article.slug}`}>
                                    <div className="group h-full bg-white rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 cursor-pointer flex flex-col">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            {article.category.split(',').slice(0, 1).map((cat, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] font-bold uppercase tracking-wider rounded-lg">
                                                    {cat.trim()}
                                                </span>
                                            ))}
                                            <span className="text-[11px] text-[#86868b] flex items-center gap-1 ml-auto">
                                                <Clock className="w-3 h-3" /> {article.read_time}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 group-hover:text-[#0071e3] transition-colors leading-snug line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-[#86868b] text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0">
                                                {article.author.charAt(0)}
                                            </div>
                                            <div className="text-xs truncate">
                                                <p className="font-medium text-[#1d1d1f] truncate">{article.author}</p>
                                                <p className="text-[#86868b] truncate">{article.author_role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </NextLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-[#1d1d1f] font-medium text-lg">No encontramos artículos.</p>
                            <p className="text-[#86868b] mt-1">Intenta buscar con otros términos o palabras clave.</p>
                            {isSearchActive && (
                                <button onClick={clearSearch} className="mt-4 text-[#0071e3] font-medium hover:underline">
                                    Limpiar búsqueda
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Load More Button */}
                {hasMore && gridArticles.length > 0 && (
                    <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-8">
                        <button 
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="
                                inline-flex items-center gap-2 px-8 py-3.5
                                bg-white border border-[#d2d2d7] rounded-full
                                text-[15px] font-medium text-[#1d1d1f]
                                hover:bg-[#f5f5f7] hover:border-[#86868b]
                                transition-all active:scale-95 shadow-sm disabled:opacity-50
                            "
                        >
                            {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Ver más artículos
                        </button>
                    </div>
                )}
            </>
        )}

        {/* Server Rendered Children (SEO Content) */}
        {children}

      </div>
    </>
  );
}
