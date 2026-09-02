import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SareeProduct, 
  CartItem, 
  Order, 
  StoreSettings, 
  SEOSettings,
  Coupon, 
  CustomerDetails, 
  PaymentMethod,
  OrderStatus,
  CourierPartner,
  PageType,
  ProductReview
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SETTINGS, 
  INITIAL_SEO_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from '../data/initialData';

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  products: SareeProduct[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  orders: Order[];
  coupons: Coupon[];
  reviews: ProductReview[];
  settings: StoreSettings;
  seoSettings: SEOSettings;
  appliedCoupon: Coupon | null;
  activeView: 'store' | 'admin';
  currentPage: PageType;
  currentCategory: string;
  selectedProduct: SareeProduct | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderSuccessOpen: boolean;
  isTrackOrderOpen: boolean;
  isCareGuideOpen: boolean;
  lastPlacedOrder: Order | null;
  toasts: ToastMessage[];

  // Actions
  setActiveView: (view: 'store' | 'admin') => void;
  setCurrentPage: (page: PageType) => void;
  setCurrentCategory: (category: string) => void;
  setSelectedProduct: (product: SareeProduct | null) => void;
  navigateTo: (page: PageType, param?: string | SareeProduct) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderSuccessOpen: (open: boolean) => void;
  setIsTrackOrderOpen: (open: boolean) => void;
  setIsCareGuideOpen: (open: boolean) => void;
  
  // Reviews
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => ProductReview[];
  
  // Cart Actions
  addToCart: (product: SareeProduct, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Checkout & Orders
  cartSubtotal: number;
  discountAmount: number;
  deliveryCharge: (city: 'ঢাকা সিটির ভিতরে' | 'ঢাকা সিটির বাইরে' | 'ঢাকার পার্শ্ববর্তী এলাকা') => number;
  placeOrder: (
    customer: CustomerDetails, 
    paymentMethod: PaymentMethod, 
    trxId?: string
  ) => Promise<Order>;
  createManualOrder: (orderData: {
    customer: CustomerDetails;
    items: CartItem[];
    discountAmount?: number;
    deliveryCharge: number;
    paymentMethod: PaymentMethod;
    advancePaid?: number;
    courierName?: CourierPartner;
    courierTrackingCode?: string;
    adminNotes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  updateOrderCourier: (orderId: string, courierName: CourierPartner, courierTrackingCode: string) => void;
  bulkUpdateOrderStatus: (orderIds: string[], status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Admin Actions
  addProduct: (product: Omit<SareeProduct, 'id'>) => void;
  updateProduct: (product: SareeProduct) => void;
  deleteProduct: (productId: string) => void;
  updateSettings: (newSettings: StoreSettings) => void;
  updateSEOSettings: (newSeo: SEOSettings) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCouponStatus: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;
  resetToDemoData: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Permanent Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_darkMode', 'true');
      document.documentElement.classList.add('dark');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleDarkMode = () => {
    // Keep dark mode permanently
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  };
  // Persistence with localStorage
  const [products, setProducts] = useState<SareeProduct[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is CartItem => Boolean(item && item.product && item.product.id));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [seoSettings, setSeoSettings] = useState<SEOSettings>(() => {
    try {
      const saved = localStorage.getItem('ambia_saree_seo_settings');
      return saved ? JSON.parse(saved) : INITIAL_SEO_SETTINGS;
    } catch {
      return INITIAL_SEO_SETTINGS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [selectedProduct, setSelectedProductState] = useState<SareeProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigate helper with URL sync
  const navigateTo = (page: PageType, param?: string | SareeProduct) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'admin') {
      setActiveView('admin');
      setCurrentPage('admin');
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'admin');
        url.searchParams.delete('id');
        url.searchParams.delete('fabric');
        window.history.pushState({ page: 'admin' }, '', url.toString());
      } catch (e) {
        console.error(e);
      }
      return;
    }

    setActiveView('store');

    if (page === 'product') {
      let targetProduct: SareeProduct | null = null;
      if (typeof param === 'object' && param !== null) {
        targetProduct = param;
      } else if (typeof param === 'string') {
        targetProduct = products.find(p => p.id === param || p.code === param) || null;
      }
      if (targetProduct) {
        setSelectedProductState(targetProduct);
        setCurrentPage('product');
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('page', 'product');
          url.searchParams.set('id', targetProduct.id);
          url.searchParams.delete('fabric');
          window.history.pushState({ page: 'product', id: targetProduct.id }, '', url.toString());
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    if (page === 'category') {
      const fabricName = typeof param === 'string' ? param : '';
      setCurrentCategory(fabricName);
      setCurrentPage('category');
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'category');
        if (fabricName) {
          url.searchParams.set('fabric', fabricName);
        } else {
          url.searchParams.delete('fabric');
        }
        url.searchParams.delete('id');
        window.history.pushState({ page: 'category', fabric: fabricName }, '', url.toString());
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Standard pages: home, track, care, about, contact, wishlist
    setCurrentPage(page);
    try {
      const url = new URL(window.location.href);
      if (page === 'home') {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', page);
      }
      url.searchParams.delete('id');
      url.searchParams.delete('fabric');
      window.history.pushState({ page }, '', url.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Keep setSelectedProduct backward compatible, but navigate to product landing page when product is clicked!
  const setSelectedProduct = (product: SareeProduct | null) => {
    setSelectedProductState(product);
    if (product) {
      navigateTo('product', product);
    }
  };

  // Sync on initial mount & handle browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const url = new URL(window.location.href);
        const pageParam = url.searchParams.get('page');
        const idParam = url.searchParams.get('id') || url.searchParams.get('product');
        const fabricParam = url.searchParams.get('fabric') || url.searchParams.get('category');

        if (pageParam === 'admin') {
          setActiveView('admin');
          setCurrentPage('admin');
        } else if (pageParam === 'product' || idParam) {
          setActiveView('store');
          const found = products.find(p => p.id === idParam || p.code === idParam);
          if (found) {
            setSelectedProductState(found);
            setCurrentPage('product');
          } else {
            setCurrentPage('home');
          }
        } else if (pageParam === 'category' || fabricParam) {
          setActiveView('store');
          setCurrentCategory(fabricParam || '');
          setCurrentPage('category');
        } else if (pageParam && ['track', 'care', 'about', 'contact', 'wishlist'].includes(pageParam)) {
          setActiveView('store');
          setCurrentPage(pageParam as PageType);
        } else {
          setActiveView('store');
          setCurrentPage('home');
        }
      } catch (e) {
        console.error('URL parse error:', e);
      }
    };

    // Run on initial load
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }, [reviews]);

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('আপনার মূল্যবান রিভিউ ও রেটিং সফলভাবে যোগ হয়েছে!', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId);
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error('Error saving coupons:', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }, [settings]);

  // SEO settings persistence & Head tags updater
  useEffect(() => {
    try {
      localStorage.setItem('ambia_saree_seo_settings', JSON.stringify(seoSettings));

      // Dynamic Title
      if (seoSettings.metaTitle) {
        document.title = seoSettings.metaTitle;
      }

      // Helper to set or create meta tag
      const setMetaTag = (nameOrProp: 'name' | 'property', attrValue: string, content: string) => {
        let el = document.querySelector(`meta[${nameOrProp}="${attrValue}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(nameOrProp, attrValue);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      // Set standard meta tags
      if (seoSettings.metaDescription) {
        setMetaTag('name', 'description', seoSettings.metaDescription);
      }
      if (seoSettings.metaKeywords) {
        setMetaTag('name', 'keywords', seoSettings.metaKeywords);
      }

      // Robots
      const robotsDirective = `${seoSettings.robotsIndex ? 'index' : 'noindex'}, ${seoSettings.robotsFollow ? 'follow' : 'nofollow'}`;
      setMetaTag('name', 'robots', robotsDirective);

      // Open Graph Tags
      setMetaTag('property', 'og:title', seoSettings.ogTitle || seoSettings.metaTitle);
      setMetaTag('property', 'og:description', seoSettings.ogDescription || seoSettings.metaDescription);
      if (seoSettings.ogImage) {
        setMetaTag('property', 'og:image', seoSettings.ogImage);
      }
      setMetaTag('property', 'og:type', 'website');
      if (seoSettings.canonicalUrl) {
        setMetaTag('property', 'og:url', seoSettings.canonicalUrl);
      }

      // Twitter Cards
      setMetaTag('name', 'twitter:card', seoSettings.twitterCardType || 'summary_large_image');
      setMetaTag('name', 'twitter:title', seoSettings.ogTitle || seoSettings.metaTitle);
      setMetaTag('name', 'twitter:description', seoSettings.ogDescription || seoSettings.metaDescription);
      if (seoSettings.ogImage) {
        setMetaTag('name', 'twitter:image', seoSettings.ogImage);
      }

      // Google Search Console meta tag
      if (seoSettings.googleSearchConsoleCode) {
        const code = seoSettings.googleSearchConsoleCode.includes('content="')
          ? seoSettings.googleSearchConsoleCode.split('content="')[1].split('"')[0]
          : seoSettings.googleSearchConsoleCode.replace('google-site-verification=', '').trim();
        setMetaTag('name', 'google-site-verification', code);
      }

      // Canonical link tag
      if (seoSettings.canonicalUrl) {
        let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonicalEl) {
          canonicalEl = document.createElement('link');
          canonicalEl.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalEl);
        }
        canonicalEl.setAttribute('href', seoSettings.canonicalUrl);
      }

      // Structured Data (JSON-LD) Schema
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': seoSettings.schemaType || 'ClothingStore',
        'name': settings.storeName,
        'description': seoSettings.metaDescription,
        'url': seoSettings.canonicalUrl || 'https://ambiasareehouse.com',
        'telephone': settings.phone,
        'email': settings.email,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': settings.address,
          'addressLocality': 'Dhaka',
          'addressCountry': 'BD'
        },
        'priceRange': '৳৳',
        'image': seoSettings.ogImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'
      };

      let scriptSchema = document.getElementById('store-schema-jsonld') as HTMLScriptElement | null;
      if (!scriptSchema) {
        scriptSchema = document.createElement('script');
        scriptSchema.id = 'store-schema-jsonld';
        scriptSchema.type = 'application/ld+json';
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schemaData, null, 2);

    } catch (e) {
      console.error('Error applying SEO settings:', e);
    }
  }, [seoSettings, settings]);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    if (!item?.product?.price) return sum;
    return sum + item.product.price * (item.quantity || 1);
  }, 0);

  const discountAmount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return appliedCoupon.discountValue;
  }, [appliedCoupon, cartSubtotal]);

  const deliveryCharge = (city: 'ঢাকা সিটির ভিতরে' | 'ঢাকা সিটির বাইরে' | 'ঢাকার পার্শ্ববর্তী এলাকা') => {
    if (cartSubtotal >= settings.freeDeliveryThreshold && cartSubtotal > 0) {
      return 0;
    }
    if (city === 'ঢাকা সিটির ভিতরে') return settings.insideDhakaDeliveryFee;
    if (city === 'ঢাকার পার্শ্ববর্তী এলাকা') return settings.subDhakaDeliveryFee;
    return settings.outsideDhakaDeliveryFee;
  };

  // Cart Functions
  const addToCart = (product: SareeProduct, quantity = 1, selectedColor?: string) => {
    if (!product || !product.id) return;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item?.product?.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.color }];
    });
    showToast(`"${product.name}" কার্টে যুক্ত হয়েছে!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    if (!productId) return;
    setCart(prev => prev.filter(item => item?.product?.id !== productId));
    showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!productId) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => item?.product?.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('পছন্দের তালিকা থেকে সরানো হয়েছে', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('পছন্দের তালিকায় যুক্ত হয়েছে', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'মেয়াদোত্তীর্ণ বা ভুল কুপন কোড।' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return { 
        success: false, 
        message: `এই কুপনটি পেতে সর্বনিম্ন ৳ ${found.minOrderValue.toLocaleString('bn-BD')} টাকার অর্ডার করতে হবে।` 
      };
    }
    setAppliedCoupon(found);
    showToast(`কুপন "${found.code}" সফলভাবে প্রয়োগ করা হয়েছে!`, 'success');
    return { success: true, message: 'কুপন সফলভাবে যুক্ত হয়েছে!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('কুপন ডিসকাউন্ট সরানো হয়েছে', 'info');
  };

  // Place Order
  const placeOrder = async (
    customer: CustomerDetails, 
    paymentMethod: PaymentMethod, 
    trxId?: string
  ): Promise<Order> => {
    const charge = deliveryCharge(customer.city);
    const finalTotal = Math.max(0, cartSubtotal - discountAmount + charge);
    const trackingNumber = 'ASH-' + Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    let paymentStatus: Order['paymentStatus'] = 'বকেয়া (Unpaid)';
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
      paymentStatus = trxId ? 'যাচাই চলছে (Verifying)' : 'বকেয়া (Unpaid)';
    }

    const newOrder: Order = {
      id: orderId,
      trackingCode: trackingNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      deliveryCharge: charge,
      total: finalTotal,
      paymentMethod,
      paymentStatus,
      transactionId: trxId,
      status: 'পেন্ডিং',
      adminNotes: ''
    };

    // Update Product Stock
    setProducts(prev => 
      prev.map(prod => {
        const cartItem = cart.find(ci => ci.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stockCount - cartItem.quantity);
          return {
            ...prod,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    showToast(`অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! ট্র্যাকিং কোড: ${newOrder.trackingCode}`, 'success');

    return newOrder;
  };

  // Manual COD / POS Order creation by Admin
  const createManualOrder = (orderData: {
    customer: CustomerDetails;
    items: CartItem[];
    discountAmount?: number;
    deliveryCharge: number;
    paymentMethod: PaymentMethod;
    advancePaid?: number;
    courierName?: CourierPartner;
    courierTrackingCode?: string;
    adminNotes?: string;
  }): Order => {
    const trackingNumber = 'ASH-' + Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = orderData.discountAmount || 0;
    const total = Math.max(0, subtotal - discount + orderData.deliveryCharge);
    const advance = orderData.advancePaid || 0;
    const codDue = Math.max(0, total - advance);

    const newOrder: Order = {
      id: orderId,
      trackingCode: trackingNumber,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items,
      subtotal,
      discountAmount: discount,
      deliveryCharge: orderData.deliveryCharge,
      total,
      advancePaid: advance,
      codAmount: codDue,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: advance >= total ? 'পরিশোধিত (Paid)' : (orderData.paymentMethod === 'cod' ? 'বকেয়া (Unpaid)' : 'যাচাই চলছে (Verifying)'),
      status: 'কনফার্মড',
      courierName: orderData.courierName,
      courierTrackingCode: orderData.courierTrackingCode,
      adminNotes: orderData.adminNotes || 'অ্যাডমিন প্যানেল থেকে সরাসরি তৈরি করা ক্যাশ অন ডেলিভারি অর্ডার'
    };

    // Deduct stock
    setProducts(prev => 
      prev.map(prod => {
        const matchingItem = orderData.items.find(ci => ci.product.id === prod.id);
        if (matchingItem) {
          const newStock = Math.max(0, prod.stockCount - matchingItem.quantity);
          return {
            ...prod,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    showToast(`নতুন COD অর্ডার #${newOrder.id} (${newOrder.trackingCode}) তৈরি হয়েছে!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders(prev => 
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            adminNotes: notes !== undefined ? notes : ord.adminNotes,
            paymentStatus: status === 'ডেলিভার্ড' ? 'পরিশোধিত (Paid)' : ord.paymentStatus
          };
        }
        return ord;
      })
    );
    showToast(`অর্ডার #${orderId} এর স্ট্যাটাস '${status}' এ পরিবর্তিত হয়েছে`, 'success');
  };

  const updateOrderCourier = (orderId: string, courierName: CourierPartner, courierTrackingCode: string) => {
    setOrders(prev => 
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            courierName,
            courierTrackingCode,
            status: ord.status === 'পেন্ডিং' || ord.status === 'কনফার্মড' ? 'ডেলিভারিতে আছে' : ord.status
          };
        }
        return ord;
      })
    );
    showToast(`কুরিয়ার অ্যাসাইন করা হয়েছে: ${courierName} (${courierTrackingCode})`, 'success');
  };

  const bulkUpdateOrderStatus = (orderIds: string[], status: OrderStatus) => {
    setOrders(prev => 
      prev.map(ord => {
        if (orderIds.includes(ord.id)) {
          return {
            ...ord,
            status,
            paymentStatus: status === 'ডেলিভার্ড' ? 'পরিশোধিত (Paid)' : ord.paymentStatus
          };
        }
        return ord;
      })
    );
    showToast(`${orderIds.length} টি অর্ডারের স্ট্যাটাস '${status}' এ আপডেট করা হয়েছে`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`অর্ডার #${orderId} মুছে ফেলা হয়েছে`, 'info');
  };

  // Product Admin Operations
  const addProduct = (prodData: Omit<SareeProduct, 'id'>) => {
    const newId = 'saree-' + Date.now().toString().slice(-4);
    const newProduct: SareeProduct = {
      ...prodData,
      id: newId
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`নতুন শাড়ি "${newProduct.name}" যুক্ত হয়েছে!`, 'success');
  };

  const updateProduct = (updated: SareeProduct) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`"${updated.name}" এর তথ্য আপডেট করা হয়েছে`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('শাড়িটি ক্যাটালগ থেকে মুছে ফেলা হয়েছে', 'info');
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('দোকানের সেটিংস সফলভাবে আপডেট হয়েছে', 'success');
  };

  const updateSEOSettings = (newSeo: SEOSettings) => {
    setSeoSettings(newSeo);
    showToast('সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) সেটিংস সফলভাবে সংরক্ষণ হয়েছে', 'success');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: 'c-' + Date.now().toString().slice(-4),
      code: couponData.code.trim().toUpperCase()
    };
    setCoupons(prev => [...prev, newCoupon]);
    showToast(`নতুন কুপন "${newCoupon.code}" তৈরি হয়েছে!`, 'success');
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(prev => 
      prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c)
    );
    showToast('কুপন স্ট্যাটাস পরিবর্তিত হয়েছে', 'info');
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    showToast('কুপনটি মুছে ফেলা হয়েছে', 'info');
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setWishlist([]);
    showToast('সকল ডেটা সফলভাবে ডিফল্ট ডেমোতে রিসেট করা হয়েছে', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
        products,
        cart,
        wishlist,
        orders,
        coupons,
        settings,
        seoSettings,
        appliedCoupon,
        activeView,
        currentPage,
        currentCategory,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        isOrderSuccessOpen,
        isTrackOrderOpen,
        isCareGuideOpen,
        lastPlacedOrder,
        toasts,
        reviews,

        setActiveView,
        setCurrentPage,
        setCurrentCategory,
        setSelectedProduct,
        navigateTo,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsOrderSuccessOpen,
        setIsTrackOrderOpen,
        setIsCareGuideOpen,

        addReview,
        getProductReviews,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,

        applyCoupon,
        removeCoupon,

        cartSubtotal,
        discountAmount,
        deliveryCharge,
        placeOrder,
        createManualOrder,
        updateOrderStatus,
        updateOrderCourier,
        bulkUpdateOrderStatus,
        deleteOrder,

        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        updateSEOSettings,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        resetToDemoData,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
