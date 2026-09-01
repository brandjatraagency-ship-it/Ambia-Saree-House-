import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerDetails, PaymentMethod } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discountAmount, 
    deliveryCharge, 
    placeOrder, 
    settings,
    showToast
  } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'ঢাকা সিটির ভিতরে',
    district: 'ঢাকা',
    postalCode: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [trxId, setTrxId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isCheckoutOpen) return null;

  const currentDeliveryFee = deliveryCharge(customer.city);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + currentDeliveryFee);

  const handleCopyNumber = (num: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num.replace(/[^0-9]/g, ''));
      setCopiedNumber(true);
      showToast('নম্বরটি কপি করা হয়েছে!', 'info');
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!customer.name.trim()) {
      errs.name = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।';
    }

    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
    }

    if (!customer.address.trim()) {
      errs.address = 'ডেলিভারির জন্য সম্পূর্ণ ঠিকানা লিখুন।';
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && !trxId.trim()) {
      errs.trxId = 'পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cart.length === 0) {
      showToast('আপনার ব্যাগ খালি!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(customer, paymentMethod, trxId.trim() || undefined);
    } catch (err) {
      showToast('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      
      {/* Modal Card */}
      <div 
        id="checkout-modal"
        className="relative bg-[#FAF8F5] dark:bg-[#161014] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-4 max-h-[95vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1E171C] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6B1728] dark:bg-amber-400 text-amber-100 dark:text-stone-950 flex items-center justify-center font-bold text-sm">
              🛍️
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg">
                অর্ডার ও ডেলিভারি তথ্য (COD Checkout)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                সহজ ক্যাশ অন ডেলিভারি ও দ্রুত হোম ডেলিভারি
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex-1">
          <form onSubmit={handleSubmitOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              {/* Left Column: Customer Form & Payment Method */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Customer Details */}
                <div className="bg-white dark:bg-[#1E171C] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#6B1728] dark:bg-amber-400 text-amber-100 dark:text-stone-950 text-xs font-bold flex items-center justify-center">
                      ১
                    </span>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">গ্রাহকের ঠিকানা ও যোগাযোগ</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        আপনার পুরো নাম <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="যেমন: ফারহানা চৌধুরী"
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                      />
                      {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                          মোবাইল নম্বর <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="01XXXXXXXXX"
                          className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400 font-mono"
                        />
                        {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                          ইমেইল (ঐচ্ছিক)
                        </label>
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    {/* Delivery Area Selection */}
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-2">
                        ডেলিভারি এরিয়া বেছে নিন <span className="text-rose-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'ঢাকা সিটির ভিতরে', label: 'ঢাকা সিটির ভিতরে', fee: settings.insideDhakaDeliveryFee },
                          { id: 'ঢাকার পার্শ্ববর্তী এলাকা', label: 'সাভার/কেরানীগঞ্জ/গাজীপুর', fee: settings.subDhakaDeliveryFee },
                          { id: 'ঢাকা সিটির বাইরে', label: 'সমগ্র বাংলাদেশের অন্যান্য জেলা', fee: settings.outsideDhakaDeliveryFee },
                        ].map((loc) => {
                          const isSelected = customer.city === loc.id;
                          const effectiveFee = cartSubtotal >= settings.freeDeliveryThreshold ? 0 : loc.fee;
                          return (
                            <div
                              key={loc.id}
                              onClick={() => setCustomer({ ...customer, city: loc.id as any })}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#6B1728] dark:border-amber-400 bg-rose-50/60 dark:bg-[#341822] ring-1 ring-[#6B1728] dark:ring-amber-400'
                                  : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#251D22] hover:bg-stone-100 dark:hover:bg-stone-800'
                              }`}
                            >
                              <div className="font-semibold text-stone-900 dark:text-stone-100 text-xs">{loc.label}</div>
                              <div className="text-[11px] text-[#6B1728] dark:text-amber-400 font-bold mt-1">
                                {effectiveFee === 0 ? 'ফ্রি ডেলিভারি' : `৳ ${effectiveFee}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* District selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                          জেলা <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={customer.district}
                          onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                          className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                        >
                          {BANGLADESH_DISTRICTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                          পোস্ট কোড (ঐচ্ছিক)
                        </label>
                        <input
                          type="text"
                          value={customer.postalCode}
                          onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                          placeholder="যেমন: ১২০৫"
                          className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Address Detail */}
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা নং, রোড, থানা) <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="বাড়ি নং, ফ্ল্যাট, রোড, এলাকা..."
                        className="w-full p-2.5 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728] dark:focus:ring-amber-400"
                      />
                      {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                        ডেলিভারি নোট / বিশেষ নির্দেশনা (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={customer.note}
                        onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                        placeholder="যেমন: বিকেলে ফোন দিয়ে আসবেন"
                        className="w-full p-2 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Selection */}
                <div className="bg-white dark:bg-[#1E171C] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#6B1728] dark:bg-amber-400 text-amber-100 dark:text-stone-950 text-xs font-bold flex items-center justify-center">
                      ২
                    </span>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">পেমেন্ট মেথড বেছে নিন</h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    
                    {/* Cash On Delivery */}
                    <label 
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#6B1728] dark:border-amber-400 bg-rose-50/50 dark:bg-[#341822] ring-1 ring-[#6B1728] dark:ring-amber-400'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#251D22] hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-0.5 text-[#6B1728] focus:ring-[#6B1728]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 dark:text-stone-100">ক্যাশ অন ডেলিভারি (COD)</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">জনপ্রিয় ও সুরক্ষিত</span>
                        </div>
                        <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                          পণ্য হাতে পেয়ে এবং কোয়ালিটি দেখে কুরিয়ারকে মূল্য পরিশোধ করুন।
                        </p>
                      </div>
                    </label>

                    {/* bKash Payment */}
                    <label 
                      onClick={() => setPaymentMethod('bkash')}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'bkash'
                          ? 'border-[#D12053] bg-pink-50/50 dark:bg-[#381523] ring-1 ring-[#D12053]'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#251D22] hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="mt-0.5 text-[#D12053]"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-[#D12053]">বিকাশ পেমেন্ট / মার্চেন্ট</span>
                        <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                          বিকাশ অ্যাপে Payment অপশন থেকে পরিশোধ করুন।
                        </p>

                        {paymentMethod === 'bkash' && (
                          <div className="mt-3 p-3 bg-white dark:bg-[#1E171C] rounded-xl border border-pink-200 dark:border-pink-900/50 space-y-2">
                            <div className="flex items-center justify-between bg-pink-50 dark:bg-pink-950/40 p-2 rounded-lg">
                              <span className="font-mono font-bold text-stone-900 dark:text-pink-200">{settings.bkashMerchantNumber}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyNumber(settings.bkashMerchantNumber)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-[#D12053] dark:text-pink-400 hover:underline"
                              >
                                {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}
                              </button>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                TrxID (ট্রানজেকশন আইডি) লিখুন <span className="text-rose-600">*</span>
                              </label>
                              <input
                                type="text"
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                placeholder="যেমন: 9J47KL..."
                                className="w-full p-2 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg uppercase font-mono text-xs focus:ring-1 focus:ring-[#D12053]"
                              />
                              {errors.trxId && <p className="text-rose-600 text-[10px] mt-0.5">{errors.trxId}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Nagad Payment */}
                    <label 
                      onClick={() => setPaymentMethod('nagad')}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === 'nagad'
                          ? 'border-[#F7941D] bg-amber-50/50 dark:bg-[#342416] ring-1 ring-[#F7941D]'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-[#251D22] hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="mt-0.5 text-[#F7941D]"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-[#D97706] dark:text-amber-400">নগদ পেমেন্ট (Nagad)</span>
                        <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                          নগদ নম্বরে Send Money বা Payment করুন।
                        </p>

                        {paymentMethod === 'nagad' && (
                          <div className="mt-3 p-3 bg-white dark:bg-[#1E171C] rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-2">
                            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                              <span className="font-mono font-bold text-stone-900 dark:text-amber-200">{settings.nagadMerchantNumber}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyNumber(settings.nagadMerchantNumber)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-[#D97706] dark:text-amber-400 hover:underline"
                              >
                                {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}
                              </button>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                TrxID (ট্রানজেকশন আইডি) <span className="text-rose-600">*</span>
                              </label>
                              <input
                                type="text"
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                placeholder="যেমন: NG88390..."
                                className="w-full p-2 bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg uppercase font-mono text-xs focus:ring-1 focus:ring-[#F7941D]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Confirm Button */}
              <div className="lg:col-span-5 space-y-4">
                
                <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 sticky top-4">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm border-b border-stone-100 dark:border-stone-800 pb-2">
                    অর্ডার সামারি ({cart.length} টি শাড়ি)
                  </h3>

                  {/* Products summary list */}
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 text-xs">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-2.5 pb-2 border-b border-stone-50 dark:border-stone-800">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-12 h-14 object-cover rounded-lg shrink-0 border border-stone-200 dark:border-stone-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">পরিমাণ: {item.quantity} × ৳ {item.product.price.toLocaleString('bn-BD')}</p>
                        </div>
                        <span className="font-bold text-stone-900 dark:text-amber-400 text-xs shrink-0 font-mono">
                          ৳ {(item.product.price * item.quantity).toLocaleString('bn-BD')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex justify-between">
                      <span>সাবটোটাল</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                        ৳ {cartSubtotal.toLocaleString('bn-BD')}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                        <span>ডিসকাউন্ট ভাউচার</span>
                        <span>- ৳ {discountAmount.toLocaleString('bn-BD')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>ডেলিভারি ফি ({customer.city})</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                        {currentDeliveryFee === 0 ? (
                          <span className="text-emerald-700 dark:text-emerald-400">ফ্রি (০ ৳)</span>
                        ) : (
                          `৳ ${currentDeliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-stone-100 pt-2.5 border-t border-stone-200 dark:border-stone-700">
                      <span>সর্বমোট প্রদেয় (COD)</span>
                      <span className="text-lg text-[#6B1728] dark:text-amber-400 font-mono">
                        ৳ {grandTotal.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-order-confirm-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-50 dark:text-stone-950 font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>অর্ডার প্রসেস হচ্ছে...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                        <span>অর্ডার নিশ্চিত করুন (৳ {grandTotal.toLocaleString('bn-BD')})</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                    <p className="flex items-center justify-center gap-1 font-medium text-emerald-800 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      কোনো অগ্রিম পেমেন্ট বাধ্যতামূলক নয় • ক্যাশ অন ডেলিভারি
                    </p>
                    <p>অর্ডার করার পর আমাদের প্রতিনিধি আপনাকে কল করে নিশ্চিত করবেন।</p>
                  </div>

                </div>

              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
