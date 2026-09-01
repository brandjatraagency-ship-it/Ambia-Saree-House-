import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';
import { 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  CreditCard, 
  Sparkles, 
  RefreshCw, 
  Save, 
  Check,
  AlertTriangle
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useStore();
  const [form, setForm] = useState<StoreSettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে ডেমো ডেটাতে রিসেট করতে চান? আপনার কাস্টম পরিবর্তন মুছে যাবে।')) {
      resetToDemoData();
      setForm(settings);
    }
  };

  return (
    <div id="admin-settings-tab" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-stone-900 text-lg">দোকানের সাধারণ সেটিংস ও ডেলিভারি ফি</h2>
          <p className="text-xs text-stone-500 font-medium">
            ব্যবসার যোগাযোগের তথ্য, বিকাশ/নগদ মার্চেন্ট এবং ডেলিভারি চার্জ পরিবর্তন
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 font-semibold px-4 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>ডিফল্ট ডেমো ডেটা রিসেট</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. Basic Store Info */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
            <Store className="w-4 h-4 text-[#6B1728]" />
            <span>প্রতিষ্ঠানের পরিচিতি ও ব্র্যান্ডিং</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">দোকানের নাম *</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-[#6B1728]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">স্লোগান / ট্যাগলাইন</label>
              <input
                type="text"
                value={form.storeTagline}
                onChange={(e) => setForm({ ...form, storeTagline: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">শোরুম / দোকানের পূর্ণ ঠিকানা *</label>
            <textarea
              rows={2}
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Contact & Numbers */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
            <Phone className="w-4 h-4 text-[#6B1728]" />
            <span>যোগাযোগ ও পেমেন্ট অ্যাকাউন্ট</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">প্রধান হেল্পলাইন ফোন *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">হোয়াটসঅ্যাপ নম্বর *</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">বিকাশ মার্চেন্ট নম্বর</label>
              <input
                type="text"
                value={form.bkashMerchantNumber}
                onChange={(e) => setForm({ ...form, bkashMerchantNumber: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">নগদ অ্যাকাউন্ট নম্বর</label>
              <input
                type="text"
                value={form.nagadMerchantNumber}
                onChange={(e) => setForm({ ...form, nagadMerchantNumber: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">রকেট অ্যাকাউন্ট নম্বর</label>
              <input
                type="text"
                value={form.rocketMerchantNumber}
                onChange={(e) => setForm({ ...form, rocketMerchantNumber: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Delivery Fees & Free Threshold */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
            <Truck className="w-4 h-4 text-[#6B1728]" />
            <span>ডেলিভারি চার্জ ও ফ্রি ডেলিভারি শর্ত</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">ঢাকা সিটির ভিতরে (৳)</label>
              <input
                type="number"
                required
                min={0}
                value={form.insideDhakaDeliveryFee}
                onChange={(e) => setForm({ ...form, insideDhakaDeliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ঢাকার পার্শ্ববর্তী এলাকা (৳)</label>
              <input
                type="number"
                required
                min={0}
                value={form.subDhakaDeliveryFee}
                onChange={(e) => setForm({ ...form, subDhakaDeliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ঢাকা সিটির বাইরে (৳)</label>
              <input
                type="number"
                required
                min={0}
                value={form.outsideDhakaDeliveryFee}
                onChange={(e) => setForm({ ...form, outsideDhakaDeliveryFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ফ্রি ডেলিভারি সর্বনিম্ন মূল্য (৳)</label>
              <input
                type="number"
                required
                min={0}
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Top Announcement Bar */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>টপ অ্যানাউন্সমেন্ট ও অফার ব্যানার</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAnnouncementActive}
                onChange={(e) => setForm({ ...form, isAnnouncementActive: e.target.checked })}
                className="accent-[#6B1728]"
              />
              <span>ওয়েবসাইটের শীর্ষে অ্যানাউন্সমেন্ট বার চালু রাখুন</span>
            </label>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ব্যানার মেসেজ</label>
              <input
                type="text"
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold px-6 py-3 rounded-2xl shadow-md text-sm transition-colors"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>

    </div>
  );
};
