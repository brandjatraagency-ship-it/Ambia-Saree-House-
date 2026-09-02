import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { SareeProduct } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Award, 
  Clock, 
  Check, 
  Star,
  Layers,
  Flame
} from 'lucide-react';

interface HeroBannerProps {
  onShopNowClick?: () => void;
  onSelectFabric?: (fabric: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onShopNowClick,
  onSelectFabric 
}) => {
  const { 
    products, 
    addToCart, 
    setIsCartOpen, 
    navigateTo, 
    setSelectedProduct,
    toggleWishlist,
    isInWishlist
  } = useStore();

  // Highlight featured models matching the exact 3-arch showcase
  const showcaseItems = [
    {
      id: 'showcase-green',
      title: 'পান্না সবুজ জরির কাতান',
      subtitle: 'Emerald Green Zari Katan',
      category: 'কাতান',
      fabric: 'কাতান',
      price: 9200,
      originalPrice: 11500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
      badge: 'সবুজ এক্সক্লুসিভ',
      desc: 'হাতে বোনা জরির নিখুঁত পাড় ও জমিন'
    },
    {
      id: 'showcase-maroon',
      title: 'রাজকীয় ব্রাইডাল বেনারসি কাতান',
      subtitle: 'Royal Bridal Maroon Katan',
      category: 'বেনারসি',
      fabric: 'বেনারসি',
      price: 12500,
      originalPrice: 15000,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      badge: 'টপ ব্রাইডাল চয়েস',
      desc: 'খাঁটি লাল-মেরুন গর্জিয়াস কাজ'
    },
    {
      id: 'showcase-white',
      title: 'আদি ঢাকাই অফ-হোয়াইট জামদানি',
      subtitle: 'Pristine White Jamdani',
      category: 'জামদানি',
      fabric: 'জামদানি',
      price: 8500,
      originalPrice: 10500,
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80',
      badge: 'ঐতিহ্যবাহী জামদানি',
      desc: '৮৪ কাউন্ট সুতায় বোনা নিখুঁত কাজ'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(1); // Default to middle card (Maroon/Center)
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto rotate every 6 seconds if not hovered
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, showcaseItems.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? showcaseItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  const handleCategoryPillClick = (fabric: string) => {
    if (onSelectFabric) {
      onSelectFabric(fabric);
    }
    const catalogEl = document.getElementById('saree-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopNow = () => {
    if (onShopNowClick) {
      onShopNowClick();
    } else {
      const el = document.getElementById('saree-catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardClick = (item: typeof showcaseItems[0]) => {
    const matched = products.find(p => p.fabric.toLowerCase().includes(item.fabric.toLowerCase()) || p.name.includes(item.fabric));
    if (matched) {
      setSelectedProduct(matched);
      navigateTo('product-detail', matched);
    } else if (products.length > 0) {
      setSelectedProduct(products[0]);
      navigateTo('product-detail', products[0]);
    }
  };

  const handleDirectBuy = (e: React.MouseEvent, item: typeof showcaseItems[0]) => {
    e.stopPropagation();
    const matched = products.find(p => p.fabric.toLowerCase().includes(item.fabric.toLowerCase()) || p.name.includes(item.fabric)) || products[0];
    if (matched) {
      addToCart(matched, 1);
      setIsCartOpen(true);
    }
  };

  // Quick Category Ribbon counts
  const categoryCounts = [
    { name: 'জামদানি', count: products.filter(p => p.fabric === 'জামদানি').length || 4 },
    { name: 'কাতান', count: products.filter(p => p.fabric === 'কাতান' || p.fabric === 'বেনারসি').length || 4 },
    { name: 'মসলিন', count: products.filter(p => p.fabric === 'মসলিন').length || 4 },
    { name: 'সিল্ক', count: products.filter(p => p.fabric === 'সিল্ক').length || 4 },
  ];

  return (
    <div 
      id="hero-banner-section" 
      className="relative overflow-hidden bg-[#160E12] text-stone-100 select-none border-b border-[#2D1F26]"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      
      {/* 1. Deep Velvet Maroon Silk Drapery (Left Aesthetic Backdrop) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1/3 max-w-[420px] pointer-events-none opacity-40 z-0 bg-gradient-to-r from-[#4A0A17] via-[#350711] to-transparent"
        style={{
          backgroundImage: `radial-gradient(ellipse at top left, rgba(128, 20, 42, 0.6), transparent 70%)`
        }}
      />

      {/* 2. Architectural Wooden Finish & Sweeping Curved Panel (Right Aesthetic Backdrop) */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2/3 lg:w-1/2 pointer-events-none z-0 overflow-hidden"
      >
        {/* Sweeping curve divider with woodgrain luxury hue */}
        <div 
          className="absolute inset-0 bg-gradient-to-l from-[#241716] via-[#1A1114] to-transparent opacity-90"
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-[580px] bg-[#221617]/40 rounded-l-[120px] border-l border-[#4A3228]/50 backdrop-blur-xs"
        />
        
        {/* Frosted Glass Window with Soft City Skyline / Bokeh Lighting */}
        <div 
          className="absolute right-8 top-12 bottom-12 w-[420px] rounded-3xl bg-gradient-to-b from-amber-500/5 via-rose-500/5 to-transparent border border-white/5 opacity-50 blur-xs"
        />
      </div>

      {/* 3. Modern Geometrical Brass / Rose-Gold Floor Sculpture with Glowing Pearl Spheres */}
      <div className="absolute right-6 lg:right-16 top-1/4 bottom-1/4 w-32 pointer-events-none z-0 hidden md:block opacity-75">
        {/* Geometric Rose-Gold Wireframe Lines */}
        <div className="absolute top-12 right-6 w-24 h-48 border-r-2 border-t-2 border-[#D4AF37]/30 rounded-tr-[50px] transform rotate-6" />
        <div className="absolute top-28 right-12 w-20 h-40 border-l-2 border-b-2 border-[#C98B6E]/30 rounded-bl-[40px] transform -rotate-12" />
        
        {/* Glowing Pearl-like Spheres */}
        <div className="absolute top-10 right-4 w-5 h-5 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#FFE4B5] to-[#D4AF37] shadow-[0_0_18px_rgba(255,228,181,0.8)] animate-pulse" />
        <div className="absolute top-36 right-16 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#FFE4B5] to-[#C98B6E] shadow-[0_0_12px_rgba(255,228,181,0.6)]" />
        <div className="absolute bottom-12 right-8 w-4 h-4 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#FFE4B5] to-[#D4AF37] shadow-[0_0_14px_rgba(255,228,181,0.7)]" />
      </div>

      {/* Main Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT CONTENT: GRAND DISPLAY TYPOGRAPHY & CTA ================= */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Top Brand Monogram & Sparkle */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#36131C]/80 border border-[#6B1728] text-amber-200 text-xs font-semibold shadow-inner mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="font-bangla">খাঁটি ঐতিহ্য ও আভিজাত্যের বিশ্বস্ত ঠিকানা</span>
            </div>

            {/* Display Headings (স্বর্ণালী রঙে 'অনন্য রূপ, ঐতিহ্যের স্বাদ।') */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-serif-brand">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FCE5A4] via-[#E8C16B] to-[#C99839] drop-shadow-sm">
                  অনন্য রূপ,
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FCE5A4] via-[#E8C16B] to-[#C99839] drop-shadow-sm">
                  ঐতিহ্যের স্বাদ।
                </span>
              </h1>

              {/* Subtitle in Crisp White */}
              <div className="text-xl sm:text-2xl font-bold text-white tracking-wide pt-1">
                এক্সক্লুসিভ কালেকশন
              </div>
            </div>

            {/* English Description Text */}
            <p className="text-stone-300/90 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-sans italic">
              Discover the art of elegance with our curated range of handpicked sarees.
            </p>

            {/* Golden CTA Button ("কেনাকাটা করুন ❯") */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-shop-now-btn"
                type="button"
                onClick={handleShopNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#F0C05A] via-[#E5B147] to-[#D49F30] hover:from-[#FAD77B] hover:to-[#E5B147] text-stone-950 font-extrabold text-base sm:text-lg shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all transform duration-200 cursor-pointer group"
              >
                <span>কেনাকাটা করুন</span>
                <span className="w-7 h-7 rounded-full bg-stone-950/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  ❯
                </span>
              </button>

              {/* Instant Call / Help Hotline */}
              <a 
                href="tel:01711234567"
                className="inline-flex items-center gap-2 text-xs text-amber-200/80 hover:text-amber-200 font-medium px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/30 transition-colors"
              >
                <span>📞 সরাসরি বুকিং করুন</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#2D1F26] flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>১০০% খাঁটি বুনন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>প্রিমিয়াম কোয়ালিটি</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT CONTENT: 3-ARCH SHOWCASE & CAROUSEL ================= */}
          <div className="lg:col-span-7 relative">
            
            {/* The 3 Arched Saree Frame Showcase (Green, Maroon Center, Cream/White) */}
            <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
              
              {/* Previous Golden Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Showcase"
                className="absolute -left-2 sm:left-2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2A1B22]/90 hover:bg-[#6B1728] text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Golden Arrow */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Showcase"
                className="absolute -right-2 sm:right-2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2A1B22]/90 hover:bg-[#6B1728] text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* 3 Arched Cards Grid */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-2xl px-8 sm:px-12">
                
                {showcaseItems.map((item, index) => {
                  const isCenter = index === activeIndex;
                  const isLeft = index === (activeIndex === 0 ? showcaseItems.length - 1 : activeIndex - 1);
                  const isRight = index === (activeIndex === showcaseItems.length - 1 ? 0 : activeIndex + 1);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className={`relative cursor-pointer transition-all duration-500 ease-out transform-gpu group ${
                        isCenter
                          ? 'z-20 scale-105 sm:scale-110 w-[55%] sm:w-[50%] opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                          : isLeft || isRight
                            ? 'z-10 scale-90 sm:scale-95 w-[38%] sm:w-[35%] opacity-70 hover:opacity-90 blur-[0.5px] hover:blur-none'
                            : 'hidden'
                      }`}
                    >
                      {/* Arched Top Golden Double Border Frame */}
                      <div className={`p-1 sm:p-1.5 rounded-t-[70px] sm:rounded-t-[90px] rounded-b-2xl bg-gradient-to-b ${
                        isCenter 
                          ? 'from-[#F7E1A0] via-[#D4AF37] to-[#5C1625]' 
                          : 'from-stone-500/40 via-amber-400/20 to-transparent'
                      }`}>
                        
                        <div className="relative rounded-t-[66px] sm:rounded-t-[84px] rounded-b-xl overflow-hidden bg-stone-950 aspect-[3/4.6]">
                          
                          {/* Saree Model Image */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            loading={isCenter ? 'eager' : 'lazy'}
                          />

                          {/* Gradient Overlay for Text Legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                          {/* Top Badge */}
                          <div className="absolute top-4 inset-x-3 flex justify-center z-10">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#6B1728]/90 text-amber-200 border border-amber-400/40 text-[10px] sm:text-[11px] font-bold shadow-md backdrop-blur-md">
                              {item.badge}
                            </span>
                          </div>

                          {/* Card Bottom Details */}
                          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left z-10 space-y-1.5">
                            <div className="text-[11px] sm:text-xs text-amber-300 font-bold uppercase tracking-wider">
                              {item.category}
                            </div>
                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white font-serif-brand line-clamp-1 group-hover:text-amber-300 transition-colors">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center justify-between pt-1 border-t border-white/15">
                              <div>
                                <span className="text-xs sm:text-sm font-black text-amber-300 font-serif-brand">
                                  ৳{item.price.toLocaleString('bn-BD')}
                                </span>
                              </div>

                              {isCenter && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDirectBuy(e, item)}
                                  className="flex items-center gap-1 bg-[#6B1728] hover:bg-[#851C32] text-amber-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-400/30 shadow-xs cursor-pointer"
                                >
                                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  <span>অর্ডার</span>
                                </button>
                              )}
                            </div>

                          </div>

                        </div>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Showcase Indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {showcaseItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex 
                      ? 'w-6 bg-gradient-to-r from-[#F0C05A] to-[#D49F30]' 
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>

        {/* ================= 4. BOTTOM QUICK SAREE FILTER RIBBON ================= */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-[#2D1F26]">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            
            {categoryCounts.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryPillClick(cat.name)}
                className="flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-[#20151B] hover:bg-[#351C28] text-stone-200 hover:text-amber-200 border border-[#3E2B35] hover:border-amber-400/50 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-xs sm:text-sm font-bold group"
              >
                <span>{cat.name}</span>
                <span className="w-5 h-5 rounded-full bg-[#36131C] group-hover:bg-amber-400 group-hover:text-stone-950 text-amber-300 text-[10px] font-mono flex items-center justify-center transition-colors">
                  {cat.count}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleCategoryPillClick('')}
              className="flex items-center gap-1.5 px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#6B1728] to-[#450C19] hover:from-[#851C32] hover:to-[#5B1022] text-amber-200 text-xs sm:text-sm font-bold border border-amber-400/40 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>সকল শাড়ি দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
