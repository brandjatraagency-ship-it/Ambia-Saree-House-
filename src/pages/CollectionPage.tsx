import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductFilterBar } from '../components/ProductFilterBar';
import { FabricPills } from '../components/FabricPills';
import { ArrowLeft, Sparkles, PackageOpen } from 'lucide-react';

const FABRIC_DESCRIPTIONS: Record<string, { title: string; subtitle: string; desc: string }> = {
  'জামদানি': {
    title: 'ঐতিহ্যবাহী ঢাকai জামদানি কালেকশন',
    subtitle: 'UNESCO স্বীকৃত আবহমান বাংলার অমূল্য হস্তশিল্প',
    desc: 'রূপগঞ্জ ও শীতলক্ষ্যা তীরের দক্ষ তাঁতিদের নিখুঁত হাতে বোনা খাঁটি ঢাকাই জামদানি। সূক্ষ্ম সুতা ও জটিল নকশার অনন্য আভিজাত্য।'
  },
  'কাতান': {
    title: 'রাজকীয় বেনারসি ও কাতান কালেকশন',
    subtitle: 'বিয়ে, বউভাত ও জমকালো অনুষ্ঠানের প্রথম পছন্দ',
    desc: 'মিরপুর বেনারসি পল্লী ও ঐতিহ্যবাহী তাঁতের খাঁটি জরি ও রেশম সুতার রাজকীয় কাতান শাড়ি। ব্রাইডাল সাজের সেরা প্রতীক।'
  },
  'মসলিন': {
    title: 'অভিজাত খাঁটি মসলিন শাড়ি',
    subtitle: 'মুঘল আমলের ঐতিহ্য, হাওয়ায় ভাসা কোমলতা',
    desc: 'অত্যন্ত মোলায়েম ও উচ্চ কাউন্টের খাঁটি সুতায় তৈরি রাজকীয় মসলিন। যেকোনো অভিজাত পার্টি ও বিশেষ দিনের সেরা সম্ভার।'
  },
  'সিল্ক': {
    title: 'খাঁটি রাজশাহী রেশম ও তসর সিল্ক',
    subtitle: 'রেশম কন্যার দেশ থেকে সংগৃহীত খাঁটি সিল্ক',
    desc: 'প্রাকৃতিক রেশম গুটি থেকে উৎপাদিত খাঁটি সিল্ক শাড়ি। চমৎকার ফল ও দীর্ঘস্থায়ী আভিজাত্য।'
  },
  'তাঁত ও কটন': {
    title: 'টাঙ্গাইল তাঁত ও প্রিমিয়াম কটন শাড়ি',
    subtitle: 'দৈনন্দিন পরার আরাম ও উৎসবের স্নিগ্ধ রূপ',
    desc: '১০০% পিওর সুতি সুতায় বোনা আরামদায়ক টাঙ্গাইল তাঁতের শাড়ি। গরমে আরাম ও মার্জিত আউটলুক।'
  },
  'বেনারসি': {
    title: 'এক্সক্লুসিভ ব্রাইডাল বেনারসি কালেকশন',
    subtitle: 'বিয়ের কনের স্বপ্নিল রাজকীয় সাজ',
    desc: 'ঘন ভারী জরির কাজ, মিনা ও বুটি নকশায় সাজানো জমকালো বেনারসি শাড়ির অনন্য সংগ্রহ।'
  },
  'অর্গানজা': {
    title: 'মডার্ন অর্গানজা ও শিফন শাড়ি',
    subtitle: 'সমসাময়িক ট্রেন্ডি ডিজাইন ও হালকা আরাম',
    desc: 'তরুণীদের পছন্দের আধুনিক প্যাস্টেল শেড ও ফ্লোরাল এমব্রয়ডারি করা লাক্সারি অর্গানজা ও শিফন।'
  }
};

export const CollectionPage: React.FC = () => {
  const { 
    products, 
    currentCategory, 
    setCurrentCategory,
    navigateTo 
  } = useStore();

  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [onlyBlousePiece, setOnlyBlousePiece] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const activeFabric = currentCategory || 'জামদানি';
  const fabricInfo = FABRIC_DESCRIPTIONS[activeFabric] || {
    title: `${activeFabric} শাড়ি কালেকশন`,
    subtitle: 'প্রিমিয়াম শাড়ির অনন্য সংগ্রহ',
    desc: 'আম্বিয়া শাড়ি হাউসের এক্সক্লুসিভ ডিজাইনার শাড়ির সংগ্রহ।'
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p || !p.id) return false;
      if (activeFabric && p.fabric !== activeFabric) return false;
      if (selectedOccasion && selectedOccasion !== 'সকল অনুষ্ঠান') {
        const match = Array.isArray(p.occasion) && p.occasion.some(occ => occ.includes(selectedOccasion) || selectedOccasion.includes(occ));
        if (!match) return false;
      }
      if (selectedColor && !p.color.toLowerCase().includes(selectedColor.toLowerCase())) {
        return false;
      }
      if (selectedPriceRange) {
        if (selectedPriceRange === 'under-3000' && p.price >= 3000) return false;
        if (selectedPriceRange === '3000-8000' && (p.price < 3000 || p.price > 8000)) return false;
        if (selectedPriceRange === '8000-15000' && (p.price < 8000 || p.price > 15000)) return false;
        if (selectedPriceRange === 'above-15000' && p.price <= 15000) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchCode = (p.code || '').toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }
      if (onlyBlousePiece && !p.hasBlousePiece) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'discount': return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'newest': return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'popular': return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'featured':
        default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, activeFabric, selectedOccasion, selectedColor, selectedPriceRange, searchQuery, selectedSort, onlyBlousePiece, onlyInStock]);

  const handleResetFilters = () => {
    setSelectedOccasion('');
    setSelectedColor('');
    setSelectedPriceRange('');
    setSearchQuery('');
    setSelectedSort('featured');
    setOnlyBlousePiece(false);
    setOnlyInStock(false);
  };

  return (
    <div id="collection-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
      {/* Category Hero Banner */}
      <section className="bg-gradient-to-b from-stone-900 via-[#3D0A14] to-[#1A050A] text-amber-100 py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-900/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-center">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition-colors bg-white/5 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>সকল কালেকশনে ফিরে যান</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold font-serif-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{fabricInfo.subtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-100 font-serif-brand">
            {fabricInfo.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-bangla leading-relaxed">
            {fabricInfo.desc}
          </p>
        </div>
      </section>

      {/* Fabric Switcher Bar */}
      <div className="bg-white dark:bg-[#1A1218] border-b border-stone-200/90 dark:border-stone-800 py-4 shadow-xs sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FabricPills
            selectedFabric={activeFabric}
            onSelectFabric={(fab) => setCurrentCategory(fab)}
          />
        </div>
      </div>

      {/* Main Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Filters */}
        <ProductFilterBar
          selectedOccasion={selectedOccasion}
          onSelectOccasion={setSelectedOccasion}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
          sortBy={selectedSort}
          onSortChange={setSelectedSort}
          inStockOnly={onlyInStock}
          onToggleInStock={() => setOnlyInStock(!onlyInStock)}
          hasBlousePieceOnly={onlyBlousePiece}
          onToggleBlousePiece={() => setOnlyBlousePiece(!onlyBlousePiece)}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          selectedFabric={activeFabric}
          onClearFabric={() => navigateTo('home')}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          hasActiveFilters={Boolean(selectedOccasion || selectedColor || selectedPriceRange || searchQuery || onlyBlousePiece || onlyInStock)}
          totalFilteredCount={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#1E171C] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">কোনো শাড়ি মেলেনি</h3>
            <p className="text-xs text-stone-500">
              নির্বাচিত ফিল্টারের সাথে এই কালেকশনে কোনো পণ্য খুঁজে পাওয়া যায়নি।
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#6B1728] hover:bg-[#52111e] text-amber-100 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

    </div>
  );
};
