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
  MapPin,
  User,
  Crown
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
  'সবুজ কাতান শাড়ি',
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
    setActiveView
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
      className="sticky top-0 z-40 w-full bg-[#181215] text-stone-100 border-b border-[#2C2126] shadow-xl transition-colors select-none"
    >
      
      {/* 1. Top Thin Notification Bar (পাতলা লাল/মেরুন বার) */}
      <div id="top-notification-bar" className="bg-[#581220] border-b border-[#6E1929] text-amber-100 text-[11px] sm:text-xs font-medium py-1.5 px-3 sm:px-4 tracking-wide shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <span className="truncate font-medium text-amber-100/95">
              {settings.announcementText || '✨ নতুন কালেকশন! বিশেষ অফার এবং প্রিমিয়াম সার্ভিস | ৮,৫০০+ অর্ডারে ফ্রি ডেলিভারি! ✨'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] shrink-0 font-medium">
            <button 
              onClick={() => navigateTo('track-order')}
              className="flex items-center gap-1.5 text-amber-200/90 hover:text-amber-100 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>তোমাদের অর্ডার দ্রুত ডেলিভারি</span>
            </button>
            <span className="text-amber-300/30">|</span>
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-amber-200/90 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-300 shrink-0" />
              <span>হেল্পলাইন: {settings.phone || '01711-234567'}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar (মূল নেভিগেশন বার) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          
          {/* Left: Mobile Menu & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-stone-300 hover:bg-[#2A1E24] transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Logo & Golden Title */}
            <div 
              id="brand-logo-container"
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 min-w-0" 
              onClick={() => {
                setActiveView('store');
                navigateTo('home');
                if (onSelectFabric) onSelectFabric('');
              }}
            >
              {/* Royal Circular Monogram Emblem */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#6B1728] via-[#851C32] to-[#450C19] border border-amber-400/40 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif-brand text-amber-200 font-extrabold text-xl sm:text-2xl tracking-wider select-none">
                  আ
                </span>
              </div>

              {/* Store Name in Gold */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-serif-brand text-lg sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F7E1A0] via-[#E8C16B] to-[#C99839] group-hover:brightness-110 transition-all truncate whitespace-nowrap">
                  শারী হাউস
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] text-amber-200/60 font-medium tracking-widest uppercase truncate">
                  SHARI HOUSE • LUXURY
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Box */}
          <div ref={searchContainerRef} className="hidden lg:block relative flex-1 max-w-sm xl:max-w-md mx-4">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="জামদানি, কাতান, সিল্ক বা কোড খুঁজুন..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#251A20] border border-[#3E2B35] rounded-full text-xs sm:text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/60 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs w-4 h-4 rounded-full hover:bg-stone-700 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Smart Search Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1F151B] border border-[#3E2B35] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2E2028] text-[11px] font-bold text-amber-300">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
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
                      className="text-xs bg-[#2A1E24] hover:bg-[#6B1728] hover:text-amber-200 text-stone-300 px-3 py-1 rounded-full border border-[#3E2B35] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Wishlist, Shopping Bag Capsule & Admin/Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 rounded-full text-stone-300 hover:bg-[#2A1E24] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button (Heart Icon) */}
            <button
              id="wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className={`p-2 sm:p-2.5 rounded-full relative transition-colors ${
                currentPage === 'wishlist'
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                  : 'text-stone-300 hover:text-rose-400 hover:bg-[#2A1E24]'
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

            {/* Shopping Bag Button (Gold capsule as shown in image) */}
            <button
              id="cart-drawer-trigger"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#F0C05A] via-[#E5B147] to-[#D49F30] hover:from-[#E5B147] hover:to-[#C69024] text-stone-950 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all relative font-bold group cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#6B1728] text-amber-100 text-[9px] sm:text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs leading-none gap-1 font-bold">
                <span>ব্যাগ</span>
                {totalCartCount > 0 && (
                  <span className="hidden sm:inline text-[11px] font-mono">({totalCartCount})</span>
                )}
              </div>
            </button>

            {/* Profile / Admin Button */}
            <button
              id="admin-view-toggle"
              onClick={() => setActiveView(activeView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md'
                  : 'bg-[#251A20] text-amber-200/90 border-[#3E2B35] hover:border-amber-400/40 hover:bg-[#2F2129]'
              }`}
              title="অ্যাডমিন ও প্রোফাইল"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{activeView === 'admin' ? 'দোকানে ফিরুন' : 'অ্যাডমিন'}</span>
            </button>

          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="py-2.5 lg:hidden border-t border-[#2C2126] animate-in fade-in slide-in-from-top-2">
            <div className="relative w-full">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="শাড়ির নাম বা কোড দিয়ে খুঁজুন..."
                autoFocus
                className="w-full pl-9 pr-8 py-2 bg-[#251A20] border border-[#3E2B35] rounded-full text-xs text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. Category Menu Bar (ক্যাটাগরি মেনু: হোম, শাড়ির কালেকশন, ইত্যাদি) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#2C2126] py-2">
          
          <div className="flex items-center gap-1.5 xl:gap-2">
            
            {/* 1. Home (Gold Active Pill as shown in image) */}
            <button
              onClick={() => {
                navigateTo('home');
                if (onSelectFabric) onSelectFabric('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentPage === 'home' && !currentCategory
                  ? 'bg-gradient-to-r from-[#F0C05A] to-[#D49F30] text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-[#2A1E24]'
              }`}
            >
              হোম
            </button>

            {/* 2. Saree Collections Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('collections')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'collections' ? null : 'collections')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentPage === 'category' || activeDropdown === 'collections'
                    ? 'bg-[#2F2129] text-amber-300 border border-amber-400/30'
                    : 'text-stone-300 hover:text-amber-300 hover:bg-[#2A1E24]'
                }`}
              >
                <span>শাড়ির কালেকশন</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'collections' ? 'rotate-180 text-amber-300' : 'text-stone-400'}`} />
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === 'collections' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[540px] bg-[#1F151B] border border-[#3E2B35] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 grid grid-cols-2 gap-4"
                  onMouseEnter={() => handleMouseEnterDropdown('collections')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  {FABRIC_COLLECTIONS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 pb-1 border-b border-[#2C2126]">
                        {group.title}
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavFabricClick(item.fabric)}
                            className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-[#2A1E24] group transition-colors cursor-pointer"
                          >
                            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                                  {item.name}
                                </span>
                                {item.hot && (
                                  <span className="text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                                    হট
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-400 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="col-span-2 pt-2 border-t border-[#2C2126] flex items-center justify-between text-xs">
                    <span className="text-stone-400">তাঁতিদের নিজস্ব নিখুঁত বুনন গ্যারান্টি</span>
                    <button
                      onClick={() => handleNavFabricClick('')}
                      className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>সকল শাড়ি একনজরে</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Occasions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('occasions')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'occasions' ? null : 'occasions')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeDropdown === 'occasions'
                    ? 'bg-[#2F2129] text-amber-300 border border-amber-400/30'
                    : 'text-stone-300 hover:text-amber-300 hover:bg-[#2A1E24]'
                }`}
              >
                <span>অনুষ্ঠানভিত্তিক</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'occasions' ? 'rotate-180 text-amber-300' : 'text-stone-400'}`} />
              </button>

              {activeDropdown === 'occasions' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-[#1F151B] border border-[#3E2B35] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-50 zoom-in-95 space-y-1"
                  onMouseEnter={() => handleMouseEnterDropdown('occasions')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-1">
                    অনুষ্ঠানের জন্য বাছাইকৃত শাড়ি
                  </div>
                  {OCCASIONS_LIST.map((occ) => (
                    <button
                      key={occ.name}
                      onClick={() => handleNavOccasionClick(occ.occ)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-[#2A1E24] text-xs font-medium text-stone-200 hover:text-amber-300 transition-colors"
                    >
                      <span>{occ.icon}</span>
                      <div className="truncate">
                        <div className="font-bold">{occ.name}</div>
                        <div className="text-[10px] text-stone-400">{occ.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Customer Care Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('care')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'care' ? null : 'care')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-300 hover:text-amber-300 hover:bg-[#2A1E24] transition-all"
              >
                <span>গ্রাহক সেবা ও তথ্য</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {activeDropdown === 'care' && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-[#1F151B] border border-[#3E2B35] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 space-y-1 text-xs"
                  onMouseEnter={() => handleMouseEnterDropdown('care')}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <button
                    onClick={() => {
                      navigateTo('track-order');
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#2A1E24] text-stone-200 hover:text-amber-300 transition-colors"
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>পার্সেল ট্র্যাকিং</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('care-guide');
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#2A1E24] text-stone-200 hover:text-amber-300 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>শাড়ি যত্ন ও ওয়াশ নির্দেশিকা</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('contact');
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#2A1E24] text-stone-200 hover:text-amber-300 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>কাস্টমার সাপোর্ট</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Hot Offer Pill */}
            <button
              onClick={() => {
                const el = document.getElementById('saree-catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-[#2A1E24] transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>হট অফার ও ছাড়</span>
            </button>

          </div>

          {/* Right Links (আমাদের পরিচিতি, শোরুম ও যোগাযোগ) */}
          <div className="flex items-center gap-4 text-xs font-medium text-stone-400">
            <button 
              onClick={() => navigateTo('about')}
              className="hover:text-amber-300 transition-colors"
            >
              আমাদের পরিচিতি
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="hover:text-amber-300 transition-colors"
            >
              শোরুম ও যোগাযোগ
            </button>
          </div>

        </nav>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-between animate-in fade-in">
          <div className="bg-[#1C1318] border-b border-[#3E2B35] max-h-[85vh] overflow-y-auto p-4 space-y-4">
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigateTo('home');
                  if (onSelectFabric) onSelectFabric('');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left font-bold text-sm text-amber-300 py-2 border-b border-[#2C2126]"
              >
                🏠 হোম পেজ
              </button>

              <div className="py-2 border-b border-[#2C2126]">
                <div className="font-bold text-xs text-amber-400 mb-2">শাড়ির কালেকশন</div>
                <div className="grid grid-cols-2 gap-2">
                  {['জামদানি', 'কাতান', 'মসলিন', 'সিল্ক', 'তাঁত ও কটন', 'বেনারসি'].map(f => (
                    <button
                      key={f}
                      onClick={() => handleNavFabricClick(f)}
                      className="text-left text-xs bg-[#2A1E24] text-stone-200 p-2 rounded-lg hover:text-amber-300"
                    >
                      {f} শাড়ি
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2 space-y-2 text-xs text-stone-300">
                <button onClick={() => { navigateTo('track-order'); setMobileMenuOpen(false); }} className="w-full text-left py-1">
                  🚚 পার্সেল ট্র্যাকিং
                </button>
                <button onClick={() => { navigateTo('care-guide'); setMobileMenuOpen(false); }} className="w-full text-left py-1">
                  📖 শাড়ি যত্ন ও ধোয়ার নিয়ম
                </button>
                <button onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }} className="w-full text-left py-1">
                  ℹ️ আমাদের পরিচিতি
                </button>
                <button onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }} className="w-full text-left py-1">
                  📞 শোরুম ও যোগাযোগ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
