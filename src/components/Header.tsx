import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Phone, 
  MessageSquare,
  Menu,
  X,
  BookOpen,
  Flame,
  ChevronDown,
  ArrowRight,
  Clock,
  Compass,
  Check,
  Tag,
  Info,
  HelpCircle,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (term: string) => void;
  onSelectFabric?: (fabric: string) => void;
  onSelectOccasion?: (occasion: string) => void;
}

const FABRIC_COLLECTIONS = [
  { 
    title: 'ঐতিহ্যবাহী ক্লাসিক শাড়ি',
    items: [
      { name: 'ঢাকাই জামদানি', fabric: 'জামদানি', desc: 'আদি ঐতিহ্যবাহী বুটিদার জামদানি', icon: '🧵', hot: true },
      { name: 'বেনারসি ও কাতান', fabric: 'কাতান', desc: 'রাজকীয় মিরপুর বেনারসি কাতান', icon: '👑', hot: false },
      { name: 'পিওর মসলিন', fabric: 'মসলিন', desc: 'শতভাগ খাঁটি ফুটি কার্পাস মসলিন', icon: '🕊️', hot: false },
      { name: 'রাজশাহী ও তসর সিল্ক', fabric: 'সিল্ক', desc: 'কোমল রেশমি ও তসর সিল্ক', icon: '🌟', hot: false }
    ]
  },
  {
    title: 'উৎসব ও আধুনিক শাড়ি',
    items: [
      { name: 'টাঙ্গাইল তাঁত ও কটন', fabric: 'তাঁত ও কটন', desc: 'আরামদায়ক সুতি ও তাঁতের বুনন', icon: '🏵️', hot: false },
      { name: 'ব্রাইডাল স্পেশাল', fabric: 'বেনারসি', desc: 'বউ সাজানোর গর্জিয়াস শাড়ি', icon: '💍', hot: true },
      { name: 'ডিজাইনার অর্গানজা', fabric: 'অর্গানজা', desc: 'হালকা ও ক্লাসি আধুনিক লুক', icon: '🌸', hot: false },
      { name: 'সকল শাড়ি কালেকশন', fabric: '', desc: 'আমাদের সম্পূর্ণ শাড়ি সম্ভার', icon: '✨', hot: false }
    ]
  }
];

const OCCASIONS_LIST = [
  { name: 'বিবাহ ও বউভাত', occ: 'বিবাহ ও বউভাত', icon: '💍', desc: 'কনে ও নিকটাত্মীয়দের জন্য' },
  { name: 'পার্টি ও রিসেপশন', occ: 'পার্টি ও রিসেপশন', icon: '🥂', desc: 'সান্ধ্য পার্টি ও দাওয়াতের জন্য' },
  { name: 'উৎসব ও পূজা স্পেশাল', occ: 'উৎসব ও পূজা', icon: '🪔', desc: 'বাঙালি উৎসবের বিশেষ শাড়ি' },
  { name: 'অফিস ও ক্যাজুয়াল', occ: 'অফিস ও ক্যাজুয়াল', icon: '🏢', desc: 'দৈনন্দিন আরামদায়ক ব্যবহার' },
  { name: 'বিয়েবাড়ি বিশেষ', occ: 'বিয়েবাড়ি বিশেষ', icon: '👑', desc: 'অনুষ্ঠানের মধ্যমণি হতে' }
];

const SEARCH_SUGGESTIONS = [
  'ঢাকাই জামদানি',
  'বেনারসি কাতান',
  'ব্রাইডাল রেড',
  'খাঁটি মসলিন',
  'রাজশাহী সিল্ক',
  'ব্লাউজ পিসসহ শাড়ি',
  'টাঙ্গাইল কটন তাঁত'
];

export const Header: React.FC<HeaderProps> = ({ 
  searchQuery = '', 
  setSearchQuery,
  onSelectFabric,
  onSelectOccasion
}) => {
  const { 
    settings, 
    cart, 
    wishlist, 
    setIsCartOpen, 
    currentPage,
    currentCategory,
    navigateTo,
    activeView, 
    setActiveView,
    darkMode,
    toggleDarkMode
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const [mobileOccasionsOpen, setMobileOccasionsOpen] = useState(false);
  const [mobileHelpOpen, setMobileHelpOpen] = useState(false);

  // Desktop active dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);

  const [searchFocused, setSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  // Close search suggestions & dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        // keep mobile search
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnterDropdown = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleNavFabricClick = (fabric: string) => {
    if (!fabric) {
      navigateTo('home');
      if (onSelectFabric) onSelectFabric('');
    } else {
      navigateTo('category', fabric);
      if (onSelectFabric) onSelectFabric(fabric);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleNavOccasionClick = (occasion: string) => {
    navigateTo('home');
    if (onSelectOccasion) onSelectOccasion(occasion);
    const el = document.getElementById('saree-catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      id="main-header" 
      className="sticky top-0 z-40 w-full bg-[#FAF8F5]/98 dark:bg-[#140D12]/98 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 shadow-xs transition-colors"
    >
      
      {/* Top Royal Announcement Strip */}
      {settings.isAnnouncementActive && (
        <div id="top-announcement-bar" className="bg-gradient-to-r from-[#4E0E1B] via-[#6B1728] to-[#4E0E1B] text-amber-100 text-xs font-medium py-1.5 px-3 sm:px-4 tracking-wide shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
            
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> অফার
              </span>
              <span className="truncate text-xs font-bangla text-amber-50">
                {settings.announcementText}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0 font-medium">
              <span className="flex items-center gap-1.5 text-amber-200">
                <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                সারাদেশে ক্যাশ অন ডেলিভারি
              </span>
              <span className="text-amber-200/40">|</span>
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-amber-300 shrink-0" />
                হেল্পলাইন: {settings.phone}
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Main Nav Bar (Optimized for Mobile & Desktop) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          
          {/* Left: Mobile Menu Trigger & Guaranteed Fixed Responsive Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Logo & Royal Title (Rock-solid fixed layout on all devices) */}
            <div 
              id="brand-logo-container"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0" 
              onClick={() => {
                setActiveView('store');
                navigateTo('home');
                if (onSelectFabric) onSelectFabric('');
              }}
            >
              {/* Royal Monogram Emblem */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6B1728] via-[#851C32] to-[#4A0D1B] border border-amber-400/50 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif-brand text-amber-200 font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider select-none">
                  আ
                </span>
              </div>

              {/* Store Name & Tagline */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-serif-brand text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#6B1728] dark:text-amber-300 group-hover:text-[#851C32] dark:group-hover:text-amber-200 transition-colors truncate whitespace-nowrap">
                  {settings.storeName}
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] md:text-[11px] text-stone-500 dark:text-stone-400 font-semibold tracking-wider uppercase truncate">
                  LUXURY SAREE BOUTIQUE
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Search Bar with Suggestions (Desktop) */}
          <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-sm xl:max-w-md mx-4">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="জামদানি, কাতান, সিল্ক বা কোড খুঁজুন..."
                className="w-full pl-10 pr-9 py-2 bg-stone-100/90 dark:bg-[#1E171C] border border-stone-300/80 dark:border-stone-700 rounded-full text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6B1728]/20 dark:focus:ring-amber-400/20 focus:border-[#6B1728] dark:focus:border-amber-400 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs w-4 h-4 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Smart Search Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E171C] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    জনপ্রিয় অনুসন্ধান:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        if (setSearchQuery) setSearchQuery(suggestion);
                        setSearchFocused(false);
                      }}
                      className="text-xs bg-stone-50 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-[#6B1728] dark:hover:text-amber-300 text-stone-700 dark:text-stone-300 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions (Mobile Search, Theme, Wishlist, Cart, Admin) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-full text-stone-700 dark:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
              title={darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className={`p-2 sm:p-2.5 rounded-full relative transition-colors ${
                currentPage === 'wishlist'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                  : 'text-stone-700 dark:text-stone-300 hover:text-rose-700 hover:bg-stone-200/70 dark:hover:bg-stone-800'
              }`}
              title="পছন্দের তালিকা"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Premium Cart Drawer Trigger */}
            <button
              id="cart-drawer-trigger"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#6B1728] dark:bg-amber-400 text-amber-50 dark:text-stone-950 hover:bg-[#541220] dark:hover:bg-amber-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all relative font-bold group cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 dark:bg-[#6B1728] text-stone-950 dark:text-amber-100 text-[9px] sm:text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left text-xs leading-none">
                <span className="font-extrabold">ব্যাগ {totalCartCount > 0 ? `(${totalCartCount})` : ''}</span>
                {totalCartCount > 0 && (
                  <span className="text-[10px] text-amber-200 dark:text-stone-900 font-mono font-bold mt-0.5">৳ {cartSubtotal.toLocaleString('bn-BD')}</span>
                )}
              </div>
            </button>

            {/* Admin Switch Button */}
            <button
              id="admin-view-toggle"
              onClick={() => setActiveView(activeView === 'store' ? 'admin' : 'store')}
              className={`hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-inner'
                  : 'bg-stone-900 dark:bg-stone-800 text-amber-200 border-stone-800 hover:bg-stone-800'
              }`}
              title="অ্যাডমিন প্যানেল"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">{activeView === 'admin' ? 'দোকানে ফিরুন' : 'অ্যাডমিন'}</span>
            </button>

          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="py-2 lg:hidden border-t border-stone-200 dark:border-stone-800 animate-in fade-in slide-in-from-top-2">
            <div className="relative w-full">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="শাড়ির নাম বা কোড দিয়ে খুঁজুন..."
                autoFocus
                className="w-full pl-9 pr-8 py-2 bg-stone-100 dark:bg-[#1E171C] border border-stone-300 dark:border-stone-700 rounded-full text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#6B1728]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Clean Luxury Desktop Submenu Navigation Bar (Clear, Uncluttered & Structured) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-stone-200/80 dark:border-stone-800 py-1.5">
          
          <div className="flex items-center gap-1 xl:gap-2">
            
            {/* 1. Home */}
            <button
              onClick={() => {
                navigateTo('home');
                if (onSelectFabric) onSelectFabric('');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentPage === 'home' && !currentCategory
                  ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 shadow-2xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-[#6B1728] dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
              }`}
            >
              হোম
            </button>

            {/* 2. Saree Collections Dropdown Submenu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('collections')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'collections' ? null : 'collections')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentPage === 'category' || activeDropdown === 'collections'
                    ? 'bg-[#6B1728]/10 dark:bg-amber-400/10 text-[#6B1728] dark:text-amber-300'
                    : 'text-stone-700 dark:text-stone-300 hover:text-[#6B1728] dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                }`}
              >
                <span>শাড়ির কালেকশন</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'collections' ? 'rotate-180 text-[#6B1728] dark:text-amber-300' : 'text-stone-400'}`} />
              </button>

              {/* Collections Dropdown Panel */}
              {activeDropdown === 'collections' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[560px] bg-white dark:bg-[#1C141A] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 grid grid-cols-2 gap-4"
                  onMouseEnter={() => handleMouseEnterDropdown('collections')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  {FABRIC_COLLECTIONS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 pb-1 border-b border-stone-100 dark:border-stone-800">
                        {group.title}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavFabricClick(item.fabric)}
                            className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 group transition-colors cursor-pointer"
                          >
                            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#6B1728] dark:group-hover:text-amber-300 transition-colors">
                                  {item.name}
                                </span>
                                {item.hot && (
                                  <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                                    হট
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Dropdown Bottom Bar */}
                  <div className="col-span-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">তাঁতিদের নিজস্ব নিখুঁত বুনন গ্যারান্টি</span>
                    <button
                      onClick={() => handleNavFabricClick('')}
                      className="font-bold text-[#6B1728] dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>সকল শাড়ি একনজরে</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Occasions Dropdown Submenu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('occasions')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'occasions' ? null : 'occasions')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeDropdown === 'occasions'
                    ? 'bg-[#6B1728]/10 dark:bg-amber-400/10 text-[#6B1728] dark:text-amber-300'
                    : 'text-stone-700 dark:text-stone-300 hover:text-[#6B1728] dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                }`}
              >
                <span>অনুষ্ঠানভিত্তিক</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'occasions' ? 'rotate-180 text-[#6B1728] dark:text-amber-300' : 'text-stone-400'}`} />
              </button>

              {/* Occasions Dropdown Panel */}
              {activeDropdown === 'occasions' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1C141A] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in-50 zoom-in-95 space-y-1"
                  onMouseEnter={() => handleMouseEnterDropdown('occasions')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2 py-1">
                    উপলক্ষ নির্বাচন করুন
                  </div>
                  {OCCASIONS_LIST.map((occ) => (
                    <button
                      key={occ.name}
                      onClick={() => handleNavOccasionClick(occ.occ)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 group transition-colors cursor-pointer"
                    >
                      <span className="text-base shrink-0">{occ.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#6B1728] dark:group-hover:text-amber-300">
                          {occ.name}
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                          {occ.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Customer Care & Info Dropdown Submenu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('care')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'care' ? null : 'care')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentPage === 'track-order' || currentPage === 'care-guide' || activeDropdown === 'care'
                    ? 'bg-[#6B1728]/10 dark:bg-amber-400/10 text-[#6B1728] dark:text-amber-300'
                    : 'text-stone-700 dark:text-stone-300 hover:text-[#6B1728] dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                }`}
              >
                <span>গ্রাহক সেবা ও তথ্য</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'care' ? 'rotate-180 text-[#6B1728] dark:text-amber-300' : 'text-stone-400'}`} />
              </button>

              {/* Customer Care Dropdown Panel */}
              {activeDropdown === 'care' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-[#1C141A] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in-50 zoom-in-95 space-y-1"
                  onMouseEnter={() => handleMouseEnterDropdown('care')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <button
                    onClick={() => {
                      navigateTo('track-order');
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-[#6B1728] dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#6B1728] dark:group-hover:text-amber-300">
                        অর্ডার ট্র্যাকিং
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        পার্সেলের বর্তমান অবস্থান জানুন
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('care-guide');
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#6B1728] dark:group-hover:text-amber-300">
                        শাড়ি কেয়ার গাইড
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        জামদানি ও কাতান সংরক্ষণের নিয়ম
                      </div>
                    </div>
                  </button>

                  <div className="p-2 bg-stone-50 dark:bg-stone-800/50 rounded-xl text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>৭ দিনের সহজ রিটার্ন সুবিধা</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>পণ্য দেখে মূল্য পরিশোধ</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Special Offers Link */}
            <button
              onClick={() => {
                navigateTo('home');
                const el = document.getElementById('saree-catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>হট অফার ও ছাড়</span>
            </button>

          </div>

          {/* Right Side Direct Links */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => navigateTo('about')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                currentPage === 'about'
                  ? 'text-[#6B1728] dark:text-amber-300 font-extrabold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#6B1728] dark:hover:text-amber-300'
              }`}
            >
              আমাদের পরিচিতি
            </button>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                currentPage === 'contact'
                  ? 'text-[#6B1728] dark:text-amber-300 font-extrabold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#6B1728] dark:hover:text-amber-300'
              }`}
            >
              শোরুম ও যোগাযোগ
            </button>
          </div>

        </nav>

        {/* Mobile Full Drawer Menu (Neatly Organised into Collapsible Sub-sections) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-4 bg-[#FAF8F5] dark:bg-[#140D12] pb-8 animate-in slide-in-from-top-3 max-h-[80vh] overflow-y-auto">
            
            {/* Quick Home and All Sarees */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigateTo('home');
                  if (onSelectFabric) onSelectFabric('');
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-center text-xs font-bold border transition-colors ${
                  currentPage === 'home' && !currentCategory
                    ? 'bg-[#6B1728] text-amber-100 border-[#6B1728]'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                }`}
              >
                🏠 হোম পেজ
              </button>

              <button
                onClick={() => {
                  navigateTo('category', '');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl text-center text-xs font-bold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
              >
                ✨ সব কালেকশন
              </button>
            </div>

            {/* Accordion 1: Saree Categories */}
            <div className="bg-white dark:bg-[#1C141A] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-stone-900 dark:text-stone-100 bg-stone-50/70 dark:bg-stone-800/60"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>শাড়ির ক্যাটাগরি ও ফ্যাব্রিক</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCategoriesOpen && (
                <div className="p-3 grid grid-cols-2 gap-2 border-t border-stone-100 dark:border-stone-800">
                  {FABRIC_COLLECTIONS.flatMap(g => g.items).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavFabricClick(item.fabric)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 text-xs font-semibold text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{item.icon}</span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.hot && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          হট
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Occasions */}
            <div className="bg-white dark:bg-[#1C141A] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              <button
                onClick={() => setMobileOccasionsOpen(!mobileOccasionsOpen)}
                className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-stone-900 dark:text-stone-100 bg-stone-50/70 dark:bg-stone-800/60"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                  <span>অনুষ্ঠান অনুযায়ী শাড়ি</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOccasionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileOccasionsOpen && (
                <div className="p-3 space-y-1.5 border-t border-stone-100 dark:border-stone-800">
                  {OCCASIONS_LIST.map((occ) => (
                    <button
                      key={occ.name}
                      onClick={() => handleNavOccasionClick(occ.occ)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 text-xs font-semibold text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span>{occ.icon}</span>
                        <span>{occ.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{occ.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 3: Customer Care & Info */}
            <div className="bg-white dark:bg-[#1C141A] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              <button
                onClick={() => setMobileHelpOpen(!mobileHelpOpen)}
                className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-stone-900 dark:text-stone-100 bg-stone-50/70 dark:bg-stone-800/60"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>গ্রাহক সেবা ও তথ্য</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileHelpOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileHelpOpen && (
                <div className="p-3 grid grid-cols-2 gap-2 border-t border-stone-100 dark:border-stone-800 text-xs font-bold">
                  <button
                    onClick={() => {
                      navigateTo('track-order');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300"
                  >
                    <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                    <span>অর্ডার ট্র্যাকিং</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('care-guide');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>কেয়ার গাইড</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('about');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  >
                    <Info className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span>আমাদের সম্পর্কে</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                  >
                    <MapPin className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span>শোরুম ও ঠিকানা</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Support */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">শাড়ি পছন্দ করতে সাহায্য চাই?</h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=হ্যালো,%20আমি%20শাড়ি%20কিনতে%20চাই।`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-emerald-700 shrink-0"
              >
                চ্যাট
              </a>
            </div>

            {/* Admin Switch in Mobile Drawer */}
            <div className="pt-2 flex items-center justify-between px-1 text-xs">
              <button
                onClick={() => {
                  setActiveView(activeView === 'store' ? 'admin' : 'store');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-bold hover:text-[#6B1728]"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>{activeView === 'admin' ? 'দোকানের ভিউতে যান' : 'অ্যাডমিন ড্যাশবোর্ড'}</span>
              </button>

              <a href={`tel:${settings.phone}`} className="font-bold text-[#6B1728] dark:text-amber-400">
                {settings.phone}
              </a>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};


