export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5095/api';

export async function fetchProductsFromApi(category = 'all') {
  const url = category && category !== 'all'
    ? `${API_BASE_URL}/products?category=${category}`
    : `${API_BASE_URL}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API fetch failed');
  return await res.json();
}

export async function createOrderApi(orderData) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Order creation failed');
  return await res.json();
}

export async function trackOrderApi(orderNumber, phone) {
  const res = await fetch(`${API_BASE_URL}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('الطلب غير موجود أو البيانات غير متطابقة');
    throw new Error('حدث خطأ أثناء البحث عن الطلب');
  }
  return await res.json();
}

export async function loginUserApi(email, password) {
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
}

export async function registerUserApi(fullName, email, password, phone, city, address) {
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
}

export async function validateCouponApi(code) {
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
}

export async function fetchDashboardStatsApi() {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error('Dashboard stats failed');
  return await res.json();
}

export async function fetchAnalyticsReportsApi() {
  const res = await fetch(`${API_BASE_URL}/dashboard/analytics`);
  if (!res.ok) throw new Error('Analytics report fetch failed');
  return await res.json();
}

export async function fetchAllOrdersApi() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  if (!res.ok) throw new Error('Orders fetch failed');
  return await res.json();
}

export async function updateOrderStatusApi(orderId, status) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Status update failed');
  return await res.json();
}

export async function fetchMyOrdersApi(phone, fullName) {
  const params = new URLSearchParams();
  if (phone) params.append('phone', phone);
  if (fullName) params.append('fullName', fullName);
  const res = await fetch(`${API_BASE_URL}/orders/my?${params}`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return await res.json();
}

export async function saveProductApi(productData) {
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
}

export async function deleteProductApi(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Product delete failed');
  return true;
}

// Coupons API
export async function fetchCouponsApi() {
  const res = await fetch(`${API_BASE_URL}/coupons`);
  if (!res.ok) throw new Error('Coupons fetch failed');
  return await res.json();
}

export async function createCouponApi(couponData) {
  const res = await fetch(`${API_BASE_URL}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(couponData)
  });
  if (!res.ok) throw new Error('Coupon create failed');
  return await res.json();
}

export async function toggleCouponApi(couponId) {
  const res = await fetch(`${API_BASE_URL}/coupons/${couponId}/toggle`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Coupon toggle failed');
  return await res.json();
}

export async function deleteCouponApi(couponId) {
  const res = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Coupon delete failed');
  return true;
}

// Categories API (Admin)
export async function fetchCategoriesApi() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Categories fetch failed');
  return await res.json();
}

export async function saveCategoryApi(categoryData) {
  const isEdit = !!categoryData.id;
  const url = isEdit ? `${API_BASE_URL}/categories/${categoryData.id}` : `${API_BASE_URL}/categories`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw new Error('Category save failed');
  return await res.json();
}

export async function deleteCategoryApi(categoryId) {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Category delete failed');
  return true;
}

// Users API (Admin)
export async function fetchUsersApi(search = '') {
  const url = search ? `${API_BASE_URL}/users?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/users`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Users fetch failed');
  return await res.json();
}

export async function updateUserRoleApi(userId, role) {
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
}

export async function deleteUserApi(userId) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'فشل حذف المستخدم');
  }
  return await res.json();
}

export async function updateUserApi(userId, userData) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw new Error('User update failed');
  return await res.json();
}

// Reviews API
export async function fetchProductReviewsApi(productId) {
  const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
  if (!res.ok) throw new Error('Reviews fetch failed');
  return await res.json();
}

export async function submitReviewApi(reviewData) {
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
}

// Dynamic Hero Slides & Settings API
export async function fetchHeroSlidesApi() {
  const res = await fetch(`${API_BASE_URL}/hero/slides`);
  if (!res.ok) throw new Error('Hero slides fetch failed');
  return await res.json();
}

export async function saveHeroSlideApi(slideData) {
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
}

export async function deleteHeroSlideApi(id) {
  const res = await fetch(`${API_BASE_URL}/hero/slides/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Delete hero slide failed');
  return true;
}

export async function fetchHeroSettingsApi() {
  const res = await fetch(`${API_BASE_URL}/hero/settings`);
  if (!res.ok) throw new Error('Fetch hero settings failed');
  return await res.json();
}

export async function updateHeroSettingsApi(settingsData) {
  const res = await fetch(`${API_BASE_URL}/hero/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData)
  });
  if (!res.ok) throw new Error('Update hero settings failed');
  return true;
}

/* ============================================================
   OFFERS API FUNCTIONS
   ============================================================ */
export async function fetchOffersApi() {
  const res = await fetch(`${API_BASE_URL}/offers`);
  if (!res.ok) throw new Error('Fetch offers failed');
  return await res.json();
}

export async function fetchAdminOffersApi() {
  const res = await fetch(`${API_BASE_URL}/offers/admin`);
  if (!res.ok) throw new Error('Fetch admin offers failed');
  return await res.json();
}

export async function saveOfferApi(offerData) {
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
}

export async function toggleOfferApi(id) {
  const res = await fetch(`${API_BASE_URL}/offers/${id}/toggle`, { method: 'PUT' });
  if (!res.ok) throw new Error('Toggle offer failed');
  return await res.json();
}

export async function deleteOfferApi(id) {
  const res = await fetch(`${API_BASE_URL}/offers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete offer failed');
  return true;
}
