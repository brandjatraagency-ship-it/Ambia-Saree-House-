import React, { useState, useMemo, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FabricPills } from './components/FabricPills';
import { ProductCard } from './components/ProductCard';
import { ProductFilterBar } from './components/ProductFilterBar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { SareeCareModal } from './components/SareeCareModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/Admin/AdminDashboard';

// Multi-page components
import { ProductLandingPage } from './pages/ProductLandingPage';
import { CollectionPage } from './pages/CollectionPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CareGuidePage } from './pages/CareGuidePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';

import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Heart,
  ChevronRight,
  PackageOpen
} from 'lucide-react';

const HomePageContent: React.FC<{
  selectedFabric: string;
  setSelectedFabric: (fab: string) => void;
  selectedOccasion: string;
  setSelectedOccasion: (occ: string) => void;
  selectedColor: string;
  setSelectedColor: (col: string) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (pr: string) => void;
  searchQuery: string;
  setSearchQuery: (sq: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  onlyBlousePiece: boolean;
  setOnlyBlousePiece: (val: boolean) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  filteredProducts: any[];
  hasActiveFilters: boolean;
  handleResetFilters: () => void;
  scrollToCatalog: () => void;
}> = ({
  selectedFabric,
  setSelectedFabric,
  selectedOccasion,
  setSelectedOccasion,
  selectedColor,
  setSelectedColor,
  selectedPriceRange,
  setSelectedPriceRange,
  searchQuery,
  setSearchQuery,
  selectedSort,
  setSelectedSort,
  onlyBlousePiece,
  setOnlyBlousePiece,
  onlyInStock,
  setOnlyInStock,
  filteredProducts,
  hasActiveFilters,
  handleResetFilters,
  scrollToCatalog
}) => {
  return (
    <>
      {/* Hero Banner Showcase */}
      <HeroBanner 
        onExplore={scrollToCatalog} 
        onFabricSelect={(fab) => {
          setSelectedFabric(fab);
          scrollToCatalog();
        }}
      />

      {/* Value Proposition & Trust Badges Strip */}
      <section className="bg-white dark:bg-[#1A1218] border-y border-stone-200/90 dark:border-stone-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#6B1728] dark:text-amber-400 flex items-center justify-center mb-1 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-bangla">১০০% খাঁটি শাড়ি কালেকশন</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">তাঁতিদের নিজস্ব নিখুঁত বুনন</p>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#6B1728] dark:text-amber-400 flex items-center justify-center mb-1 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-bangla">সারা দেশে ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">পণ্য হাতে পেয়ে মূল্য পরিশোধ</p>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#6B1728] dark:text-amber-400 flex items-center justify-center mb-1 shadow-2xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-bangla">৭ দিনের সহজ রিটার্ন</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">পছন্দ না হলে সহজ এক্সচেঞ্জ</p>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#6B1728] dark:text-amber-400 flex items-center justify-center mb-1 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-bangla">প্রিমিয়াম শোরুম কোয়ালিটি</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">গাউছিয়া মার্কেট গ্যারান্টি</p>
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <main id="saree-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B1728]/10 dark:bg-amber-950/40 text-[#6B1728] dark:text-amber-300 text-xs font-bold font-serif-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অভিজাত শাড়ির মহোৎসব</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif-brand">
            আমাদের এক্সক্লুসিভ শাড়ি কালেকশন
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-bangla">
            ঢাকাই জামদানি থেকে শুরু করে রাজকীয় বেনারসি কাতান ও তসর সিল্ক — প্রতিটি শাড়িতে জড়িয়ে আছে বাঙালি নারীর রূপ ও ঐতিহ্য।
          </p>
        </div>

        {/* Fabric Filter Pills */}
        <FabricPills
          selectedFabric={selectedFabric}
          onSelectFabric={(fab) => setSelectedFabric(fab)}
        />

        {/* Filter and Sorting Toolbar */}
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
          selectedFabric={selectedFabric}
          onClearFabric={() => setSelectedFabric('')}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalFilteredCount={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#1E171C] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">কোনো শাড়ি খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              আপনার নির্বাচিত ফিল্টার বা অনুসন্ধানের সাথে কোনো পণ্য মেলেনি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#6B1728] hover:bg-[#52111e] dark:bg-amber-400 dark:text-stone-950 text-amber-100 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div 
            id="saree-products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>
    </>
  );
};

const StoreContent: React.FC = () => {
  const { 
    products, 
    activeView, 
    currentPage,
    selectedProduct,
    currentCategory,
    settings,
    navigateTo
  } = useStore();

  // Filter States for Home Page
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [onlyBlousePiece, setOnlyBlousePiece] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const hasActiveFilters = Boolean(
    selectedFabric || 
    selectedOccasion || 
    selectedColor || 
    selectedPriceRange ||
    onlyBlousePiece || 
    onlyInStock || 
    searchQuery
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Filtered and Sorted Products for Home
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p || !p.id) return false;
      // Fabric filter
      if (selectedFabric && selectedFabric !== 'সকল' && p.fabric !== selectedFabric) {
        return false;
      }
      // Occasion filter
      if (selectedOccasion && selectedOccasion !== 'সকল অনুষ্ঠান') {
        const matchesOcc = Array.isArray(p.occasion) && p.occasion.some(occ => occ.includes(selectedOccasion) || selectedOccasion.includes(occ));
        if (!matchesOcc) return false;
      }
      // Color filter
      if (selectedColor) {
        if (!p.color.toLowerCase().includes(selectedColor.toLowerCase())) {
          return false;
        }
      }
      // Price Range filter
      if (selectedPriceRange) {
        if (selectedPriceRange === 'under-3000' && p.price >= 3000) return false;
        if (selectedPriceRange === '3000-8000' && (p.price < 3000 || p.price > 8000)) return false;
        if (selectedPriceRange === '8000-15000' && (p.price < 8000 || p.price > 15000)) return false;
        if (selectedPriceRange === 'above-15000' && p.price <= 15000) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchNameEn = (p.nameEn || '').toLowerCase().includes(q);
        const matchCode = (p.code || '').toLowerCase().includes(q);
        const matchFabric = (p.fabric || '').toLowerCase().includes(q);
        const matchColor = (p.color || '').toLowerCase().includes(q);
        if (!matchName && !matchNameEn && !matchCode && !matchFabric && !matchColor) {
          return false;
        }
      }
      // Blouse piece
      if (onlyBlousePiece && !p.hasBlousePiece) {
        return false;
      }
      // Stock
      if (onlyInStock && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'price-asc':
        case 'price-low':
          return a.price - b.price;
        case 'price-desc':
        case 'price-high':
          return b.price - a.price;
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'popular':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, selectedFabric, selectedOccasion, selectedColor, selectedPriceRange, searchQuery, selectedSort, onlyBlousePiece, onlyInStock]);

  const handleResetFilters = () => {
    setSelectedFabric('');
    setSelectedOccasion('');
    setSelectedColor('');
    setSelectedPriceRange('');
    setSearchQuery('');
    setSelectedSort('featured');
    setOnlyBlousePiece(false);
    setOnlyInStock(false);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('saree-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeView === 'admin') {
    return (
      <>
        <AdminDashboard />
        <ProductDetailModal />
        <ToastContainer />
      </>
    );
  }

  // Determine current active page to render
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'product':
        if (selectedProduct) {
          return <ProductLandingPage product={selectedProduct} />;
        }
        // Fallback if direct url or no product selected
        return (
          <HomePageContent 
            selectedFabric={selectedFabric}
            setSelectedFabric={setSelectedFabric}
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={setSelectedOccasion}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            onlyBlousePiece={onlyBlousePiece}
            setOnlyBlousePiece={setOnlyBlousePiece}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            filteredProducts={filteredProducts}
            hasActiveFilters={hasActiveFilters}
            handleResetFilters={handleResetFilters}
            scrollToCatalog={scrollToCatalog}
          />
        );

      case 'category':
        return <CollectionPage />;

      case 'track-order':
        return <TrackOrderPage />;

      case 'care-guide':
        return <CareGuidePage />;

      case 'about':
        return <AboutPage />;

      case 'contact':
        return <ContactPage />;

      case 'wishlist':
        return <WishlistPage />;

      case 'home':
      default:
        return (
          <HomePageContent 
            selectedFabric={selectedFabric}
            setSelectedFabric={setSelectedFabric}
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={setSelectedOccasion}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            onlyBlousePiece={onlyBlousePiece}
            setOnlyBlousePiece={setOnlyBlousePiece}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            filteredProducts={filteredProducts}
            hasActiveFilters={hasActiveFilters}
            handleResetFilters={handleResetFilters}
            scrollToCatalog={scrollToCatalog}
          />
        );
    }
  };

  return (
    <div id="store-main-app" className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 selection:bg-[#6B1728] selection:text-amber-100 transition-colors">
      
      {/* Top Header with Sticky Nav & Search */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectFabric={(fab) => {
          setSelectedFabric(fab);
          if (currentPage !== 'home' && !fab) {
            navigateTo('home');
          } else if (fab) {
            navigateTo('category', fab);
          } else {
            scrollToCatalog();
          }
        }}
        onSelectOccasion={(occ) => {
          setSelectedOccasion(occ);
          if (currentPage !== 'home') {
            navigateTo('home');
          }
          scrollToCatalog();
        }}
      />

      {/* Dynamic Multi-Page Body Content */}
      <div className="flex-1">
        {renderCurrentPage()}
      </div>

      {/* Floating Quick Action Buttons (WhatsApp & Helpline) */}
      <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আম্বিয়া শাড়ি হাউস থেকে শাড়ি কিনতে আগ্রহী।')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp-এ যোগাযোগ করুন"
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          title="WhatsApp-এ যোগাযোগ করুন"
        >
          <MessageSquare className="w-6 h-6" />
        </a>

        <a
          id="floating-call-btn"
          href={`tel:${settings.phone}`}
          aria-label="সরাসরি ফোন দিন"
          className="w-12 h-12 bg-[#6B1728] hover:bg-[#52111e] text-amber-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          title="সরাসরি ফোন দিন"
        >
          <Phone className="w-5 h-5" />
        </a>
      </aside>

      {/* Footer */}
      <Footer onSelectFabric={(fab) => {
        setSelectedFabric(fab);
        if (fab) {
          navigateTo('category', fab);
        } else {
          navigateTo('home');
        }
      }} />

      {/* Interactive Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />
      <SareeCareModal />
      <ToastContainer />

    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}

export default App;
