import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FileCode, Download, Loader2, AlertCircle, CheckCircle, Globe, Layers, FileText, Info } from 'lucide-react';
import { ALL_CITIES, COMMON_SPECIALTIES, ALL_DISEASES } from '../lib/constants';

const SITE_URL = 'https://medibusca.com';
const MAX_URLS_PER_SITEMAP = 10000;

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

interface GeneratedFile {
  filename: string;
  content: string;
  type: string; // For UI grouping
}

export const SitemapGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMaps, setGeneratedMaps] = useState<GeneratedFile[]>([]);
  const [status, setStatus] = useState<string>('');

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const createXmlContent = (urls: SitemapUrl[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    urls.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${url.loc}</loc>\n`;
      if (url.lastmod) xml += `    <lastmod>${url.lastmod.split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    return xml;
  };

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const generateSitemaps = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    setGeneratedMaps([]);
    setStatus('Initializing...');

    const files: GeneratedFile[] = [];

    try {
      // --- 1. Main Static Pages ---
      setStatus('Generating Main Pages...');
      const mainUrls: SitemapUrl[] = [
        { loc: `${SITE_URL}`, changefreq: 'daily', priority: '1.0' },
        { loc: `${SITE_URL}/buscar`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/especialidades`, changefreq: 'monthly', priority: '0.8' },
        { loc: `${SITE_URL}/enfermedades`, changefreq: 'monthly', priority: '0.8' },
        { loc: `${SITE_URL}/enciclopedia`, changefreq: 'daily', priority: '0.8' },
        { loc: `${SITE_URL}/nosotros`, changefreq: 'monthly', priority: '0.5' },
        { loc: `${SITE_URL}/contacto`, changefreq: 'monthly', priority: '0.5' },
        { loc: `${SITE_URL}/privacidad`, changefreq: 'yearly', priority: '0.3' },
        { loc: `${SITE_URL}/terminos`, changefreq: 'yearly', priority: '0.3' },
      ];
      files.push({
        filename: 'sitemap-main.xml',
        content: createXmlContent(mainUrls),
        type: 'Static'
      });

      // --- 2. Taxonomies (Cities, Specialties, Diseases) ---
      setStatus('Generating Taxonomies (Cities, Specialties, Diseases)...');
      
      const cityUrls = ALL_CITIES.map(city => ({
        loc: `${SITE_URL}/doctores/${slugify(city)}`,
        changefreq: 'weekly',
        priority: '0.8'
      }));
      files.push({
        filename: 'sitemap-cities.xml',
        content: createXmlContent(cityUrls),
        type: 'Taxonomy'
      });

      const specialtyUrls = COMMON_SPECIALTIES.map(spec => ({
        loc: `${SITE_URL}/especialidad/${slugify(spec)}`,
        changefreq: 'weekly',
        priority: '0.9'
      }));
      files.push({
        filename: 'sitemap-specialties.xml',
        content: createXmlContent(specialtyUrls),
        type: 'Taxonomy'
      });

      const diseaseUrls = ALL_DISEASES.map(disease => ({
        loc: `${SITE_URL}/enfermedad/${slugify(disease)}`,
        changefreq: 'weekly',
        priority: '0.8'
      }));
      files.push({
        filename: 'sitemap-diseases.xml',
        content: createXmlContent(diseaseUrls),
        type: 'Taxonomy'
      });

      // --- 3. Combinations (City+Spec, Disease+City) ---
      setStatus('Generating Combination Routes...');
      
      // City + Specialty
      const citySpecUrls: SitemapUrl[] = [];
      ALL_CITIES.forEach(city => {
          COMMON_SPECIALTIES.forEach(spec => {
            citySpecUrls.push({
                  loc: `${SITE_URL}/doctores/${slugify(city)}/${slugify(spec)}`,
                  changefreq: 'monthly',
                  priority: '1.0'
              });
          });
      });
      // Chunk combinations if they exceed limit
      const citySpecChunks = chunkArray(citySpecUrls, MAX_URLS_PER_SITEMAP);
      citySpecChunks.forEach((chunk, idx) => {
        files.push({
            filename: `sitemap-city-specialty${citySpecChunks.length > 1 ? `-${idx + 1}` : ''}.xml`,
            content: createXmlContent(chunk),
            type: 'Combination'
        });
      });

      // Disease + City
      const diseaseCityUrls: SitemapUrl[] = [];
      ALL_DISEASES.forEach(disease => {
        ALL_CITIES.forEach(city => {
            diseaseCityUrls.push({
                loc: `${SITE_URL}/enfermedad/${slugify(disease)}/${slugify(city)}`,
                changefreq: 'monthly',
                priority: '0.8'
            });
        });
      });
      const diseaseCityChunks = chunkArray(diseaseCityUrls, MAX_URLS_PER_SITEMAP);
      diseaseCityChunks.forEach((chunk, idx) => {
          files.push({
              filename: `sitemap-disease-city${diseaseCityChunks.length > 1 ? `-${idx + 1}` : ''}.xml`,
              content: createXmlContent(chunk),
              type: 'Combination'
          });
      });

      // --- 4. Database Content: Articles ---
      setStatus('Fetching Articles from Database...');
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('slug, published_at');
      
      if (articlesError) throw articlesError;
      
      if (articles && articles.length > 0) {
        const articleUrls = articles.map((article: any) => ({
            loc: `${SITE_URL}/enciclopedia/${article.slug}`,
            lastmod: article.published_at || new Date().toISOString(),
            changefreq: 'weekly',
            priority: '0.9'
        }));
        
        files.push({
            filename: 'sitemap-articles.xml',
            content: createXmlContent(articleUrls),
            type: 'Content'
        });
      }

      // --- 5. Database Content: Doctors ---
      setStatus('Fetching Doctors from Database (Calculating total)...');
      
      // Get exact count first
      const { count: doctorCount, error: countError } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
         console.warn("Could not fetch doctor count", countError);
      }

      const allDoctors: any[] = [];
      let doctorBatchFrom = 0;
      const DOCTOR_BATCH_SIZE = 1000; // Safer batch size for PostgREST
      let keepFetching = true;

      setStatus(`Database contains ${doctorCount || '?'} doctors. Starting retrieval...`);

      while (keepFetching) {
          const { data, error } = await supabase
            .from('doctors')
            .select('slug, updated_at')
            .order('slug', { ascending: true }) // Stable ordering for pagination
            .range(doctorBatchFrom, doctorBatchFrom + DOCTOR_BATCH_SIZE - 1);

          if (error) {
            console.error('Error fetching doctors batch:', error);
            throw error;
          }

          if (data && data.length > 0) {
            allDoctors.push(...data);
            setStatus(`Fetched ${allDoctors.length} / ${doctorCount || '?'} doctors...`);
            
            // If we received fewer items than requested, we've reached the end
            if (data.length < DOCTOR_BATCH_SIZE) {
                keepFetching = false;
            } else {
                doctorBatchFrom += DOCTOR_BATCH_SIZE;
            }
          } else {
            keepFetching = false;
          }
      }

      if (allDoctors.length > 0) {
        const doctorUrls = allDoctors.map((doc: any) => ({
            loc: `${SITE_URL}/medico/${doc.slug}`,
            lastmod: doc.updated_at || new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.6'
        }));

        const doctorChunks = chunkArray(doctorUrls, MAX_URLS_PER_SITEMAP);
        doctorChunks.forEach((chunk, idx) => {
            files.push({
                filename: `sitemap-doctors-${idx + 1}.xml`,
                content: createXmlContent(chunk),
                type: 'Content'
            });
        });
      }

      // --- 6. The Index File ---
      setStatus('Building Sitemap Index...');
      const today = new Date().toISOString().split('T')[0];
      
      let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      files.forEach(file => {
        indexXml += `  <sitemap>\n`;
        indexXml += `    <loc>${SITE_URL}/${file.filename}</loc>\n`;
        indexXml += `    <lastmod>${today}</lastmod>\n`;
        indexXml += `  </sitemap>\n`;
      });
      indexXml += `</sitemapindex>`;

      // Add index to the BEGINNING of the list
      files.unshift({
          filename: 'sitemap-index.xml',
          content: indexXml,
          type: 'Index'
      });

      // --- 7. Robots.txt ---
      setStatus('Generating Robots.txt...');
      const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap-index.xml
`;
      files.push({
          filename: 'robots.txt',
          content: robotsTxt,
          type: 'Config'
      });

      setGeneratedMaps(files);
      setStatus(`Complete! Generated ${files.length} files handling ${allDoctors.length} doctors.`);

    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const type = filename.endsWith('.xml') ? 'text/xml' : 'text/plain';
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group files for display
  const groupedFiles: Record<string, GeneratedFile[]> = {};
  generatedMaps.forEach(f => {
      if (!groupedFiles[f.type]) groupedFiles[f.type] = [];
      groupedFiles[f.type].push(f);
  });

  return (
    <div className="bg-white shadow rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Sitemap Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">Generate segmented XML sitemaps for Google Search Console.</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-3">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <div>
             <p className="font-semibold mb-1">Configuration</p>
             <p>Domain: <strong>{SITE_URL}</strong></p>
             <p>Limit per file: <strong>{MAX_URLS_PER_SITEMAP} URLs</strong></p>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
           {!loading && generatedMaps.length === 0 && (
             <div className="text-center">
               <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <button
                  onClick={generateSitemaps}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
               >
                 Generate Sitemaps
               </button>
             </div>
           )}

           {loading && (
             <div className="text-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-slate-600 font-medium">{status}</p>
             </div>
           )}

           {generatedMaps.length > 0 && (
             <div className="w-full px-4 md:px-8">
                <div className="flex items-center justify-center gap-2 mb-6 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold text-lg">Generation Successful</span>
                </div>

                {/* Instructions */}
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-2">Instructions to Install:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Create a folder named <code>public</code> in your project root directory.</li>
                                <li>Download <strong>all</strong> files listed below.</li>
                                <li>Move the downloaded files into the <code>public</code> folder.</li>
                                <li>Deploy your project.</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    {/* Index & Config Highlight */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Index */}
                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="font-bold text-indigo-900">sitemap-index.xml</p>
                                    <p className="text-xs text-indigo-700">Submit to Google</p>
                                </div>
                            </div>
                            <button
                                onClick={() => downloadFile('sitemap-index.xml', generatedMaps.find(f => f.filename === 'sitemap-index.xml')?.content || '')}
                                className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-indigo-200"
                            >
                                Download
                            </button>
                        </div>
                        {/* Robots */}
                        <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <div>
                                    <p className="font-bold text-slate-900">robots.txt</p>
                                    <p className="text-xs text-slate-700">Crawler Instructions</p>
                                </div>
                            </div>
                            <button
                                onClick={() => downloadFile('robots.txt', generatedMaps.find(f => f.filename === 'robots.txt')?.content || '')}
                                className="bg-white text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-slate-300"
                            >
                                Download
                            </button>
                        </div>
                    </div>

                    {/* Sub-sitemaps Groups */}
                    {Object.entries(groupedFiles)
                        .filter(([type]) => type !== 'Index' && type !== 'Config')
                        .map(([type, files]) => (
                        <div key={type}>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{type} Sitemaps</h3>
                            <div className="grid gap-2">
                                {files.map((map, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileCode className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{map.filename}</p>
                                                <p className="text-[10px] text-slate-400">{(map.content.length / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => downloadFile(map.filename, map.content)}
                                            className="text-slate-500 hover:text-indigo-600 p-1.5 hover:bg-white rounded transition-colors"
                                            title="Download XML"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <button
                  onClick={generateSitemaps}
                  className="mt-8 text-sm text-slate-500 hover:text-slate-800 underline block mx-auto"
                >
                    Regenerate All
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};