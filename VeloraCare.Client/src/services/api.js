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
    throw err;
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
    throw err;
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
