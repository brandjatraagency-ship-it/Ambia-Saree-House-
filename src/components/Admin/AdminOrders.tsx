import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, CourierPartner } from '../../types';
import { 
  Search, 
  Filter, 
  Printer, 
  FileText, 
  MessageSquare, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle,
  X,
  CheckSquare,
  Square,
  Zap,
  DollarSign
} from 'lucide-react';

interface AdminOrdersProps {
  onViewInvoice: (order: Order) => void;
}

const STATUS_LIST: OrderStatus[] = [
  'পেন্ডিং',
  'কনফার্মড',
  'প্রসেসিং',
  'ডেলিভারিতে আছে',
  'ডেলিভার্ড',
  'বাতিল'
];

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onViewInvoice }) => {
  const { orders, updateOrderStatus, updateOrderCourier, bulkUpdateOrderStatus, deleteOrder, settings } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cod' | 'digital'>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatusAction, setBulkStatusAction] = useState<OrderStatus>('কনফার্মড');

  const filteredOrders = orders.filter(o => {
    const matchSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.includes(searchTerm) ||
      (o.courierTrackingCode && o.courierTrackingCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = !selectedStatus || o.status === selectedStatus;
    const matchPayment = paymentFilter === 'all' 
      ? true 
      : paymentFilter === 'cod' 
        ? o.paymentMethod === 'cod' 
        : o.paymentMethod !== 'cod';

    return matchSearch && matchStatus && matchPayment;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'ডেলিভার্ড': return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'পেন্ডিং': return 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'কনফার্মড': return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'প্রসেসিং': return 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'ডেলিভারিতে আছে': return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'বাতিল': return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExecuteBulkUpdate = () => {
    if (selectedOrderIds.length === 0) return;
    bulkUpdateOrderStatus(selectedOrderIds, bulkStatusAction);
    setSelectedOrderIds([]);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm(`আপনি কি অর্ডার #${orderId} স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      deleteOrder(orderId);
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    }
  };

  return (
    <div id="admin-orders-tab" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1E171C] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-stone-900 dark:text-stone-100 text-lg">অর্ডার ম্যানেজমেন্ট ({orders.length} টি)</h2>
          <p className="text-xs text-stone-500 font-medium">
            ক্যাশ অন ডেলিভারি (COD) ট্র্যাকিং, কুরিয়ার অ্যাসাইনমেন্ট ও মেমো জেনারেশন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">পেন্ডিং:</span>
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 font-mono">
              {orders.filter(o => o.status === 'পেন্ডিং').length} টি
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">COD অর্ডার:</span>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-mono">
              {orders.filter(o => o.paymentMethod === 'cod').length} টি
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Payment Method & Search */}
      <div className="bg-white dark:bg-[#1E171C] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
        
        {/* Status Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setSelectedStatus('')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedStatus === ''
                  ? 'bg-stone-900 dark:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              সব অর্ডার ({orders.length})
            </button>

            {STATUS_LIST.map((st) => {
              const count = orders.filter(o => o.status === st).length;
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#6B1728] dark:bg-amber-400 text-amber-100 dark:text-stone-950 font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          {/* Payment Type Selector */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#281F25] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                paymentFilter === 'all' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
              }`}
            >
              সব মেথড
            </button>
            <button
              onClick={() => setPaymentFilter('cod')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                paymentFilter === 'cod' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
              }`}
            >
              <Truck className="w-3 h-3 text-emerald-600" />
              <span>শুধু COD</span>
            </button>
            <button
              onClick={() => setPaymentFilter('digital')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                paymentFilter === 'digital' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs' : 'text-stone-500'
              }`}
            >
              ডিজিটাল (বিকাশ/নগদ)
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="গ্রাহকের নাম, ফোন নম্বর, অর্ডার কোড (ASH-...) বা কুরিয়ার ট্র্যাকিং কোড দিয়ে সার্চ করুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:ring-1 focus:ring-[#6B1728]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedOrderIds.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-[#281F25] border border-amber-300 dark:border-amber-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              {selectedOrderIds.length} টি অর্ডার নির্বাচিত হয়েছে
            </span>

            <div className="flex items-center gap-2">
              <span className="text-stone-600 dark:text-stone-400">স্ট্যাটাস পরিবর্তন করুন:</span>
              <select
                value={bulkStatusAction}
                onChange={(e) => setBulkStatusAction(e.target.value as OrderStatus)}
                className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold"
              >
                {STATUS_LIST.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <button
                onClick={handleExecuteBulkUpdate}
                className="px-3 py-1.5 bg-[#6B1728] dark:bg-amber-400 text-amber-50 dark:text-stone-950 font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                প্রয়োগ করুন
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#1E171C] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-[#281F25] border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold">
                <th className="py-3 px-4 w-10">
                  <button onClick={handleSelectAll} className="text-stone-400 hover:text-stone-600">
                    {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                      <CheckSquare className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">অর্ডার কোড ও তারিখ</th>
                <th className="py-3 px-4">গ্রাহকের তথ্য ও ঠিকানা</th>
                <th className="py-3 px-4">পণ্যসমূহ</th>
                <th className="py-3 px-4">পেমেন্ট ও COD হিসাব</th>
                <th className="py-3 px-4">কুরিয়ার ট্র্যাকিং</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-stone-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrderIds.includes(ord.id);
                  const isCOD = ord.paymentMethod === 'cod';
                  const whatsappCustomerText = encodeURIComponent(
                    `হ্যালো ${ord.customer.name}! আম্বিয়া শাড়ি হাউস থেকে আপনার অর্ডার #${ord.id} (${ord.trackingCode}) এর স্ট্যাটাস: *${ord.status}*। মোট প্রদেয়: ৳ ${ord.codAmount !== undefined ? ord.codAmount : ord.total}। ধন্যবাদ!`
                  );

                  return (
                    <tr key={ord.id} className={`hover:bg-stone-50/80 dark:hover:bg-[#281F25]/60 transition-colors ${isSelected ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''}`}>
                      
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button onClick={() => toggleSelectOrder(ord.id)} className="text-stone-400 hover:text-stone-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#6B1728] dark:text-amber-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* ID & Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">{ord.trackingCode}</span>
                        <span className="font-mono text-[10px] text-stone-400 block">{ord.id}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-bold text-stone-900 dark:text-stone-100">{ord.customer.name}</p>
                        <p className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">{ord.customer.phone}</p>
                        <p className="text-stone-500 text-[11px] truncate" title={ord.customer.address}>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">{ord.customer.district}:</span> {ord.customer.address}
                        </p>
                        {ord.customer.note && (
                          <p className="text-amber-800 dark:text-amber-300 text-[10px] bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded mt-1">
                            নোট: {ord.customer.note}
                          </p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6B1728] dark:bg-amber-400 shrink-0" />
                              <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[150px]">{it.product.name}</span>
                              <span className="text-stone-400 font-mono text-[10px]">({it.quantity}টি)</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Payment & Amount */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-[#6B1728] dark:text-amber-400 font-mono">
                          ৳ {ord.total.toLocaleString('bn-BD')}
                        </div>

                        {/* COD Breakdown */}
                        {isCOD ? (
                          <div className="mt-0.5 space-y-0.5">
                            <span className="inline-block font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                              ক্যাশ অন ডেলিভারি (COD)
                            </span>
                            {ord.advancePaid && ord.advancePaid > 0 ? (
                              <p className="text-[10px] text-blue-600 font-medium">
                                অগ্রিম: ৳{ord.advancePaid} | বকেয়া: ৳{ord.codAmount || (ord.total - ord.advancePaid)}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="font-mono uppercase font-bold text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.2 rounded">
                              {ord.paymentMethod}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              ({ord.paymentStatus})
                            </span>
                          </div>
                        )}

                        {ord.transactionId && (
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5 font-bold">
                            Trx: {ord.transactionId}
                          </span>
                        )}
                      </td>

                      {/* Courier Partner & Tracking */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <select
                            value={ord.courierName || 'Steadfast'}
                            onChange={(e) => updateOrderCourier(ord.id, e.target.value as any, ord.courierTrackingCode || '')}
                            className="p-1 rounded bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 text-[11px] w-24"
                          >
                            <option value="Steadfast">Steadfast</option>
                            <option value="Pathao">Pathao</option>
                            <option value="RedX">RedX</option>
                            <option value="Paperfly">Paperfly</option>
                            <option value="সুন্দরবন">সুন্দরবন</option>
                          </select>
                          <input
                            type="text"
                            defaultValue={ord.courierTrackingCode || ''}
                            placeholder="ট্র্যাকিং আইডি"
                            onBlur={(e) => updateOrderCourier(ord.id, ord.courierName || 'Steadfast', e.target.value)}
                            className="p-1 rounded bg-stone-50 dark:bg-[#281F25] border border-stone-300 dark:border-stone-700 text-[10px] font-mono w-24 block"
                          />
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`p-1.5 rounded-lg text-xs font-bold border focus:outline-none ${getStatusBadgeClass(ord.status)}`}
                        >
                          {STATUS_LIST.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                          title="ক্যাশ মেমো / ইনভয়েস দেখুন ও প্রিন্ট করুন"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=${whatsappCustomerText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 inline-block transition-colors"
                          title="গ্রাহককে WhatsApp মেসেজ পাঠান"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`tel:${ord.customer.phone}`}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 inline-block transition-colors"
                          title="সরাসরি কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDelete(ord.id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 transition-colors"
                          title="অর্ডার মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

