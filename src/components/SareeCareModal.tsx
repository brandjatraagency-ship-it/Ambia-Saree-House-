import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Sun, 
  Droplets, 
  Wind, 
  FoldHorizontal,
  Flame,
  Shirt
} from 'lucide-react';

export const SareeCareModal: React.FC = () => {
  const { isCareGuideOpen, setIsCareGuideOpen } = useStore();

  if (!isCareGuideOpen) return null;

  return (
    <div id="care-guide-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      <div 
        id="care-guide-modal"
        className="relative bg-[#FAF8F5] dark:bg-[#161014] text-stone-900 dark:text-stone-100 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-4 max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#6B1728] dark:bg-[#2A0D15] text-amber-50 flex items-center justify-between border-b border-amber-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 dark:bg-amber-400/20">
              <BookOpen className="w-5 h-5 text-amber-300 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-amber-100">ঐতিহ্যবাহী শাড়ির যত্ন ও সংরক্ষণ গাইড</h2>
              <p className="text-xs text-amber-200/80">আম্বিয়া শাড়ি হাউস বিশেষজ্ঞদের পরামর্শ</p>
            </div>
          </div>

          <button
            onClick={() => setIsCareGuideOpen(false)}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          
          {/* Jamdani Care */}
          <div className="bg-white dark:bg-[#1E171C] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="font-bold text-[#6B1728] dark:text-amber-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ১. ঢাকাই জামদানি শাড়ির যত্ন
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 dark:text-stone-400">
              <li>জামদানি শাড়ি ভুলেও সাধারণ সাবান বা ডিটারজেন্ট দিয়ে ঘরে ধোবেন না। সবসময় প্রফেশনাল ড্রাই ক্লিন করাবেন।</li>
              <li>ইস্ত্রি করার সময় শাড়ির উপর হালকা সাদা সুতি কাপড় দিয়ে উল্টো পিঠে মৃদু তাপে আয়রন করুন।</li>
              <li>কখনোই তারের হ্যাঙ্গারে ঝুলিয়ে রাখবেন না; ভাঁজ করে নরম সুতি কাপড়ে মুড়ে রাখুন।</li>
            </ul>
          </div>

          {/* Banarasi & Katan Care */}
          <div className="bg-white dark:bg-[#1E171C] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="font-bold text-[#6B1728] dark:text-amber-400 text-sm flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ২. বেনারসি ও কাতান শাড়ি সংরক্ষণ
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 dark:text-stone-400">
              <li>বেনারসি শাড়ির জড়ির উজ্জ্বলতা দীর্ঘস্থায়ী রাখতে প্রতি ৩-৪ মাস পর পর ভাঁজ পরিবর্তন করে দিন।</li>
              <li>প্লাস্টিক ব্যাগে রাখবেন না; মসলিন বা খাঁটি সুতির কাপড়ে মুড়ে কাঠের আলমারিতে রাখুন।</li>
              <li>স্যাঁতসেঁতে আর্দ্রতা থেকে বাঁচাতে আলমারিতে লবঙ্গ বা শুকনো নিমের পাতা রাখতে পারেন। ন্যাপথলিন সরাসরি শাড়ির সংস্পর্শে দেবেন না।</li>
            </ul>
          </div>

          {/* Silk & Muslin */}
          <div className="bg-white dark:bg-[#1E171C] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="font-bold text-[#6B1728] dark:text-amber-400 text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ৩. পিওর সিল্ক ও মসলিন ধোয়ার নিয়ম
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 dark:text-stone-400">
              <li>যদি কোনো দাগ লাগে, সঙ্গে সঙ্গে পানি ও হালকা বেবি শ্যাম্পু দিয়ে স্পট ক্লিন করুন।</li>
              <li>কড়া রোদে কখনোই শুকাতে দেবেন না; ছায়াযুক্ত এবং বাতাস চলাচল করে এমন স্থানে শুকান।</li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 font-medium text-center">
            যেকোনো প্রশ্ন বা শাড়ির যত্ন সংক্রান্ত পরামর্শের জন্য আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।
          </div>

        </div>

      </div>
    </div>
  );
};
