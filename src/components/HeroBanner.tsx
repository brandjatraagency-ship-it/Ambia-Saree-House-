import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award, 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Star, 
  Eye,
  Flame,
  Zap,
  PhoneCall,
  Crown,
  Layers,
  Users
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SareeProduct } from '../types';

interface HeroBannerProps {
  onExplore?: () => void;
  onExploreClick?: () => void;
  onFabricSelect?: (fabric: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onExplore, 
  onExploreClick, 
  onFabricSelect 
}) => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo, 
    setIsCheckoutOpen,
    settings
  } = useStore();

  const handleExplore = onExplore || onExploreClick || (() => {
    const el = document.getElementById('saree-catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  // Top curated products for hero slideshow
  const sliderProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const featured = products.filter(p => p.isFeatured || p.isBestSeller || p.rating >= 4.8);
    return featured.length >= 3 ? featured.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-slide effect (4.5s per slide)
  useEffect(() => {
    if (sliderProducts.length <= 1 || isPaused) return;

    timerRef.current = window.setInterval(() => {
      handleNext();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, sliderProducts.length]);

  const handleNext = () => {
    if (sliderProducts.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % sliderProducts.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (sliderProducts.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSelectSlide = (idx: number) => {
    if (idx === currentIndex || idx < 0 || idx >= sliderProducts.length) return;
    setIsAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentProduct: SareeProduct | undefined = sliderProducts[currentIndex];

  const handleInstantBuy = (e: React.MouseEvent, product: SareeProduct) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleViewProduct = (product: SareeProduct) => {
    navigateTo('product', product);
  };

  return (
    <div 
      id="hero-section" 
      className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FAF8F5] to-white dark:from-[#180E14] dark:via-[#140D12] dark:to-[#100A0E] pt-6 pb-12 sm:pb-16 border-b border-stone-200/90 dark:border-stone-800 transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* High-end Ambient Background Aura Glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-amber-400/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none transform-gpu" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#6B1728]/15 via-amber-600/10 to-transparent blur-3xl pointer-events-none transform-gpu" />

      {/* Subtle traditional damask pattern background texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#6B1728_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: Brand Story & Interactive CTAs ================= */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            
            {/* Top Royal Collection Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-[#6B1728]/10 to-amber-500/10 dark:from-amber-400/20 dark:via-rose-900/30 dark:to-amber-400/20 border border-amber-400/30 dark:border-amber-400/40 text-[#6B1728] dark:text-amber-300 text-xs font-bold tracking-wide shadow-xs">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>ঐতিহ্যবাহী তাঁত ও ব্রাইডাল লাক্সারি কালেকশন ২০২৬</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.18]">
              খাঁটি রূপ ও আভিজাত্যে <br />
              <span className="font-serif-brand text-transparent bg-clip-text bg-gradient-to-r from-[#6B1728] via-[#9E203B] to-[#541220] dark:from-amber-300 dark:via-amber-100 dark:to-amber-400">
                {settings.storeName || 'আম্বিয়া শাড়ি হাউস'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              প্রাচীন ঐতিহ্যের সুতোয় বোনা আসল ঢাকাই জামদানি, রূপকথার মতো বেনারসি কাতান, শুভ্র মসলিন ও রেশমি সিল্কের অনন্য সম্ভার—অনলাইনে সরাসরি আপনার দোরগোড়ায়।
            </p>

            {/* Quick Saree Fabric Switchers */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mr-1 hidden sm:inline">
                জনপ্রিয় ফ্যাব্রিক:
              </span>
              {[
                { name: 'জামদানি', icon: '🪡', tag: 'হট' },
                { name: 'কাতান', icon: '👑', tag: 'ব্রাইডাল' },
                { name: 'মসলিন', icon: '✨', tag: 'খাঁটি' },
                { name: 'সিল্ক', icon: '🌸', tag: 'রাজকীয়' },
                { name: 'অর্গানজা', icon: '💎', tag: 'আধুনিক' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (onFabricSelect) onFabricSelect(item.name);
                    navigateTo('category', item.name);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:border-[#6B1728] dark:hover:border-amber-400 hover:text-[#6B1728] dark:hover:text-amber-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="text-[9px] text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 font-bold px-1 rounded-sm">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={handleExplore}
                className="flex items-center gap-2 bg-gradient-to-r from-[#6B1728] via-[#851C32] to-[#5B1020] hover:from-[#541220] hover:to-[#6B1728] dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 dark:hover:from-amber-300 dark:hover:to-amber-400 text-amber-50 dark:text-stone-950 px-6 sm:px-7 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:shadow-[#6B1728]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>সব শাড়ি কালেকশন দেখুন</span>
                <ArrowRight className="w-4 h-4 text-amber-300 dark:text-stone-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-track-order-btn"
                onClick={() => navigateTo('track-order')}
                className="flex items-center gap-2 bg-white dark:bg-[#1E171C] hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 px-5 py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span>পার্সেল ট্র্যাকিং</span>
              </button>

              {/* Quick WhatsApp Contact */}
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=হ্যালো,%20আমি%20আম্বিয়া%20শাড়ি%20হাউস%20থেকে%20শাড়ি%20কিনতে%20আগ্রহী।`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 px-4 py-3 rounded-full transition-all shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>সহায়তা নিন</span>
              </a>
            </div>

            {/* Trust Badges Strip (Clean 4-column Bento) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-stone-200/80 dark:border-stone-800 text-left">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-[#1E171C]/70 border border-stone-200/80 dark:border-stone-800 backdrop-blur-xs">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-[10px] leading-tight">
                  <p className="font-bold text-stone-900 dark:text-stone-100">১০০% খাঁটি তাঁত</p>
                  <p className="text-stone-500 dark:text-stone-400">অরিজিনাল বুনন</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-[#1E171C]/70 border border-stone-200/80 dark:border-stone-800 backdrop-blur-xs">
                <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400 shrink-0" />
                <div className="text-[10px] leading-tight">
                  <p className="font-bold text-stone-900 dark:text-stone-100">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-stone-500 dark:text-stone-400">সারাদেশে প্রাপ্তি</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-[#1E171C]/70 border border-stone-200/80 dark:border-stone-800 backdrop-blur-xs">
                <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-[10px] leading-tight">
                  <p className="font-bold text-stone-900 dark:text-stone-100">সহজ রিটার্ন</p>
                  <p className="text-stone-500 dark:text-stone-400">৭ দিনের পলিসি</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-[#1E171C]/70 border border-stone-200/80 dark:border-stone-800 backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-[10px] leading-tight">
                  <p className="font-bold text-stone-900 dark:text-stone-100">দেখে মূল্য পরিশোধ</p>
                  <p className="text-stone-500 dark:text-stone-400">নিশ্চিন্ত কেনাকাটা</p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Ultra-Premium Modern Slideshow UI ================= */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Luxury Frame Container with Double Golden Halo */}
              <div className="relative p-1 sm:p-1.5 rounded-[2rem] bg-gradient-to-br from-amber-400/40 via-stone-300/30 to-amber-500/30 dark:from-amber-400/30 dark:via-stone-800 dark:to-rose-950 shadow-2xl">
                
                <div className="relative rounded-[1.8rem] overflow-hidden bg-stone-950 border border-amber-400/20 dark:border-amber-400/30">
                  
                  {/* Top Progress Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
                    <div 
                      key={currentIndex}
                      className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all ease-linear"
                      style={{
                        width: '100%',
                        animation: isPaused ? 'none' : 'heroProgress 4.5s linear forwards'
                      }}
                    />
                  </div>

                  {/* Main Slide Screen */}
                  <div className="relative aspect-[4/4.9] sm:aspect-[4/4.6] overflow-hidden group">
                    {sliderProducts.map((product, idx) => {
                      const isActive = idx === currentIndex;
                      return (
                        <div
                          key={product.id}
                          aria-hidden={!isActive}
                          className={`absolute inset-0 transition-all duration-700 ease-out transform-gpu ${
                            isActive 
                              ? 'opacity-100 scale-100 z-10 translate-x-0' 
                              : idx < currentIndex 
                                ? 'opacity-0 scale-95 z-0 -translate-x-12 pointer-events-none' 
                                : 'opacity-0 scale-95 z-0 translate-x-12 pointer-events-none'
                          }`}
                        >
                          {/* Saree High-Resolution Image */}
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />

                          {/* Refined Luxury Multi-Stop Vignette Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/40" />

                          {/* Top Floating Tags Bar */}
                          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6B1728]/90 text-amber-200 border border-amber-400/40 text-[11px] font-extrabold shadow-md backdrop-blur-md">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                {product.fabric}
                              </span>
                              
                              {product.discountPercent && product.discountPercent > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md">
                                  <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  {product.discountPercent}% ছাড়
                                </span>
                              )}

                              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 text-stone-200 border border-white/10 text-[10px] font-mono backdrop-blur-md">
                                CODE: #{product.id.slice(-4).toUpperCase()}
                              </span>
                            </div>

                            {/* Wishlist Heart Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              aria-label="Wishlist"
                              className="w-9 h-9 rounded-full bg-black/40 hover:bg-[#6B1728] backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer shadow-lg shrink-0"
                            >
                              <Heart 
                                className={`w-4 h-4 transition-colors ${
                                  isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                                }`} 
                              />
                            </button>
                          </div>

                          {/* Bottom Frosted Glass Product Card Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 space-y-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                            
                            {/* Rating, Stock & Live Viewers */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{product.rating.toFixed(1)} ({product.reviewCount} রিভিউ)</span>
                                </div>
                                
                                {product.inStock && (
                                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    রেডি স্টক
                                  </span>
                                )}
                              </div>

                              {/* Subtle Live Viewer Indicator */}
                              <div className="hidden sm:flex items-center gap-1 text-[10px] text-amber-200/90 font-medium">
                                <Users className="w-3 h-3 text-amber-300" />
                                <span>এই মুহূর্তে ৫ জন দেখছেন</span>
                              </div>
                            </div>

                            {/* Saree Title and Description */}
                            <div 
                              className="cursor-pointer group/title"
                              onClick={() => handleViewProduct(product)}
                            >
                              <h3 className="text-lg sm:text-xl font-bold text-white font-serif-brand group-hover/title:text-amber-300 transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-stone-300/90 line-clamp-1 mt-0.5">
                                {product.description}
                              </p>
                            </div>

                            {/* Price & Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/20">
                              
                              {/* Price Display */}
                              <div>
                                <div className="text-[10px] text-stone-400 font-medium">স্পেশাল অফার প্রাইস:</div>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-serif-brand">
                                    ৳{product.price.toLocaleString('bn-BD')}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-xs text-stone-400 line-through">
                                      ৳{product.originalPrice.toLocaleString('bn-BD')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewProduct(product)}
                                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                                  title="শাড়ির বিস্তারিত ও গ্যালারি দেখুন"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                                  <span>বিস্তারিত</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => handleInstantBuy(e, product)}
                                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#6B1728] via-[#851C32] to-[#6B1728] hover:from-[#52111e] hover:to-[#6B1728] text-amber-100 border border-amber-400/50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                                >
                                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                  <span>অর্ডার করুন</span>
                                </button>
                              </div>

                            </div>

                          </div>
                        </div>
                      );
                    })}

                    {/* Modern Frosted Chevron Arrows */}
                    {sliderProducts.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                          }}
                          aria-label="Previous Slide"
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#6B1728] text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md shadow-lg active:scale-90 cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          aria-label="Next Slide"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#6B1728] text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md shadow-lg active:scale-90 cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}

                  </div>

                  {/* Thumbnail Strip Gallery & Navigation */}
                  <div className="bg-[#140D12] p-2.5 sm:p-3 border-t border-stone-800 flex items-center justify-between gap-2">
                    
                    {/* Thumbnails */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                      {sliderProducts.map((prod, idx) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleSelectSlide(idx)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            idx === currentIndex 
                              ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30 ring-1 ring-amber-400/50' 
                              : 'border-stone-800 opacity-50 hover:opacity-90'
                          }`}
                          title={prod.name}
                        >
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            className="w-10 h-10 sm:w-11 sm:h-11 object-cover" 
                          />
                        </button>
                      ))}
                    </div>

                    {/* Active Slide Counter */}
                    <div className="text-[11px] font-bold text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1 rounded-full shrink-0">
                      <span className="text-amber-300">{currentIndex + 1}</span> / {sliderProducts.length}
                    </div>

                  </div>

                </div>

              </div>

              {/* Floating Special Offer Notification Badge */}
              <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white/95 dark:bg-[#1E171C]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-amber-400/30 dark:border-amber-400/40 flex items-center gap-2.5 z-30 animate-float">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-bold text-sm shadow-xs">
                  ৳
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
                    বিশেষ সুবিধা
                  </div>
                  <div className="text-xs font-bold text-[#6B1728] dark:text-amber-300">
                    ৩০০০+ টাকার অর্ডারে ফ্রি ডেলিভারি!
                  </div>
                </div>
              </div>

              {/* Floating Quality Guarantee Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-gradient-to-r from-[#6B1728] via-[#851C32] to-[#541220] text-amber-100 px-3 py-2 rounded-2xl shadow-xl border border-amber-400/40 flex items-center gap-1.5 z-30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold">১০০% শোরুম কোয়ালিটি</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
