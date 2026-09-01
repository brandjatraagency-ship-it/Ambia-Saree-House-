import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Sun, 
  Wind, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';

const CARE_GUIDES = [
  {
    fabric: 'জামদানি শাড়ি',
    icon: '🧵',
    tagline: 'রূপগঞ্জ ও শীতলক্ষ্যা তীরের ঐতিহ্যবাহী বুনন',
    points: [
      'খাঁটি সুতি বা মসলিন কাপড়ের ব্যাগে মুড়িয়ে নরম সুতির তোয়ালে দিয়ে জড়িয়ে রাখুন।',
      'কখনো প্লাস্টিকের কভারে দীর্ঘদিন আটকে রাখবেন না, এতে সুতার ক্ষতি হতে পারে।',
      'প্রতি ২-৩ মাস অন্তর শাড়ির ভাঁজ পরিবর্তন করে দিন, যাতে সুতা ফেটে না যায়।',
      'শুধুমাত্র বিশ্বস্ত অভিজ্ঞ ড্রাই ক্লিনার থেকে ড্রাই ওয়াশ করান।',
      'ইস্ত্রি করার সময় শাড়ির ওপর পাতলা সুতি কাপড় বিছিয়ে হালকা তাপে আয়রন করুন।'
    ]
  },
  {
    fabric: 'বেনারসি ও কাতান',
    icon: '👑',
    tagline: 'খাঁটি জরি ও রেশমের জমকালো কারুকাজ',
    points: [
      'জরির ঔজ্জ্বল্য ধরে রাখতে শাড়ির জরি ভেতরের দিকে রেখে উল্টো করে ভাঁজ করুন।',
      'স্যাঁতসেঁতে আর্দ্র জায়গায় রাখবেন না। আলমারিতে নিমপাতা বা সুগন্ধি চক ব্যবহার করতে পারেন।',
      'কোনো প্রকার পারফিউম, বডি স্প্রে বা সুগন্ধি পানি সরাসরি জরির ওপর স্প্রে করবেন না।',
      'বাসায় ধোয়া সম্পূর্ণ নিষিদ্ধ, শুধুমাত্র পেশাদার ড্রাই ক্লিন করতে হবে।',
      'বছরান্তে মৃদু রোদে হালকা বাতাসে ৩০ মিনিট শুকিয়ে পুনরায় ভাঁজ করে রাখুন।'
    ]
  },
  {
    fabric: 'পিওর মসলিন শাড়ি',
    icon: '🕊️',
    tagline: 'মুঘল আমলের অতি সূক্ষ্ম কোমল শিল্প',
    points: [
      'অত্যন্ত সূক্ষ্ম ও নরম হওয়ায় কাঠের হ্যাঙ্গারে ঝুলিয়ে রাখা সবচেয়ে নিরাপদ।',
      'পায়ে ভারী হিল বা ধারালো গহনার সাথে পরার সময় সাবধানে চালচলন করুন।',
      'কোনো দাগ লাগলে ভেজা সুতি কাপড় দিয়ে ঘষাঘষি না করে দ্রুত ড্রাই ক্লিনে দিন।',
      'তীব্র কড়া রোদে সরাসরি মেলা থেকে বিরত থাকুন।'
    ]
  },
  {
    fabric: 'রাজশাহী সিল্ক ও তসর',
    icon: '🌟',
    tagline: 'প্রাকৃতিক রেশম তন্তুর দীর্ঘস্থায়ী দীপ্তি',
    points: [
      'সিল্ক শাড়ি নরম সুতির ফাইলে বা মসলিন আবরণে সংরক্ষণ করুন।',
      'নেপথলিন বল সরাসরি শাড়ির সংস্পর্শে রাখবেন না, এতে সিল্কের সুতা হলুদ হতে পারে।',
      'স্টিম আয়রন বা হালকা তাপে উল্টো পিঠে ইস্ত্রি করুন।',
      'ঘাম লাগলে শাড়িটি বাতাসে ভালো করে শুকিয়ে তারপর আলমারিতে তুলুন।'
    ]
  }
];

export const CareGuidePage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div id="care-guide-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold font-serif-brand">
            <BookOpen className="w-3.5 h-3.5" />
            <span>শাড়ি সংরক্ষণ ও যত্ন নির্দেশিকা</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-brand">
            আপনার প্রিয় শাড়ির সঠিক যত্ন ও সৌন্দর্য রক্ষার নিয়মাবলী
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 font-bangla max-w-2xl mx-auto">
            একটি ঐতিহ্যবাহী শাড়ি প্রজন্মের পর প্রজন্ম ধরে তার রূপ ও দীপ্তি ধরে রাখতে পারে সঠিক সংরক্ষণের মাধ্যমে।
          </p>
        </div>
      </section>

      {/* Main Guides Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        
        {/* Fabric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARE_GUIDES.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-[#1A1218] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand">{item.fabric}</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400">{item.tagline}</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {item.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B1728] dark:bg-amber-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Universal Do's and Don'ts */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-3xl border border-amber-200 dark:border-amber-900/40 p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-[#6B1728] dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>জরুরি ৫টি সতর্কতা</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-stone-700 dark:text-stone-300">
            <div className="p-3.5 bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800">
              <strong className="block text-stone-900 dark:text-stone-100 mb-1">🚫 কোনো পারফিউম নয়:</strong>
              পারফিউমের অ্যালকোহল জরি ও রেশম সুতাকে ফ্যাকাসে ও কালো করে ফেলতে পারে।
            </div>
            <div className="p-3.5 bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800">
              <strong className="block text-stone-900 dark:text-stone-100 mb-1">🔄 নিয়মিত ভাঁজ বদল:</strong>
              শাড়ির একই ভাঁজে দীর্ঘদিন থাকলে সুতা ফেটে স্থায়ী ভাঁজ পড়ে যায়।
            </div>
            <div className="p-3.5 bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800">
              <strong className="block text-stone-900 dark:text-stone-100 mb-1">📦 সুতি কাভারে রাখুন:</strong>
              প্লাস্টিক ব্যাগ আর্দ্রতা আটকে রেখে ফাঙ্গাস তৈরি করে, সুতির ব্যাগ ব্যবহার করুন।
            </div>
          </div>
        </div>

      </main>

    </div>
  );
};
