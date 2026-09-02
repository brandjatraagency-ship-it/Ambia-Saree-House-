import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SEOSettings, SareeProduct } from '../../types';
import { 
  Globe, 
  Search, 
  Sparkles, 
  Share2, 
  FileCode, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Save, 
  Smartphone, 
  Monitor, 
  Check, 
  Eye, 
  ShieldCheck, 
  Tag, 
  Layers, 
  FileText, 
  Info,
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCheck
} from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { seoSettings, updateSEOSettings, settings, products, showToast } = useStore();

  const [formData, setFormData] = useState<SEOSettings>({ ...seoSettings });
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'google-preview' | 'social' | 'tracking' | 'sitemap' | 'product-audit'>('meta');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'facebook' | 'whatsapp' | 'twitter'>('facebook');
  const [newKeyword, setNewKeyword] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAuditProduct, setSelectedAuditProduct] = useState<SareeProduct | null>(null);

  const keywordsList = formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const updated = [...keywordsList, newKeyword.trim()];
    setFormData(prev => ({ ...prev, metaKeywords: updated.join(', ') }));
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const updated = keywordsList.filter(k => k !== keywordToRemove);
    setFormData(prev => ({ ...prev, metaKeywords: updated.join(', ') }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSEOSettings(formData);
  };

  // SEO Health Score Calculation
  const calculateScore = () => {
    let score = 0;
    // Title checks
    if (formData.metaTitle.length >= 30 && formData.metaTitle.length <= 65) score += 20;
    else if (formData.metaTitle.length > 0) score += 10;

    // Description checks
    if (formData.metaDescription.length >= 100 && formData.metaDescription.length <= 165) score += 20;
    else if (formData.metaDescription.length > 0) score += 10;

    // Keywords
    if (keywordsList.length >= 4) score += 15;
    else if (keywordsList.length > 0) score += 8;

    // Canonical & Robots
    if (formData.canonicalUrl && formData.robotsIndex && formData.robotsFollow) score += 15;

    // Social & OG
    if (formData.ogImage && formData.ogTitle) score += 15;

    // Tracking / Verification
    if (formData.googleSearchConsoleCode || formData.googleAnalyticsId || formData.facebookPixelId) score += 15;

    return Math.min(100, score);
  };

  const seoScore = calculateScore();

  // Generate XML Sitemap string
  const generateSitemapXml = () => {
    const baseUrl = formData.canonicalUrl ? formData.canonicalUrl.replace(/\/$/, '') : 'https://ambiasareehouse.com';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { loc: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/?page=category&fabric=জামদানি`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?page=category&fabric=কাতান`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?page=category&fabric=মসলিন`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?page=category&fabric=সিল্ক`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/?page=category&fabric=তাঁত ও কটন`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/?page=category&fabric=বেনারসি`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?page=category&fabric=অর্গানজা`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/?page=care`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/?page=about`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/?page=contact`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/?page=track`, priority: '0.7', changefreq: 'daily' },
    ];

    const productPages = products.map(prod => ({
      loc: `${baseUrl}/?page=product&id=${prod.id}`,
      priority: prod.isFeatured || prod.isBestSeller ? '0.95' : '0.85',
      changefreq: 'weekly',
      lastmod: today
    }));

    const allUrls = [...staticPages, ...productPages];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    allUrls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('sitemap.xml ডাউনলোড সম্পন্ন হয়েছে!', 'success');
  };

  // Structured Data Schema preview
  const generateSchemaJson = () => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': formData.schemaType || 'ClothingStore',
      'name': settings.storeName,
      'description': formData.metaDescription,
      'url': formData.canonicalUrl,
      'telephone': settings.phone,
      'email': settings.email,
      'priceRange': '৳৳',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': settings.address,
        'addressLocality': 'Dhaka',
        'addressCountry': 'BD'
      },
      'image': formData.ogImage,
      'sameAs': [
        'https://facebook.com/ambiasareehouse',
        'https://instagram.com/ambiasareehouse'
      ]
    }, null, 2);
  };

  return (
    <div id="admin-seo-management" className="space-y-8 animate-fadeIn text-stone-900 dark:text-stone-100">
      
      {/* Top Banner with SEO Score */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 dark:from-[#191418] dark:via-[#22181F] dark:to-[#171216] border border-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও ট্রাফিক বুস্টার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-brand font-bold text-amber-100">
              সার্চ ইঞ্জিন ও মেটা ট্যাগ ম্যানেজার
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              গুগল, বিং ও ফেসবুক সার্চে আম্বিয়া শাড়ি হাউসকে ১ নম্বরে র্যাংক করানোর জন্য সম্পূর্ণ এসইও কন্ট্রোল প্যানেল। মেটা ট্যাগ, লাইভ স্নsnippet, স্কিমা ও সাইটম্যাপ ম্যানেজ করুন।
            </p>
          </div>

          {/* SEO Score Box */}
          <div className="flex items-center gap-4 bg-stone-900/80 dark:bg-stone-950/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-stone-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={`${
                    seoScore >= 80 ? 'text-emerald-400' : seoScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                  } transition-all duration-1000 ease-out`}
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * seoScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold font-mono">{seoScore}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">এসইও হেলথ স্কোর</div>
              <div className="text-sm font-bold text-amber-200">
                {seoScore >= 80 ? 'অসাধারণ (Excellent)' : seoScore >= 60 ? 'ভালো (Good)' : 'উন্নতি প্রয়োজন (Needs Work)'}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {products.length}টি শাড়ি স্বয়ংক্রিয় ইনডেক্সভুক্ত
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-300 dark:border-stone-800 scrollbar-none">
        <button
          id="seo-subtab-meta"
          onClick={() => setActiveSubTab('meta')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'meta'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>মেটা ট্যাগ ও বেসিক সেটিংস</span>
        </button>

        <button
          id="seo-subtab-google"
          onClick={() => setActiveSubTab('google-preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'google-preview'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>গুগল সার্চ সিমুলেটর</span>
        </button>

        <button
          id="seo-subtab-social"
          onClick={() => setActiveSubTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'social'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>সোশ্যাল ও ফেসবুক প্রিভিউ (OG)</span>
        </button>

        <button
          id="seo-subtab-audit"
          onClick={() => setActiveSubTab('product-audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'product-audit'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>শাড়ি প্রোডাক্ট এসইও অডিট ({products.length})</span>
        </button>

        <button
          id="seo-subtab-tracking"
          onClick={() => setActiveSubTab('tracking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'tracking'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>সার্চ কনসোল ও পিক্সেল</span>
        </button>

        <button
          id="seo-subtab-sitemap"
          onClick={() => setActiveSubTab('sitemap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'sitemap'
              ? 'bg-[#6B1728] text-amber-100 shadow-sm'
              : 'bg-white dark:bg-[#1E171C] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>সাইটম্যাপ ও রোবটস (XML)</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SUBTAB 1: Meta Tags & Basic Settings */}
        {activeSubTab === 'meta' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                    <Globe className="w-5 h-5 text-amber-500" />
                    মূল মেটা ট্যাগ কনফিগারেশন
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    গুগলে সার্চ করার সময় টাইটেল ও ডেসক্রিপশন কেমন দেখাবে তা নিয়ন্ত্রণ করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      metaTitle: `${settings.storeName} | খাঁটি জামদানি, কাতান, মসলিন ও বেনারসি শাড়ির অনলাইন শপ`,
                      metaDescription: `${settings.storeName} - ঐতিহ্যবাহী আদি ঢাকাই জামদানি, ব্রাইডাল বেনারসি কাতান ও খাঁটি মসলিন শাড়ি কিনুন সুলভ মূল্যে। সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি।`
                    }));
                    showToast('ডিফল্ট মেটা সাজেস্ট করা হয়েছে!', 'info');
                  }}
                  className="text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>অটো-সাজেস্ট</span>
                </button>
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="meta-title-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    মেটা টাইটেল (Page Title) <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono font-medium ${
                    formData.metaTitle.length >= 50 && formData.metaTitle.length <= 65
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : formData.metaTitle.length > 65
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}>
                    {formData.metaTitle.length}/৬০ অক্ষর {formData.metaTitle.length >= 50 && formData.metaTitle.length <= 65 ? '(আদর্শ মাপ)' : ''}
                  </span>
                </div>
                <input
                  id="meta-title-input"
                  type="text"
                  value={formData.metaTitle}
                  onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="যেমন: আম্বিয়া শাড়ি হাউস | খাঁটি জামদানি ও বেনারসি শাড়ি..."
                  className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  required
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  পরামর্শ: ৫০ থেকে ৬০ অক্ষরের মধ্যে রাখুন এবং ব্র্যান্ডের নাম ও মূল শাড়ির ধরন উল্লেখ করুন।
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="meta-desc-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    মেটা ডেসক্রিপশন (Meta Description) <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono font-medium ${
                    formData.metaDescription.length >= 130 && formData.metaDescription.length <= 165
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : formData.metaDescription.length > 165
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}>
                    {formData.metaDescription.length}/১৬০ অক্ষর {formData.metaDescription.length >= 130 && formData.metaDescription.length <= 165 ? '(আদর্শ মাপ)' : ''}
                  </span>
                </div>
                <textarea
                  id="meta-desc-input"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="আপনার শাড়ি শপের বৈশিষ্ট্য, হোম ডেলিভারি, কালেকশনের বিবরণ লিখুন..."
                  className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  required
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  পরামর্শ: ১৩০ থেকে ১৬০ অক্ষরের মধ্যে লিখুন। ক্যাশ অন ডেলিভারি, জামদানি ও বিয়ের শাড়ি কি-ওয়ার্ড রাখুন।
                </p>
              </div>

              {/* Keywords Tagging */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>টার্গেটেড এসইও কি-ওয়ার্ডস (SEO Keywords)</span>
                </label>
                
                <div className="flex gap-2">
                  <input
                    id="new-keyword-input"
                    type="text"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="নতুন কি-ওয়ার্ড লিখুন (যেমন: বিয়ের লাল বেনারসি শাড়ি)"
                    className="flex-1 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-amber-100 text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all"
                  >
                    যোগ করুন
                  </button>
                </div>

                {/* Keyword Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {keywordsList.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full font-medium"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-rose-500 ml-1 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {keywordsList.length === 0 && (
                    <span className="text-xs text-stone-400 italic">কোনো কি-ওয়ার্ড যুক্ত করা হয়নি।</span>
                  )}
                </div>
              </div>

              {/* Canonical URL & Indexing Directives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="space-y-2">
                  <label htmlFor="canonical-url-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    ক্যানোনিকাল ডোমেইন URL (Canonical URL)
                  </label>
                  <input
                    id="canonical-url-input"
                    type="url"
                    value={formData.canonicalUrl}
                    onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder="https://ambiasareehouse.com"
                    className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100 font-mono text-xs"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">ডুপ্লিকেট কন্টেন্ট সমস্যা এড়াতে মূল সাইট লিংক।</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="schema-type-select" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    স্কিমা.অর্গ টাইপ (Structured Data Type)
                  </label>
                  <select
                    id="schema-type-select"
                    value={formData.schemaType}
                    onChange={e => setFormData({ ...formData, schemaType: e.target.value as any })}
                    className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  >
                    <option value="ClothingStore">ClothingStore (শাড়ির দোকান / বুটিক শপ)</option>
                    <option value="Store">Store (সাধারণ অনলাইন স্টোর)</option>
                    <option value="Organization">Organization (প্রতিষ্ঠান / ব্র্যান্ড)</option>
                  </select>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">গুগল রিচ রেজাল্টের জন্য ClothingStore সবচেয়ে কার্যকর।</p>
                </div>
              </div>

              {/* Robots Directives */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200">সার্চ ইঞ্জিন ক্রলিং ও ইনডেক্সিং পলিসি</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">গুগল বটকে সাইটের সব পেজ পড়ার অনুমতি দিন</div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.robotsIndex}
                      onChange={e => setFormData({ ...formData, robotsIndex: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>ইনডেক্সিং চালু (Index)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.robotsFollow}
                      onChange={e => setFormData({ ...formData, robotsFollow: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>লিংক ফলো (Follow)</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 2: Google Search Result Simulator */}
        {activeSubTab === 'google-preview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                    <Search className="w-5 h-5 text-amber-500" />
                    লাইভ গুগল সার্চ প্রিভিউ সিমুলেটর
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    গুগলে আপনার ওয়েবসাইট সার্চ করলে কাস্টমাররা যেভাবে দেখতে পাবে
                  </p>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>ডেস্কটপ ভিউ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>মোবাইল ভিউ</span>
                  </button>
                </div>
              </div>

              {/* Google Result Preview Box */}
              <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-md bg-stone-50 dark:bg-stone-900 p-4 rounded-3xl border-2 border-stone-300 dark:border-stone-700 shadow-lg' : 'max-w-3xl bg-white dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm'}`}>
                
                {/* Search Bar Visual */}
                <div className="flex items-center gap-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-full px-4 py-2 mb-6 text-xs text-stone-500 shadow-xs">
                  <Search className="w-4 h-4 text-stone-400" />
                  <span className="text-stone-800 dark:text-stone-200 font-medium">জামদানি শাড়ি অনলাইন শপ বাংলাদেশ</span>
                </div>

                {/* The Google Result Snippet */}
                <div className="space-y-1.5 text-left font-sans">
                  {/* Favicon & Breadcrumb */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#6B1728] text-amber-200 flex items-center justify-center text-[10px] font-bold border border-amber-400/30">
                      আ
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-stone-800 dark:text-stone-200 font-medium leading-none">
                        {settings.storeName}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-none pt-0.5">
                        {formData.canonicalUrl || 'https://ambiasareehouse.com'}
                      </span>
                    </div>
                  </div>

                  {/* Clickable Blue Title */}
                  <h3 className="text-lg sm:text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug pt-1">
                    {formData.metaTitle || 'আম্বিয়া শাড়ি হাউস | খাঁটি জামদানি ও ব্রাইডাল শাড়ি'}
                  </h3>

                  {/* Star Rating Rich Snippet */}
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold py-0.5">
                    <span>★★★★★</span>
                    <span className="text-stone-600 dark:text-stone-300">৪.৯ (৩৪০+ কাস্টমার রিভিউ)</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-600 dark:text-stone-300">মূল্য: ৳ ২,৪৫০ - ৳ ১৮,৫০০</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">স্টকে আছে</span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-0.5">
                    {formData.metaDescription || 'আম্বিয়া শাড়ি হাউস - ঐতিহ্যবাহী আদি ঢাকাই জামদানি, ব্রাইডাল বেনারসি কাতান ও খাঁটি মসলিন শাড়ি কিনুন সুলভ মূল্যে। সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি।'}
                  </p>

                  {/* Google Sitelinks Preview */}
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <div className="bg-stone-50 dark:bg-stone-950 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8]">ঢাকাই জামদানি কালেকশন</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">রূপগঞ্জের খাঁটি হাতে বোনা সুতি ও রেশম জামদানি</div>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-950 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8]">ব্রাইডাল বেনারসি কাতান</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">মিরপুর বেনারসি পল্লীর এক্সক্লুসিভ বিয়ের শাড়ি</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Diagnostic Checklist */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  এসইও ডায়াগনস্টিক চেকলিস্ট
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    {formData.metaTitle.length >= 40 && formData.metaTitle.length <= 65 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">টাইটেল দৈর্ঘ্য: </span>
                      <span className="text-stone-500 dark:text-stone-400">{formData.metaTitle.length} অক্ষর (লক্ষ্য: ৫০-৬০)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    {formData.metaDescription.length >= 120 && formData.metaDescription.length <= 165 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">ডেসক্রিপশন দৈর্ঘ্য: </span>
                      <span className="text-stone-500 dark:text-stone-400">{formData.metaDescription.length} অক্ষর (লক্ষ্য: ১৩০-১৬০)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">স্কিমা স্ট্রাকচার্ড ডাটা: </span>
                      <span className="text-stone-500 dark:text-stone-400">JSON-LD {formData.schemaType} সক্রিয়</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">মোবাইল অপ্টিমাইজেশন: </span>
                      <span className="text-stone-500 dark:text-stone-400">১০০% রেস্পন্সিভ ও ফাস্ট লোডিং</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 3: Social & Open Graph (OG) Preview */}
        {activeSubTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                    <Share2 className="w-5 h-5 text-amber-500" />
                    সোশ্যাল মিডিয়া ও ওপেন গ্রাফ (OG) শেয়ার কার্ড
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    ফেসবুক, হোয়াটসঅ্যাপ ও টুইটারে লিংক শেয়ার করলে যে ছবি ও লেখা শো করবে
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSocialPlatform('facebook')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      socialPlatform === 'facebook'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    ফেসবুক (Facebook)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPlatform('whatsapp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      socialPlatform === 'whatsapp'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    হোয়াটসঅ্যাপ (WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPlatform('twitter')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      socialPlatform === 'twitter'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    Twitter / X
                  </button>
                </div>
              </div>

              {/* Social Preview Container */}
              <div className="max-w-xl mx-auto">
                
                {socialPlatform === 'facebook' && (
                  <div className="bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl overflow-hidden shadow-md">
                    <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        f
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{settings.storeName}</div>
                        <div className="text-[10px] text-stone-500">Sponsored • 🌐</div>
                      </div>
                    </div>
                    
                    <div className="relative aspect-video w-full bg-stone-800 overflow-hidden">
                      <img
                        src={formData.ogImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                        alt="OG Social Banner"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider font-mono">
                        {formData.canonicalUrl ? new URL(formData.canonicalUrl).hostname : 'AMBIASAREEHOUSE.COM'}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mt-0.5">
                        {formData.ogTitle || formData.metaTitle}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                        {formData.ogDescription || formData.metaDescription}
                      </p>
                    </div>
                  </div>
                )}

                {socialPlatform === 'whatsapp' && (
                  <div className="bg-[#EFEAE2] dark:bg-[#0B141A] p-4 rounded-2xl border border-stone-300 dark:border-stone-800 shadow-md">
                    <div className="bg-white dark:bg-[#1F2C34] rounded-xl overflow-hidden shadow-sm max-w-sm ml-auto border border-emerald-500/30">
                      <img
                        src={formData.ogImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                        alt="WhatsApp Preview"
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3 bg-stone-50 dark:bg-[#1F2C34]">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {formData.ogTitle || formData.metaTitle}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                          {formData.ogDescription || formData.metaDescription}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                          {formData.canonicalUrl || 'https://ambiasareehouse.com'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {socialPlatform === 'twitter' && (
                  <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={formData.ogImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                      alt="Twitter Card"
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
                      <div className="text-[11px] text-stone-500 font-mono">ambiasareehouse.com</div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mt-0.5">
                        {formData.ogTitle || formData.metaTitle}
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 mt-0.5">
                        {formData.ogDescription || formData.metaDescription}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Social OG Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="space-y-2">
                  <label htmlFor="og-title-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    সোশ্যাল শেয়ার টাইটেল (OG Title)
                  </label>
                  <input
                    id="og-title-input"
                    type="text"
                    value={formData.ogTitle}
                    onChange={e => setFormData({ ...formData, ogTitle: e.target.value })}
                    placeholder="সোশ্যাল টাইটেল লিখুন..."
                    className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="og-image-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    সোশ্যাল ব্যানার ইমেজ URL (OG Image 1200x630px)
                  </label>
                  <input
                    id="og-image-input"
                    type="url"
                    value={formData.ogImage}
                    onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100 text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="og-desc-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    সোশ্যাল শেয়ার ডেসক্রিপশন (OG Description)
                  </label>
                  <textarea
                    id="og-desc-input"
                    rows={2}
                    value={formData.ogDescription}
                    onChange={e => setFormData({ ...formData, ogDescription: e.target.value })}
                    placeholder="ফেসবুক বা মেসেঞ্জারে শেয়ার করলে যে ছোট বিবরণ দেখাবে..."
                    className="w-full text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 4: Product SEO Audit */}
        {activeSubTab === 'product-audit' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    শাড়ি ক্যাটালগ এসইও অডিটর ও হেলথ চেকার
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    প্রতিটি শাড়ির মেটা ট্যাগ, ডেসক্রিপশন দৈর্ঘ্য ও গুগল ইনডেক্সিং স্ট্যাটাস
                  </p>
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
                  {products.length}টি শাড়ি স্ক্যান সম্পন্ন
                </div>
              </div>

              {/* Product Audit Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-600 dark:text-stone-400">
                      <th className="py-3 px-4 rounded-l-xl">শাড়ির নাম ও কোড</th>
                      <th className="py-3 px-4">ফ্যাব্রিক ও ক্যাটাগরি</th>
                      <th className="py-3 px-4">ডেসক্রিপশন কোয়ালিটি</th>
                      <th className="py-3 px-4">ইমেজ এসইও</th>
                      <th className="py-3 px-4">এসইও রেটিং</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {products.map(prod => {
                      const descLength = prod.description ? prod.description.length : 0;
                      const hasImages = prod.images && prod.images.length > 0;
                      const isDescGood = descLength >= 80;
                      const productSeoScore = (isDescGood ? 40 : 20) + (hasImages ? 30 : 0) + (prod.code ? 15 : 0) + (prod.fabric ? 15 : 0);

                      return (
                        <tr key={prod.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1">{prod.name}</div>
                                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">{prod.code} • {prod.nameEn}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md text-[11px] font-medium">
                              {prod.fabric}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {isDescGood ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>উত্তম ({descLength} অক্ষর)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>ছোট ডেসক্রিপশন</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[11px] text-stone-600 dark:text-stone-300">
                              {prod.images.length}টি হাই-রেজ ছবি
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${productSeoScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  style={{ width: `${productSeoScore}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-[11px]">{productSeoScore}%</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAuditProduct(prod);
                                showToast(`"${prod.name}" এর এসইও রিভিউ মোড চালু হয়েছে`, 'info');
                              }}
                              className="text-xs bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-xl font-semibold transition-all"
                            >
                              ভিউ স্লিপ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Product Modal Preview if selected */}
              {selectedAuditProduct && (
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      শাড়ি এসইও ট্যাগ: {selectedAuditProduct.name} ({selectedAuditProduct.code})
                    </div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-300">
                      গুগল সার্চ ইউআরএল: <span className="font-mono text-amber-700 dark:text-amber-300">{formData.canonicalUrl}/?page=product&id={selectedAuditProduct.id}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAuditProduct(null)}
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-xs font-bold"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SUBTAB 5: Tracking & Webmaster */}
        {activeSubTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                  গুগল সার্চ কনসোল ও অ্যানালিটিক্স ইন্টিগ্রেশন
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  ওয়েবসাইটে কত ভিজিটর আসছে ও কোন সার্চ থেকে অর্ডার হচ্ছে তা ট্র্যাকিং করার কোড
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Search Console */}
                <div className="space-y-2">
                  <label htmlFor="gsc-input" className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>Google Search Console HTML ভেরিফিকেশন ট্যাগ</span>
                  </label>
                  <input
                    id="gsc-input"
                    type="text"
                    value={formData.googleSearchConsoleCode}
                    onChange={e => setFormData({ ...formData, googleSearchConsoleCode: e.target.value })}
                    placeholder="যেমন: google-site-verification=xxxx..."
                    className="w-full text-xs font-mono bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Google Search Console থেকে প্রাপ্ত মেটা ট্যাগ বা ভেরিফিকেশন কোড পেস্ট করুন।
                  </p>
                </div>

                {/* Google Analytics 4 */}
                <div className="space-y-2">
                  <label htmlFor="ga4-input" className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    <span>Google Analytics 4 (GA4) Measurement ID</span>
                  </label>
                  <input
                    id="ga4-input"
                    type="text"
                    value={formData.googleAnalyticsId}
                    onChange={e => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    placeholder="যেমন: G-ASH2026BD99"
                    className="w-full text-xs font-mono bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    লাইভ ট্রাফিক ও ইউজার সেশন পরিমাপের জন্য গুগল অ্যানালিটিক্স আইডি।
                  </p>
                </div>

                {/* Facebook Pixel ID */}
                <div className="space-y-2">
                  <label htmlFor="pixel-input" className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook Pixel ID (মেটা কনভার্সন ট্র্যাকিং)</span>
                  </label>
                  <input
                    id="pixel-input"
                    type="text"
                    value={formData.facebookPixelId}
                    onChange={e => setFormData({ ...formData, facebookPixelId: e.target.value })}
                    placeholder="যেমন: 109283746501928"
                    className="w-full text-xs font-mono bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    ফেসবুক বুস্টিং ও অ্যাড রিটার্গেটিং ক্যাম্পেইনের জন্য পিক্সেল আইডি।
                  </p>
                </div>

                {/* Organization Legal Name */}
                <div className="space-y-2">
                  <label htmlFor="org-name-input" className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>আইনি ব্র্যান্ড ও প্রতিষ্ঠান নাম (Organization Schema)</span>
                  </label>
                  <input
                    id="org-name-input"
                    type="text"
                    value={formData.organizationName}
                    onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="Ambia Saree House"
                    className="w-full text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    নলেজ গ্রাফ ও গুগল বিজনেসে শো করার জন্য অফিশিয়াল নাম।
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 6: Sitemap.xml & Robots.txt */}
        {activeSubTab === 'sitemap' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-brand">
                    <FileCode className="w-5 h-5 text-amber-500" />
                    ডায়নামিক XML সাইটম্যাপ ও Robots.txt ম্যানেজার
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    সকল ক্যাটাগরি ও শাড়ির পেজ গুগলে ইনডেক্স করানোর জন্য অটোমেটিক সাইটম্যাপ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSitemap}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>sitemap.xml ডাউনলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(generateSitemapXml(), 'sitemap')}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-amber-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
                  >
                    {copiedKey === 'sitemap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'sitemap' ? 'কপি হয়েছে' : 'XML কোড কপি'}</span>
                  </button>
                </div>
              </div>

              {/* Sitemap Live Code Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    অটো-জেনারেটেড XML সাইটম্যাপ প্রিভিউ ({products.length + 12} টি URL)
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    Google Sitemap Protocol 0.9 Compliant
                  </span>
                </div>
                <pre className="text-[11px] font-mono bg-stone-950 text-stone-300 p-4 rounded-2xl border border-stone-800 overflow-x-auto max-h-56 scrollbar-thin">
                  {generateSitemapXml()}
                </pre>
              </div>

              {/* Schema JSON-LD Structured Data */}
              <div className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Schema.org JSON-LD স্ট্রাকচার্ড ডাটা
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generateSchemaJson(), 'schema')}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'schema' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'schema' ? 'কপি হয়েছে' : 'JSON কপি করুন'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-stone-950 text-amber-200/90 p-4 rounded-2xl border border-stone-800 overflow-x-auto max-h-52 scrollbar-thin">
                  {generateSchemaJson()}
                </pre>
              </div>

              {/* Robots.txt Editor */}
              <div className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                <label htmlFor="robots-txt-input" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Robots.txt ফাইল কনফিগারেশন
                </label>
                <textarea
                  id="robots-txt-input"
                  rows={4}
                  value={formData.customRobotsTxt}
                  onChange={e => setFormData({ ...formData, customRobotsTxt: e.target.value })}
                  placeholder="User-agent: *&#10;Allow: /"
                  className="w-full text-xs font-mono bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:text-stone-100"
                />
              </div>

            </div>
          </div>
        )}

        {/* Sticky Action Bar */}
        <div className="sticky bottom-4 z-20 bg-stone-950/90 dark:bg-[#191418]/90 backdrop-blur-md border border-stone-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-100">
                এসইও সেটিংস সংরক্ষণ করতে চান?
              </div>
              <div className="text-[11px] text-stone-400 hidden sm:block">
                সেভ বাটনে চাপ দিলে সঙ্গে সঙ্গে মেটা ট্যাগ ও গুগলের ইনডেক্সিং কনফিগ আপডেট হবে।
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...seoSettings });
                showToast('পরিবর্তন বাতিল করা হয়েছে', 'info');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
            >
              রিসেট
            </button>
            <button
              id="save-seo-settings-btn"
              type="submit"
              className="flex items-center gap-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
