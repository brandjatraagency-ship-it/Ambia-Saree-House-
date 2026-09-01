import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Truck,
  Eye,
  FileText,
  MessageSquare
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'products' | 'orders' | 'coupons' | 'settings') => void;
  onOpenNewProductModal: () => void;
  onViewInvoice: (order: Order) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ 
  onNavigateTab, 
  onOpenNewProductModal,
  onViewInvoice 
}) => {
  const { orders, products, updateOrderStatus } = useStore();

  const totalRevenue = orders
    .filter(o => o.status !== 'বাতিল')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'পেন্ডিং');
  const lowStockProducts = products.filter(p => p.stockCount <= 5);

  // Sales by Fabric distribution
  const fabricStats: { [key: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(it => {
      fabricStats[it.product.fabric] = (fabricStats[it.product.fabric] || 0) + it.quantity;
    });
  });

  return (
    <div id="admin-overview-tab" className="space-y-6">
      
      {/* Top Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট বিক্রয় (সর্বমোট)</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#6B1728]">
            ৳ {totalRevenue.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span>সফল ও প্রসেসিং অর্ডার থেকে অর্জিত</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট অর্ডার</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {orders.length} টি
          </div>
          <div className="text-[11px] text-stone-500">
            {orders.filter(o => o.status === 'ডেলিভার্ড').length} টি সফলভাবে ডেলিভার্ড
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">পেন্ডিং অর্ডার</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">
            {pendingOrders.length} টি
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            {pendingOrders.length > 0 ? 'জরুরি কল ও কনফার্মেশন প্রয়োজন' : 'কোনো পেন্ডিং অর্ডার নেই'}
          </div>
        </div>

        {/* Total Catalog & Low Stock */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">স্টক ও ইনভেন্টরি</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {products.length} টি ডিজাইন
          </div>
          <div className="text-[11px] text-rose-600 font-bold">
            {lowStockProducts.length} টি শাড়ির স্টক সীমিত (≤ ৫ টি)
          </div>
        </div>

      </div>

      {/* Quick Action Buttons */}
      <div className="bg-stone-900 text-white p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-amber-200 font-serif-brand">
            আম্বিয়া শাড়ি হাউস — কুইক কন্ট্রোল
          </h3>
          <p className="text-xs text-stone-300">
            নতুন শাড়ির কালেকশন আপলোড করুন অথবা অর্ডার প্রসেসিং আপডেট করুন।
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 bg-[#6B1728] hover:bg-[#8B1E3F] text-amber-100 text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>নতুন শাড়ি যুক্ত করুন</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all border border-stone-700"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>সকল অর্ডার ম্যানেজ করুন</span>
          </button>
        </div>
      </div>

      {/* Two columns: Recent Orders & Fabric Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6B1728]" />
              <span>সাম্প্রতিক অর্ডারসমূহ</span>
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#6B1728] font-bold hover:underline"
            >
              সব দেখুন ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50">
                  <th className="py-2.5 px-3">অর্ডার আইডি</th>
                  <th className="py-2.5 px-3">গ্রাহকের নাম ও ফোন</th>
                  <th className="py-2.5 px-3">শাড়ি আইটেম</th>
                  <th className="py-2.5 px-3">মোট মূল্য</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-stone-900">{ord.id}</span>
                      <span className="block text-[10px] text-stone-400 font-mono">{ord.trackingCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-stone-900 block">{ord.customer.name}</span>
                      <span className="text-stone-500 text-[11px]">{ord.customer.phone}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-stone-700">
                        {ord.items.map(i => `${i.product.fabric} (${i.quantity})`).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#6B1728]">
                      ৳ {ord.total.toLocaleString('bn-BD')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        ord.status === 'ডেলিভার্ড'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'পেন্ডিং'
                          ? 'bg-amber-100 text-amber-900'
                          : ord.status === 'বাতিল'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => onViewInvoice(ord)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
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

        {/* Fabric Popularity & Low Stock (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Low stock alert box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-bold text-stone-900 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
                সীমিত স্টক সতর্কতা (Low Stock)
              </span>
              <span className="text-stone-400 font-normal">{lowStockProducts.length} টি</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={p.images[0]} alt="" className="w-8 h-10 object-cover rounded shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-stone-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{p.code}</p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-700 px-2 py-0.5 bg-rose-100 rounded-md shrink-0">
                    {p.stockCount} টি বাকি
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saree Fabric Sales Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
              ফ্যাব্রিক অনুযায়ী বিক্রয় অনুপাত
            </h4>

            <div className="space-y-2.5 text-xs">
              {Object.entries(fabricStats).map(([fab, count]) => {
                const totalItems = Object.values(fabricStats).reduce((a, b) => a + b, 0) || 1;
                const percent = Math.round((count / totalItems) * 100);

                return (
                  <div key={fab} className="space-y-1">
                    <div className="flex justify-between font-medium text-stone-700">
                      <span>{fab}</span>
                      <span className="font-bold">{count} টি ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#6B1728] rounded-full transition-all" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
