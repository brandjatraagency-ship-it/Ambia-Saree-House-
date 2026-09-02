import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCODHub } from './AdminCODHub';
import { AdminCoupons } from './AdminCoupons';
import { AdminSettings } from './AdminSettings';
import { AdminSEO } from './AdminSEO';
import { InvoiceModal } from './InvoiceModal';
import { Order, SareeProduct } from '../../types';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  Tag, 
  Settings, 
  ArrowLeft, 
  ShieldCheck, 
  Store,
  Sparkles,
  ExternalLink,
  Zap,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActiveView, setSelectedProduct, settings, orders, products, darkMode, toggleDarkMode } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'cod-hub' | 'products' | 'orders' | 'coupons' | 'settings' | 'seo'>('overview');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const pendingCount = orders.filter(o => o.status === 'পেন্ডিং').length;

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-[#F5F2EC] dark:bg-[#120E10] text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-stone-950 dark:bg-[#191418] text-white border-b border-stone-800 dark:border-stone-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand in Admin */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B1728] to-[#8B1E3F] border border-amber-400/40 flex items-center justify-center text-amber-200 font-serif-brand font-bold text-lg shadow-xs">
                আ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-brand font-bold text-base sm:text-lg text-amber-100">
                    {settings.storeName}
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-400/30">
                    অ্যাডমিন প্যানেল
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden sm:block">
                  স্টোর ম্যানেজমেন্ট, COD সেলস ও কুরিয়ার হাব
                </p>
              </div>
            </div>

            {/* Back to Storefront & Dark mode Action */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark mode switch */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors"
                title={darkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                id="back-to-store-btn"
                onClick={() => setActiveView('store')}
                className="flex items-center gap-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>মূল দোকানে ফিরুন</span>
              </button>
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none border-t border-stone-800/80 pt-2">
            <button
              id="admin-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ওভারভিউ ও ড্যাশবোর্ড</span>
            </button>

            <button
              id="admin-tab-cod-hub"
              onClick={() => setActiveTab('cod-hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'cod-hub'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ক্যাশ অন ডেলিভারি (COD) হাব</span>
            </button>

            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>শাড়ি ক্যাটালগ ({products.length})</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap relative ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>সকল অর্ডার ({orders.length})</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              id="admin-tab-coupons"
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>ডিসকাউন্ট কুপন</span>
            </button>

            <button
              id="admin-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>শপ সেটিংস ও চার্জ</span>
            </button>

            <button
              id="admin-tab-seo"
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>SEO ও সার্চ ইঞ্জিন</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

        </div>
      </header>

      {/* Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'overview' && (
          <AdminOverview 
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProductModal={() => setActiveTab('products')}
            onViewInvoice={(ord) => setSelectedInvoiceOrder(ord)}
          />
        )}

        {activeTab === 'cod-hub' && (
          <AdminCODHub 
            onViewInvoice={(ord) => setSelectedInvoiceOrder(ord)}
          />
        )}

        {activeTab === 'products' && (
          <AdminProducts 
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrders 
            onViewInvoice={(ord) => setSelectedInvoiceOrder(ord)}
          />
        )}

        {activeTab === 'coupons' && (
          <AdminCoupons />
        )}

        {activeTab === 'settings' && (
          <AdminSettings />
        )}

        {activeTab === 'seo' && (
          <AdminSEO />
        )}
      </main>

      {/* Invoice Modal for Admin */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Footer info */}
      <footer className="py-4 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-300 dark:border-stone-800">
        আম্বিয়া শাড়ি হাউস — অ্যাডমিন কন্ট্রোল প্যানেল © ২০২৬
      </footer>

    </div>
  );
};
