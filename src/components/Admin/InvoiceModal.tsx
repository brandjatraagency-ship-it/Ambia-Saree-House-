import React from 'react';
import { Order, StoreSettings } from '../../types';
import { X, Printer, Share2, MessageSquare, Download } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const whatsappText = encodeURIComponent(
    `*আম্বিয়া শাড়ি হাউস - অফিসিয়াল ক্যাশ মেমো*\n\n` +
    `অর্ডার আইডি: ${order.id}\n` +
    `ট্র্যাকিং কোড: ${order.trackingCode}\n` +
    `গ্রাহকের নাম: ${order.customer.name}\n` +
    `ঠিকানা: ${order.customer.address}, ${order.customer.district}\n\n` +
    `*পণ্যসমূহ:*\n` +
    order.items.map(i => `• ${i.product.name} (${i.product.code}) × ${i.quantity} = ৳ ${i.product.price * i.quantity}`).join('\n') +
    `\n\nসাবটোটাল: ৳ ${order.subtotal}\n` +
    (order.discountAmount > 0 ? `ডিসকাউন্ট: - ৳ ${order.discountAmount}\n` : '') +
    `ডেলিভারি চার্জ: ৳ ${order.deliveryCharge}\n` +
    `*সর্বমোট প্রদেয়: ৳ ${order.total}*\n` +
    `পেমেন্ট পদ্ধতি: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})`
  );

  return (
    <div id="invoice-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      <div 
        id="invoice-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">ক্যাশ মেমো / ইনভয়েস</span>
            <span className="font-mono text-xs bg-stone-800 px-2 py-0.5 rounded text-amber-300">
              #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন</span>
            </button>

            <a
              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>গ্রাহককে পাঠান</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-stone-900 font-sans text-xs">
          
          {/* Header */}
          <div className="text-center border-b-2 border-stone-800 pb-4 mb-5">
            <h1 className="text-2xl font-bold font-serif-brand text-[#6B1728]">
              {settings.storeName}
            </h1>
            <p className="text-xs text-stone-500 italic mt-0.5">{settings.storeTagline}</p>
            <p className="text-[11px] text-stone-600 mt-1">{settings.address}</p>
            <p className="text-[11px] text-stone-600">ফোন: {settings.phone} | ইমেইল: {settings.email}</p>
            <div className="inline-block mt-2 bg-stone-900 text-amber-100 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded">
              অফিসিয়াল গ্রাহক মেমো
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-stone-200">
            <div>
              <p className="text-stone-500 text-[11px]">বিল টু (গ্রাহক):</p>
              <p className="font-bold text-sm text-stone-900">{order.customer.name}</p>
              <p className="text-stone-700">মোবাইল: {order.customer.phone}</p>
              <p className="text-stone-700">{order.customer.address}</p>
              <p className="text-stone-700">{order.customer.district}, {order.customer.city}</p>
            </div>

            <div className="text-right space-y-1">
              <p><strong>ইনভয়েস নং:</strong> {order.id}</p>
              <p><strong>ট্র্যাকিং কোড:</strong> <span className="font-mono font-bold text-[#6B1728]">{order.trackingCode}</span></p>
              <p><strong>তারিখ:</strong> {new Date(order.createdAt).toLocaleDateString('bn-BD')}</p>
              <p><strong>পেমেন্ট মেথড:</strong> <span className="uppercase font-semibold">{order.paymentMethod}</span></p>
              {order.transactionId && (
                <p><strong>TrxID:</strong> <span className="font-mono text-emerald-700">{order.transactionId}</span></p>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse mb-5">
            <thead>
              <tr className="border-b-2 border-stone-800 bg-stone-50 text-stone-900 font-bold text-[11px]">
                <th className="py-2 px-2">নং</th>
                <th className="py-2 px-2">শাড়ির নাম ও বিবরণ</th>
                <th className="py-2 px-2">ফ্যাব্রিক</th>
                <th className="py-2 px-2 text-center">পরিমাণ</th>
                <th className="py-2 px-2 text-right">একক মূল্য</th>
                <th className="py-2 px-2 text-right">মোট টাকা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-2 font-mono">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <span className="font-bold text-stone-900">{it.product.name}</span>
                    <span className="text-[10px] text-stone-500 block font-mono">কোড: {it.product.code}</span>
                  </td>
                  <td className="py-2 px-2 text-stone-600">{it.product.fabric}</td>
                  <td className="py-2 px-2 text-center font-bold">{it.quantity}</td>
                  <td className="py-2 px-2 text-right font-mono">৳ {it.product.price.toLocaleString('bn-BD')}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">
                    ৳ {(it.product.price * it.quantity).toLocaleString('bn-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation */}
          <div className="w-full sm:w-1/2 ml-auto space-y-1.5 pt-2 border-t border-stone-800 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-600">সাবটোটাল:</span>
              <span className="font-mono font-semibold">৳ {order.subtotal.toLocaleString('bn-BD')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>কুপন ডিসকাউন্ট:</span>
                <span className="font-mono font-semibold">- ৳ {order.discountAmount.toLocaleString('bn-BD')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-600">ডেলিভারি চার্জ:</span>
              <span className="font-mono font-semibold">৳ {order.deliveryCharge.toLocaleString('bn-BD')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#6B1728] pt-2 border-t border-stone-300">
              <span>সর্বমোট প্রদেয়:</span>
              <span className="font-mono text-base">৳ {order.total.toLocaleString('bn-BD')}</span>
            </div>
          </div>

          {/* Footer Note & Signatures */}
          <div className="pt-10 mt-6 border-t border-stone-200 flex items-end justify-between text-[11px] text-stone-600">
            <div>
              <p className="font-semibold text-stone-800">বিশেষ দ্রষ্টব্য:</p>
              <p>ডেলিভারির সময় পণ্য পরীক্ষা করে রিসিভ করুন।</p>
              <p>যে কোনো অনুসন্ধানে আমাদের হেল্পলাইনে যোগাযোগ করুন।</p>
            </div>

            <div className="text-center">
              <div className="w-36 border-t border-stone-800 mb-1" />
              <span className="font-bold text-stone-900">অনুমোদিত স্বাক্ষর</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
