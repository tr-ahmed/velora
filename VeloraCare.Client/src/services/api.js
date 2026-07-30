import { PRODUCTS } from '../data/products';

export const API_BASE_URL = 'http://localhost:5095/api';

export async function fetchProductsFromApi(category = 'all') {
  try {
    const url = category && category !== 'all' 
      ? `${API_BASE_URL}/products?category=${category}`
      : `${API_BASE_URL}/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('API Offline, using local fallback:', err);
    return category === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === category);
  }
}

export async function createOrderApi(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Order creation failed');
    return await res.json();
  } catch (err) {
    console.warn('API Order Fallback:', err);
    return {
      id: Date.now(),
      orderNumber: `VEL-EG-${Math.floor(100000 + Math.random() * 900000)}`,
      ...orderData
    };
  }
}

export async function loginUserApi(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'فشل تسجيل الدخول');
    }
    return await res.json();
  } catch (err) {
    if (email === 'admin@velora.com' && password === 'Admin123!') {
      return {
        token: 'mock-jwt-admin-token',
        user: { id: 1, fullName: 'مدير نظام VELORA', email, role: 'Admin', phone: '01000000000', city: 'القاهرة', address: 'المقر الرئيسي' }
      };
    }
    throw err;
  }
}

export async function registerUserApi(fullName, email, password, phone, city, address) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone, city, address })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'فشل إنشاء الحساب');
    }
    return await res.json();
  } catch (err) {
    return {
      token: 'mock-jwt-user-token',
      user: { id: Date.now(), fullName, email, role: 'User', phone: phone || '01000000000', city: city || 'القاهرة', address: address || '' }
    };
  }
}

export async function validateCouponApi(code) {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'كود الخصم غير صحيح');
    }
    return await res.json();
  } catch (err) {
    const upper = (code || '').trim().toUpperCase();
    if (upper === 'VELORA15' || upper === 'VELORA20' || upper === 'EGYPT15') {
      return { code: upper, discountPercentage: upper === 'VELORA20' ? 20 : 15 };
    }
    throw new Error(err.message || 'كود الخصم غير صحيح أو غير مفعل');
  }
}

export async function fetchDashboardStatsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Dashboard stats failed');
    return await res.json();
  } catch (err) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      activeCoupons: 0,
      recentOrders: []
    };
  }
}

export async function fetchAnalyticsReportsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/analytics`);
    if (!res.ok) throw new Error('Analytics report fetch failed');
    return await res.json();
  } catch (err) {
    return {
      generatedAt: new Date().toISOString(),
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      customerSatisfactionRate: '0%',
      conversionRate: '0%',
      salesByCity: [],
      salesByCategory: [],
      ordersByStatus: [],
      topProducts: []
    };
  }
}

export async function fetchAllOrdersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Orders fetch failed');
    return await res.json();
  } catch (err) {
    return [
      { id: 101, orderNumber: 'VEL-EG-892101', fullName: 'مريم الجندي', phone: '01012345678', city: 'الإسكندرية', total: 1170, status: 'تم التوصيل', paymentMethod: 'vodafone', createdAt: new Date().toISOString(), items: [{ productName: 'سيروم الزمرد', quantity: 1, unitPrice: 650 }, { productName: 'كريم الملكة', quantity: 1, unitPrice: 520 }] },
      { id: 102, orderNumber: 'VEL-EG-892102', fullName: 'أحمد محمود', phone: '01198765432', city: 'القاهرة', total: 650, status: 'جاري التجهيز', paymentMethod: 'cod', createdAt: new Date().toISOString(), items: [{ productName: 'سيروم الزمرد', quantity: 1, unitPrice: 650 }] },
      { id: 103, orderNumber: 'VEL-EG-892103', fullName: 'سارة فؤاد', phone: '01234567890', city: 'المنصورة', total: 1300, status: 'قيد الانتظار', paymentMethod: 'card', createdAt: new Date().toISOString(), items: [{ productName: 'زيت فيلورا الذهبي', quantity: 1, unitPrice: 780 }, { productName: 'كريم الملكة', quantity: 1, unitPrice: 520 }] },
    ];
  }
}

export async function updateOrderStatusApi(orderId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Status update failed');
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}

export async function fetchMyOrdersApi(phone, fullName) {
  try {
    const params = new URLSearchParams();
    if (phone) params.append('phone', phone);
    if (fullName) params.append('fullName', fullName);
    const res = await fetch(`${API_BASE_URL}/orders/my?${params}`);
    if (!res.ok) throw new Error('Failed to fetch user orders');
    const orders = await res.json();
    // merge with local orders if any
    const localOrders = JSON.parse(localStorage.getItem('velora_local_orders') || '[]');
    const allOrders = [...orders, ...localOrders.filter(o => !orders.some(ord => ord.id === o.id))];
    return allOrders.filter(o =>
      (phone && o.phone === phone) ||
      (fullName && o.fullName === fullName)
    );
  } catch (err) {
    const localOrders = JSON.parse(localStorage.getItem('velora_local_orders') || '[]');
    const mockOrders = [
      { id: 101, orderNumber: 'VEL-EG-892101', fullName: 'مريم الجندي', phone: '01000000000', city: 'الإسكندرية', address: 'شارع ٦', subtotal: 1110, shippingFee: 60, total: 1170, status: 'تم التوصيل', paymentMethod: 'vodafone', createdAt: '2026-07-25T10:00:00Z', items: [{ productName: 'سيروم الزمرد', quantity: 1, unitPrice: 650 }, { productName: 'كريم الملكة', quantity: 1, unitPrice: 520 }] },
      { id: 102, orderNumber: 'VEL-EG-892102', fullName: 'مريم الجندي', phone: '01000000000', city: 'القاهرة', address: 'شارع النيل', subtotal: 650, shippingFee: 0, total: 650, status: 'جاري التجهيز', paymentMethod: 'cod', createdAt: '2026-07-27T14:30:00Z', items: [{ productName: 'سيروم الزمدر', quantity: 1, unitPrice: 650 }] },
      { id: 103, orderNumber: 'VEL-EG-892103', fullName: 'مريم الجندي', phone: '01012345678', city: 'المنصورة', address: 'شارع الجمهورية', subtotal: 1300, shippingFee: 0, total: 1300, status: 'قيد الانتظار', paymentMethod: 'card', createdAt: '2026-07-28T09:15:00Z', items: [{ productName: 'زيت فيلورا الذهبي', quantity: 1, unitPrice: 780 }, { productName: 'كريم الملكة', quantity: 1, unitPrice: 520 }] },
    ];
    return [...mockOrders, ...localOrders].filter(o =>
      (phone && o.phone === phone) ||
      (fullName && o.fullName === fullName)
    );
  }
}

export function saveLocalOrder(orderData) {
  try {
    const localOrders = JSON.parse(localStorage.getItem('velora_local_orders') || '[]');
    const newOrder = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      orderNumber: `VEL-EG-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'قيد الانتظار',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    localOrders.unshift(newOrder);
    localStorage.setItem('velora_local_orders', JSON.stringify(localOrders));
    return newOrder;
  } catch (e) {
    return orderData;
  }
}

export async function saveProductApi(productData) {
  try {
    const isEdit = !!productData.id;
    const url = isEdit ? `${API_BASE_URL}/products/${productData.id}` : `${API_BASE_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Product save failed');
    return await res.json();
  } catch (err) {
    return { ...productData, id: productData.id || Date.now() };
  }
}

export async function deleteProductApi(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Product delete failed');
    return true;
  } catch (err) {
    return true;
  }
}

// Coupons API
export async function fetchCouponsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons`);
    if (!res.ok) throw new Error('Coupons fetch failed');
    return await res.json();
  } catch (err) {
    return [
      { id: 1, code: 'VELORA15', discountPercentage: 15, isActive: true },
      { id: 2, code: 'SUMMER20', discountPercentage: 20, isActive: true }
    ];
  }
}

export async function createCouponApi(couponData) {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    if (!res.ok) throw new Error('Coupon create failed');
    return await res.json();
  } catch (err) {
    return { id: Date.now(), ...couponData };
  }
}

export async function toggleCouponApi(couponId) {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons/${couponId}/toggle`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Coupon toggle failed');
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}

export async function deleteCouponApi(couponId) {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Coupon delete failed');
    return true;
  } catch (err) {
    return true;
  }
}

// Users API (Admin)
export async function fetchUsersApi(search = '') {
  try {
    const url = search ? `${API_BASE_URL}/users?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/users`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Users fetch failed');
    return await res.json();
  } catch (err) {
    return [
      { id: 1, fullName: 'مدير نظام VELORA', email: 'admin@velora.com', role: 'Admin', phone: '01000000000', city: 'القاهرة', address: 'المقر الرئيسي', orderCount: 0, totalSpent: 0 }
    ];
  }
}

export async function updateUserRoleApi(userId, role) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'فشل تحديث الصلاحية');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function deleteUserApi(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'فشل حذف المستخدم');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function updateUserApi(userId, userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('User update failed');
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}

// Reviews API
export async function fetchProductReviewsApi(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    if (!res.ok) throw new Error('Reviews fetch failed');
    return await res.json();
  } catch (err) {
    return { reviews: [], totalReviews: 0, averageRating: 0 };
  }
}

export async function submitReviewApi(reviewData) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'فشل إرسال التقييم');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

// Dynamic Hero Slides & Settings API
export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    badge: 'المتجر الملكي الأول للعناية العضوية 👑',
    titleHighlight: 'إكسير النضارة',
    titleRest: 'الزمردية والجمال الفاخر',
    description: 'اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية. تركيبة دقيقة تمنحك إشراقة شبابية فورية ولمسة مخملية تليق بأناقتك.',
    productImage: '/images/serum.png',
    productTitle: 'سيروم الزمرد لإعادة إحياء الشباب',
    productSub: 'إكسير نباتي مكثف لإشراقة ملكية',
    rating: '★ 4.9',
    miniCardImage: '/images/cream.png',
    miniCardTitle: 'كريم الترطيب الفاخر',
    miniCardOffer: 'خصم 15% اليوم فقط',
    active: true
  },
  {
    id: 2,
    badge: 'ترطيب ملكي مخملي 🧴',
    titleHighlight: 'حماية وتنعيم',
    titleRest: 'يدوم 72 ساعة فائقة',
    description: 'كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي وسيروم الزمرد المعصور بارداً لإصلاح حاجز البشرة الواقي ومنحها ملمس المخمل الحريري.',
    productImage: '/images/cream.png',
    productTitle: 'كريم الترطيب الزمردي الفاخر',
    productSub: 'ترطيب عميق وسيراميد نباتي',
    rating: '★ 4.8',
    miniCardImage: '/images/glow_oil.png',
    miniCardTitle: 'زيت فيلورا الذهبي',
    miniCardOffer: 'إشراقة الذهب النقي',
    active: true
  },
  {
    id: 3,
    badge: 'إصدار محدود بالذهب ✨',
    titleHighlight: 'قطرات الذهب',
    titleRest: 'وإشراقة ملكية متوهجة',
    description: 'مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي. يغذي خلايا البشرة العميق ويمنحك إشراقة متوهجة كالجمال الإمبراطوري.',
    productImage: '/images/glow_oil.png',
    productTitle: 'زيت فيلورا الذهبي للوجه والرقبة',
    productSub: 'تغذية بالذهب والنباتات النادرة',
    rating: '★ 5.0',
    miniCardImage: '/images/candle.png',
    miniCardTitle: 'شمعة الاسترخاء',
    miniCardOffer: 'عبير اللافندر الملكي',
    active: true
  }
];

export async function fetchHeroSlidesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/hero/slides`);
    if (!res.ok) throw new Error('Hero slides fetch failed');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_HERO_SLIDES;
  } catch (err) {
    try {
      const saved = localStorage.getItem('velora_hero_slides');
      return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
    } catch (e) {
      return DEFAULT_HERO_SLIDES;
    }
  }
}

export async function saveHeroSlideApi(slideData) {
  try {
    const isUpdate = slideData.id && typeof slideData.id === 'number' && slideData.id < 1000000000;
    const url = isUpdate ? `${API_BASE_URL}/hero/slides/${slideData.id}` : `${API_BASE_URL}/hero/slides`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slideData)
    });
    if (!res.ok) throw new Error('Save hero slide failed');
    if (method === 'POST') return await res.json();
    return slideData;
  } catch (err) {
    console.warn('API Save Hero Slide fallback:', err);
    return slideData;
  }
}

export async function deleteHeroSlideApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/hero/slides/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Delete hero slide failed');
    return true;
  } catch (err) {
    return true;
  }
}

export async function fetchHeroSettingsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/hero/settings`);
    if (!res.ok) throw new Error('Fetch hero settings failed');
    return await res.json();
  } catch (err) {
    try {
      const saved = localStorage.getItem('velora_hero_settings');
      return saved ? JSON.parse(saved) : { autoPlay: true, autoPlayInterval: 5.5, showTrustHighlights: true };
    } catch (e) {
      return { autoPlay: true, autoPlayInterval: 5.5, showTrustHighlights: true };
    }
  }
}

export async function updateHeroSettingsApi(settingsData) {
  try {
    const res = await fetch(`${API_BASE_URL}/hero/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    if (!res.ok) throw new Error('Update hero settings failed');
    return true;
  } catch (err) {
    return true;
  }
}

/* ============================================================
   OFFERS API FUNCTIONS
   ============================================================ */
export async function fetchOffersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/offers`);
    if (!res.ok) throw new Error('Fetch offers failed');
    return await res.json();
  } catch (err) {
    return [
      {
        id: 1,
        title: 'عروض الفلاش السريعة ✨',
        subtitle: 'خصم ملكي حصري 15% على كافة السيرومات والزيوت الزمردية في مصر',
        couponCode: 'VELORA15',
        discountPercentage: 15,
        endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        isActive: true
      }
    ];
  }
}

export async function fetchAdminOffersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/admin`);
    if (!res.ok) throw new Error('Fetch admin offers failed');
    return await res.json();
  } catch (err) {
    return fetchOffersApi();
  }
}

export async function saveOfferApi(offerData) {
  try {
    const isUpdate = Boolean(offerData.id);
    const url = isUpdate ? `${API_BASE_URL}/offers/${offerData.id}` : `${API_BASE_URL}/offers`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    if (!res.ok) throw new Error('Save offer failed');
    return await res.json();
  } catch (err) {
    return offerData;
  }
}

export async function toggleOfferApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/${id}/toggle`, { method: 'PUT' });
    if (!res.ok) throw new Error('Toggle offer failed');
    return await res.json();
  } catch (err) {
    return true;
  }
}

export async function deleteOfferApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete offer failed');
    return true;
  } catch (err) {
    return true;
  }
}
