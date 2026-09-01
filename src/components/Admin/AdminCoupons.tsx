import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState(10);
  const [newMinOrder, setNewMinOrder] = useState(2000);
  const [newDesc, setNewDesc] = useState('');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    addCoupon({
      code: newCode.trim().toUpperCase(),
      discountType: newType,
      discountValue: Number(newValue),
      minOrderValue: Number(newMinOrder),
      isActive: true,
      expiryDate: newExpiry,
      description: newDesc || (newType === 'percentage' ? `${newValue}% বিশেষ ছাড়` : `৳ ${newValue} ফ্ল্যাট ডিসকাউন্ট`)
    });

    setNewCode('');
    setNewDesc('');
    setIsCreating(false);
  };

  return (
    <div id="admin-coupons-tab" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-stone-900 text-lg">ডিসকাউন্ট কুপন ও ভাউচার</h2>
          <p className="text-xs text-stone-500 font-medium">
            বিশেষ উৎসব, ঈদ ও নতুন গ্রাহকদের জন্য প্রমো কোড তৈরি ও পরিচালনা
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{isCreating ? 'ফর্ম বন্ধ করুন' : 'নতুন কুপন তৈরি করুন'}</span>
        </button>
      </div>

      {/* Create Coupon Box */}
      {isCreating && (
        <form onSubmit={handleCreateCoupon} className="bg-white p-5 rounded-2xl border-2 border-[#6B1728]/30 shadow-md space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>নতুন ডিসকাউন্ট কুপন ফর্ম</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">কুপন কোড (Promo Code) *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="যেমন: EID2026 বা BOISHAKH"
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase font-bold text-stone-900 focus:ring-1 focus:ring-[#6B1728]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">ডিসকাউন্ট ধরন</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="percentage">শতাংশ ছাড় (%)</option>
                <option value="fixed">নির্দিষ্ট টাকা ছাড় (৳ Fixed)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                ডিসকাউন্ট পরিমাণ ({newType === 'percentage' ? '%' : '৳'}) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">সর্বনিম্ন অর্ডারের পরিমাণ (৳) *</label>
              <input
                type="number"
                required
                min={0}
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">মেয়াদ শেষ হওয়ার তারিখ</label>
              <input
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">কুপনের বিবরণ</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="যেমন: ঈদ উপলক্ষে ১০% বিশেষ মূল্যছাড়"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6B1728] text-amber-100 rounded-xl font-bold hover:bg-[#52111e]"
            >
              কুপন সক্রিয় করুন
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div 
            key={c.id} 
            className={`p-4 rounded-2xl border bg-white shadow-xs flex flex-col justify-between space-y-3 ${
              c.isActive ? 'border-stone-200' : 'border-stone-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-sm px-2.5 py-1 bg-amber-100 text-amber-950 rounded-lg border border-amber-300">
                  {c.code}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  {c.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-lg font-bold text-[#6B1728]">
                  {c.discountType === 'percentage' ? `${c.discountValue}% ছাড়` : `৳ ${c.discountValue} ছাড়`}
                </span>
                <p className="text-xs text-stone-600 mt-1 font-medium">{c.description}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  সর্বনিম্ন অর্ডার: ৳ {c.minOrderValue.toLocaleString('bn-BD')}
                </p>
                <p className="text-[11px] text-stone-400">মেয়াদ: {c.expiryDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className={`font-semibold hover:underline ${c.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
              >
                {c.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
              </button>

              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-rose-600 hover:text-rose-800 p-1"
                title="কুপন মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
