import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, navigateTo, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    showToast('আপনার বার্তা সফলভাবে গৃহীত হয়েছে! শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।', 'success');
  };

  return (
    <div id="contact-page" className="min-h-screen bg-[#FAF8F5] dark:bg-[#140D12] text-stone-900 dark:text-stone-100 transition-colors pb-16">
      
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
            যোগাযোগ ও শোরুম লোকেশন
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 font-bangla">
            যেকোনো জিজ্ঞাসা, বাল্ক অর্ডার বা শাড়ি নির্বাচনের সহযোগিতায় আমরা আছি আপনার পাশে।
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white dark:bg-[#1A1218] p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3 font-serif-brand">
              আমাদের সরাসরি যোগাযোগ মাধ্যম
            </h3>

            <div className="space-y-3 text-xs">
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#6B1728]/10 text-[#6B1728] dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">জরুরি হেল্পলাইন নম্বর</span>
                  <span className="text-stone-600 dark:text-stone-400">{settings.phone} / {settings.secondaryPhone}</span>
                </div>
              </a>

              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">WhatsApp লাইভ চ্যাট</span>
                  <span className="text-stone-600 dark:text-stone-400">{settings.whatsappNumber}</span>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">ইমেইল</span>
                  <span className="text-stone-600 dark:text-stone-400">{settings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">শোরুমের ঠিকানা</span>
                  <span className="text-stone-600 dark:text-stone-400">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">শোরুম খোলার সময়সূচি</span>
                  <span className="text-stone-600 dark:text-stone-400">প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা (মঙ্গলবার বন্ধ)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#1A1218] p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
                আমাদের বার্তা পাঠান
              </h3>
              <p className="text-xs text-stone-500">
                যেকোনো প্রশ্ন বা বিশেষ শাড়ির রিকয়ারমেন্ট জানিয়ে মেসেজ দিন।
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-emerald-800 dark:text-emerald-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-sm">বার্তা সফলভাবে পাঠানো হয়েছে!</h4>
                <p className="text-xs">আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-700 underline mt-2 inline-block"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: নুসরাত জাহান"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    আপনার বার্তা বা জিজ্ঞাসা *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="কোন শাড়ি সম্পর্কে জানতে চান বা বিশেষ কী জানতে চান তা লিখুন..."
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#6B1728]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>বার্তা পাঠিয়ে দিন</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

    </div>
  );
};
