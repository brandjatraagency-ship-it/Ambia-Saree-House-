export type FabricType = 
  | 'জামদানি' 
  | 'কাতান' 
  | 'মসলিন' 
  | 'সিল্ক' 
  | 'তাঁত ও কটন' 
  | 'বেনারসি' 
  | 'জর্জেট ও শিফন'
  | 'অর্গানজা';

export type OccasionType = 
  | 'বিবাহ ও বউভাত' 
  | 'উৎসব ও পূজা' 
  | 'পার্টি ও রিসেপশন' 
  | 'অফিস ও ক্যাজুয়াল' 
  | 'বিয়েবাড়ি বিশেষ';

export interface SareeProduct {
  id: string;
  name: string;
  nameEn: string;
  code: string; // e.g. "ASH-102"
  fabric: FabricType;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  description: string;
  color: string;
  colorHex: string;
  hasBlousePiece: boolean;
  blousePieceDetails?: string;
  length: string; // e.g. "১২ হাত (৬ গজ)"
  origin: string; // e.g. "রূপগঞ্জ, নারায়ণগঞ্জ" or "মিরপুর বেনারসি পল্লী"
  washCare: string; // e.g. "শুধুমাত্র ড্রাই ক্লিন"
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  occasion: OccasionType[];
}

export interface CartItem {
  product: SareeProduct;
  quantity: number;
  selectedColor?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: 'ঢাকা সিটির ভিতরে' | 'ঢাকা সিটির বাইরে' | 'ঢাকার পার্শ্ববর্তী এলাকা';
  district: string;
  postalCode?: string;
  note?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';

export type OrderStatus = 
  | 'পেন্ডিং' 
  | 'কনফার্মড' 
  | 'প্রসেসিং' 
  | 'ডেলিভারিতে আছে' 
  | 'ডেলিভার্ড' 
  | 'বাতিল';

export type CourierPartner = 
  | 'Steadfast' 
  | 'Pathao' 
  | 'RedX' 
  | 'Paperfly' 
  | 'সুন্দরবন' 
  | 'নিজস্ব রাইডার' 
  | 'অন্যান্য';

export interface Order {
  id: string;
  trackingCode: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  total: number;
  advancePaid?: number;
  codAmount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'বকেয়া (Unpaid)' | 'পরিশোধিত (Paid)' | 'যাচাই চলছে (Verifying)';
  transactionId?: string;
  status: OrderStatus;
  adminNotes?: string;
  courierName?: CourierPartner;
  courierTrackingCode?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
  expiryDate: string;
  description: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  location?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  insideDhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  subDhakaDeliveryFee: number;
  freeDeliveryThreshold: number;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  announcementText: string;
  isAnnouncementActive: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedFabric: string;
  selectedCategory: string;
  selectedOccasion: string;
  selectedColor: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount';
  inStockOnly: boolean;
  hasBlousePieceOnly: boolean;
}

export type PageType = 
  | 'home'
  | 'product'
  | 'category'
  | 'track'
  | 'care'
  | 'about'
  | 'contact'
  | 'wishlist'
  | 'admin';

