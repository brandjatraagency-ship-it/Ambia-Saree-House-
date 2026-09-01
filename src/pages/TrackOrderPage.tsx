import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  Calendar,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, navigateTo } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const term = searchInput.trim().toUpperCase();
    const cleanPhone = searchInput.trim().replace(/[^0-9]/g, '');

    const found = orders.find(o => 
      (o.trackingCode && o.trackingCode.toUpperCase() === term) ||
      (o.id && o.id.toUpperCase() === term) ||
      (cleanPhone.length >= 10 && o.customer.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'পেন্ডিং': return 1;
      case 'কনফার্মড': return 2;
      case 'প্রসেসিং': return 3;
      case 'ডেলিভারিতে আছে': return 4;
      case 'ডেলিভার্ড': return 5;
      case 'বাতিল': return 0;
      default: return 1;
    }
  };

  const progress = searchedOrder ? getStepProgress(searchedOrder.status) : 0;

  return (
    <div id="track-order-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#4E0E1B] via-[#6B1728] to-[#3D0A14] text-amber-100 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমে ফিরে যান</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-brand">
            আপনার শাড়ির ডেলিভারি ট্র্যাকিং
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 font-bangla">
            অর্ডার করার সময় প্রাপ্ত ট্র্যাকিং কোড (যেমন: ASH-TRK-XXXX) অথবা ১১ ডিজিটের মোবাইল নম্বর দিয়ে অনুসন্ধান করুন।
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 space-y-8">
        
        {/* Search Card */}
        <div className="bg-white dark:bg-[#1A1218] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ট্র্যাকিং আইডি (ASH-TRK-XXXX) অথবা মোবাইল নম্বর..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728] font-mono"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>ট্র্যাক করুন</span>
            </button>
          </form>

          {/* Quick demo tracker tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-stone-500">
            <span>পরীক্ষা করার জন্য ট্র্যাকিং কোড:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchInput(o.trackingCode);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="font-mono bg-amber-50 dark:bg-amber-950/50 text-[#6B1728] dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 text-[11px] font-bold hover:underline"
              >
                {o.trackingCode}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Result View */}
        {hasSearched && (
          searchedOrder ? (
            <div className="bg-white dark:bg-[#1A1218] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-6 animate-in fade-in">
              
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
                <div>
                  <span className="text-xs text-stone-500 block">ট্র্যাকিং কোড</span>
                  <span className="text-lg font-extrabold font-mono text-[#6B1728] dark:text-amber-300">
                    {searchedOrder.trackingCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">স্ট্যাটাস:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    searchedOrder.status === 'ডেলিভার্ড'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : searchedOrder.status === 'বাতিল'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>
              </div>

              {/* Step Progression Timeline */}
              {searchedOrder.status !== 'বাতিল' ? (
                <div className="py-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-[#6B1728] dark:bg-amber-400 -translate-y-1/2 z-0 transition-all duration-500" 
                      style={{ width: `${((progress - 1) / 4) * 100}%` }}
                    />

                    {[
                      { step: 1, label: 'পেন্ডিং' },
                      { step: 2, label: 'কনফার্মড' },
                      { step: 3, label: 'প্যাকেজিং' },
                      { step: 4, label: 'রাইডারের কাছে' },
                      { step: 5, label: 'ডেলিভার্ড' }
                    ].map((s) => {
                      const isDone = progress >= s.step;
                      return (
                        <div key={s.step} className="relative z-10 flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isDone 
                              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 shadow-md' 
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                          </div>
                          <span className={`text-[10px] sm:text-xs font-medium ${
                            isDone ? 'text-stone-900 dark:text-stone-100 font-bold' : 'text-stone-400'
                          }`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে হেল্পলাইনে যোগাযোগ করুন।</span>
                </div>
              )}

              {/* Courier & Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                    <span>ডেলিভারি ঠিকানা</span>
                  </h4>
                  <p><strong>গ্রাহক:</strong> {searchedOrder.customer.name}</p>
                  <p><strong>ফোন:</strong> {searchedOrder.customer.phone}</p>
                  <p><strong>ঠিকানা:</strong> {searchedOrder.customer.address}, {searchedOrder.customer.district}</p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                    <span>অর্ডারের পণ্যসমূহ ({searchedOrder.items.length} টি)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate max-w-[180px]">{item.product.name} × {item.quantity}</span>
                        <span className="font-mono font-bold">৳ {(item.product.price * item.quantity).toLocaleString('bn-BD')}</span>
                      </div>
                    ))}
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-1.5 flex justify-between font-bold text-stone-900 dark:text-amber-300">
                      <span>সর্বমোট বিল:</span>
                      <span className="font-mono">৳ {searchedOrder.total.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#1A1218] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">কোনো অর্ডার পাওয়া যায়নি</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                আপনার প্রদত্ত ট্র্যাকিং কোড অথবা মোবাইল নম্বরের সাথে কোনো অর্ডার মেলেনি। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।
              </p>
            </div>
          )
        )}

      </main>

    </div>
  );
};
