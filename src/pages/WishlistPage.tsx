import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigateTo } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div id="wishlist-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#4E0E1B] via-[#6B1728] to-[#3D0A14] text-amber-100 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমে ফিরে যান</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold font-serif-brand">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>সংরক্ষিত শাড়ি তালিকা</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-brand">
            আপনার পছন্দের শাড়িসমূহ ({wishlistProducts.length})
          </h1>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#1E171C] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">উইশলিস্ট খালি</h3>
            <p className="text-xs text-stone-500">
              আপনি এখনো কোনো শাড়ি উইশলিস্টে যুক্ত করেননি। আপনার পছন্দের শাড়ির হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন।
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="bg-[#6B1728] hover:bg-[#52111e] text-amber-100 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>শাড়ি ব্রাউজ করুন</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
};
