import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Heart, Award, MapPin, Users, ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useStore();

  return (
    <div id="about-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#4E0E1B] via-[#6B1728] to-[#3D0A14] text-amber-100 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমে ফিরে যান</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold font-serif-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের পরিচিতি ও ঐতিহ্য</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-brand">
            {settings.storeName}
          </h1>

          <p className="text-xs sm:text-sm text-amber-200 font-bangla max-w-2xl mx-auto leading-relaxed">
            {settings.storeTagline} — আবহমান বাংলার ঐতিহ্যবাহী বুননশিল্পকে আধুনিক নারীর রুচির সাথে একীভূত করার এক অনুপম অঙ্গীকার।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-10">
        
        {/* Story Section */}
        <div className="bg-white dark:bg-[#1A1218] p-6 sm:p-10 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif-brand">
              আমাদের সূচনা ও ঐতিহ্য
            </h2>
            <div className="h-1 w-16 bg-[#6B1728] dark:bg-amber-400 rounded-full" />
          </div>

          <div className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm space-y-4 leading-relaxed font-bangla">
            <p>
              আম্বিয়া শাড়ি হাউস বাংলাদেশের ঐতিহ্যবাহী শাড়িপ্রেমীদের একটি অন্যতম বিশ্বস্ত ঠিকানা। ঢাকা গাউছিয়া মার্কেটের সন্নিকটে আমাদের নিজস্ব আউটলেট ও সরাসরি দেশীয় তাঁতিদের সাথে মেলবন্ধনে আমরা প্রতিটি শাড়ি তৈরি ও সংগ্রহ করি।
            </p>
            <p>
              ঐতিহাসিক ঢাকাই জামদানি, রূপগঞ্জের পিট-লুমের কারুকার্য, মিরপুরের বেনারসি কাতান, রাজশাহীর পিওর রেশম সিল্ক থেকে শুরু করে টাঙ্গাইলের সুতি তাঁত — বাংলার প্রতিটি অঞ্চলের নিজস্ব তাঁত ঐতিহ্যকে আমরা সর্বোচ্চ মানের সাথে গ্রাহকের কাছে পৌঁছে দিচ্ছি।
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-[#6B1728] dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">১০০% অথেনটিক পণ্য</h4>
              <p className="text-[11px] text-stone-500">কোনো কৃত্রিম সুতার ভেজাল নেই, শতভাগ আসল সুতা ও জড়ির গ্যারান্টি।</p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-[#6B1728] dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">তাঁতিদের পাশে</h4>
              <p className="text-[11px] text-stone-500">প্রান্তিক দক্ষ কারিগরদের ন্যায্য পারিশ্রমিক ও দেশীয় ঐতিহ্য রক্ষা।</p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 text-[#6B1728] dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">হাজারো সন্তুষ্ট গ্রাহক</h4>
              <p className="text-[11px] text-stone-500">দেশ ও বিদেশের শাড়িপ্রেমী নারীদের প্রথম আস্থার প্রতীক।</p>
            </div>
          </div>
        </div>

        {/* Showroom info banner */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[#6B1728] dark:text-amber-300 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>আমাদের শোরুমে সরাসরি আসার আমন্ত্রণ</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {settings.address}
            </p>
          </div>

          <button
            onClick={() => navigateTo('contact')}
            className="px-5 py-2.5 rounded-xl bg-[#6B1728] hover:bg-[#52111e] text-amber-100 text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            যোগাযোগের ঠিকানা দেখুন
          </button>
        </div>

      </main>

    </div>
  );
};
