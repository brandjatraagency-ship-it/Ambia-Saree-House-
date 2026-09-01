import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Truck, 
  ShieldAlert,
  Zap
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    discountAmount, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    setIsCheckoutOpen,
    settings,
    clearCart
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const remainingForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Slide Drawer Content */}
      <div 
        id="cart-drawer"
        className="relative z-10 w-full max-w-md bg-[#FAF8F5] dark:bg-[#161014] text-stone-900 dark:text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 transition-colors"
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#1E171C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#6B1728]/10 dark:bg-amber-400/15 text-[#6B1728] dark:text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base">আপনার শপিং ব্যাগ</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {totalCount > 0 ? `${totalCount} টি আইটেম যুক্ত আছে` : 'ব্যাগ খালি'}
              </p>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {totalCount > 0 && (
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/50 p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-amber-950 dark:text-amber-200">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!</span>
                ) : (
                  <span>আর ৳ {remainingForFreeDelivery.toLocaleString('bn-BD')} টাকার শপিংয়ে ফ্রি ডেলিভারি</span>
                )}
              </span>
              <span className="font-bold">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/70 dark:bg-amber-900/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#6B1728] dark:bg-amber-400 transition-all duration-500" 
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-800 dark:text-stone-200 text-base">আপনার ব্যাগ বর্তমানে খালি</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                  আমাদের ঐতিহ্যবাহী জামদানি, কাতান ও সিল্ক শাড়ির কালেকশন থেকে আপনার পছন্দেরটি বেছে নিন।
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 text-xs font-bold py-2.5 px-6 rounded-full transition-colors shadow-xs"
              >
                শাড়ি কালেকশন দেখুন
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="bg-white dark:bg-[#1E171C] p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex gap-3 shadow-2xs items-center"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover rounded-xl shrink-0 border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 shrink-0 transition-colors"
                      title="সরিয়ে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <span>{item.product.fabric}</span>
                    <span>•</span>
                    <span className="truncate">{item.selectedColor || item.product.color}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-xs text-[#6B1728] dark:text-amber-400 font-mono">
                      ৳ {(item.product.price * item.quantity).toLocaleString('bn-BD')}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-[#251D22]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Coupon & Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#1E171C] border-t border-stone-200/80 dark:border-stone-800 space-y-3 shadow-lg">
            
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="কুপন কোড (যেমন: AMBIA10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    প্রয়োগ
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>কুপন ({appliedCoupon.code}) কার্যকর!</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 dark:text-rose-400 hover:underline font-bold text-[11px]"
                >
                  সরান
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-1">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                  ৳ {cartSubtotal.toLocaleString('bn-BD')}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                  <span>ডিসকাউন্ট সাশ্রয়</span>
                  <span>- ৳ {discountAmount.toLocaleString('bn-BD')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                <span>ডেলিভারি চার্জ</span>
                <span>চেকআউটে এলাকা অনুযায়ী যুক্ত হবে</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span>মোট পরিমাণ (আনুমানিক)</span>
                <span className="text-[#6B1728] dark:text-amber-400 text-base font-extrabold font-mono">
                  ৳ {(cartSubtotal - discountAmount).toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="proceed-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-50 dark:text-stone-950 font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-sm"
            >
              <span>চেকআউট ও ডেলিভারি তথ্য</span>
              <ArrowRight className="w-4 h-4 text-amber-300 dark:text-stone-950" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
