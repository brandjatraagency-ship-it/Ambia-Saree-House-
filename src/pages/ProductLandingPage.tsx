import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { SareeProduct, CustomerDetails, ProductReview } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Share2, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  Sparkles, 
  Info, 
  Eye, 
  Clock, 
  Flame,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
  Scissors,
  HelpCircle,
  ThumbsUp,
  MapPin
} from 'lucide-react';

interface ProductLandingPageProps {
  product: SareeProduct;
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({ product }) => {
  const { 
    products,
    settings, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    placeOrder, 
    setIsCartOpen,
    navigateTo,
    reviews,
    addReview,
    showToast
  } = useStore();

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Buy box state
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(product.color);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'care' | 'delivery'>('story');

  // Simulated live viewing & urgency stats
  const [liveViewers, setLiveViewers] = useState<number>(4);
  useEffect(() => {
    // Randomize live viewers slightly
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.floor(Math.random() * 4) + 3);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Direct 1-Click Cash on Delivery Form State
  const orderFormRef = useRef<HTMLDivElement>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [deliveryArea, setDeliveryArea] = useState<'ঢাকা সিটির ভিতরে' | 'ঢাকা সিটির বাইরে' | 'ঢাকার পার্শ্ববর্তী এলাকা'>('ঢাকা সিটির ভিতরে');
  const [customerDistrict, setCustomerDistrict] = useState<string>('ঢাকা');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // Review Form State
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerLocation, setReviewerLocation] = useState<string>('ঢাকা');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  // Filter reviews for this product (plus generic initial reviews fallback)
  const productReviews = reviews.filter(r => r.productId === product.id);

  const isFavorite = isInWishlist(product.id);

  // Delivery fee calculation
  const deliveryFee = 
    (product.price * quantity) >= settings.freeDeliveryThreshold
      ? 0
      : deliveryArea === 'ঢাকা সিটির ভিতরে'
      ? settings.insideDhakaDeliveryFee
      : deliveryArea === 'ঢাকার পার্শ্ববর্তী এলাকা'
      ? settings.subDhakaDeliveryFee
      : settings.outsideDhakaDeliveryFee;

  const totalPayable = (product.price * quantity) + deliveryFee;
  const savingsAmount = product.originalPrice && product.originalPrice > product.price 
    ? (product.originalPrice - product.price) * quantity 
    : 0;

  // Scroll to instant order form
  const scrollToOrderForm = () => {
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // highlight visual pulse
      orderFormRef.current.classList.add('ring-4', 'ring-[#6B1728]', 'ring-offset-4');
      setTimeout(() => {
        orderFormRef.current?.classList.remove('ring-4', 'ring-[#6B1728]', 'ring-offset-4');
      }, 2000);
    }
  };

  // Image zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Direct 1-Click Order Placement
  const handleDirectOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন';
    }
    const cleanPhone = customerPhone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      errors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711XXXXXX)';
    }
    if (!customerAddress.trim() || customerAddress.trim().length < 8) {
      errors.address = 'অনুগ্রহ করে আপনার সম্পূর্ণ ঠিকানা (বাড়ি, রোড, এলাকা) লিখুন';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmittingOrder(true);

    try {
      // Add this product directly to cart then place order
      addToCart(product, quantity, selectedColor);

      const customer: CustomerDetails = {
        name: customerName.trim(),
        phone: cleanPhone,
        address: customerAddress.trim(),
        city: deliveryArea,
        district: customerDistrict,
        note: customerNote.trim() || undefined
      };

      await placeOrder(customer, 'cod');
      
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerNote('');
      showToast('আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
      showToast('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Submit Review Handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      showToast('অনুগ্রহ করে আপনার নাম লিখুন', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('অনুগ্রহ করে আপনার রিভিউ মন্তব্য লিখুন', 'error');
      return;
    }

    setIsReviewSubmitting(true);
    addReview({
      productId: product.id,
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      location: reviewerLocation,
      isVerifiedPurchase: true
    });

    setReviewerName('');
    setReviewComment('');
    setShowReviewForm(false);
    setIsReviewSubmitting(false);
  };

  // Related sarees (same fabric or category)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.fabric === product.fabric || p.category === product.category))
    .slice(0, 4);

  // WhatsApp link with prefilled message
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `আসসালামু আলাইকুম! আমি আম্বিয়া শাড়ি হাউস থেকে "${product.name}" (কোড: ${product.code}, মূল্য: ৳${product.price}) শাড়িটি সম্পর্কে জানতে ও অর্ডার করতে চাই।`
  )}`;

  return (
    <div id="product-landing-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-24">
      
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white/90 dark:bg-[#1A1218]/90 border-b border-stone-200/90 dark:border-stone-800 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 overflow-x-auto no-scrollbar py-0.5">
            <button 
              onClick={() => navigateTo('home')}
              className="hover:text-[#6B1728] dark:hover:text-amber-300 font-medium flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>হোম</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <button 
              onClick={() => navigateTo('category', product.fabric)}
              className="hover:text-[#6B1728] dark:hover:text-amber-300 font-medium shrink-0"
            >
              {product.fabric} কালেকশন
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-900 dark:text-amber-300 font-bold truncate max-w-[200px] sm:max-w-sm">
              {product.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-full font-bold">
              কোড: {product.code}
            </span>
          </div>

        </div>
      </div>

      {/* Main Product Showcase Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* 2-Column Hero Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: High Resolution Gallery (5 Columns on Desktop) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Interactive Zoomable Image Preview */}
            <div 
              ref={imageContainerRef}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-lg cursor-crosshair group"
            >
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                      }
                    : undefined
                }
              />

              {/* Floating Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="bg-gradient-to-r from-[#6B1728] to-[#8E1E36] text-amber-200 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-md border border-amber-400/30">
                    -{product.discountPercent}% বিশেষ ছাড়
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-amber-500 text-stone-950 text-[11px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider shadow-md">
                    বেস্টসেলার চয়েস
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-stone-900 text-amber-100 text-[11px] font-bold px-3 py-1 rounded-xl shadow-md border border-amber-400/30">
                    নতুন কালেকশন
                  </span>
                )}
              </div>

              {/* Wishlist & Share Floating Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  id="product-wishlist-toggle"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isFavorite 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-rose-600'
                  }`}
                  aria-label="Add to Wishlist"
                  title="পছন্দের তালিকায় যোগ করুন"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('শাড়ির লিংক সফলভাবে কপি করা হয়েছে!', 'success');
                  }}
                  className="p-3 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-[#6B1728] dark:hover:text-amber-300 backdrop-blur-md transition-all shadow-md"
                  aria-label="Share Link"
                  title="লিংক কপি করুন"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Zoom Instruction Tag */}
              <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-sm text-amber-200 text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Eye className="w-3.5 h-3.5" />
                <span>কাছে নিয়ে দেখতে মাউস রাখুন</span>
              </div>

              {/* Artisan Authenticity Seal */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-[#1A1218]/90 backdrop-blur-md border border-amber-400/40 text-stone-900 dark:text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>১০০% খাঁটি দেশীয় তাঁত</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#6B1728] dark:border-amber-400 ring-2 ring-[#6B1728]/20 dark:ring-amber-400/20 scale-105 shadow-md'
                        : 'border-stone-200 dark:border-stone-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Value Badges Banner below images */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span className="font-bold text-stone-800 dark:text-stone-200">ক্যাশ অন ডেলিভারি</span>
                <span className="text-[10px] text-stone-500">হাতে পেয়ে টাকা দিন</span>
              </div>
              <div className="flex flex-col items-center space-y-1 border-x border-amber-200/80 dark:border-amber-900/40 px-1">
                <RotateCcw className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span className="font-bold text-stone-800 dark:text-stone-200">৭ দিন এক্সচেঞ্জ</span>
                <span className="text-[10px] text-stone-500">পছন্দ না হলে বদল</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span className="font-bold text-stone-800 dark:text-stone-200">প্রোডাক্ট চেকিং</span>
                <span className="text-[10px] text-stone-500">দেখে নেওয়ার সুযোগ</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Converting Buy Box & Details (7 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header: Title, Fabric, Ratings & Code */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#6B1728]/10 dark:bg-amber-400/10 text-[#6B1728] dark:text-amber-300 font-semibold text-xs px-3 py-1 rounded-full">
                  {product.fabric} কালেকশন
                </span>
                <span className="text-xs text-stone-500 font-mono bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-md font-bold">
                  SKU: {product.code}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> ইন-স্টক (রেডি টু শিপ)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-serif-brand leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
                {product.nameEn}
              </p>

              {/* Star Rating & Live Social Proof */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-3 py-1 rounded-full">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-amber-200">{product.rating}</span>
                  <span className="text-xs text-stone-500">({product.reviewCount} রিভিউ)</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>এই মুহূর্তে {liveViewers} জন ক্রেতা দেখছেন</span>
                </div>
              </div>
            </div>

            {/* Price & Savings Box */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1218] border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#6B1728] dark:text-amber-400 font-mono tracking-tight">
                  ৳ {product.price.toLocaleString('bn-BD')}
                </span>
                
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg sm:text-xl text-stone-400 line-through font-mono">
                      ৳ {product.originalPrice.toLocaleString('bn-BD')}
                    </span>
                    <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                      সাশ্রয় ৳ {(product.originalPrice - product.price).toLocaleString('bn-BD')}
                    </span>
                  </>
                )}
              </div>

              {/* Urgency stock alert */}
              {product.stockCount <= 3 && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 px-3.5 py-2 rounded-xl border border-amber-300/50 dark:border-amber-800">
                  <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>স্টক অতি সীমিত! ডেলিভারির জন্য মাত্র {product.stockCount} টি শাড়ি অবশিষ্ট আছে।</span>
                </div>
              )}
            </div>

            {/* Quick Saree Specs Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white dark:bg-[#1A1218] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">ফেব্রিক</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 truncate">{product.fabric}</span>
              </div>
              <div className="bg-white dark:bg-[#1A1218] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">দৈর্ঘ্য</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.length || '১২ হাত'}</span>
              </div>
              <div className="bg-white dark:bg-[#1A1218] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">ব্লাউজ পিস</span>
                <span className={`font-bold ${product.hasBlousePiece ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600'}`}>
                  {product.hasBlousePiece ? 'পিসসহ' : 'ছাড়া'}
                </span>
              </div>
              <div className="bg-white dark:bg-[#1A1218] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">উৎপত্তি</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 truncate">{product.origin || 'বাংলাদেশ'}</span>
              </div>
            </div>

            {/* Color & Quantity Selectors */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>রং / কালার ভ্যারিয়েন্ট:</span>
                  <span className="text-xs font-medium text-stone-500">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedColor(product.color)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#6B1728] dark:border-amber-400 bg-amber-50/50 dark:bg-amber-950/30 text-xs font-bold text-stone-900 dark:text-amber-200"
                  >
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: product.colorHex }} />
                    <span>{product.color} (মূল ছবি)</span>
                  </button>
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200">পরিমাণ:</label>
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-[#1E171C]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockCount || 5, quantity + 1))}
                    disabled={quantity >= (product.stockCount || 5)}
                    className="px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-500">
                  সর্বমোট: <strong className="text-[#6B1728] dark:text-amber-400 font-mono">৳ {(product.price * quantity).toLocaleString('bn-BD')}</strong>
                </span>
              </div>
            </div>

            {/* High-Converting CTAs */}
            <div className="space-y-3 pt-2">
              
              {/* Main Instant Cash on Delivery Button */}
              <button
                id="instant-cod-order-btn"
                onClick={scrollToOrderForm}
                disabled={!product.inStock}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#6B1728] via-[#851C32] to-[#6B1728] hover:from-[#541220] hover:to-[#541220] text-amber-100 font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300 animate-bounce" />
                <span>সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
              </button>

              {/* Grid 2 Buttons: Add to Cart & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="add-to-cart-landing-btn"
                  onClick={() => {
                    addToCart(product, quantity, selectedColor);
                    setIsCartOpen(true);
                  }}
                  disabled={!product.inStock}
                  className="py-3.5 px-4 rounded-xl bg-white dark:bg-[#1E171C] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                  <span>শপিং ব্যাগে যোগ করুন</span>
                </button>

                <a
                  id="whatsapp-landing-order-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp-এ সরাসরি কথা বলুন</span>
                </a>
              </div>

            </div>

            {/* Helpline quick strip */}
            <div className="flex items-center justify-between p-3.5 bg-stone-100/80 dark:bg-stone-900/80 rounded-2xl text-xs text-stone-700 dark:text-stone-300">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span>যেকোনো তথ্যের জন্য সরাসরি কল দিন:</span>
              </span>
              <a href={`tel:${settings.phone}`} className="font-bold text-[#6B1728] dark:text-amber-300 hover:underline">
                {settings.phone}
              </a>
            </div>

          </div>

        </div>

        {/* 1-Click Fast Cash on Delivery Checkout Form (Bangladesh E-Commerce Special) */}
        <section 
          ref={orderFormRef}
          id="instant-checkout-form-section" 
          className="bg-white dark:bg-[#1A1218] rounded-3xl border-2 border-[#6B1728]/30 dark:border-amber-400/30 p-6 sm:p-8 lg:p-10 shadow-xl space-y-6 transition-all"
        >
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-[#6B1728] dark:text-amber-300 text-xs font-bold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>সহজ ও দ্রুত ১-ক্লিক অর্ডার ফর্ম</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif-brand">
                ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই! শাড়ি হাতে পেয়ে খুলে দেখে মূল্য পরিশোধ করুন।
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-right shrink-0">
              <span className="text-[11px] text-stone-500 block">নির্বাচিত শাড়ি:</span>
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{product.name} ({quantity} টি)</span>
            </div>
          </div>

          <form onSubmit={handleDirectOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Inputs (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  আপনার সম্পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: নুসরাত জাহান বা সাজিদা আক্তার"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                />
                {formErrors.name && <p className="text-rose-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  ১১ ডিজিটের মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="যেমন: 017XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728] dark:focus:ring-amber-400 font-mono"
                />
                {formErrors.phone && <p className="text-rose-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              {/* Delivery Area Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  ডেলিভারি এলাকা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryArea === 'ঢাকা সিটির ভিতরে'
                      ? 'border-[#6B1728] dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 text-stone-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryArea" 
                      className="sr-only" 
                      checked={deliveryArea === 'ঢাকা সিটির ভিতরে'} 
                      onChange={() => setDeliveryArea('ঢাকা সিটির ভিতরে')} 
                    />
                    <span className="font-bold text-xs">ঢাকা সিটির ভিতরে</span>
                    <span className="text-[11px] text-stone-500">৳ {settings.insideDhakaDeliveryFee} (১-২ দিন)</span>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryArea === 'ঢাকার পার্শ্ববর্তী এলাকা'
                      ? 'border-[#6B1728] dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 text-stone-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryArea" 
                      className="sr-only" 
                      checked={deliveryArea === 'ঢাকার পার্শ্ববর্তী এলাকা'} 
                      onChange={() => setDeliveryArea('ঢাকার পার্শ্ববর্তী এলাকা')} 
                    />
                    <span className="font-bold text-xs">ঢাকা সাব-এরিয়া</span>
                    <span className="text-[11px] text-stone-500">৳ {settings.subDhakaDeliveryFee} (২ দিন)</span>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryArea === 'ঢাকা সিটির বাইরে'
                      ? 'border-[#6B1728] dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 text-stone-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryArea" 
                      className="sr-only" 
                      checked={deliveryArea === 'ঢাকা সিটির বাইরে'} 
                      onChange={() => setDeliveryArea('ঢাকা সিটির বাইরে')} 
                    />
                    <span className="font-bold text-xs">ঢাকার বাইরে</span>
                    <span className="text-[11px] text-stone-500">৳ {settings.outsideDhakaDeliveryFee} (২-৩ দিন)</span>
                  </label>
                </div>
              </div>

              {/* District & Full Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                    জেলা <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={customerDistrict}
                    onChange={(e) => setCustomerDistrict(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728]"
                  >
                    {BANGLADESH_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                    সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/থানা) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="যেমন: বাড়ি #১২, রোড #৫, ধানমন্ডি, ঢাকা"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                  />
                </div>
              </div>
              {formErrors.address && <p className="text-rose-500 text-xs mt-1">{formErrors.address}</p>}

              {/* Order Note */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  className="w-full px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>

            </div>

            {/* Right Order Summary & Confirm (5 Cols) */}
            <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-900/90 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-2">
                  অর্ডার সামারি ও মূল্য তালিকা
                </h3>

                {/* Saree Line Item Preview */}
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-14 h-16 object-cover rounded-xl border border-stone-200 shrink-0" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{product.name}</p>
                    <p className="text-stone-500">{product.fabric} • {selectedColor}</p>
                    <p className="text-stone-500">পরিমাণ: {quantity} টি</p>
                  </div>
                  <div className="text-right text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                    ৳ {(product.price * quantity).toLocaleString('bn-BD')}
                  </div>
                </div>

                {/* Calculation Rows */}
                <div className="space-y-2 text-xs border-t border-stone-200 dark:border-stone-800 pt-3">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>শাড়ির সাবটোটাল</span>
                    <span className="font-mono font-bold">৳ {(product.price * quantity).toLocaleString('bn-BD')}</span>
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>ডেলিভারি চার্জ ({deliveryArea})</span>
                    <span className="font-mono font-bold">
                      {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">ফ্রি!</span> : `৳ ${deliveryFee}`}
                    </span>
                  </div>

                  {savingsAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>আপনার মোট সাশ্রয়</span>
                      <span className="font-mono font-bold">- ৳ {savingsAmount.toLocaleString('bn-BD')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-[#6B1728] dark:text-amber-400 border-t border-stone-300 dark:border-stone-700 pt-2">
                    <span>সর্বমোট প্রদেয় বিল</span>
                    <span className="font-mono">৳ {totalPayable.toLocaleString('bn-BD')}</span>
                  </div>
                </div>

                <div className="bg-amber-100/50 dark:bg-amber-950/50 p-3 rounded-xl border border-amber-300/40 text-[11px] text-stone-700 dark:text-stone-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#6B1728] dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ক্যাশ অন ডেলিভারি (COD) পেমেন্ট</span>
                  </div>
                  <p>পণ্য গ্রহণের সময় রাইডারের কাছে ৳ {totalPayable.toLocaleString('bn-BD')} টাকা পরিশোধ করবেন।</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingOrder || !product.inStock}
                className="w-full py-4 rounded-xl bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-amber-300 dark:text-stone-950" />
                    <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                  </>
                )}
              </button>

            </div>

          </form>
        </section>

        {/* Detailed Story, Specs & Care Tabs */}
        <section className="bg-white dark:bg-[#1A1218] rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                activeTab === 'story'
                  ? 'bg-[#6B1728] text-amber-100'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              📜 শাড়ির বুনন ও ঐতিহ্য
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-[#6B1728] text-amber-100'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              📐 বিস্তারিত স্পেসিফিকেশন
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                activeTab === 'care'
                  ? 'bg-[#6B1728] text-amber-100'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              🧼 যত্ন ও সংরক্ষণ গাইড
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                activeTab === 'delivery'
                  ? 'bg-[#6B1728] text-amber-100'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              🛡️ রিটার্ন ও কোয়ালিটি গ্যারান্টি
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-2 text-stone-700 dark:text-stone-300 leading-relaxed text-sm">
            
            {activeTab === 'story' && (
              <div className="space-y-4 max-w-4xl">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                  {product.name} - শতবর্ষের ঐতিহ্য ও হস্তশিল্পের মেলবন্ধন
                </h3>
                <p>
                  {product.description}
                </p>
                <p>
                  এই শাড়িটি তৈরির পেছনে রয়েছে অভিজ্ঞ দক্ষ তাঁতিদের অক্লান্ত পরিশ্রম ও নিখুঁত কারিগরি। কাঠের টানা-পোড়েন পিট-লুমে এক একটি মোটিফ সুঁই দিয়ে তোলার মতো যত্নে বোনা হয়েছে। আবহমান বাংলার উৎসব-পার্বণ কিংবা পারিবারিক শুভ অনুষ্ঠানে এই শাড়িটি এনে দেবে আভিজাত্যময় রানি রূপ।
                </p>
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-stone-900 dark:text-stone-100">আম্বিয়া শাড়ি হাউস কোয়ালিটি প্রমিজ:</p>
                    <p className="text-stone-600 dark:text-stone-400">আমরা সরাসরি নিজস্ব কারখানা ও প্রান্তিক তাঁতিদের থেকে শাড়ি সংগ্রহ করি। প্রতিটি শাড়ির সুতা, জড়ি এবং ফিনিশিং কঠোরভাবে মান যাচাই করা হয়।</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                  স্পেসিফিকেশন ও মেজারমেন্টস
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">প্রোডাক্ট কোড:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">{product.code}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">ফেব্রিক টাইপ:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{product.fabric}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">শাড়ির বহর/দৈর্ঘ্য:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{product.length}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">ব্লাউজ পিস:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {product.hasBlousePiece ? (product.blousePieceDetails || 'রানিং ব্লাউজ পিসসহ (৮০ সেমি)') : 'ব্লাউজ পিস নেই'}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">উৎপত্তি স্থান:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{product.origin}</span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between">
                    <span className="text-stone-500">উপযুক্ত উপলক্ষ:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{product.occasion?.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                  শাড়ির সৌন্দর্য দীর্ঘদিন অক্ষুণ্ণ রাখার সঠিক নিয়ম
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm list-disc list-inside">
                  <li><strong>ড্রাই ক্লিন:</strong> শাড়ির সুতা ও জড়ির দীপ্তি ধরে রাখতে শুধুমাত্র ড্রাই ওয়াশ করানোর পরামর্শ দেওয়া হয়।</li>
                  <li><strong>সংরক্ষণ:</strong> সুতি বা মসলিন কাপড়ের ব্যাগে মুড়িয়ে নরম জায়গায় রাখুন। প্লাস্টিকের কভারে দীর্ঘ সময় রাখবেন না।</li>
                  <li><strong>ভাঁজ পরিবর্তন:</strong> প্রতি ২-৩ মাস পর পর শাড়ির ভাঁজ বদলে দিন, যাতে ভাঁজের দাগ স্থায়ী না হয়।</li>
                  <li><strong>ইস্ত্রি:</strong> শাড়ির উল্টো পিঠে পাতলা সুতি কাপড় বিছিয়ে হালকা তাপে আয়রন করুন।</li>
                </ul>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                  ডেলিভারি ও রিটার্ন পলিসি
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">🚚 ডেলিভারি টাইমলাইন</h4>
                    <p className="text-stone-600 dark:text-stone-400">ঢাকা সিটিতে ২৪-৪৮ ঘণ্টার ভেতর এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় পৌঁছে যাবে।</p>
                  </div>
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">🔄 সহজ রিটার্ন ও এক্সচেঞ্জ</h4>
                    <p className="text-stone-600 dark:text-stone-400">পণ্য হাতে পেয়ে কোনো ক্রটি বা অপছন্দ হলে ডেলিভারিম্যান থাকা অবস্থাতেই রিটার্ন করতে পারবেন অথবা ৭ দিনের ভেতর এক্সচেঞ্জ করতে পারবেন।</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* Customer Reviews Section */}
        <section className="bg-white dark:bg-[#1A1218] rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif-brand">
                ক্রেতাদের রিভিউ ও রেটিং ({productReviews.length})
              </h2>
              <p className="text-xs text-stone-500">
                আমাদের সম্মানিত ক্রেতাদের খাঁটি অভিজ্ঞতা ও মতামত
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 rounded-xl bg-[#6B1728] hover:bg-[#52111e] text-amber-100 text-xs font-bold transition-colors shadow-xs"
            >
              {showReviewForm ? 'ফর্ম বন্ধ করুন' : '✍️ রিভিউ লিখুন'}
            </button>
          </div>

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in fade-in">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                আপনার মূল্যবান রিভিউ ও রেটিং প্রদান করুন
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="যেমন: তানিয়া আহমেদ"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">আপনার এলাকা/শহর</label>
                  <input
                    type="text"
                    value={reviewerLocation}
                    onChange={(e) => setReviewerLocation(e.target.value)}
                    placeholder="যেমন: ধানমন্ডি, ঢাকা"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">রেটিং দিন</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-bold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (৫ - অসাধারণ)</option>
                    <option value={4}>⭐⭐⭐⭐ (৪ - খুব ভালো)</option>
                    <option value={3}>⭐⭐⭐ (৩ - সন্তোষজনক)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">মন্তব্য / অভিজ্ঞতা *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="শাড়ির কোয়ালিটি, কাপড়ের সফটনেস ও প্যাকেজিং কেমন লেগেছে তা জানান..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                />
              </div>

              <button
                type="submit"
                disabled={isReviewSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#6B1728] text-amber-100 text-xs font-bold hover:bg-[#52111e] transition-colors"
              >
                রিভিউ সাবমিট করুন
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                এই শাড়িতে এখনো কোনো রিভিউ যুক্ত হয়নি। আপনিই প্রথম রিভিউ প্রদান করুন!
              </p>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#6B1728]/10 dark:bg-amber-400/20 text-[#6B1728] dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                        {rev.userName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">{rev.userName}</h4>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> ভেরিফাইড ক্রেতা
                            </span>
                          )}
                        </div>
                        {rev.location && <p className="text-[10px] text-stone-400">{rev.location}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 pl-10">
                    "{rev.comment}"
                  </p>

                  <div className="text-right text-[10px] text-stone-400">
                    তারিখ: {rev.date}
                  </div>
                </div>
              ))
            )}
          </div>

        </section>

        {/* Related Sarees Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                  আপনার আরও পছন্দ হতে পারে
                </h3>
                <p className="text-xs text-stone-500">
                  একই ফ্যাব্রিক ও ক্যাটাগরির জনপ্রিয় শাড়ি কালেকশন
                </p>
              </div>

              <button
                onClick={() => navigateTo('category', product.fabric)}
                className="text-xs font-bold text-[#6B1728] dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>সকল {product.fabric} দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => navigateTo('product', relProduct)}
                  className="bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={relProduct.images[0]}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 space-y-2">
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                      {relProduct.code}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-[#6B1728] dark:group-hover:text-amber-300 transition-colors">
                      {relProduct.name}
                    </h4>
                    <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                      <span className="font-bold text-sm text-[#6B1728] dark:text-amber-400 font-mono">
                        ৳ {relProduct.price.toLocaleString('bn-BD')}
                      </span>
                      {relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (
                        <span className="text-[11px] text-stone-400 line-through font-mono">
                          ৳ {relProduct.originalPrice.toLocaleString('bn-BD')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Mobile Bottom Quick Buy Bar */}
      <aside aria-label="Mobile quick order" className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#140D12]/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 p-3 z-40 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-stone-200" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">{product.name}</p>
            <p className="text-xs font-bold text-[#6B1728] dark:text-amber-400 font-mono">৳ {product.price.toLocaleString('bn-BD')}</p>
          </div>
        </div>

        <button
          onClick={scrollToOrderForm}
          className="py-2.5 px-4 rounded-xl bg-[#6B1728] dark:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-300 dark:fill-stone-950" />
          <span>অর্ডার করুন</span>
        </button>
      </aside>

    </div>
  );
};
