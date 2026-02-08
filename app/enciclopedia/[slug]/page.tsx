import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Clock, ChevronLeft, User, Share2, Loader2, Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Article } from '../../../types';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        
        // 1. Fetch current article
        const { data: currentArticle, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', params.slug)
            .single();
        
        if (currentArticle) {
            setArticle(currentArticle as Article);

            // 2. Fetch related articles based on the first category
            const firstCategory = (currentArticle.category || '').split(',')[0].trim();
            
            if (firstCategory) {
                const { data: related } = await supabase
                    .from('articles')
                    .select('id, title, slug, excerpt, category, read_time, author, published_at')
                    .neq('id', currentArticle.id) // Exclude current
                    .ilike('category', `%${firstCategory}%`) // Match category
                    .limit(3);
                
                if (related) {
                    setRelatedArticles(related as Article[]);
                }
            }
        }
        setLoading(false);
    }
    if (params.slug) fetchData();
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#ffffff]"><Loader2 className="animate-spin w-8 h-8 text-[#0071e3]" /></div>;
  }

  if (!article) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
            <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Artículo no encontrado</h1>
            <Link href="/enciclopedia" className="text-[#0071e3] hover:underline">Volver a la Enciclopedia</Link>
        </div>
    );
  }

  // Get only the first category for display
  const primaryCategory = article.category.split(',')[0].trim();

  return (
    <div className="min-h-screen bg-white pb-20">
        
        {/* Sticky Navigation Bar */}
        <div className="sticky top-[48px] md:top-[52px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all">
            <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/enciclopedia" className="group flex items-center gap-1 text-[13px] font-medium text-[#86868b] hover:text-[#0071e3] transition-colors">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
                    Enciclopedia
                </Link>
                <div className="flex gap-4">
                     <button className="text-[#86868b] hover:text-[#0071e3] transition-colors" title="Guardar">
                         <Bookmark className="w-5 h-5" />
                     </button>
                     <button className="text-[#86868b] hover:text-[#0071e3] transition-colors" title="Compartir">
                         <Share2 className="w-5 h-5" />
                     </button>
                </div>
            </div>
        </div>

        <article className="max-w-2xl mx-auto px-6 py-12 md:py-16">
            
            {/* Header */}
            <header className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-[#0071e3] text-white text-[11px] font-bold uppercase tracking-widest rounded-full">
                        {primaryCategory}
                    </span>
                    <span className="text-[13px] font-medium text-[#86868b] flex items-center gap-1.5 ml-2">
                        <Clock className="w-3.5 h-3.5" /> {article.read_time}
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-8">
                    {article.title}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] border border-slate-100">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-[#1d1d1f] text-sm">{article.author}</p>
                        <div className="flex items-center gap-2 text-xs text-[#86868b] font-medium">
                            <span>{article.author_role}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                {article.published_at}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Custom Styles for Raw HTML content to make it look Apple-like */}
            <style>{`
                /* Target the specific container user adds */
                .article-content div[style*="background-color"] {
                    background-color: #f5f5f7 !important;
                    border-radius: 20px !important;
                    padding: 24px !important;
                    margin-bottom: 40px !important;
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }
                
                /* Target table of contents inside that div */
                .article-content div[style*="background-color"] h3 {
                    margin-top: 0 !important;
                    font-size: 1.1em !important;
                    letter-spacing: -0.01em !important;
                    color: #1d1d1f !important;
                }

                .article-content div[style*="background-color"] ul {
                    padding-left: 0 !important;
                    margin-bottom: 0 !important;
                    list-style: none !important;
                }

                .article-content div[style*="background-color"] li {
                    margin-bottom: 8px !important;
                    padding-left: 0 !important;
                }
                
                .article-content div[style*="background-color"] a {
                    color: #0071e3 !important;
                    text-decoration: none !important;
                    font-weight: 500 !important;
                    font-size: 15px !important;
                    display: block;
                    padding: 4px 0;
                    border-bottom: 1px solid transparent;
                    transition: all 0.2s;
                }
                
                .article-content div[style*="background-color"] a:hover {
                    color: #0077ED !important;
                    transform: translateX(4px);
                }

                /* General Article Styling */
                .article-content h2 {
                    margin-top: 2.5em !important;
                    margin-bottom: 0.8em !important;
                    font-size: 24px !important;
                    letter-spacing: -0.015em !important;
                }
                
                .article-content h3 {
                    margin-top: 2em !important;
                    font-size: 20px !important;
                }

                .article-content p {
                    margin-bottom: 1.5em !important;
                    font-size: 17px !important; 
                    line-height: 1.6 !important;
                    color: rgba(29, 29, 31, 0.88) !important;
                }

                .article-content ul {
                    list-style-type: disc !important;
                    margin-bottom: 1.5em !important;
                    padding-left: 1.5em !important;
                }

                .article-content ol {
                    list-style-type: decimal !important;
                    margin-bottom: 1.5em !important;
                    padding-left: 1.5em !important;
                }

                .article-content li {
                    font-size: 17px !important;
                    line-height: 1.6 !important;
                    margin-bottom: 0.5em !important;
                    color: rgba(29, 29, 31, 0.88) !important;
                    padding-left: 0.5em;
                }
                
                /* Custom Bullets Color */
                .article-content ul li::marker {
                    color: #0071e3;
                }

                .article-content a {
                    color: #0071e3;
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .article-content a:hover {
                    text-decoration: underline;
                }
            `}</style>

            {/* Content Body */}
            <div 
                className="
                    article-content
                    font-sans
                    animate-in fade-in slide-in-from-bottom-8 duration-700
                "
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Footer / Disclaimer */}
            <div className="mt-20 pt-10 border-t border-slate-200">
                <div className="bg-[#f5f5f7] rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#86868b] mt-2 shrink-0"></div>
                        <p className="text-sm text-[#86868b] leading-relaxed">
                            <strong>Nota Médica:</strong> La información contenida en este artículo es meramente informativa y educativa. No sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre busca el consejo de tu médico u otro proveedor de salud calificado ante cualquier duda sobre una condición médica.
                        </p>
                    </div>
                </div>
            </div>

        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
            <aside className="w-full bg-[#f5f5f7] py-16 border-t border-slate-200">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex items-center gap-2 mb-8">
                        <BookOpen className="w-6 h-6 text-[#0071e3]" />
                        <h2 className="text-2xl font-bold text-[#1d1d1f]">También podría interesarte</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((relArticle) => (
                            <Link key={relArticle.id} href={`/enciclopedia/${relArticle.slug}`}>
                                <div className="group h-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/60 cursor-pointer flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2.5 py-1 bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider rounded-lg truncate max-w-[120px]">
                                            {relArticle.category.split(',')[0]}
                                        </span>
                                        <span className="text-[11px] text-[#86868b] flex items-center gap-1 ml-auto shrink-0">
                                            <Clock className="w-3 h-3" /> {relArticle.read_time}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-2">
                                        {relArticle.title}
                                    </h3>
                                    
                                    <p className="text-[#86868b] text-[14px] leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {relArticle.excerpt}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <span className="text-xs font-medium text-[#1d1d1f]">{relArticle.author}</span>
                                        <span className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>
        )}
    </div>
  );
}