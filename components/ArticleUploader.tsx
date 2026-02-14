
'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BookOpen, Save, Loader2, CheckCircle, AlertCircle, RefreshCw, Trash2, Edit2, X, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';

export const ArticleUploader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Management State
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetchingList, setFetchingList] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '', // HTML content
    category: '',
    author: '',
    author_role: '',
    read_time: '',
    image_url: '',
    published_at: ''
  });

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles(1);
  }, []);

  const fetchArticles = async (page: number = 1) => {
    if (!isSupabaseConfigured()) return;
    setFetchingList(true);
    
    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      if (data) {
        setArticles(data as Article[]);
        setCurrentPage(page);
      }
    } catch (err: any) {
        console.error('Error fetching articles:', err);
    } finally {
      setFetchingList(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchArticles(newPage);
      }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug if not editing or if slug is empty
    setFormData(prev => {
        const newData = { ...prev, title };
        if (!editingId && (!prev.slug || prev.slug.trim() === '')) {
            newData.slug = generateSlug(title);
        }
        return newData;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      author_role: article.author_role,
      read_time: article.read_time,
      image_url: article.image_url || '',
      published_at: article.published_at ? article.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setSuccess(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      author_role: '',
      read_time: '',
      image_url: '',
      published_at: ''
    });
    setSuccess(false);
    setError(null);
  };

  const requestDelete = (id: string) => {
    setDeleteConfirmationId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmationId) return;
    
    const id = deleteConfirmationId;
    setError(null);
    setDeleteConfirmationId(null); // Close modal

    try {
        const { error: dbError } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        // If deleting the last item on the page, go to previous page if possible
        const isLastOnPage = articles.length === 1;
        const nextPage = (isLastOnPage && currentPage > 1) ? currentPage - 1 : currentPage;
        
        await fetchArticles(nextPage);
        
        // If the user was editing the item that just got deleted, cancel edit mode
        if (editingId === id) handleCancelEdit();

    } catch (err: any) {
        console.error("Delete Error:", err);
        setError("Failed to delete article: " + (err.message || "Unknown error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.title || !formData.slug || !formData.content) {
        throw new Error("Title, Slug and Content are required.");
      }

      // Prepare payload
      const payload: any = {
          ...formData,
          published_at: formData.published_at || new Date().toISOString().split('T')[0]
      };
      
      // Remove undefined or empty optional fields to prevent issues
      if (!payload.image_url) delete payload.image_url;

      if (editingId) {
        // Update existing article
        const { error: dbError } = await supabase
            .from('articles')
            .update(payload)
            .eq('id', editingId);

        if (dbError) throw dbError;
        
        await fetchArticles(currentPage);

      } else {
        // Create new article
        const { error: dbError } = await supabase
            .from('articles')
            .insert([payload]);

        if (dbError) throw dbError;

        await fetchArticles(1); // Go to first page to see new item
      }

      setSuccess(true);
      
      if (!editingId) {
        // Reset form only if we were creating
        setFormData(prev => ({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: prev.category, // Keep last category for convenience
            author: prev.author,
            author_role: prev.author_role,
            read_time: '',
            image_url: '',
            published_at: ''
        }));
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 relative">
        {/* Delete Confirmation Modal */}
        {deleteConfirmationId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                    <div className="flex items-center gap-4 mb-4 text-red-600">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Delete Article</h3>
                            <p className="text-sm text-slate-500">This action cannot be undone.</p>
                        </div>
                    </div>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Are you sure you want to delete this article? It will be permanently removed from the database and the public encyclopedia.
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setDeleteConfirmationId(null)}
                            className="px-4 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeDelete}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition-all active:scale-95"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Form Section */}
        <div className="bg-white shadow rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                {editingId ? 'Edit Article' : 'Create Article'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {editingId ? 'Update existing content in the encyclopedia.' : 'Publish new content to the encyclopedia.'}
                </p>
            </div>
            {editingId && (
                <button 
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" /> Cancel Edit
                </button>
            )}
        </div>

        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Article Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Guía de Prevención de Diabetes"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 font-mono text-sm"
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Excerpt (Short Summary)</label>
                <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="Brief description for cards and SEO..."
                />
            </div>

            {/* Metadata */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Categories</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Cardiología, Salud, Prevención"
                />
                <p className="text-xs text-slate-400">Separate multiple categories with commas.</p>
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Read Time</label>
                <input
                    type="text"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. 5 min"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Publish Date</label>
                <div className="relative">
                    <input
                        type="date"
                        name="published_at"
                        value={formData.published_at}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Author Name</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Dr. Juan Pérez"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Author Role</label>
                <input
                    type="text"
                    name="author_role"
                    value={formData.author_role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Cardiólogo Certificado"
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Image URL (Optional)</label>
                <div className="relative">
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pl-10"
                        placeholder="https://..."
                    />
                    <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Content (HTML Support)</label>
                <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                required
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                placeholder="<p>Write your article content here...</p><h3>Subheading</h3>"
                />
                <p className="text-xs text-slate-500">You can use basic HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.</p>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5" />
                <span>Article {editingId ? 'updated' : 'published'} successfully!</span>
                </div>
            )}

            {/* Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                type="submit"
                disabled={loading}
                className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white shadow-sm transition-all
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}
                `}
                >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {loading ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Article' : 'Publish Article')}
                </button>
            </div>

            </form>
        </div>
        </div>

        {/* List Section */}
        <div className="bg-white shadow rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Existing Articles
                </h2>
                <button 
                    onClick={() => fetchArticles(currentPage)}
                    disabled={fetchingList}
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors"
                    title="Refresh List"
                >
                    <RefreshCw className={`w-5 h-5 ${fetchingList ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <div className="divide-y divide-slate-100">
                {articles.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        {fetchingList ? 'Loading articles...' : 'No articles found. Create your first one above.'}
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{article.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                                    {article.category.split(',').slice(0, 3).map((cat, i) => (
                                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                            {cat.trim()}
                                        </span>
                                    ))}
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.published_at}</span>
                                    <span>by {article.author}</span>
                                    <a href={`/enciclopedia/${article.slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View Live</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(article)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => requestDelete(article.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalCount > 0 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-sm text-slate-500">
                        Showing {articles.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} results
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || fetchingList}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || fetchingList}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
