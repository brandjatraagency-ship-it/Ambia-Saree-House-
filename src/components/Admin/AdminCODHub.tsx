import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, SareeProduct, CartItem, CustomerDetails, CourierPartner } from '../../types';
import { 
  Zap, 
  Truck, 
  ShieldCheck, 
  DollarSign, 
  MessageSquare, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  FileText, 
  Send,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface AdminCODHubProps {
  onViewInvoice: (order: Order) => void;
}

const BD_DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ',
  'গাজীপুর', 'নারায়ণগঞ্জ', 'কুমিল্লা', 'বগুড়া', 'নোয়াখালী', 'ফেনী', 'যশোর', 'দিনাজপুর',
  'টাঙ্গাইল', 'কক্সবাজার', 'ব্রাহ্মণবাড়িয়া', 'কুষ্টিয়া', 'পাবনা', 'ফরিদপুর', 'জামালপুর',
  'সিরাজগঞ্জ', 'নাটোর', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ', 'চাঁদপুর', 'লক্ষ্মীপুর',
  'কিশোরগঞ্জ', 'মানিকগঞ্জ', 'মুন্সীগঞ্জ', 'নরসিংদী', 'মাদারীপুর', 'শরীয়তপুর', 'গোপালগঞ্জ',
  'রাজবাড়ী', 'নেত্রকোণা', 'শেরপুর', 'ভোলা', 'পটুয়াখালী', 'পিরোজপুর', 'ঝালকাঠি', 'বরগুনা',
  'বাগেরহাট', 'সাতক্ষীরা', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল', 'চুয়াডাঙ্গা', 'মেহেরপুর',
  'নওগাঁ', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট', 'গাইবান্ধা', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী',
  'ঠাকুরগাঁও', 'পঞ্চগড়', 'খাগড়াছড়ি', 'রাঙ্গামাটি', 'বান্দরবান'
];

export const AdminCODHub: React.FC<AdminCODHubProps> = ({ onViewInvoice }) => {
  const { 
    products, 
    orders, 
    settings, 
    createManualOrder, 
    updateOrderCourier, 
    bulkUpdateOrderStatus,
    showToast 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'quick-sale' | 'courier-dispatch' | 'risk-check' | 'reconciliation' | 'message-templates'>('quick-sale');

  // Quick Sale State
  const [productSearch, setProductSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('ঢাকা');
  const [cityType, setCityType] = useState<'ঢাকা সিটির ভিতরে' | 'ঢাকা সিটির বাইরে' | 'ঢাকার পার্শ্ববর্তী এলাকা'>('ঢাকা সিটির ভিতরে');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [selectedCourier, setSelectedCourier] = useState<CourierPartner>('Steadfast');
  const [assignedTrackingCode, setAssignedTrackingCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Risk check phone state
  const [riskPhoneInput, setRiskPhoneInput] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState<{
    phone: string;
    totalOrders: number;
    deliveredCount: number;
    cancelledCount: number;
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    advice: string;
  } | null>(null);

  // Filter products for quick sale
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
      );
    });
  }, [products, productSearch]);

  // Delivery charge based on city selection
  const deliveryCharge = useMemo(() => {
    if (cityType === 'ঢাকা সিটির ভিতরে') return settings.insideDhakaDeliveryFee;
    if (cityType === 'ঢাকার পার্শ্ববর্তী এলাকা') return settings.subDhakaDeliveryFee;
    return settings.outsideDhakaDeliveryFee;
  }, [cityType, settings]);

  const itemsSubtotal = selectedItems.reduce((sum, it) => sum + (it.product.price * it.quantity), 0);
  const calculatedTotal = Math.max(0, itemsSubtotal - customDiscount + deliveryCharge);
  const codDueAmount = Math.max(0, calculatedTotal - advancePaid);

  // Quick Sale Handlers
  const handleAddProductToSale = (product: SareeProduct) => {
    if (product.stockCount <= 0) {
      showToast('এই শাড়ির পর্যাপ্ত স্টক নেই!', 'error');
      return;
    }
    setSelectedItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockCount) {
          showToast(`সর্বোচ্চ স্টক (${product.stockCount} টি) নির্বাচন করা হয়েছে`, 'info');
          return prev;
        }
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1, selectedColor: product.color }];
    });
  };

  const handleUpdateItemQty = (productId: string, delta: number) => {
    setSelectedItems(prev => {
      return prev.map(i => {
        if (i.product.id === productId) {
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > i.product.stockCount) {
            showToast(`স্টক সীমাবদ্ধতা: ${i.product.stockCount} টির বেশি নেই`, 'info');
            return i;
          }
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একটি শাড়ি নির্বাচন করুন', 'error');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast('গ্রাহকের নাম, ফোন নম্বর ও পূর্ণ ঠিকানা আবশ্যক', 'error');
      return;
    }

    const customer: CustomerDetails = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      city: cityType,
      district: customerDistrict,
      note: deliveryNote.trim()
    };

    const newOrder = createManualOrder({
      customer,
      items: selectedItems,
      discountAmount: Number(customDiscount) || 0,
      deliveryCharge,
      paymentMethod: 'cod',
      advancePaid: Number(advancePaid) || 0,
      courierName: selectedCourier,
      courierTrackingCode: assignedTrackingCode.trim() || undefined,
      adminNotes: `ম্যানুয়াল COD অর্ডার। অগ্রিম: ৳ ${advancePaid}, COD বকেয়া: ৳ ${codDueAmount}`
    });

    // Reset Form
    setSelectedItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setDeliveryNote('');
    setCustomDiscount(0);
    setAdvancePaid(0);
    setAssignedTrackingCode('');

    // Open invoice preview
    onViewInvoice(newOrder);
  };

  // Fraud / Return Risk Check
  const handleCheckRisk = (phoneToCheck?: string) => {
    const rawPhone = (phoneToCheck || riskPhoneInput).trim();
    if (!rawPhone) {
      showToast('অনুগ্রহ করে একটি মোবাইল নম্বর প্রদান করুন', 'error');
      return;
    }

    const matchedOrders = orders.filter(o => o.customer.phone.includes(rawPhone));
    const total = matchedOrders.length;
    const delivered = matchedOrders.filter(o => o.status === 'ডেলিভার্ড').length;
    const cancelled = matchedOrders.filter(o => o.status === 'বাতিল').length;

    let score = 95;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let advice = '✅ ১০০% নিরাপদ গ্রাহক! সরাসরি ক্যাশ অন ডেলিভারিতে (COD) পার্সেল পাঠানো নিরাপদ।';

    if (total > 0) {
      const successRate = (delivered / total) * 100;
      if (cancelled > 0 && successRate < 50) {
        score = 45;
        riskLevel = 'high';
        advice = '⚠️ উচ্চ ঝুঁকির সম্ভাবনা! পূর্বের অর্ডার বাতিলের রেকর্ড রয়েছে। কুরিয়ার চার্জ বাবদ ৳ ১৫০ অগ্রিম বিকাশ/নগদে গ্রহণ করার পরামর্শ।';
      } else if (cancelled > 0) {
        score = 75;
        riskLevel = 'medium';
        advice = '⚡ মাঝারি ঝুঁকি। গ্রাহককে ফোনে নিশ্চিত হয়ে কনফার্মেশন কোড যাচাই করে পাঠান।';
      } else {
        score = 98;
        riskLevel = 'low';
        advice = '🌟 বিশ্বস্ত নিয়মিত গ্রাহক! এই গ্রাহকের পূর্বের সকল অর্ডার সফলভাবে ডেলিভার্ড হয়েছে।';
      }
    } else {
      score = 85;
      riskLevel = 'low';
      advice = '✨ নতুন গ্রাহক। ফোন করে ঠিকানা ও কালার নিশ্চিত করে COD তে পাঠানো উপযুক্ত।';
    }

    setRiskAnalysis({
      phone: rawPhone,
      totalOrders: total,
      deliveredCount: delivered,
      cancelledCount: cancelled,
      score,
      riskLevel,
      advice
    });
  };

  // Courier Bulk CSV Export for Steadfast
  const exportSteadfastCSV = () => {
    const codOrders = orders.filter(o => o.paymentMethod === 'cod' && o.status !== 'বাতিল' && o.status !== 'ডেলিভার্ড');
    if (codOrders.length === 0) {
      showToast('রপ্তানি করার মতো কোনো পেন্ডিং COD অর্ডার নেই', 'info');
      return;
    }

    const headers = ['Invoice', 'Recipient Name', 'Recipient Phone', 'Recipient Address', 'COD Amount', 'Note'];
    const rows = codOrders.map(o => [
      o.trackingCode,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      o.customer.phone,
      `"${(o.customer.address + ', ' + o.customer.district).replace(/"/g, '""')}"`,
      o.codAmount !== undefined ? o.codAmount : o.total,
      `"${(o.items.map(i => i.product.name).join(' + ') + (o.customer.note ? ' - ' + o.customer.note : '')).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ambia_saree_steadfast_cod_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Steadfast কুরিয়ার ফরম্যাটে CSV এক্সপোর্ট সফল হয়েছে!', 'success');
  };

  // Courier Bulk CSV Export for Pathao
  const exportPathaoCSV = () => {
    const codOrders = orders.filter(o => o.paymentMethod === 'cod' && o.status !== 'বাতিল');
    if (codOrders.length === 0) {
      showToast('কোনো COD অর্ডার পাওয়া যায়নি', 'info');
      return;
    }

    const headers = ['Merchant Order ID', 'Recipient Name', 'Recipient Phone', 'Recipient Address', 'Recipient City', 'Amount to Collect', 'Item Type', 'Special Instruction'];
    const rows = codOrders.map(o => [
      o.id,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      o.customer.phone,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.district}"`,
      o.codAmount !== undefined ? o.codAmount : o.total,
      'Saree / Clothing',
      `"${o.customer.note || 'সাবধানে হ্যান্ডেল করুন'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ambia_saree_pathao_cod_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Pathao কুরিয়ার ফরম্যাটে CSV এক্সপোর্ট সফল হয়েছে!', 'success');
  };

  // Financial COD Totals
  const codOrders = orders.filter(o => o.paymentMethod === 'cod');
  const totalCODVolume = codOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCOD = codOrders.filter(o => o.status === 'ডেলিভার্ড').reduce((sum, o) => sum + o.total, 0);
  const inTransitCOD = codOrders.filter(o => o.status === 'ডেলিভারিতে আছে' || o.status === 'প্রসেসিং').reduce((sum, o) => sum + o.total, 0);
  const pendingCOD = codOrders.filter(o => o.status === 'পেন্ডিং').reduce((sum, o) => sum + o.total, 0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    showToast('মেসেজ টেক্সট কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div id="admin-cod-hub" className="space-y-6">
      
      {/* Sub navigation bar for COD Features */}
      <div className="bg-white dark:bg-[#1E171C] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveSubTab('quick-sale')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'quick-sale'
              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ দ্রুত COD অর্ডার বুকিং (POS)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('courier-dispatch')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'courier-dispatch'
              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>📦 কুরিয়ার অ্যাসাইন ও বাল্ক এক্সপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('risk-check')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'risk-check'
              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>🛡️ COD রিটার্ন ও ফ্রড রিস্ক চেকার</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reconciliation')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'reconciliation'
              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>💰 COD কালেকশন হিসাব ও রিকনসিলিয়েশন</span>
        </button>

        <button
          onClick={() => setActiveSubTab('message-templates')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'message-templates'
              ? 'bg-[#6B1728] text-amber-100 dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>💬 WhatsApp / SMS টেমপ্লেট</span>
        </button>
      </div>

      {/* 1. QUICK SALE TAB */}
      {activeSubTab === 'quick-sale' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Saree Catalog Picker (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                  <span>শাড়ি নির্বাচন করুন ({products.length} টি ডিজাইন)</span>
                </h3>
                <span className="text-xs text-stone-500">এক ক্লিকে অর্ডারে যুক্ত করুন</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="শাড়ির নাম, কোড (ASH-...) বা ফ্যাব্রিক দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#6B1728]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Products List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const isSelected = selectedItems.some(i => i.product.id === p.id);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handleAddProductToSale(p)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#6B1728] dark:border-amber-400 bg-amber-50/40 dark:bg-amber-950/20' 
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-[#1A1418]'
                      }`}
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-12 h-14 object-cover rounded-lg shrink-0 border border-stone-200 dark:border-stone-700" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-stone-500">{p.code}</span>
                          <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.2 rounded">
                            {p.fabric}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-extrabold text-[#6B1728] dark:text-amber-400">
                            ৳ {p.price.toLocaleString('bn-BD')}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            p.stockCount > 0 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            স্টক: {p.stockCount}
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#6B1728] hover:text-white dark:hover:bg-amber-400 dark:hover:text-stone-950 flex items-center justify-center shrink-0 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right: COD Order Details & Quick Checkout (5 cols) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCreateOrder} className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    ক্যাশ অন ডেলিভারি (COD) অর্ডার ফর্ম
                  </h3>
                  <p className="text-[11px] text-stone-500">ফোন বা হোয়াটসঅ্যাপ অর্ডারের তথ্য লিখুন</p>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  {selectedItems.length} টি আইটেম
                </span>
              </div>

              {/* Selected Items Tray */}
              {selectedItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center text-xs text-stone-400">
                  বাম পাশের ক্যাটালগ থেকে শাড়ি নির্বাচন করুন
                </div>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedItems.map((it) => (
                    <div key={it.product.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#281F25] text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{it.product.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono">৳ {it.product.price} × {it.quantity} = ৳ {(it.product.price * it.quantity).toLocaleString('bn-BD')}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(it.product.id, -1)}
                          className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold font-mono px-1.5">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(it.product.id, 1)}
                          className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    গ্রাহকের মোবাইল নম্বর *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="flex-1 p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckRisk(customerPhone)}
                      className="px-2.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl font-medium flex items-center gap-1 shrink-0"
                      title="গ্রাহকের ঝুঁকি চেক করুন"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>রিস্ক চেক</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    গ্রাহকের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: নুসরাত জাহান"
                    className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      ডেলিভারি এরিয়া *
                    </label>
                    <select
                      value={cityType}
                      onChange={(e) => setCityType(e.target.value as any)}
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
                    >
                      <option value="ঢাকা সিটির ভিতরে">ঢাকা সিটি (৳৮০)</option>
                      <option value="ঢাকার পার্শ্ববর্তী এলাকা">উপশহর (৳১০০)</option>
                      <option value="ঢাকা সিটির বাইরে">ঢাকার বাইরে (৳১৫০)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      জেলা *
                    </label>
                    <select
                      value={customerDistrict}
                      onChange={(e) => setCustomerDistrict(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
                    >
                      {BD_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    বিস্তারিত ঠিকানা (বাড়ি, রোড, এলাকা) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড, থানা, পোস্ট কোড..."
                    className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      বিশেষ ডিসকাউন্ট (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customDiscount || ''}
                      onChange={(e) => setCustomDiscount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      অগ্রিম পরিশোধ (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={advancePaid || ''}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      placeholder="যেমন: ১৫০ বা ২০০"
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono text-emerald-700 dark:text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      কুরিয়ার সিলেক্ট
                    </label>
                    <select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value as any)}
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                    >
                      <option value="Steadfast">Steadfast Courier</option>
                      <option value="Pathao">Pathao Courier</option>
                      <option value="RedX">RedX Delivery</option>
                      <option value="Paperfly">Paperfly</option>
                      <option value="সুন্দরবন">সুন্দরবন কুরিয়ার</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      কুরিয়ার ট্র্যাকিং কোড
                    </label>
                    <input
                      type="text"
                      value={assignedTrackingCode}
                      onChange={(e) => setAssignedTrackingCode(e.target.value)}
                      placeholder="ঐচ্ছিক (যেমন: ST-90234)"
                      className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    অর্ডার নোট / কালার স্পেসিফিকেশন
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="যেমন: লাল পার বা নির্দিষ্ট সময় ডেলিভারি..."
                    className="w-full p-2 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#281F25] border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span className="font-mono">৳ {itemsSubtotal.toLocaleString('bn-BD')}</span>
                </div>
                {customDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>ডিসকাউন্ট:</span>
                    <span className="font-mono">- ৳ {customDiscount.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono">৳ {deliveryCharge.toLocaleString('bn-BD')}</span>
                </div>
                {advancePaid > 0 && (
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>অগ্রিম পেমেন্ট:</span>
                    <span className="font-mono">- ৳ {advancePaid.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 dark:border-stone-700 pt-1.5 flex justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>ক্যাশ অন ডেলিভারি (COD) পাওনা:</span>
                  <span className="text-sm text-[#6B1728] dark:text-amber-400 font-mono">
                    ৳ {codDueAmount.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={selectedItems.length === 0}
                className="w-full py-3 rounded-xl bg-[#6B1728] dark:bg-amber-400 text-amber-50 dark:text-stone-950 font-bold text-xs hover:bg-[#52111e] dark:hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>অর্ডার নিশ্চিত করুন ও ইনভয়েস তৈরি করুন</span>
              </button>

            </form>
          </div>

        </div>
      )}

      {/* 2. COURIER DISPATCH TAB */}
      {activeSubTab === 'courier-dispatch' && (
        <div className="space-y-6">
          
          {/* Export Action Bar */}
          <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                <span>কুরিয়ার কনসাইনমেন্ট বুকিং ও বাল্ক এক্সপোর্ট</span>
              </h3>
              <p className="text-xs text-stone-500">
                এক ক্লিকে Steadfast বা Pathao কুরিয়ারে বাল্ক ফাইল আপলোড করুন
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportSteadfastCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Steadfast CSV ডাউনলোড</span>
              </button>

              <button
                onClick={exportPathaoCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pathao CSV ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Table of Orders to Dispatch */}
          <div className="bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                ডেলিভারি উপযোগী অর্ডারসমূহ ({orders.length} টি)
              </span>
              <span className="text-[11px] text-stone-500">
                কুরিয়ার ট্র্যাকিং কোড ইনপুট করুন ও সরাসরি আপডেট করুন
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 dark:bg-[#281F25] border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold">
                    <th className="py-3 px-4">অর্ডার কোড</th>
                    <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                    <th className="py-3 px-4">জেলা ও ঠিকানা</th>
                    <th className="py-3 px-4">COD কালেকশন (৳)</th>
                    <th className="py-3 px-4">কুরিয়ার পার্টনার</th>
                    <th className="py-3 px-4">কুরিয়ার ট্র্যাকিং কোড</th>
                    <th className="py-3 px-4 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 dark:hover:bg-[#281F25]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className="block text-stone-900 dark:text-stone-100">{ord.trackingCode}</span>
                        <span className="text-[10px] text-stone-400">{ord.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold">{ord.customer.name}</p>
                        <p className="text-stone-500 font-mono text-[11px]">{ord.customer.phone}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate" title={ord.customer.address}>
                        <span className="font-bold">{ord.customer.district}</span> — {ord.customer.address}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#6B1728] dark:text-amber-400 font-mono">
                        ৳ {(ord.codAmount !== undefined ? ord.codAmount : ord.total).toLocaleString('bn-BD')}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.courierName || 'Steadfast'}
                          onChange={(e) => updateOrderCourier(ord.id, e.target.value as any, ord.courierTrackingCode || '')}
                          className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#281F25] text-xs"
                        >
                          <option value="Steadfast">Steadfast</option>
                          <option value="Pathao">Pathao</option>
                          <option value="RedX">RedX</option>
                          <option value="Paperfly">Paperfly</option>
                          <option value="সুন্দরবন">সুন্দরবন</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          defaultValue={ord.courierTrackingCode || ''}
                          placeholder="কোড লিখুন..."
                          onBlur={(e) => updateOrderCourier(ord.id, ord.courierName || 'Steadfast', e.target.value)}
                          className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#281F25] text-xs font-mono w-28"
                        />
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300"
                          title="মেমো প্রিন্ট করুন"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* 3. RISK CHECK TAB */}
      {activeSubTab === 'risk-check' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-[#1E171C] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>গ্রাহক যাচাই ও COD ফ্রড / রিটার্ন রিস্ক চেকার</span>
              </h3>
              <p className="text-xs text-stone-500">
                পার্সেল পাঠানোর পূর্বে গ্রাহকের ফোন নম্বর দিয়ে অতীত ডেলিভারি ইতিহাস ও বিশ্বস্ততা যাচাই করুন।
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="tel"
                value={riskPhoneInput}
                onChange={(e) => setRiskPhoneInput(e.target.value)}
                placeholder="মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)..."
                className="flex-1 p-3 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-2xl text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="button"
                onClick={() => handleCheckRisk()}
                className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Search className="w-4 h-4" />
                <span>রিস্ক বিশ্লেষণ করুন</span>
              </button>
            </div>

            {/* Analysis Result Card */}
            {riskAnalysis && (
              <div className="mt-4 p-5 rounded-2xl bg-stone-50 dark:bg-[#281F25] border border-stone-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
                  <div>
                    <span className="text-xs text-stone-500">মোবাইল নম্বর:</span>
                    <p className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">{riskAnalysis.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500">বিশ্বস্ততা স্কোর:</span>
                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{riskAnalysis.score}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block">মোট অর্ডার</span>
                    <span className="font-bold text-base text-stone-900 dark:text-stone-100 font-mono">{riskAnalysis.totalOrders} টি</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block">সফল ডেলিভারি</span>
                    <span className="font-bold text-base text-emerald-600 font-mono">{riskAnalysis.deliveredCount} টি</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1E171C] rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block">বাতিল / রিটার্ন</span>
                    <span className="font-bold text-base text-rose-600 font-mono">{riskAnalysis.cancelledCount} টি</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  riskAnalysis.riskLevel === 'low'
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : riskAnalysis.riskLevel === 'medium'
                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                    : 'bg-rose-100 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                }`}>
                  {riskAnalysis.advice}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. RECONCILIATION TAB */}
      {activeSubTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-stone-500">মোট COD অর্ডার ভ্যালু</span>
              <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                ৳ {totalCODVolume.toLocaleString('bn-BD')}
              </div>
              <span className="text-[11px] text-stone-400">{codOrders.length} টি ক্যাশ অন ডেলিভারি অর্ডার</span>
            </div>

            <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-emerald-600">কুরিয়ার থেকে সংগৃহীত ও সফল</span>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                ৳ {deliveredCOD.toLocaleString('bn-BD')}
              </div>
              <span className="text-[11px] text-emerald-700">টাকা হাতে পাওয়া গেছে</span>
            </div>

            <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-indigo-600">ট্রানজিটে থাকা COD পাওনা</span>
              <div className="text-2xl font-extrabold text-indigo-600 font-mono">
                ৳ {inTransitCOD.toLocaleString('bn-BD')}
              </div>
              <span className="text-[11px] text-indigo-700">কুরিয়ারের কাছে হস্তান্তরিত</span>
            </div>

            <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-amber-600">পেন্ডিং প্রসেসিং পার্সেল</span>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">
                ৳ {pendingCOD.toLocaleString('bn-BD')}
              </div>
              <span className="text-[11px] text-amber-700">প্যাকিং সম্পন্ন করতে হবে</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MESSAGE TEMPLATES TAB */}
      {activeSubTab === 'message-templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Template 1 */}
          <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>১. অর্ডার কনফার্মেশন মেসেজ</span>
              </h4>
              <button
                onClick={() => copyToClipboard(`সম্মানিত গ্রাহক, আম্বিয়া শাড়ি হাউস থেকে আপনার পছন্দের শাড়ির অর্ডারটি গ্রহণ করা হয়েছে। ট্র্যাকিং কোড: [ASH-CODE]। পার্সেলটি হাতে পেয়ে ৳ [AMOUNT] পরিশোধ করুন। ধন্যবাদ!`, 't1')}
                className="text-xs flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                {copiedCode === 't1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 't1' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
            <p className="text-xs p-3 bg-stone-50 dark:bg-[#281F25] rounded-xl text-stone-700 dark:text-stone-300 font-bangla leading-relaxed border border-stone-200 dark:border-stone-700">
              "সম্মানিত গ্রাহক, আম্বিয়া শাড়ি হাউস থেকে আপনার পছন্দের শাড়ির অর্ডারটি গ্রহণ করা হয়েছে। ট্র্যাকিং কোড: [ASH-CODE]। পার্সেলটি হাতে পেয়ে ৳ [AMOUNT] পরিশোধ করুন। ধন্যবাদ!"
            </p>
          </div>

          {/* Template 2 */}
          <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>২. কুরিয়ার হ্যান্ডওভার ও ট্র্যাকিং</span>
              </h4>
              <button
                onClick={() => copyToClipboard(`আপনার শাড়ির পার্সেলটি Steadfast কুরিয়ারে হস্তান্তর করা হয়েছে। কুরিয়ার ট্র্যাকিং কোড: [COURIER-TRACKING]। আগামী ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি পাবেন।`, 't2')}
                className="text-xs flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                {copiedCode === 't2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 't2' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
            <p className="text-xs p-3 bg-stone-50 dark:bg-[#281F25] rounded-xl text-stone-700 dark:text-stone-300 font-bangla leading-relaxed border border-stone-200 dark:border-stone-700">
              "আপনার শাড়ির পার্সেলটি Steadfast কুরিয়ারে হস্তান্তর করা হয়েছে। কুরিয়ার ট্র্যাকিং কোড: [COURIER-TRACKING]। আগামী ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি পাবেন।"
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
