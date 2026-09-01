import React from 'react';
import { SareeProduct } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Zap, Check } from 'lucide-react';

interface ProductCardProps {
  product: SareeProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProduct, 
    navigateTo,
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen 
  } = useStore();

  if (!product || !product.id) return null;

  const isFavorite = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    navigateTo('product', product);
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-900">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#6B1728] dark:bg-[#851C32] text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercent}% ছাড়
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
              বেস্টসেলার
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-stone-900 dark:bg-stone-800 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-amber-400/20">
              নতুন
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            isFavorite 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Floating Overlay on Hover */}
        <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 dark:bg-[#1E171C]/95 backdrop-blur-sm text-stone-900 dark:text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 border border-stone-200 dark:border-stone-700">
            <Eye className="w-3.5 h-3.5 text-[#6B1728] dark:text-amber-400" />
            <span>বিস্তারিত দেখুন</span>
          </div>
        </div>

        {/* Stock Alert Badge */}
        {!product.inStock ? (
          <div className="absolute bottom-0 inset-x-0 bg-stone-900/90 text-white text-center text-xs py-1.5 font-semibold">
            স্টক শেষ (Stock Out)
          </div>
        ) : product.stockCount <= 3 ? (
          <div className="absolute bottom-0 inset-x-0 bg-amber-600/90 text-amber-50 text-center text-[11px] py-1 font-semibold">
            মাত্র {product.stockCount} টি অবশিষ্ট আছে!
          </div>
        ) : null}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Saree Code & Fabric */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium mb-1">
            <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded font-mono font-semibold">
              {product.code}
            </span>
            <span className="text-[#6B1728] dark:text-amber-400 font-semibold">
              {product.fabric}
            </span>
          </div>

          {/* Saree Title */}
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base line-clamp-2 group-hover:text-[#6B1728] dark:group-hover:text-amber-300 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Saree Attributes */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-600 dark:text-stone-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600 shrink-0" style={{ backgroundColor: product.colorHex }} />
              <span className="truncate max-w-[90px]">{product.color}</span>
            </span>
            <span>•</span>
            <span className={product.hasBlousePiece ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-500'}>
              {product.hasBlousePiece ? 'ব্লাউজ পিসসহ' : 'ব্লাউজ পিস ছাড়া'}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{product.rating}</span>
            <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-[#6B1728] dark:text-amber-400 font-mono">
              ৳ {product.price.toLocaleString('bn-BD')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono">
                ৳ {product.originalPrice.toLocaleString('bn-BD')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
              <span>কার্টে যোগ</span>
            </button>

            <button
              id={`buy-now-${product.id}`}
              onClick={handleQuickOrder}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold bg-[#6B1728] dark:bg-amber-400 hover:bg-[#541220] dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 dark:text-stone-950 fill-amber-300 dark:fill-stone-950" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
