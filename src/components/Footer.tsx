import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Heart,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onSelectFabric: (fabric: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectFabric }) => {
  const { settings, navigateTo, setActiveView } = useStore();

  return (
    <footer id="main-footer" className="bg-[#1C1917] text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigateTo('home')}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6B1728] to-[#8B1E3F] border border-amber-400/40 flex items-center justify-center text-amber-200 font-serif-brand font-bold text-lg">
                আ
              </div>
              <span className="font-serif-brand text-xl font-bold text-amber-100">
                আম্বিয়া শাড়ি হাউস
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              খাঁটি ঢাকাই জামদানি, রূপকথার মতো বেনারসি কাতান ও রেশমি সিল্কের নির্ভরযোগ্য প্রতিষ্ঠান। ঐতিহ্য ও আধুনিকতার মেলবন্ধনে প্রতিটি নারীর রূপের অনন্য অহংকার।
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#6B1728] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">
              জনপ্রিয় কালেকশন
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => navigateTo('category', 'জামদানি')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  খাঁটি ঢাকাই জামদানি
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('category', 'কাতান')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  ব্রাইডাল বেনারসি কাতান
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('category', 'মসলিন')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  ঐতিহ্যবাহী ঢাকাই মসলিন
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('category', 'সিল্ক')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  রাজশাহী তসর সিল্ক
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('category', 'তাঁত ও কটন')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  টাঙ্গাইল সুতি তাঁতের শাড়ি
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">
              গ্রাহক সেবা ও তথ্য
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => navigateTo('track-order')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('care-guide')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  শাড়ির কেয়ার গাইড
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  আমাদের পরিচিতি
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('contact')} 
                  className="hover:text-amber-200 transition-colors"
                >
                  যোগাযোগ ও শোরুম
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('admin')} 
                  className="text-amber-400/80 hover:text-amber-300 font-semibold"
                >
                  অ্যাডমিন প্যানেল
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200">
              শোরুম ও যোগাযোগ
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <span>{settings.phone} / {settings.secondaryPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <span>{settings.email}</span>
              </p>
            </div>

            {/* Payment methods icons badge */}
            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block mb-1.5 font-medium">পেমেন্ট পার্টনার:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded bg-pink-900/40 text-pink-200 border border-pink-700/40">bKash</span>
                <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-700/40">Nagad</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-700/40">Rocket</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-700/40">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© ২০২৬ আম্বিয়া শাড়ি হাউস (Ambia Saree House) — সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            <span>খাঁটি বাঙালি ঐতিহ্যের সাথে নির্মিত</span>
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          </p>
        </div>

      </div>
    </footer>
  );
};
