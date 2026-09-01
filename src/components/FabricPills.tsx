import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FabricPillsProps {
  selectedFabric: string;
  onSelectFabric: (fabric: string) => void;
}

interface CategoryItem {
  name: string;
  value: string;
  subtitle: string;
  image: string;
  tag?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'সকল শাড়ি',
    value: '',
    subtitle: 'সম্পূর্ণ কালেকশন',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    tag: 'অল'
  },
  {
    name: 'ঢাকাই জামদানি',
    value: 'জামদানি',
    subtitle: 'আদি ঐতিহ্যবাহী বুটি',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    tag: 'হাতে বোনা'
  },
  {
    name: 'বেনারসি কাতান',
    value: 'কাতান',
    subtitle: 'রাজকীয় মিরপুর কাতান',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
    tag: 'ব্রাইডাল'
  },
  {
    name: 'খাঁটি মসলিন',
    value: 'মসলিন',
    subtitle: 'ফুটি কার্পাস তুলা',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    tag: 'অভিজাত'
  },
  {
    name: 'রাজশাহী সিল্ক',
    value: 'সিল্ক',
    subtitle: 'তসর ও পিওর সিল্ক',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
    tag: 'সিল্ক'
  },
  {
    name: 'টাঙ্গাইল তাঁত ও কটন',
    value: 'তাঁত ও কটন',
    subtitle: 'নরম সুতি আরামদায়ক',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    tag: 'কটন'
  },
  {
    name: 'ব্রাইডাল বেনারসি',
    value: 'বেনারসি',
    subtitle: 'কনে সাজানোর মহোৎসব',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
    tag: 'এক্সক্লুসিভ'
  },
  {
    name: 'ডিজাইনার অর্গানজা',
    value: 'অর্গানজা',
    subtitle: 'হালকা পার্টি লুক',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    tag: 'নতুন'
  },
  {
    name: 'পার্টি জর্জেট ও শিফন',
    value: 'জর্জেট ও শিফন',
    subtitle: 'স্টাইলিশ ও গর্জিয়াস',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
    tag: 'পার্টি'
  }
];

export const FabricPills: React.FC<FabricPillsProps> = ({ selectedFabric, onSelectFabric }) => {
  const { products } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCount = (fabricVal: string) => {
    if (!fabricVal) return products.length;
    return products.filter(p => p.fabric === fabricVal).length;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="luxury-category-section" className="relative bg-gradient-to-b from-stone-50/80 to-white dark:from-[#1A1217] dark:to-[#161014] rounded-3xl p-4 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-sm transition-colors">
      
      {/* Header section with title and quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-serif-brand font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg tracking-tight">
              শাড়ির স্পেশাল ক্যাটাগরি ও ফ্যাব্রিক
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
            আপনার পছন্দের শাড়ির ধরন বেছে নিন — সরাসরি তাঁতি ও বেনারসি পল্লী থেকে সংগৃহীত
          </p>
        </div>

        {/* Scroll Arrows & Total badge */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-[#6B1728] dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1 rounded-full font-mono">
            {products.length} টি শাড়ি কালেকশন
          </span>
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-400 transition-all shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-400 transition-all shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Luxury Visual Category Cards (Horizontal Slider) */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory pt-1 px-0.5"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = (cat.value === '' && !selectedFabric) || selectedFabric === cat.value;
          const count = getCount(cat.value);

          return (
            <button
              key={cat.name}
              id={`luxury-category-card-${cat.value || 'all'}`}
              onClick={() => onSelectFabric(cat.value)}
              className={`group relative flex-shrink-0 w-44 sm:w-48 text-left rounded-2xl p-2.5 transition-all duration-300 snap-start border cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-[#6B1728] to-[#4A0D1B] text-amber-50 border-[#851C32] ring-2 ring-amber-400/50 shadow-lg -translate-y-1'
                  : 'bg-white dark:bg-[#1E171C] text-stone-800 dark:text-stone-200 border-stone-200/90 dark:border-stone-800 hover:border-amber-400/70 hover:shadow-md dark:hover:border-amber-500/50 hover:-translate-y-0.5'
              }`}
            >
              {/* Category Image Thumbnail with Vignette */}
              <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2.5 bg-stone-100 dark:bg-stone-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Top Mini Tag */}
                {cat.tag && (
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-black/50 text-amber-200 border border-white/20'
                  }`}>
                    {cat.tag}
                  </span>
                )}

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md animate-in zoom-in-75">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Saree Count Floating Pill */}
                <div className="absolute bottom-1.5 right-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono shadow-xs backdrop-blur-xs ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-black/60 text-white border border-white/20'
                  }`}>
                    {count} টি শাড়ি
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="px-1 pb-1">
                <h4 className={`font-bold text-xs sm:text-sm tracking-tight line-clamp-1 ${
                  isSelected ? 'text-amber-100' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#6B1728] dark:group-hover:text-amber-300'
                }`}>
                  {cat.name}
                </h4>
                <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                  isSelected ? 'text-amber-200/80' : 'text-stone-500 dark:text-stone-400'
                }`}>
                  {cat.subtitle}
                </p>
              </div>

              {/* Bottom Subtle Highlight Bar */}
              <div className={`h-1 w-full rounded-full mt-2 transition-all ${
                isSelected 
                  ? 'bg-amber-400' 
                  : 'bg-stone-100 dark:bg-stone-800 group-hover:bg-amber-400/40'
              }`} />
            </button>
          );
        })}
      </div>

    </section>
  );
};

