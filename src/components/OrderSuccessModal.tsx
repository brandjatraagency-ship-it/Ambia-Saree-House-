import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Printer, 
  Share2, 
  ShoppingBag, 
  Phone, 
  Truck, 
  Copy, 
  Check, 
  X,
  MessageSquare
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { 
    isOrderSuccessOpen, 
    setIsOrderSuccessOpen, 
    lastPlacedOrder, 
    settings,
    showToast 
  } = useStore();

  const [copied, setCopied] = React.useState(false);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(lastPlacedOrder.trackingCode);
      setCopied(true);
      showToast('ট্র্যাকিং কোড কপি করা হয়েছে!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappReceiptText = encodeURIComponent(
    `*আম্বিয়া শাড়ি হাউস - অর্ডার রসিদ*\n` +
    `অর্ডার আইডি: ${lastPlacedOrder.id}\n` +
    `ট্র্যাকিং কোড: ${lastPlacedOrder.trackingCode}\n` +
    `গ্রাহকের নাম: ${lastPlacedOrder.customer.name}\n` +
    `মোট প্রদেয়: ৳ ${lastPlacedOrder.total}\n` +
    `পেমেন্ট: ${lastPlacedOrder.paymentMethod.toUpperCase()}\n` +
    `ঠিকানা: ${lastPlacedOrder.customer.address}, ${lastPlacedOrder.customer.district}`
  );

  return (
    <div id="order-success-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Container */}
      <div 
        id="order-success-modal"
        className="relative bg-white dark:bg-[#1A1418] text-stone-900 dark:text-stone-100 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-4 max-h-[95vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Celebration Header */}
        <div className="bg-gradient-to-r from-[#6B1728] via-[#8B1E3F] to-[#6B1728] p-6 text-center text-amber-50 relative">
          <button
            id="close-success-modal-btn"
            onClick={() => setIsOrderSuccessOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-amber-400 text-stone-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-bangla text-amber-100">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
          </h2>
          <p className="text-xs text-amber-200/90 mt-1">
            আম্বিয়া শাড়ি হাউসে আস্থা রাখার জন্য আন্তরিক ধন্যবাদ।
          </p>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Tracking Box */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                অর্ডার ট্র্যাকিং কোড
              </span>
              <span className="text-lg sm:text-xl font-mono font-extrabold text-[#6B1728] dark:text-amber-400">
                {lastPlacedOrder.trackingCode}
              </span>
            </div>

            <button
              id="copy-tracking-code-btn"
              onClick={handleCopyTracking}
              className="flex items-center gap-1.5 bg-white dark:bg-[#251D22] hover:bg-amber-100/60 dark:hover:bg-stone-800 border border-amber-300 dark:border-amber-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
            </button>
          </div>

          {/* Customer & Order Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-50 dark:bg-[#231A20] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">গ্রাহকের বিবরণ:</span>
              <p><span className="text-stone-500 dark:text-stone-400">নাম:</span> {lastPlacedOrder.customer.name}</p>
              <p><span className="text-stone-500 dark:text-stone-400">ফোন:</span> {lastPlacedOrder.customer.phone}</p>
              <p><span className="text-stone-500 dark:text-stone-400">ঠিকানা:</span> {lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.district}</p>
            </div>

            <div className="p-3.5 bg-stone-50 dark:bg-[#231A20] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">পেমেন্ট ও ডেলিভারি:</span>
              <p><span className="text-stone-500 dark:text-stone-400">পেমেন্ট মেথড:</span> {lastPlacedOrder.paymentMethod.toUpperCase()}</p>
              <p><span className="text-stone-500 dark:text-stone-400">স্ট্যাটাস:</span> <span className="font-semibold text-emerald-700 dark:text-emerald-400">{lastPlacedOrder.status}</span></p>
              <p><span className="text-stone-500 dark:text-stone-400">মোট টাকা:</span> <span className="font-bold text-[#6B1728] dark:text-amber-400 font-mono">৳ {lastPlacedOrder.total.toLocaleString('bn-BD')}</span></p>
            </div>
          </div>

          {/* Items List */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            <div className="bg-stone-100 dark:bg-[#231A20] px-4 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 flex justify-between">
              <span>অর্ডারকৃত শাড়ি</span>
              <span>মূল্য</span>
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 p-2 text-xs">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={item.product.images[0]} 
                      alt="" 
                      className="w-10 h-12 object-cover rounded-md border border-stone-200 dark:border-stone-700" 
                    />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">কোড: {item.product.code} | {item.quantity} পিস</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                    ৳ {(item.product.price * item.quantity).toLocaleString('bn-BD')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-amber-100 py-3 px-4 rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>ক্যাশ মেমো প্রিন্ট / PDF</span>
            </button>

            <a
              id="whatsapp-share-receipt-btn"
              href={`https://wa.me/?text=${whatsappReceiptText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে রসিদ শেয়ার</span>
            </a>

          </div>

          <div className="text-center">
            <button
              onClick={() => setIsOrderSuccessOpen(false)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-200 text-xs font-semibold underline"
            >
              আরও শাড়ি দেখুন
            </button>
          </div>

        </div>

      </div>

      {/* Hidden Official Printable Cash Memo / Invoice (Active during window.print()) */}
      <div id="printable-invoice" className="hidden">
        <div className="max-w-xl mx-auto p-8 border-2 border-stone-800 font-sans text-stone-900 bg-white">
          
          {/* Memo Header */}
          <div className="text-center border-b-2 border-stone-800 pb-4 mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#6B1728]">আম্বিয়া শাড়ি হাউস</h1>
            <p className="text-xs text-stone-600 italic">ঐতিহ্যের ছোঁয়া, আভিজাত্যের প্রকাশ</p>
            <p className="text-xs text-stone-700 mt-1">{settings.address}</p>
            <p className="text-xs text-stone-700">হেল্পলাইন: {settings.phone} | {settings.email}</p>
            <div className="mt-2 inline-block bg-stone-900 text-white px-3 py-0.5 text-xs font-bold uppercase tracking-widest">
              অফিসিয়াল ক্যাশ মেমো / ইনভয়েস
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 text-xs mb-4 pb-2 border-b border-stone-300">
            <div>
              <p><strong>মেমো নং:</strong> {lastPlacedOrder.id}</p>
              <p><strong>ট্র্যাকিং কোড:</strong> {lastPlacedOrder.trackingCode}</p>
              <p><strong>তারিখ:</strong> {new Date(lastPlacedOrder.createdAt).toLocaleDateString('bn-BD')}</p>
            </div>
            <div className="text-right">
              <p><strong>ক্রেতার নাম:</strong> {lastPlacedOrder.customer.name}</p>
              <p><strong>ফোন:</strong> {lastPlacedOrder.customer.phone}</p>
              <p><strong>ঠিকানা:</strong> {lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.district}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs border-collapse mb-4">
            <thead>
              <tr className="border-b-2 border-stone-800 text-left">
                <th className="py-1">ক্র.নং</th>
                <th className="py-1">পণ্যের বিবরণ ও কোড</th>
                <th className="py-1 text-center">পরিমাণ</th>
                <th className="py-1 text-right">একক মূল্য</th>
                <th className="py-1 text-right">মোট</th>
              </tr>
            </thead>
            <tbody>
              {lastPlacedOrder.items.map((it, idx) => (
                <tr key={idx} className="border-b border-stone-200">
                  <td className="py-1.5">{idx + 1}</td>
                  <td className="py-1.5">
                    <strong>{it.product.name}</strong> ({it.product.code}) - {it.product.fabric}
                  </td>
                  <td className="py-1.5 text-center">{it.quantity}</td>
                  <td className="py-1.5 text-right">৳ {it.product.price}</td>
                  <td className="py-1.5 text-right">৳ {it.product.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="w-1/2 ml-auto text-xs space-y-1 border-t border-stone-800 pt-2 mb-8">
            <div className="flex justify-between">
              <span>সাবটোটাল:</span>
              <span>৳ {lastPlacedOrder.subtotal}</span>
            </div>
            {lastPlacedOrder.discountAmount > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>ডিসকাউন্ট:</span>
                <span>- ৳ {lastPlacedOrder.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span>৳ {lastPlacedOrder.deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t border-stone-400 pt-1">
              <span>সর্বমোট প্রদেয়:</span>
              <span>৳ {lastPlacedOrder.total}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between text-xs pt-8 border-t border-stone-300">
            <div className="text-center">
              <div className="w-32 border-t border-stone-600 mb-1" />
              <span>ক্রেতার স্বাক্ষর</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-t border-stone-600 mb-1" />
              <span>আম্বিয়া শাড়ি হাউস কর্তৃপক্ষ</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
