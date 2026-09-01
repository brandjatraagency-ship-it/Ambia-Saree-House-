import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SareeProduct, FabricType } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Image as ImageIcon, 
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

interface AdminProductsProps {
  onOpenProductDetail: (product: SareeProduct) => void;
}

const FABRIC_OPTIONS: FabricType[] = [
  'জামদানি', 
  'কাতান', 
  'মসলিন', 
  'সিল্ক', 
  'তাঁত ও কটন', 
  'বেনারসি', 
  'জর্জেট ও শিফন',
  'অর্গানজা'
];

export const AdminProducts: React.FC<AdminProductsProps> = ({ onOpenProductDetail }) => {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterFabric, setFilterFabric] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SareeProduct | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    code: '',
    fabric: 'জামদানি' as FabricType,
    category: 'ঢাকাই জামদানি',
    price: 3500,
    originalPrice: 4200,
    stockCount: 10,
    color: 'রয়েল ব্লু',
    colorHex: '#1E3A8A',
    hasBlousePiece: true,
    blousePieceDetails: '১ মিটার আনস্টিচড ব্লাউজ পিস অন্তর্ভুক্ত',
    length: '১২ হাত (৫.৫ মিটার)',
    origin: 'রূপগঞ্জ, নারায়ণগঞ্জ',
    washCare: 'ড্রাই ক্লিন কাম্য',
    description: '',
    imagesText: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  });

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFabric = !filterFabric || p.fabric === filterFabric;
    return matchSearch && matchFabric;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameEn: '',
      code: 'ASH-' + Math.floor(100 + Math.random() * 900),
      fabric: 'জামদানি',
      category: 'ঢাকাই জামদানি',
      price: 4500,
      originalPrice: 5500,
      stockCount: 8,
      color: 'মেরুন লাল',
      colorHex: '#800020',
      hasBlousePiece: true,
      blousePieceDetails: 'ব্লাউজ পিস অন্তর্ভুক্ত',
      length: '১২ হাত (৫.৫ মিটার)',
      origin: 'তাঁত পল্লী, ঢাকা',
      washCare: 'ড্রাই ক্লিন',
      description: 'অত্যন্ত চমৎকার ও নিখুঁত কাজের প্রিমিয়াম শাড়ি। যেকোনো উৎসব ও অনুষ্ঠানে পরার জন্য অতুলনীয়।',
      imagesText: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: SareeProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn,
      code: product.code,
      fabric: product.fabric,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stockCount: product.stockCount,
      color: product.color,
      colorHex: product.colorHex,
      hasBlousePiece: product.hasBlousePiece,
      blousePieceDetails: product.blousePieceDetails || '',
      length: product.length,
      origin: product.origin,
      washCare: product.washCare,
      description: product.description,
      imagesText: product.images.join('\n'),
      isFeatured: !!product.isFeatured,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const images = formData.imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80');
    }

    const discountPercent = formData.originalPrice > formData.price
      ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
      : 0;

    if (editingProduct) {
      const updated: SareeProduct = {
        ...editingProduct,
        name: formData.name,
        nameEn: formData.nameEn,
        code: formData.code,
        fabric: formData.fabric,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent,
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        color: formData.color,
        colorHex: formData.colorHex,
        hasBlousePiece: formData.hasBlousePiece,
        blousePieceDetails: formData.blousePieceDetails,
        length: formData.length,
        origin: formData.origin,
        washCare: formData.washCare,
        description: formData.description,
        images,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
      };
      updateProduct(updated);
    } else {
      addProduct({
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        code: formData.code,
        fabric: formData.fabric,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent,
        rating: 5.0,
        reviewCount: 1,
        inStock: Number(formData.stockCount) > 0,
        stockCount: Number(formData.stockCount),
        color: formData.color,
        colorHex: formData.colorHex,
        hasBlousePiece: formData.hasBlousePiece,
        blousePieceDetails: formData.blousePieceDetails,
        length: formData.length,
        origin: formData.origin,
        washCare: formData.washCare,
        description: formData.description,
        images,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        occasion: ['উৎসব ও পূজা', 'বিবাহ ও বউভাত'],
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" মুছে ফেলতে চান?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div id="admin-products-tab" className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-bold text-stone-900 text-lg">শাড়ি পণ্য তালিকা ({products.length} টি)</h2>
          <p className="text-xs text-stone-500 font-medium">
            দোকানের ক্যাটালগ, নতুন ডিজাইন সংযোজন ও স্টক ম্যানেজমেন্ট
          </p>
        </div>

        <button
          id="admin-add-saree-btn"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>নতুন শাড়ি যোগ করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="শাড়ির নাম, কোড বা ফ্যাব্রিক দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6B1728]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={filterFabric}
          onChange={(e) => setFilterFabric(e.target.value)}
          className="p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none text-stone-700"
        >
          <option value="">সকল ফ্যাব্রিক</option>
          {FABRIC_OPTIONS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold">
                <th className="py-3 px-4">ছবি ও কোড</th>
                <th className="py-3 px-4">শাড়ির নাম</th>
                <th className="py-3 px-4">ফ্যাব্রিক</th>
                <th className="py-3 px-4">বিক্রয় মূল্য</th>
                <th className="py-3 px-4">স্টক</th>
                <th className="py-3 px-4">ব্লাউজ পিস</th>
                <th className="py-3 px-4 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.images[0]} 
                        alt="" 
                        className="w-12 h-14 object-cover rounded-lg border bg-stone-100 shrink-0" 
                      />
                      <span className="font-mono font-bold text-stone-700">{p.code}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-stone-400 font-serif-brand truncate">{p.nameEn}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="bg-stone-100 text-stone-800 font-semibold px-2 py-0.5 rounded">
                      {p.fabric}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-[#6B1728]">
                      ৳ {p.price.toLocaleString('bn-BD')}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-stone-400 line-through">
                        ৳ {p.originalPrice.toLocaleString('bn-BD')}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      p.stockCount <= 3
                        ? 'bg-rose-100 text-rose-800'
                        : p.stockCount <= 6
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stockCount} টি
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-600">
                    {p.hasBlousePiece ? '✅ অন্তর্ভুক্ত' : '❌ ছাড়া'}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => onOpenProductDetail(p)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      title="প্রিভিউ দেখুন"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                      title="এডিট করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div id="product-form-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 my-4 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-amber-100">
                {editingProduct ? `শাড়ি আপডেট: ${editingProduct.name}` : 'নতুন শাড়ি যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    শাড়ির নাম (বাংলা) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: রয়েল ব্লু আদি ঢাকাই জামদানি"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-[#6B1728]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Royal Blue Dhakai Jamdani"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-[#6B1728]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    প্রোডাক্ট কোড <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    ফ্যাব্রিক টাইপ <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value as FabricType })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    {FABRIC_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    স্টক সংখ্যা <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    বিক্রয় মূল্য (৳) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    পূর্বের / নিয়মিত মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">রং</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="যেমন: রয়েল ব্লু"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">রঙের কালার কোড</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-9 h-9 rounded cursor-pointer border p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">শাড়ির দৈর্ঘ্য</label>
                  <input
                    type="text"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    placeholder="১২ হাত (৫.৫ মি)"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasBlousePiece}
                    onChange={(e) => setFormData({ ...formData, hasBlousePiece: e.target.checked })}
                    className="accent-[#6B1728]"
                  />
                  <span>ব্লাউজ পিস সাথে অন্তর্ভুক্ত রয়েছে</span>
                </label>

                {formData.hasBlousePiece && (
                  <input
                    type="text"
                    value={formData.blousePieceDetails}
                    onChange={(e) => setFormData({ ...formData, blousePieceDetails: e.target.value })}
                    placeholder="ব্লাউজ পিসের বিবরণ (যেমন: ১ মিটার রানিং ব্লাউজ পিস)"
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ছবির লিংক (Image URLs - প্রতি লাইনে একটি URL)
                </label>
                <textarea
                  rows={2}
                  value={formData.imagesText}
                  onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  শাড়ির পূর্ণ বিবরণ (Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="শাড়ির ডিজাইন, সুতার কাউন্ট ও আভিজাত্যের বর্ণনা..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-[#6B1728]"
                  />
                  <span>নতুন কালেকশন ব্যাজ</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="accent-[#6B1728]"
                  />
                  <span>বেস্টসেলার ব্যাজ</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B1728] hover:bg-[#52111e] text-amber-100 font-bold rounded-xl shadow-xs"
                >
                  {editingProduct ? 'আপডেট করুন' : 'শাড়ি সংরক্ষণ করুন'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
