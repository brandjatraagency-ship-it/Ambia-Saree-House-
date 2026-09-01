import React, { useState } from 'react';
import { SareeProduct } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  MessageSquare, 
  Sparkles,
  Layers,
  MapPin,
  Scissors,
  Droplets,
  Share2
} from 'lucide-react';

interface ProductDetailModalProps {
  product?: SareeProduct | null;
  onClose?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product: propProduct, 
  onClose: propOnClose 
}) => {
  const { 
    selectedProduct,
    setSelectedProduct,
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen,
    settings,
    showToast 
  } = useStore();

  const product = propProduct !== undefined ? propProduct : selectedProduct;
  const onClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setSelectedProduct(null);
    }
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care' | 'reviews'>('details');

  // Customer Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 'r1',
      name: 'ফারহানা চৌধুরী',
      rating: 5,
      date: '৩ দিন আগে',
      comment: 'শাড়িটির রঙ এবং কাজের নিখুঁত ফিনিশিং অসাধারণ! ছবির থেকেও বাস্তবে অনেক বেশি সুন্দর লেগেছে। প্যাকেজিংও প্রিমিয়াম ছিল।',
      verified: true
    },
    {
      id: 'r2',
      name: 'তানিয়া সুলতানা',
      rating: 5,
      date: '১ সপ্তাহ আগে',
      comment: 'আম্বিয়া শাড়ি হাউস থেকে প্রথমবার নিলাম। খুবই নরম এবং আরামদায়ক ফ্যাব্রিক। ডেলিভারি ২ দিনের মধ্যে পেয়েছি।',
      verified: true
    }
  ]);

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('শাড়ির লিংক কপি করা হয়েছে!', 'info');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: 'r-' + Date.now(),
      name: newReviewName.trim(),
      rating: newReviewRating,
      date: 'আজকে',
      comment: newReviewComment.trim(),
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName('');
    setNewReviewComment('');
    showToast('আপনার মূল্যবান রিভিউটির জন্য ধন্যবাদ!', 'success');
  };

  const whatsappMessage = encodeURIComponent(
    `হ্যালো আম্বিয়া শাড়ি হাউস! আমি এই শাড়িটি অর্ডার করতে চাই:\n\n*${product.name}*\nকোড: ${product.code}\nমূল্য: ৳ ${product.price}\nফ্যাব্রিক: ${product.fabric}\nছবি: ${product.images[0]}`
  );

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      
      {/* Modal Container */}
      <div 
        id="product-detail-modal"
        className="relative bg-[#FAF8F5] dark:bg-[#161014] text-stone-900 dark:text-stone-100 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-4 max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-white dark:hover:bg-stone-700 shadow-md transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
            
            {/* Left: Multi-image Gallery */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#6B1728] dark:bg-[#851C32] text-amber-200 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    -{product.discountPercent}% ছাড়
                  </span>
                )}

                <button
                  id="modal-wishlist-toggle"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                    isFavorite 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#6B1728] dark:border-amber-400 ring-2 ring-[#6B1728]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fast Trust Indicators */}
              <div className="p-3.5 bg-stone-100/80 dark:bg-[#1E171C] rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-medium">
                  <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400 shrink-0" />
                  <span>ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিনে ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-medium">
                  <RefreshCw className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>ডেলিভারি ম্যানের সামনে দেখে নেওয়ার ১০০% গ্যারান্টি</span>
                </div>
              </div>
            </div>

            {/* Right: Saree Details & Order Actions */}
            <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
              
              <div>
                {/* Code & Origin */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                  <span className="font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-md">
                    কোড: {product.code}
                  </span>
                  <span className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-[#6B1728] dark:text-amber-400" />
                    {product.origin}
                  </span>
                </div>

                {/* Saree Name */}
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50 leading-snug font-bangla">
                  {product.name}
                </h1>

                {/* English Name & Ratings */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-serif-brand">
                    {product.nameEn}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{product.rating}</span>
                    <span className="text-xs text-stone-400">({product.reviewCount} রিভিউ)</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 my-4 py-3 border-y border-stone-200/80 dark:border-stone-800">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#6B1728] dark:text-amber-400 font-mono">
                    ৳ {product.price.toLocaleString('bn-BD')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-stone-400 line-through font-mono">
                        ৳ {product.originalPrice.toLocaleString('bn-BD')}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        সাশ্রয় ৳ {(product.originalPrice - product.price).toLocaleString('bn-BD')}
                      </span>
                    </>
                  )}
                </div>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block text-[10px] font-medium">ফ্যাব্রিক</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{product.fabric}</span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block text-[10px] font-medium">শাড়ির দৈর্ঘ্য</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{product.length}</span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block text-[10px] font-medium">ব্লাউজ পিস</span>
                    <span className={`font-semibold ${product.hasBlousePiece ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-400'}`}>
                      {product.hasBlousePiece ? 'হ্যাঁ (অন্তর্ভুক্ত)' : 'নেই'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block text-[10px] font-medium">স্টক অবস্থা</span>
                    <span className={`font-semibold ${product.inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700'}`}>
                      {product.inStock ? `ইন-স্টক (${product.stockCount} টি)` : 'স্টক আউট'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                {product.inStock && (
                  <div className="flex items-center gap-4 mt-5">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">পরিমাণ:</span>
                    <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-[#1E171C] overflow-hidden shadow-2xs">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 py-1.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-bold text-stone-900 dark:text-stone-100 border-x border-stone-200 dark:border-stone-700">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                        className="px-3.5 py-1.5 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Order Buttons */}
              <div className="space-y-2.5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-amber-50 border border-stone-800 dark:border-stone-700 transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>কার্টে যোগ করুন</span>
                  </button>

                  <button
                    id="modal-buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 shadow-md transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300 dark:text-stone-950 fill-amber-300 dark:fill-stone-950" />
                    <span>সরাসরি অর্ডার করুন</span>
                  </button>
                </div>

                {/* WhatsApp Direct Order */}
                <a
                  id="modal-whatsapp-order-btn"
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন</span>
                </a>
              </div>

            </div>

          </div>

          {/* Tabbed Info Section */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
            <div className="flex border-b border-stone-200 dark:border-stone-800 gap-4 overflow-x-auto text-xs font-semibold scrollbar-none">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'border-[#6B1728] dark:border-amber-400 text-[#6B1728] dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                পণ্যের বিবরণ
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'border-[#6B1728] dark:border-amber-400 text-[#6B1728] dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                স্পেসিফিকেশন ও ব্লাউজ
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'care'
                    ? 'border-[#6B1728] dark:border-amber-400 text-[#6B1728] dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                যত্ন ও ওয়াশ কেয়ার
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-[#6B1728] dark:border-amber-400 text-[#6B1728] dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                কাস্টমার রিভিউ ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p className="font-normal text-stone-700 dark:text-stone-300">{product.description}</p>
                  <div className="bg-amber-50/70 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      আম্বিয়া শাড়ি হাউসের বিশেষ অঙ্গীকার:
                    </p>
                    <p>প্রতিটি শাড়ি সরাসরি তাঁত পল্লী থেকে নিজস্ব তত্ত্বাবধানে সংগৃহীত এবং কোয়ালিটি চেক করা।</p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-[#1E171C] p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block">রং ও শেড</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{product.color}</span>
                  </div>
                  <div className="bg-white dark:bg-[#1E171C] p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block">ব্লাউজ পিস বিবরণ</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{product.blousePieceDetails || 'প্রযোজ্য নয়'}</span>
                  </div>
                  <div className="bg-white dark:bg-[#1E171C] p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block">উপযুক্ত অনুষ্ঠান</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{product.occasion.join(', ')}</span>
                  </div>
                  <div className="bg-white dark:bg-[#1E171C] p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-400 block">উৎপাদন স্থান</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{product.origin}</span>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3 bg-white dark:bg-[#1E171C] p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="flex items-start gap-2.5">
                    <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-900 dark:text-stone-100">{product.washCare}</p>
                      <p className="text-stone-600 dark:text-stone-400 text-xs">কখনোই কড়া রোদে দীর্ঘক্ষণ শুকাবেন না। পাতলা সুতি কাপড়ে মুড়ে ড্রয়ারে রাখুন।</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">{rev.name}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                                ভেরিফাইড ক্রেতা
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-stone-700 dark:text-stone-300">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="bg-stone-100/80 dark:bg-[#1E171C] p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-3">
                    <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200">আপনার মতামত লিখুন</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="আপনার নাম"
                        className="p-2 text-xs bg-white dark:bg-[#251D22] text-stone-900 dark:text-stone-100 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                      />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-stone-600 dark:text-stone-400">রেটিং:</span>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="p-2 text-xs bg-white dark:bg-[#251D22] text-stone-900 dark:text-stone-100 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (৫/৫)</option>
                          <option value={4}>⭐⭐⭐⭐ (৪/৫)</option>
                          <option value={3}>⭐⭐⭐ (৩/৫)</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      required
                      rows={2}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="শাড়িটির কোয়ালিটি এবং আপনার অভিজ্ঞতা কেমন ছিল..."
                      className="w-full p-2 text-xs bg-white dark:bg-[#251D22] text-stone-900 dark:text-stone-100 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                    />
                    <button
                      type="submit"
                      className="bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 text-xs font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      রিভিউ সাবমিট করুন
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
