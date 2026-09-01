import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  AlertCircle, 
  X, 
  Phone,
  MapPin
} from 'lucide-react';

export const TrackOrderModal: React.FC = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const results = orders.filter(o => {
      const matchTrack = o.trackingCode.toLowerCase().replace(/[^a-z0-9]/g, '').includes(term);
      const matchId = o.id.toLowerCase().replace(/[^a-z0-9]/g, '').includes(term);
      const matchPhone = o.customer.phone.replace(/[^0-9]/g, '').includes(term);
      return matchTrack || matchId || matchPhone;
    });

    setFoundOrders(results);
    setSearched(true);
  };

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'পেন্ডিং': return 0;
      case 'কনফার্মড': return 1;
      case 'প্রসেসিং': return 2;
      case 'ডেলিভারিতে আছে': return 3;
      case 'ডেলিভার্ড': return 4;
      case 'বাতিল': return -1;
      default: return 0;
    }
  };

  const STEPS = [
    { title: 'অর্ডার প্রাপ্তি', desc: 'অর্ডার সিস্টেমে গৃহীত হয়েছে' },
    { title: 'নিশ্চিতকরণ', desc: 'ফোন কলের মাধ্যমে নিশ্চিত করা হয়েছে' },
    { title: 'প্যাকিং ও প্রসেসিং', desc: 'নিখুঁত কোয়ালিটি চেক সম্পন্ন' },
    { title: 'কুরিয়ারে অন-ওয়ে', desc: 'ডেলিভারি ম্যানের কাছে হস্তান্তর' },
    { title: 'সফল ডেলিভারি', desc: 'গ্রাহকের নিকট হস্তান্তর' },
  ];

  return (
    <div id="track-order-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Container */}
      <div 
        id="track-order-modal"
        className="relative bg-white dark:bg-[#1A1418] text-stone-900 dark:text-stone-100 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-4 max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#6B1728] dark:bg-[#2A0D15] text-amber-50 flex items-center justify-between border-b border-amber-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 dark:bg-amber-400/20">
              <Truck className="w-5 h-5 text-amber-300 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-amber-100">অর্ডার ট্র্যাকিং সিস্টেম</h2>
              <p className="text-xs text-amber-200/80">আপনার শাড়ির ডেলিভারির বর্তমান অবস্থা জানুন</p>
            </div>
          </div>

          <button
            id="close-track-modal-btn"
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ট্র্যাকিং কোড (যেমন: ASH-TRK-8942) অথবা মোবাইল নম্বর লিখুন..."
                className="w-full pl-9 pr-3 py-3 text-xs sm:text-sm bg-stone-50 dark:bg-[#251D22] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B1728]/20 dark:focus:ring-amber-400/20 focus:border-[#6B1728] dark:focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="bg-[#6B1728] dark:bg-amber-400 hover:bg-[#52111e] dark:hover:bg-amber-300 text-amber-100 dark:text-stone-950 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl transition-colors shrink-0 shadow-xs"
            >
              ট্র্যাক করুন
            </button>
          </form>

          {/* Results */}
          {searched && (
            <div className="space-y-6">
              {foundOrders.length === 0 ? (
                <div className="text-center p-8 bg-stone-50 dark:bg-[#231A20] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm">কোনো অর্ডার পাওয়া যায়নি</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    অনুগ্রহ করে সঠিক ট্র্যাকিং কোড অথবা অর্ডারে ব্যবহৃত ১১ ডিজিটের মোবাইল নম্বরটি দিয়ে পুনরায় চেষ্টা করুন।
                  </p>
                </div>
              ) : (
                foundOrders.map((ord) => {
                  const currentStepIdx = getStatusStepIndex(ord.status);
                  const isCancelled = ord.status === 'বাতিল';

                  return (
                    <div key={ord.id} className="bg-stone-50 dark:bg-[#231A20] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-5">
                      
                      {/* Order info header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                        <div>
                          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block">ট্র্যাকিং কোড</span>
                          <span className="font-mono font-extrabold text-sm sm:text-base text-[#6B1728] dark:text-amber-400">
                            {ord.trackingCode}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 block">অর্ডার স্ট্যাটাস</span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            ord.status === 'ডেলিভার্ড' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                              : isCancelled 
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' 
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Stepper progress */}
                      {!isCancelled ? (
                        <div className="space-y-4 py-2">
                          <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
                            {STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;

                              return (
                                <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                    isCompleted
                                      ? 'bg-[#6B1728] dark:bg-amber-400 text-amber-200 dark:text-stone-950'
                                      : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                                  } ${isCurrent ? 'ring-4 ring-amber-300 dark:ring-amber-500/40' : ''}`}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                  </div>
                                  <span className={`text-[10px] sm:text-xs font-bold leading-tight ${
                                    isCompleted ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'
                                  }`}>
                                    {step.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-xl font-medium">
                          দুঃখিত, এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।
                        </div>
                      )}

                      {/* Item list */}
                      <div className="bg-white dark:bg-[#1A1418] p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-2">
                        <span className="font-bold text-stone-700 dark:text-stone-300 block">অর্ডারকৃত পণ্য:</span>
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between items-center text-stone-600 dark:text-stone-400">
                            <span>{it.product.name} ({it.quantity} টি)</span>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">৳ {(it.product.price * it.quantity).toLocaleString('bn-BD')}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between font-bold text-stone-900 dark:text-stone-100">
                          <span>সর্বমোট প্রদেয়:</span>
                          <span className="text-[#6B1728] dark:text-amber-400 font-mono">৳ {ord.total.toLocaleString('bn-BD')}</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
