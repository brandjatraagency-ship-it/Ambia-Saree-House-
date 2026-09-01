import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Check, 
  Sparkles, 
  Tag, 
  PackageCheck, 
  Scissors, 
  CircleDollarSign,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface ProductFilterBarProps {
  selectedOccasion: string;
  onSelectOccasion: (occ: string) => void;
  selectedPriceRange?: string;
  onSelectPriceRange?: (range: string) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  hasBlousePieceOnly: boolean;
  onToggleBlousePiece: () => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedFabric?: string;
  onClearFabric?: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

const OCCASIONS = [
  { name: 'সকল অনুষ্ঠান', val: '', icon: '✨' },
  { name: 'বিবাহ ও বউভাত', val: 'বিবাহ ও বউভাত', icon: '💍' },
  { name: 'উৎসব ও পূজা', val: 'উৎসব ও পূজা', icon: '🪔' },
  { name: 'পার্টি ও রিসেপশন', val: 'পার্টি ও রিসেপশন', icon: '🥂' },
  { name: 'অফিস ও ক্যাজুয়াল', val: 'অফিস ও ক্যাজুয়াল', icon: '🏢' },
  { name: 'বিয়েবাড়ি বিশেষ', val: 'বিয়েবাড়ি বিশেষ', icon: '👑' },
];

const PRICE_RANGES = [
  { label: 'সকল বাজেট', val: '' },
  { label: '৳ ৩,০০০ এর নিচে', val: 'under-3000' },
  { label: '৳ ৩,০০০ - ৳ ৮,০০০', val: '3000-8000' },
  { label: '৳ ৮,০০০ - ৳ ১৫,০০০', val: '8000-15000' },
  { label: '৳ ১৫,০০০ এর উপরে', val: 'above-15000' },
];

const COLORS = [
  { name: 'সকল রং', hex: 'transparent', val: '' },
  { name: 'মেরুন / লাল', hex: '#800020', val: 'মেরুন' },
  { name: 'রয়েল ব্লু', hex: '#1E3A8A', val: 'নীল' },
  { name: 'পান্না সবুজ', hex: '#0B6623', val: 'সবুজ' },
  { name: 'সোনালী / হলুদ', hex: '#D4AF37', val: 'হলুদ' },
  { name: 'মিষ্টি গোলাপি', hex: '#E06B80', val: 'গোলাপী' },
  { name: 'অভিজাত কালো', hex: '#1A1A1A', val: 'কালো' },
  { name: 'সাদা / অফ-হোয়াইট', hex: '#FDFBF7', val: 'সাদা' },
];

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  selectedOccasion,
  onSelectOccasion,
  selectedPriceRange = '',
  onSelectPriceRange,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  hasBlousePieceOnly,
  onToggleBlousePiece,
  selectedColor,
  onSelectColor,
  selectedFabric,
  onClearFabric,
  searchQuery,
  onClearSearch,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div id="product-filter-bar" className="bg-white dark:bg-[#1E171C] rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-4 sm:p-5 space-y-4 transition-colors">
      
      {/* Top Bar: Occasion Event Tabs + Sort Select + Mobile Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        
        {/* Occasion Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mr-1 hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> অনুষ্ঠান:
          </span>
          {OCCASIONS.map((occ) => {
            const isAll = occ.val === '' && !selectedOccasion;
            const isSelected = isAll || selectedOccasion === occ.val;
            return (
              <button
                key={occ.name}
                id={`occasion-tab-${occ.name}`}
                onClick={() => onSelectOccasion(occ.val)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-[#6B1728] dark:bg-amber-400 text-amber-50 dark:text-stone-950 border-[#6B1728] dark:border-amber-400 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <span>{occ.icon}</span>
                <span>{occ.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Sort Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
          
          {/* Mobile Filter Expand Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B1728] dark:text-amber-400" />
            <span>ফিল্টার ও বাজেট</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">সাজান:</span>
            </div>

            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6B1728]/20 dark:focus:ring-amber-400/20 focus:border-[#6B1728] dark:focus:border-amber-400 cursor-pointer shadow-xs"
            >
              <option value="featured">✨ ফিচার্ড ও জনপ্রিয়</option>
              <option value="newest">🆕 নতুন কালেকশন</option>
              <option value="price-asc">💵 দাম: কম থেকে বেশি</option>
              <option value="price-desc">💎 দাম: বেশি থেকে কম</option>
              <option value="discount">🏷️ সর্বোচ্চ ডিসকাউন্ট</option>
            </select>
          </div>

        </div>

      </div>

      {/* Expandable / Desktop Secondary Filter Bar: Price, Colors, Stock */}
      <div className={`space-y-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Row 1: Budget / Price Range Selector */}
        {onSelectPriceRange && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-bold flex items-center gap-1 mr-1">
              <CircleDollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              বাজেট:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRICE_RANGES.map((pr) => {
                const isSelected = selectedPriceRange === pr.val;
                return (
                  <button
                    key={pr.label}
                    onClick={() => onSelectPriceRange(pr.val)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {pr.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 2: Colors Palette + Quick Checkbox Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
          
          {/* Colors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-stone-500 dark:text-stone-400 font-bold mr-1">রং:</span>
            {COLORS.map((c) => {
              const isSelected = (c.val === '' && !selectedColor) || selectedColor === c.val;
              return (
                <button
                  key={c.name}
                  id={`color-filter-${c.name}`}
                  onClick={() => onSelectColor(c.val)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${
                    isSelected
                      ? 'border-[#6B1728] dark:border-amber-400 bg-rose-50 dark:bg-[#341822] text-[#6B1728] dark:text-amber-300 font-bold shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                  }`}
                  title={c.name}
                >
                  {c.hex !== 'transparent' && (
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-600 inline-block shadow-xs shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                  )}
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Toggles (In-Stock, Blouse Piece) */}
          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
            
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300 select-none font-medium hover:text-[#6B1728] dark:hover:text-amber-300 transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStock}
                className="rounded border-stone-300 dark:border-stone-600 text-[#6B1728] focus:ring-[#6B1728] w-3.5 h-3.5 accent-[#6B1728] dark:accent-amber-400"
              />
              <span className="flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                শুধুমাত্র ইন-স্টক
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300 select-none font-medium hover:text-[#6B1728] dark:hover:text-amber-300 transition-colors">
              <input
                type="checkbox"
                checked={hasBlousePieceOnly}
                onChange={onToggleBlousePiece}
                className="rounded border-stone-300 dark:border-stone-600 text-[#6B1728] focus:ring-[#6B1728] w-3.5 h-3.5 accent-[#6B1728] dark:accent-amber-400"
              />
              <span className="flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                ব্লাউজ পিসসহ
              </span>
            </label>

          </div>

        </div>

      </div>

      {/* Active Filter Chips & Results Count Bar */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Results Counter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-800 dark:text-stone-200">
            মোট <span className="text-[#6B1728] dark:text-amber-400 font-mono font-extrabold text-sm">{totalFilteredCount}</span> টি শাড়ি পাওয়া গেছে
          </span>
        </div>

        {/* Active Filter Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedFabric && (
            <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-full font-semibold">
              ফ্যাব্রিক: {selectedFabric}
              {onClearFabric && (
                <button onClick={onClearFabric} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {selectedOccasion && (
            <span className="inline-flex items-center gap-1 bg-rose-100 dark:bg-[#341822] text-rose-900 dark:text-rose-200 px-2.5 py-1 rounded-full font-semibold">
              অনুষ্ঠান: {selectedOccasion}
              <button onClick={() => onSelectOccasion('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedColor && (
            <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-full font-semibold">
              রং: {selectedColor}
              <button onClick={() => onSelectColor('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPriceRange && onSelectPriceRange && (
            <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-full font-semibold">
              বাজেট: {PRICE_RANGES.find(p => p.val === selectedPriceRange)?.label}
              <button onClick={() => onSelectPriceRange('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 px-2.5 py-1 rounded-full font-semibold">
              অনুসন্ধান: "{searchQuery}"
              {onClearSearch && (
                <button onClick={onClearSearch} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {hasActiveFilters && (
            <button
              id="clear-all-filters-btn"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-rose-700 dark:text-rose-400 hover:text-rose-900 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-full font-bold transition-colors ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ফিল্টার রিসেট</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

