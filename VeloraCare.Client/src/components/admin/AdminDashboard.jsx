import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, ShoppingBag, Package, Users, User, Tag, Plus, Edit, Trash2, 
  CheckCircle, Clock, Truck, RefreshCw, LogOut, Sparkles, Filter, Menu, X, ArrowLeft,
  BarChart3, PieChart, TrendingUp, Download, MapPin, Layers, Printer, ChevronLeft,
  Search, FileSpreadsheet, Calendar, CreditCard, AlertTriangle, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Store, ArrowUp, ArrowDown
} from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import CouponFormModal from './CouponFormModal';
import HeroSlideFormModal from './HeroSlideFormModal';
import OfferFormModal from './OfferFormModal';
import VeloraLogo from '../VeloraLogo';
import Pagination from '../Pagination';
import { 
  fetchDashboardStatsApi, fetchAnalyticsReportsApi, fetchAllOrdersApi, updateOrderStatusApi, 
  fetchProductsFromApi, saveProductApi, deleteProductApi,
  fetchCouponsApi, createCouponApi, toggleCouponApi, deleteCouponApi,
  saveHeroSlideApi, deleteHeroSlideApi, updateHeroSettingsApi,
  fetchUsersApi, updateUserRoleApi, deleteUserApi, updateUserApi,
  fetchAdminOffersApi, saveOfferApi, toggleOfferApi, deleteOfferApi
} from '../../services/api';
import { EGYPT_GOVERNORATES } from '../../data/governorates';

// UTF-8 BOM Excel Export Helper for perfect Arabic support in Microsoft Excel
const exportToExcel = (filename, headers, rows) => {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = '\uFEFF' + [
    headers.map(h => escapeCsv(h)).join(','),
    ...rows.map(row => row.map(val => escapeCsv(val)).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function AdminDashboard({ 
  user, 
  onLogout, 
  onGoToStore,
  heroSlides = [],
  setHeroSlides,
  heroSettings = {},
  setHeroSettings
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hero' | 'orders' | 'products' | 'customers' | 'coupons'
  const [mobileAdminMenuOpen, setMobileAdminMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    activeCoupons: 0,
    recentOrders: []
  });
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderCityFilter, setOrderCityFilter] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 8;

  const [productsPage, setProductsPage] = useState(1);
  const productsPerPage = 8;

  const [customersPage, setCustomersPage] = useState(1);
  const customersPerPage = 8;

  // Users Management State
  const [users, setUsers] = useState([]);
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const usersPerPage = 10;

  // Reset pagination on filter changes
  useEffect(() => { setOrdersPage(1); }, [orderSearchQuery, orderStatusFilter, orderPaymentFilter, orderCityFilter]);
  useEffect(() => { setProductsPage(1); }, [productSearchQuery, productCategoryFilter, productStockFilter]);
  useEffect(() => { setCustomersPage(1); }, [customerSearchQuery]);
  useEffect(() => { setUsersPage(1); }, [usersSearchQuery]);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isHeroSlideModalOpen, setIsHeroSlideModalOpen] = useState(false);
  
  // Offers State
  const [offers, setOffers] = useState([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);

  // Hero Slide Action Handlers linked to C# API
  const handleSaveHeroSlide = async (slideData) => {
    if (!setHeroSlides) return;
    try {
      const savedSlide = await saveHeroSlideApi(slideData);
      if (slideData.id) {
        setHeroSlides(prev => prev.map(s => s.id === slideData.id ? savedSlide : s));
      } else {
        setHeroSlides(prev => [...prev, savedSlide]);
      }
    } catch (e) {
      console.warn('Fallback save hero slide:', e);
      if (slideData.id) {
        setHeroSlides(prev => prev.map(s => s.id === slideData.id ? slideData : s));
      } else {
        setHeroSlides(prev => [...prev, { ...slideData, id: Date.now() }]);
      }
    }
  };

  const handleDeleteHeroSlide = async (id) => {
    if (!setHeroSlides) return;
    if (window.confirm('هل أنت متأكد من حذف هذا السلايد من قسم الهيرو؟')) {
      await deleteHeroSlideApi(id);
      setHeroSlides(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleSlideActive = async (id) => {
    if (!setHeroSlides) return;
    const targetSlide = heroSlides.find(s => s.id === id);
    if (!targetSlide) return;
    const updated = { ...targetSlide, active: !targetSlide.active };
    setHeroSlides(prev => prev.map(s => s.id === id ? updated : s));
    await saveHeroSlideApi(updated);
  };

  // Offers Action Handlers
  const handleSaveOffer = async (offerData) => {
    const saved = await saveOfferApi(offerData);
    if (offerData.id) {
      setOffers(prev => prev.map(o => o.id === offerData.id ? saved : o));
    } else {
      setOffers(prev => [saved, ...prev]);
    }
  };

  const handleToggleOfferActive = async (id) => {
    await toggleOfferApi(id);
    setOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض بالكامل؟')) return;
    await deleteOfferApi(id);
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const handleUpdateHeroSettings = async (updater) => {
    if (!setHeroSettings) return;
    setHeroSettings(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      updateHeroSettingsApi(updated);
      return updated;
    });
  };

  const handleMoveSlide = (index, direction) => {
    if (!setHeroSlides) return;
    const newSlides = [...heroSlides];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    setHeroSlides(newSlides);
  };
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, productsRes, ordersRes, couponsRes, usersRes, offersRes] = await Promise.all([
        fetchDashboardStatsApi(),
        fetchAnalyticsReportsApi(),
        fetchProductsFromApi('all'),
        fetchAllOrdersApi(),
        fetchCouponsApi(),
        fetchUsersApi(),
        fetchAdminOffersApi()
      ]);
      setStats(statsRes || { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, activeCoupons: 0, recentOrders: [] });
      setAnalytics(analyticsRes || { generatedAt: new Date().toISOString(), totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, customerSatisfactionRate: '0%', conversionRate: '0%', salesByCity: [], salesByCategory: [], ordersByStatus: [], topProducts: [] });
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setCoupons(Array.isArray(couponsRes) ? couponsRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setOffers(Array.isArray(offersRes) ? offersRes : []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatusApi(orderId, newStatus);
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  const handleSaveProduct = async (productData) => {
    const saved = await saveProductApi(productData);
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
    } else {
      setProducts(prev => [saved, ...prev]);
    }
    loadData();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) {
      await deleteProductApi(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleSaveCoupon = async (couponData) => {
    const created = await createCouponApi(couponData);
    setCoupons(prev => [created, ...prev]);
  };

  const handleToggleCoupon = async (couponId) => {
    await toggleCouponApi(couponId);
    setCoupons(prev =>
      prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c)
    );
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا الكود؟')) {
      await deleteCouponApi(couponId);
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Status badge color mapping
  const statusColors = {
    'قيد الانتظار': 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs hover:bg-amber-100',
    'جاري التجهيز': 'bg-sky-50 text-sky-900 border-sky-300 shadow-xs hover:bg-sky-100',
    'تم الشحن': 'bg-purple-50 text-purple-900 border-purple-300 shadow-xs hover:bg-purple-100',
    'تم التوصيل': 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-xs hover:bg-emerald-100',
    'ملغي': 'bg-rose-50 text-rose-900 border-rose-300 shadow-xs hover:bg-rose-100'
  };

  const paymentLabels = {
    vodafone: 'فودافون كاش',
    instapay: 'انستا باي (InstaPay)',
    cod: 'الدفع عند الاستلام',
    card: 'فيزا / ميزة'
  };

  // Filtered Orders + Paginated Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = 
        !orderSearchQuery ||
        o.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.fullName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.phone?.includes(orderSearchQuery) ||
        o.city?.toLowerCase().includes(orderSearchQuery.toLowerCase());

      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchPayment = orderPaymentFilter === 'all' || o.paymentMethod === orderPaymentFilter;
      const matchCity = orderCityFilter === 'all' || o.city === orderCityFilter;

      return matchSearch && matchStatus && matchPayment && matchCity;
    });
  }, [orders, orderSearchQuery, orderStatusFilter, orderPaymentFilter, orderCityFilter]);

  const ordersTotalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);
  }, [filteredOrders, ordersPage, ordersPerPage]);

  // Filtered Products + Paginated Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = 
        !productSearchQuery ||
        p.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(productSearchQuery.toLowerCase());

      const matchCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      
      let matchStock = true;
      if (productStockFilter === 'low') matchStock = (p.stock || 50) < 15;
      else if (productStockFilter === 'out') matchStock = (p.stock || 0) === 0;
      else if (productStockFilter === 'available') matchStock = (p.stock || 50) >= 15;

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, productSearchQuery, productCategoryFilter, productStockFilter]);

  const productsTotalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((productsPage - 1) * productsPerPage, productsPage * productsPerPage);
  }, [filteredProducts, productsPage, productsPerPage]);

  // Dynamic Customer Database extracted from Orders & Users
  const customerDatabase = useMemo(() => {
    const map = new Map();
    (orders || []).forEach(o => {
      const key = o.phone || o.fullName;
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          name: o.fullName || 'عميلة فيلورا',
          phone: o.phone || 'غير مسجل',
          city: o.city || 'القاهرة',
          address: o.address || 'العنوان الرئيسي',
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: o.createdAt || new Date().toISOString()
        });
      }
      const cust = map.get(key);
      cust.totalSpent += (o.total || 0);
      cust.ordersCount += 1;
      if (o.createdAt) {
        try {
          if (!cust.lastOrderDate || new Date(o.createdAt) > new Date(cust.lastOrderDate)) {
            cust.lastOrderDate = o.createdAt;
          }
        } catch (e) {}
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const formatDateSafe = (dateVal) => {
    if (!dateVal) return 'حديثاً';
    try {
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? 'حديثاً' : d.toLocaleDateString('ar-EG');
    } catch (e) {
      return 'حديثاً';
    }
  };

  const filteredCustomers = useMemo(() => {
    return customerDatabase.filter(c => 
      !customerSearchQuery ||
      c.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.phone?.includes(customerSearchQuery) ||
      c.city?.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );
  }, [customerDatabase, customerSearchQuery]);

  const customersTotalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice((customersPage - 1) * customersPerPage, customersPage * customersPerPage);
  }, [filteredCustomers, customersPage, customersPerPage]);

  // Users Management computed data
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      !usersSearchQuery ||
      u.fullName?.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(usersSearchQuery.toLowerCase()) ||
      u.phone?.includes(usersSearchQuery) ||
      u.city?.toLowerCase().includes(usersSearchQuery.toLowerCase())
    );
  }, [users, usersSearchQuery]);

  const usersTotalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage);
  }, [filteredUsers, usersPage, usersPerPage]);

  // Unique Cities list for dropdowns (All 27 Egyptian Governorates)
  const uniqueCities = useMemo(() => {
    const citiesSet = new Set([...EGYPT_GOVERNORATES, ...orders.map(o => o.city).filter(Boolean)]);
    return Array.from(citiesSet);
  }, [orders]);

  // Overall Financial & Net Profit Metrics
  const financialMetrics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCost = orders.reduce((sum, o) => {
      if (o.items && Array.isArray(o.items)) {
        return sum + o.items.reduce((itemSum, item) => {
          const matchingProduct = products.find(p => p.id === item.productId || p.name === item.productName);
          const cost = matchingProduct?.costPrice || Math.round((item.unitPrice || 650) * 0.45);
          return itemSum + (cost * (item.quantity || 1));
        }, 0);
      }
      return sum + Math.round((o.total || 0) * 0.42);
    }, 0);

    const netProfit = totalRev - totalCost;
    const marginPct = totalRev > 0 ? Math.round((netProfit / totalRev) * 100) : 58;

    return {
      totalRev,
      totalCost,
      netProfit,
      marginPct
    };
  }, [orders, products]);

  // Top Most Profitable Products List
  const topProfitableProducts = useMemo(() => {
    return [...products]
      .map(p => {
        const cost = p.costPrice || Math.round(p.price * 0.45);
        const unitProfit = p.price - cost;
        const marginPct = p.price > 0 ? Math.round((unitProfit / p.price) * 100) : 0;
        const estTotalProfit = unitProfit * Math.max(12, 100 - (p.stock || 50));
        return {
          ...p,
          cost,
          unitProfit,
          marginPct,
          estTotalProfit
        };
      })
      .sort((a, b) => b.unitProfit - a.unitProfit);
  }, [products]);

  // Export Orders to Excel Function
  const handleExportOrdersExcel = () => {
    const headers = ['رقم الطلب', 'اسم العميلة', 'رقم الهاتف', 'المحافظة', 'العنوان', 'المجموع الفرعي', 'مصاريف الشحن', 'الإجمالي', 'طريقة الدفع', 'حالة الطلب', 'تاريخ الطلب'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.fullName,
      o.phone,
      o.city,
      o.address,
      o.subtotal || o.total,
      o.shippingFee || 0,
      o.total,
      paymentLabels[o.paymentMethod] || o.paymentMethod,
      o.status,
      new Date(o.createdAt || Date.now()).toLocaleDateString('ar-EG')
    ]);
    exportToExcel('طلبات_فيـلورا_كير', headers, rows);
  };

  // Export Products to Excel Function with Profit Margin Details
  const handleExportProductsExcel = () => {
    const headers = ['المعرف', 'اسم المنتج', 'التصنيف', 'سعر البيع (ج.م)', 'سعر التكلفة (ج.م)', 'صافي ربح القطعة (ج.م)', 'نسبة هامش الربح %', 'الحجم', 'نوع البشرة', 'المخزون', 'التقييم'];
    const rows = filteredProducts.map(p => {
      const cost = p.costPrice || Math.round(p.price * 0.45);
      const unitProfit = p.price - cost;
      const marginPct = p.price > 0 ? Math.round((unitProfit / p.price) * 100) : 0;
      return [
        p.id,
        p.name,
        p.category,
        p.price,
        cost,
        unitProfit,
        `${marginPct}%`,
        p.volume || '50ml',
        p.skinType || 'جميع أنواع البشرة',
        p.stock || 50,
        p.rating || 5
      ];
    });
    exportToExcel('تقرير_أرباح_ومخزون_منتجات_فيلورا', headers, rows);
  };

  // Comprehensive Profit & Financial Report Export
  const handleExportProfitAnalyticsExcel = () => {
    const headers = ['اسم المنتج', 'التصنيف', 'سعر البيع (ج.م)', 'سعر التكلفة (ج.م)', 'صافي ربح القطعة (ج.م)', 'نسبة هامش الربح %', 'المخزون المتاح', 'إجمالي الأرباح الصافية المحققة (ج.م)'];
    const rows = topProfitableProducts.map(p => [
      p.name,
      p.category,
      p.price,
      p.cost,
      p.unitProfit,
      `${p.marginPct}%`,
      p.stock || 50,
      p.estTotalProfit
    ]);
    exportToExcel('تقرير_الأرباح_وهامش_الربح_الشامل_فيلورا', headers, rows);
  };

  // Export Financial Summary to Excel Function
  const handleExportFinancialExcel = () => {
    if (!analytics) return;
    const headers = ['البيان المالية', 'القيمة'];
    const rows = [
      ['المبيعات الإجمالية', `${analytics.totalRevenue} ج.م`],
      ['إجمالي عدد الطلبات', `${analytics.totalOrders} طلب`],
      ['متوسط قيمة الطلب (AOV)', `${analytics.averageOrderValue} ج.م`],
      ['نسبة الرضا والتقييم', analytics.customerSatisfactionRate],
      ['عدد العملاء المتميزين', `${customerDatabase.length} عميل`],
      ['المنتجات الأكثر مبيعاً', analytics.topProducts.map(p => `${p.name} (${p.salesCount} قطعة)`).join(' | ')]
    ];
    exportToExcel('تقرير_المالية_فيـلورا_كير', headers, rows);
  };

  // Export Customers to Excel Function
  const handleExportCustomersExcel = () => {
    const headers = ['اسم العميلة', 'رقم الهاتف', 'المحافظة', 'العنوان', 'عدد الطلبات', 'إجمالي المشتريات (ج.م)', 'آخر طلب'];
    const rows = customerDatabase.map(c => [
      c.name,
      c.phone,
      c.city,
      c.address,
      c.ordersCount,
      c.totalSpent,
      new Date(c.lastOrderDate).toLocaleDateString('ar-EG')
    ]);
    exportToExcel('سجل_العملاء_فيلورا', headers, rows);
  };

  // Merged Nav Items (Combined Overview, Hero Manager & Full Reports)
  const navItems = [
    { id: 'overview', label: 'الرئيسية والتقارير الشاملة 📊', icon: <BarChart3 className="w-4 h-4 text-[#C5A059]" /> },
    { id: 'offers', label: `عروض الفلاش 🔥 (${offers.length})`, icon: <Sparkles className="w-4 h-4 text-[#C5A059]" /> },
    { id: 'hero', label: `إدارة الهيرو والسلايدر 🌟 (${heroSlides.length})`, icon: <Sparkles className="w-4 h-4 text-[#C5A059]" /> },
    { id: 'orders', label: `إدارة الطلبات (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'products', label: `المنتجات والمخزون (${products.length})`, icon: <Package className="w-4 h-4" /> },
    { id: 'customers', label: `سجل العملاء (${customerDatabase.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'users', label: `إدارة المستخدمين (${users.length})`, icon: <User className="w-4 h-4" /> },
    { id: 'coupons', label: `الأكواد والعروض (${coupons.length})`, icon: <Tag className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0D221A] flex flex-col font-sans">
      
      {/* Mobile Sleek Action Bar (Back to Store & Logout) */}
      <div className="sm:hidden sticky top-0 z-40 bg-[#0D221A] text-white px-4 py-2.5 border-b border-[#C5A059]/40 flex items-center justify-between shadow-md print:hidden">
        <button
          onClick={onGoToStore}
          className="px-3.5 py-1.5 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <Store className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>العودة للمتجر 🛍️</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] text-xs font-bold shadow-sm active:scale-95 transition-all group"
          title="تسجيل الخروج"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] text-[#0D221A] flex items-center justify-center font-bold">
            <User className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span className="text-white group-hover:text-[#EAD096]">خروج</span>
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>

      {/* Top Luxury Merged Navbar */}
      <header className="hidden sm:flex bg-[#0D221A] text-white px-4 sm:px-6 py-3 border-b border-[#C5A059]/40 items-center justify-between shadow-lg sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileAdminMenuOpen(!mobileAdminMenuOpen)}
            className="p-2 text-[#C5A059] bg-[#143529] rounded-xl border border-[#C5A059]/30 lg:hidden"
          >
            {mobileAdminMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2.5">
            <VeloraLogo size="sm" showText={false} />
            <div>
              <h1 className="text-sm sm:text-lg font-bold font-serif text-[#EAD096] flex items-center gap-2">
                لوحة إدارة VELORA CARE
                <span className="bg-[#C5A059] text-[#0D221A] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold hidden sm:inline-block">PRO</span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gray-300">مرحباً، {user?.fullName || 'مدير النظام'}</p>
            </div>
          </div>
        </div>

        {/* Consolidated Action Buttons: Store View & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-[#143529] text-[#C5A059] hover:text-white transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onGoToStore}
            className="px-3.5 py-1.5 rounded-full bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>عرض المتجر</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-secondary py-1.5 px-3 sm:px-4 text-xs flex items-center gap-1.5 border-rose-500/40 hover:bg-rose-900/40 text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileAdminMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex print:hidden">
          <div className="w-4/5 max-w-xs bg-[#0D221A] text-white p-5 space-y-6 flex flex-col justify-between border-l border-[#C5A059]/40 animate-fadeIn">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-4">
                <VeloraLogo size="sm" />
                <button
                  onClick={() => setMobileAdminMenuOpen(false)}
                  className="p-1.5 text-[#C5A059] rounded-lg hover:bg-[#143529]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileAdminMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === item.id
                        ? 'bg-[#C5A059] text-[#0D221A]'
                        : 'text-gray-300 hover:bg-[#143529]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#C5A059]/30 space-y-2">
              <button
                onClick={onGoToStore}
                className="w-full py-2.5 rounded-xl bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-[#C5A059]" />
                <span>عرض المتجر</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-rose-900/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileAdminMenuOpen(false)} />
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-20 sm:pb-8">
        
        {/* Desktop Layout: Sidebar + Content */}
        <div className="flex gap-6">

        {/* Sidebar - Large Screens */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white rounded-3xl border border-[#C5A059]/30 shadow-sm p-4 sticky top-24 self-start max-h-[calc(100vh-8rem)] print:hidden">
          <div className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-right ${
                  activeTab === item.id
                    ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059] shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2 flex-shrink-0">
            <button
              onClick={onGoToStore}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-[#0D221A] bg-[#F7F5F0] hover:bg-gray-200 transition-all"
            >
              <Store className="w-4 h-4 text-[#C5A059]" />
              <span>عودة للمتجر</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">

        {/* TAB 1: MERGED OVERVIEW & FULL REPORTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Title with Print & Export Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#C5A059]/30 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">الرئيسية والتقارير الشاملة</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">المؤشرات الحية، التحليلات الماليّة، والمبيعات التفصيلية لكل المحافظات</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto print:hidden">
                <button
                  onClick={handleExportFinancialExcel}
                  className="btn-primary text-xs py-2.5 px-4 flex-1 sm:flex-none flex items-center justify-center gap-2 shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير التقرير لإكسل</span>
                </button>
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2.5 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة التقرير</span>
                </button>
              </div>
            </div>

            {/* KPI Executive Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Revenue */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#F2EFE9] text-[#0D221A] p-5 sm:p-6 rounded-3xl border border-[#C5A059]/40 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-3 z-10">
                  <span className="text-xs font-bold text-[#52635B] tracking-wide">إجمالي المبيعات</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#0D221A] text-[#EAD096] border border-[#C5A059]/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 font-black text-[#EAD096]" />
                  </div>
                </div>
                <div className="z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D221A] font-serif tracking-tight">
                    {(stats?.totalRevenue || 0).toLocaleString()} <span className="text-xs font-sans font-normal text-[#987834]">ج.م</span>
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#52635B] font-light">محدث مباشرة من الطلبات</span>
                    <span className="bg-[#C5A059]/15 text-[#987834] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#C5A059]/30 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#987834]" /> +14.2%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Average Order Value (AOV) */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#F2EFE9] text-[#0D221A] p-5 sm:p-6 rounded-3xl border border-[#C5A059]/40 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-3 z-10">
                  <span className="text-xs font-bold text-[#52635B] tracking-wide">متوسط قيمة الطلب (AOV)</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#143529] text-[#EAD096] border border-[#C5A059]/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D221A] font-serif tracking-tight">
                    {analytics?.averageOrderValue?.toLocaleString() || 0} <span className="text-xs font-sans font-normal text-[#987834]">ج.م</span>
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#52635B] font-light">{orders.length} طلب إجمالي</span>
                    <span className="bg-[#143529]/10 text-[#0D221A] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#143529]/20 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#143529]" /> +5.8%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Customers */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#F2EFE9] text-[#0D221A] p-5 sm:p-6 rounded-3xl border border-[#C5A059]/40 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-3 z-10">
                  <span className="text-xs font-bold text-[#52635B] tracking-wide">قاعدة العملاء</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#0D221A] text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D221A] font-serif tracking-tight">
                    {customerDatabase.length} <span className="text-xs font-sans font-normal text-[#987834]">عميل مسجل</span>
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#52635B] font-light">تغطية الجداول</span>
                    <span className="bg-[#C5A059]/15 text-[#987834] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#C5A059]/30">
                      9 محافظات
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Active Products */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F5] to-[#F2EFE9] text-[#0D221A] p-5 sm:p-6 rounded-3xl border border-[#C5A059]/40 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-3 z-10">
                  <span className="text-xs font-bold text-[#52635B] tracking-wide">المنتجات النشطة</span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#987834] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-5 h-5 font-bold" />
                  </div>
                </div>
                <div className="z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D221A] font-serif tracking-tight">
                    {products.length} <span className="text-xs font-sans font-normal text-[#987834]">منتج</span>
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#52635B] font-light">في الكتالوج</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      {products.filter(p => (p.stock || 50) < 15).length} نواقص
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export Toolbar */}
            <div className="bg-gradient-to-r from-[#0D221A] via-[#143529] to-[#0D221A] text-white p-4 sm:p-5 rounded-3xl border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#EAD096]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#EAD096]">تصدير سريع للجداول وتقارير الأرباح بصيغة Excel</h4>
                  <p className="text-[10px] text-emerald-200/70">تحميل التقارير المالية والتحليلات فوراً</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleExportProfitAnalyticsExcel}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#C5A059] text-[#0D221A] text-xs font-extrabold hover:bg-[#EAD096] transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير تقرير الأرباح 💰</span>
                </button>
                <button
                  onClick={handleExportOrdersExcel}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير الطلبات</span>
                </button>
                <button
                  onClick={handleExportProductsExcel}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير المنتجات</span>
                </button>
              </div>
            </div>

            {/* DEDICATED PROFIT & FINANCIAL ANALYTICS SECTION */}
            <div className="bg-white rounded-3xl border border-[#C5A059]/40 p-5 sm:p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#987834] text-[#0D221A] flex items-center justify-center shadow-md font-bold">
                    <DollarSign className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-lg text-[#0D221A]">تقرير وتحليلات أرباح المنتجات الشاملة</h3>
                    <p className="text-xs text-gray-500">حساب صافي الأرباح، التكلفة التشغيلية، ومعدلات هامش الربح لكل المنتج</p>
                  </div>
                </div>

                <button
                  onClick={handleExportProfitAnalyticsExcel}
                  className="px-4 py-2 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center gap-1.5 shadow-xs print:hidden"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تحميل شيت إكسل للأرباح 📊</span>
                </button>
              </div>

              {/* Profit Executive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-emerald-800">إجمالي صافي الأرباح المحققة</span>
                  <h4 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
                    {financialMetrics.netProfit.toLocaleString()} <span className="text-xs font-normal text-emerald-700">ج.م</span>
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-medium">بعد خصم تكاليف المنتجات والتصنيع</p>
                </div>

                <div className="p-5 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-amber-900">إجمالي تكاليف الشراء والتصنيع (COGS)</span>
                  <h4 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif">
                    {financialMetrics.totalCost.toLocaleString()} <span className="text-xs font-normal text-amber-800">ج.م</span>
                  </h4>
                  <p className="text-[11px] text-amber-800 font-medium">التكلفة الإجمالية للمستحضرات المباعة</p>
                </div>

                <div className="p-5 rounded-2xl border border-[#C5A059]/40 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-[#0D221A]">متوسط هامش الربح الإجمالي</span>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#987834] font-serif">
                    {financialMetrics.marginPct}% <span className="text-xs font-normal text-gray-500">هامش صافي</span>
                  </h4>
                  <p className="text-[11px] text-gray-600 font-medium">معدل ممتازة أعلى من متوسط السوق</p>
                </div>
              </div>

              {/* Top Profitable Products Grid Table */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-[#0D221A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>ترتيب المنتجات بحسب أعلى صافي ربح للقطعة:</span>
                </h4>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {topProfitableProducts.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-3.5 rounded-2xl border border-gray-200 bg-[#FAF8F5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0D221A]">{p.name}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] font-extrabold">
                          هامش: {p.marginPct}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
                        <span className="text-gray-500">سعر البيع: <strong className="text-[#0D221A]">{p.price} ج.م</strong></span>
                        <span className="text-gray-500">التكلفة: <strong className="text-emerald-800">{p.cost} ج.م</strong></span>
                        <span className="text-emerald-700 font-black">ربح: {p.unitProfit} ج.م</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 bg-[#FAF8F5]">
                        <th className="py-3 px-3 rounded-r-xl">المنتج</th>
                        <th className="py-3 px-3">التصنيف</th>
                        <th className="py-3 px-3">سعر البيع</th>
                        <th className="py-3 px-3">التكلفة 🏷️</th>
                        <th className="py-3 px-3">صافي ربح القطعة 💰</th>
                        <th className="py-3 px-3">هامش الربح % 📊</th>
                        <th className="py-3 px-3 rounded-l-xl">الأرباح المتوقعة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topProfitableProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-[#0D221A]">{p.name}</td>
                          <td className="py-3 px-3 text-gray-600">{p.category}</td>
                          <td className="py-3 px-3 font-bold text-[#0D221A]">{p.price} ج.م</td>
                          <td className="py-3 px-3 text-amber-800 font-bold bg-amber-50/50 rounded-lg">{p.cost} ج.م</td>
                          <td className="py-3 px-3 font-black text-emerald-700">{p.unitProfit} ج.م</td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] font-extrabold">
                              {p.marginPct}%
                            </span>
                          </td>
                          <td className="py-3 px-3 font-black text-[#987834] font-serif">{p.estTotalProfit.toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#143529]/10 text-[#143529] border border-[#143529]/20 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-base text-[#0D221A]">تحليل وتوزيع طرق الدفع</h3>
                    <p className="text-[11px] text-gray-500">حجم المبيعات ونسب المعاملات حسب الوسيلة</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['vodafone', 'instapay'].map((pm) => {
                  const pmOrders = orders.filter(o => o.paymentMethod === pm);
                  const pmRevenue = pmOrders.reduce((acc, o) => acc + (o.total || 0), 0);
                  const pct = orders.length > 0 ? Math.round((pmOrders.length / orders.length) * 100) : 0;

                  return (
                    <div key={pm} className="p-5 rounded-2xl border border-[#C5A059]/30 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] space-y-3 shadow-xs hover:border-[#C5A059] transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#0D221A]">{paymentLabels[pm]}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border bg-[#143529] text-[#EAD096] border-[#C5A059]/40">
                          {pct}% من الطلبات
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-[#0D221A] font-serif tracking-tight">
                        {pmRevenue.toLocaleString()} <span className="text-xs font-sans font-normal text-[#987834]">ج.م</span>
                      </h4>
                      <div className="space-y-1">
                        <div className="w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-[#143529] to-[#C5A059] rounded-full transition-all duration-700 shadow-sm" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium pt-1">{pmOrders.length} طلب بهذه الوسيلة</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Governorates & Categories breakdown */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* City Breakdown */}
                <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold font-serif text-base text-[#0D221A]">أداء المحافظات المصرية</h3>
                    </div>
                    <span className="text-xs text-[#987834] font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#C5A059]/30">الحصة السوقية</span>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {(analytics?.salesByCity || []).map((item, index) => (
                      <div key={index} className="space-y-1.5 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                        <div className="flex justify-between text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] flex items-center justify-center font-mono">
                              #{index + 1}
                            </span>
                            <span className="text-[#0D221A]">{item.city} ({item.ordersCount} طلبات)</span>
                          </div>
                          <span className="text-[#987834] font-extrabold">{(item.totalRevenue || 0).toLocaleString()} ج.م ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#C5A059] via-[#143529] to-[#0D221A] rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#143529]/10 text-[#143529] border border-[#143529]/20 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold font-serif text-base text-[#0D221A]">أداء مجموعات المنتجات</h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {(analytics?.salesByCategory || []).map((cat, idx) => (
                      <div key={idx} className="space-y-1.5 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#0D221A] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                            {cat.category}
                          </span>
                          <span className="text-emerald-800 font-extrabold">{(cat.revenue || 0).toLocaleString()} ج.م ({cat.percentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#143529] to-[#C5A059] rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Table Overview */}
            <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-[#0D221A]">أحدث الطلبات المسجلة في المتجر</h3>
                  <p className="text-xs text-gray-500">متابعة وحالات أحدث الشحنات والعملاء</p>
                </div>
                <button 
                  onClick={() => setActiveTab('orders')} 
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] text-[#987834] border border-[#C5A059]/30 text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all"
                >
                  إدارة جميع الطلبات ({orders.length}) ←
                </button>
              </div>

              {/* Mobile Recent Cards */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl border border-gray-200 bg-[#FAF9F6] hover:border-[#C5A059]/60 transition-all space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="font-mono font-bold text-xs text-[#0D221A] bg-white px-2 py-0.5 rounded border border-gray-200">{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#0D221A]">{order.fullName}</p>
                        <p className="text-[10px] text-gray-500">{order.city}</p>
                      </div>
                      <span className="font-black text-[#987834] text-base">{order.total} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Recent Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold bg-[#FAF8F5]">
                      <th className="py-3 px-3 rounded-r-xl">رقم الطلب</th>
                      <th className="py-3 px-3">اسم العميلة</th>
                      <th className="py-3 px-3">رقم الهاتف</th>
                      <th className="py-3 px-3">المحافظة</th>
                      <th className="py-3 px-3">طريقة الدفع</th>
                      <th className="py-3 px-3">المجموع</th>
                      <th className="py-3 px-3 rounded-l-xl">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#0D221A]">{order.orderNumber}</td>
                        <td className="py-3.5 px-3 font-bold text-[#0D221A]">{order.fullName}</td>
                        <td className="py-3.5 px-3 text-gray-600" dir="ltr">{order.phone}</td>
                        <td className="py-3.5 px-3 font-medium">{order.city}</td>
                        <td className="py-3.5 px-3">
                          <span className="bg-[#143529] text-[#EAD096] px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">
                            {paymentLabels[order.paymentMethod] || order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-black text-[#987834] font-serif text-sm">{order.total} ج.م</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB HERO MANAGER */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#C5A059]/30 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#987834] text-[#0D221A] flex items-center justify-center font-bold shadow-md">
                  <Sparkles className="w-5 h-5 text-[#0D221A]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">إدارة قسم الهيرو وسلايدر الواجهة الرئيسية</h2>
                  <p className="text-xs text-gray-500 mt-0.5">تحكم ديناميكي كامل في العناوين، الألوان، الصور، والعروض الترويجية</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingHeroSlide(null);
                  setIsHeroSlideModalOpen(true);
                }}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سلايد جديد للهيرو ➕</span>
              </button>
            </div>

            {/* Quick Hero Global Settings Bar */}
            <div className="bg-[#0D221A] text-white p-5 rounded-3xl border border-[#C5A059]/40 shadow-xl space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#EAD096] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>إعدادات العرض والتنقّل السريع للسلايدر</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Setting 1: AutoPlay */}
                <div className="p-3.5 rounded-2xl bg-[#143529] border border-[#C5A059]/30 flex items-center justify-between">
                  <span className="font-bold">التنقّل التلقائي (Auto-Play)</span>
                  <button
                    onClick={() => handleUpdateHeroSettings(prev => ({ ...prev, autoPlay: !prev.autoPlay }))}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all ${
                      heroSettings?.autoPlay !== false
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {heroSettings?.autoPlay !== false ? 'مفعّل 🟢' : 'معطّل ⚪'}
                  </button>
                </div>

                {/* Setting 2: Interval */}
                <div className="p-3.5 rounded-2xl bg-[#143529] border border-[#C5A059]/30 flex items-center justify-between">
                  <span className="font-bold">سرعة التنقّل</span>
                  <select
                    value={heroSettings?.autoPlayInterval || 5.5}
                    onChange={(e) => handleUpdateHeroSettings(prev => ({ ...prev, autoPlayInterval: parseFloat(e.target.value) }))}
                    className="bg-[#0D221A] text-[#EAD096] border border-[#C5A059]/50 rounded-xl px-2.5 py-1 font-bold text-xs focus:outline-none"
                  >
                    <option value={3.5}>3.5 ثوانٍ (سريع)</option>
                    <option value={5.5}>5.5 ثوانٍ (افتراضي)</option>
                    <option value={8}>8 ثوانٍ (مريح)</option>
                    <option value={10}>10 ثوانٍ (بطيء)</option>
                  </select>
                </div>

                {/* Setting 3: Show Trust Badges */}
                <div className="p-3.5 rounded-2xl bg-[#143529] border border-[#C5A059]/30 flex items-center justify-between">
                  <span className="font-bold">شريط مميزات الثقة 🌿</span>
                  <button
                    onClick={() => handleUpdateHeroSettings(prev => ({ ...prev, showTrustHighlights: !prev.showTrustHighlights }))}
                    className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all ${
                      heroSettings?.showTrustHighlights !== false
                        ? 'bg-[#C5A059] text-[#0D221A] shadow-sm'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {heroSettings?.showTrustHighlights !== false ? 'ظاهر' : 'مخفي'}
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Slides Cards List */}
            <div className="space-y-4">
              <h3 className="font-bold font-serif text-base text-[#0D221A] flex items-center gap-2">
                <span>سلايدات الهيرو الحالية ({heroSlides.length}):</span>
              </h3>

              {heroSlides.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                  <p className="text-sm font-bold text-gray-600">لا توجد سلايدات حالياً في الهيرو!</p>
                  <button
                    onClick={() => {
                      setEditingHeroSlide(null);
                      setIsHeroSlideModalOpen(true);
                    }}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    إضافة السلايد الأول ➕
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {heroSlides.map((slide, index) => (
                    <div 
                      key={slide.id} 
                      className={`p-5 rounded-3xl border transition-all shadow-sm bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                        slide.active !== false ? 'border-[#C5A059]/50 hover:border-[#C5A059]' : 'border-gray-200 opacity-60 bg-gray-50'
                      }`}
                    >
                      {/* Slide Info Preview */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0D221A] overflow-hidden border border-[#C5A059]/40 flex-shrink-0 relative">
                          <img src={slide.productImage || '/images/serum.png'} alt={slide.productTitle} className="w-full h-full object-cover" />
                          <span className="absolute top-1 right-1 bg-[#143529] text-[#EAD096] text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 text-right">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] font-bold">
                              {slide.badge || 'عرض ملكي 👑'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              slide.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {slide.active !== false ? 'نشط في الواجهة 🟢' : 'مخفي ⚪'}
                            </span>
                          </div>

                          <h4 className="font-bold font-serif text-sm sm:text-base text-[#0D221A]">
                            <span className="text-[#987834] font-black">{slide.titleHighlight}</span> {slide.titleRest}
                          </h4>

                          <p className="text-xs text-gray-500 line-clamp-1">{slide.description}</p>
                          <p className="text-[11px] text-[#0D221A] font-bold">المنتج المعروض: {slide.productTitle} ({slide.rating})</p>
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                        {/* Reorder Buttons */}
                        <button
                          onClick={() => handleMoveSlide(index, -1)}
                          disabled={index === 0}
                          className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#C5A059] hover:text-white disabled:opacity-30 transition-colors"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveSlide(index, 1)}
                          disabled={index === heroSlides.length - 1}
                          className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#C5A059] hover:text-white disabled:opacity-30 transition-colors"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Toggle Active Button */}
                        <button
                          onClick={() => handleToggleSlideActive(slide.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                            slide.active !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          title={slide.active !== false ? 'إخفاء من الهيرو' : 'تفعيل في الهيرو'}
                        >
                          {slide.active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingHeroSlide(slide);
                            setIsHeroSlideModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-[#0D221A] text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors"
                          title="تعديل السلايد"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteHeroSlide(slide.id)}
                          className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="حذف السلايد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT & EXCEL EXPORT + PAGINATION */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-4 sm:p-6 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">إدارة وقائمة الطلبات التفصيلية</h3>
                <p className="text-xs text-gray-500">بحث، تصفية، تصدير إكسل، وتحديث حالة الطلبات مباشرة</p>
              </div>

              <button
                onClick={handleExportOrdersExcel}
                className="btn-primary text-xs py-2.5 px-5 w-full lg:w-auto flex items-center justify-center gap-2 shadow-md print:hidden"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير الطلبات لملف Excel (.csv)</span>
              </button>
            </div>

            {/* Filter Controls Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#F7F5F0] p-4 rounded-2xl border border-gray-200 print:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب، اسم العميلة، أو التليفون..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                />
              </div>

              <div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                >
                  <option value="all">جميع الحالات ({orders.length})</option>
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="جاري التجهيز">جاري التجهيز</option>
                  <option value="تم الشحن">تم الشحن</option>
                  <option value="تم التوصيل">تم التوصيل</option>
                  <option value="ملغي">ملغي</option>
                </select>
              </div>

              <div>
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                >
                  <option value="all">جميع طرق الدفع</option>
                  <option value="vodafone">فودافون كاش</option>
                  <option value="instapay">انستا باي InstaPay</option>
                </select>
              </div>

              <div>
                <select
                  value={orderCityFilter}
                  onChange={(e) => setOrderCityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                >
                  <option value="all">جميع المحافظات</option>
                  {uniqueCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>تم العثور على <strong>{filteredOrders.length}</strong> طلب من إجمالي {orders.length}</span>
              {(orderSearchQuery || orderStatusFilter !== 'all' || orderPaymentFilter !== 'all' || orderCityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setOrderSearchQuery('');
                    setOrderStatusFilter('all');
                    setOrderPaymentFilter('all');
                    setOrderCityFilter('all');
                  }}
                  className="text-rose-600 font-bold hover:underline"
                >
                  إلغاء التصفية
                </button>
              )}
            </div>

            {/* Orders Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-2xl border border-gray-200 bg-[#F7F5F0] space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#0D221A]">{order.orderNumber}</span>
                      <p className="text-[10px] text-gray-500">{order.fullName} ({order.phone})</p>
                    </div>
                    <span className="font-extrabold text-[#987834] text-sm">{order.total} ج.م</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-gray-700 font-bold">المحافظة: {order.city}</p>
                    <p className="text-gray-500 text-[11px]">{order.address}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-2.5 py-1 rounded-lg bg-[#0D221A] text-[#EAD096] text-[10px] font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      التفاصيل
                    </button>

                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${statusColors[order.status]}`}
                    >
                      <option value="قيد الانتظار">قيد الانتظار</option>
                      <option value="جاري التجهيز">جاري التجهيز</option>
                      <option value="تم الشحن">تم الشحن</option>
                      <option value="تم التوصيل">تم التوصيل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Orders Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 px-2">رقم الطلب</th>
                    <th className="py-3 px-2">بيانات العميل</th>
                    <th className="py-3 px-2">العنوان</th>
                    <th className="py-3 px-2">المجموع</th>
                    <th className="py-3 px-2">الدفع</th>
                    <th className="py-3 px-2">التفاصيل</th>
                    <th className="py-3 px-2">تحديث الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono font-bold text-[#0D221A]">{order.orderNumber}</td>
                      <td className="py-3 px-2">
                        <p className="font-bold text-[#0D221A]">{order.fullName}</p>
                        <p className="text-[10px] text-gray-500" dir="ltr">{order.phone}</p>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-bold text-[11px]">{order.city}</p>
                        <p className="text-[10px] text-gray-500 max-w-[160px] truncate" title={order.address}>{order.address}</p>
                      </td>
                      <td className="py-3 px-2 font-bold text-[#987834]">{order.total} ج.م</td>
                      <td className="py-3 px-2">
                        <span className="bg-[#143529] text-[#EAD096] px-2 py-0.5 rounded text-[10px]">
                          {paymentLabels[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="p-1.5 rounded-lg bg-gray-100 text-[#0D221A] hover:bg-[#C5A059] hover:text-white transition-colors"
                          title="عرض المنتجات والتفاصيل"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${statusColors[order.status]}`}
                        >
                          <option value="قيد الانتظار">قيد الانتظار</option>
                          <option value="جاري التجهيز">جاري التجهيز</option>
                          <option value="تم الشحن">تم الشحن</option>
                          <option value="تم التوصيل">تم التوصيل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Orders Pagination */}
            <Pagination
              currentPage={ordersPage}
              totalPages={ordersTotalPages}
              onPageChange={setOrdersPage}
              totalItems={filteredOrders.length}
              itemsPerPage={ordersPerPage}
            />

          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY & EXCEL EXPORT + PAGINATION */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-4 sm:p-6 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">إدارة المنتجات وتتبع المخزون</h3>
                <p className="text-xs text-gray-500">إضافة وتعديل المنتجات، مراقبة النواقص، وتصدير إكسل</p>
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto print:hidden">
                <button
                  onClick={handleExportProductsExcel}
                  className="btn-primary text-xs py-2.5 px-4 flex-1 lg:flex-none flex items-center justify-center gap-2 shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير المخزون لإكسل</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#0D221A] text-[#EAD096] border border-[#C5A059] text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>منتج جديد</span>
                </button>
              </div>
            </div>

            {/* Product Filters Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F5F0] p-4 rounded-2xl border border-gray-200 print:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث باسم المنتج أو القسم..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                />
              </div>

              <div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                >
                  <option value="all">جميع الأقسام</option>
                  <option value="سيروم">سيروم</option>
                  <option value="كريم">كريمات</option>
                  <option value="زيوت">زيوت نادرة</option>
                  <option value="عناية متكاملة">مجموعات فاخرة</option>
                </select>
              </div>

              <div>
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                >
                  <option value="all">جميع حالات المخزون</option>
                  <option value="available">متوفر بكثرة (أكثر من 15)</option>
                  <option value="low">مخزون منخفض (أقل من 15)</option>
                  <option value="out">نفذت الكمية (0)</option>
                </select>
              </div>
            </div>

            {/* Products Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {paginatedProducts.map((p) => {
                const costPrice = p.costPrice || Math.round(p.price * 0.45);
                const unitProfit = p.price - costPrice;
                const marginPct = p.price > 0 ? Math.round((unitProfit / p.price) * 100) : 0;

                return (
                  <div key={p.id} className="p-4 rounded-2xl border border-gray-200 bg-[#F7F5F0] space-y-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-[#0D221A] border border-[#C5A059]/30" />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-[#0D221A]">{p.name}</h4>
                        <p className="text-[10px] text-gray-500">{p.category} • {p.volume || '50ml'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-extrabold text-[#987834] text-xs">بيع: {p.price} ج.م</span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                            تكلفة: {costPrice} ج.م
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">صافي ربح القطعة</span>
                        <strong className="text-emerald-700 font-extrabold text-sm">{unitProfit} ج.م</strong>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block">هامش الربح</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] font-bold">
                          {marginPct}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-500">المخزون: <strong className="text-[#0D221A]">{p.stock || 50} قطعة</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0D221A] text-[#EAD096] font-bold text-[11px]"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Products Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 px-2">الصورة</th>
                    <th className="py-3 px-2">اسم المنتج</th>
                    <th className="py-3 px-2">التصنيف</th>
                    <th className="py-3 px-2">سعر البيع</th>
                    <th className="py-3 px-2">سعر التكلفة 🏷️</th>
                    <th className="py-3 px-2">صافي الربح 💰</th>
                    <th className="py-3 px-2">هامش الربح % 📊</th>
                    <th className="py-3 px-2">المخزون</th>
                    <th className="py-3 px-2 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((p) => {
                    const costPrice = p.costPrice || Math.round(p.price * 0.45);
                    const unitProfit = p.price - costPrice;
                    const marginPct = p.price > 0 ? Math.round((unitProfit / p.price) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-2 px-2">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[#0D221A]" />
                        </td>
                        <td className="py-3 px-2 font-bold text-[#0D221A]">{p.name}</td>
                        <td className="py-3 px-2">{p.category}</td>
                        <td className="py-3 px-2 font-extrabold text-[#987834]">{p.price} ج.م</td>
                        <td className="py-3 px-2 font-bold text-emerald-800 bg-emerald-50/50 rounded-lg">{costPrice} ج.م</td>
                        <td className="py-3 px-2 font-black text-emerald-700">{unitProfit} ج.م</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#143529] text-[#EAD096] text-[10px] font-bold">
                            {marginPct}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            (p.stock || 50) < 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {p.stock || 50} قطعة
                          </span>
                        </td>
                        <td className="py-3 px-2 flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#C5A059] hover:text-white transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-gray-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Products Pagination */}
            <Pagination
              currentPage={productsPage}
              totalPages={productsTotalPages}
              onPageChange={setProductsPage}
              totalItems={filteredProducts.length}
              itemsPerPage={productsPerPage}
            />

          </div>
        )}

        {/* TAB 4: CUSTOMERS DATABASE & EXCEL EXPORT + PAGINATION */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-4 sm:p-6 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">سجل وقاعدة بيانات العملاء</h3>
                <p className="text-xs text-gray-500">تحليل القيمة الشرائية لكل عميل وتصدير البيانات لإكسل</p>
              </div>

              <button
                onClick={handleExportCustomersExcel}
                className="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto flex items-center justify-center gap-2 shadow-md print:hidden"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير قائمة العملاء لملف Excel (.csv)</span>
              </button>
            </div>

            <div className="bg-[#F7F5F0] p-4 rounded-2xl border border-gray-200 print:hidden">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث باسم العميلة، رقم الهاتف، أو المحافظة..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                />
              </div>
            </div>

            {/* Empty State when no customers */}
            {paginatedCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <Users className="w-16 h-16 text-gray-300" />
                <p className="text-sm font-bold text-gray-500">لا يوجد عملاء مسجلين حتى الآن</p>
                <p className="text-xs text-gray-400">عندما يتم تقديم الطلبات الأولى، ستظهر بيانات العملاء هنا تلقائياً</p>
              </div>
            ) : (
              <>

            {/* Customers Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {paginatedCustomers.map((cust, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-[#F7F5F0] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs shadow-xs">
                        {cust.name?.charAt(0) || 'ع'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#0D221A]">{cust.name}</h4>
                        <p className="text-[10px] text-gray-500" dir="ltr">{cust.phone}</p>
                      </div>
                    </div>
                    <span className="font-black text-[#987834] text-xs bg-[#C5A059]/15 px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                      {(cust.totalSpent || 0).toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block">المحافظة والعنوان</span>
                      <p className="font-bold text-[#0D221A] text-[11px] truncate">{cust.city || 'القاهرة'}</p>
                      <p className="text-[10px] text-gray-500 truncate" title={cust.address}>{cust.address || 'العنوان الرئيسي'}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-gray-400 block">إجمالي المشتريات</span>
                      <p className="font-bold text-[#0D221A] text-[11px]">{cust.ordersCount || 1} طلبات</p>
                      <p className="text-[10px] text-gray-500">آخر طلب: <span dir="ltr">{formatDateSafe(cust.lastOrderDate)}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customers Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 px-2">اسم العميلة</th>
                    <th className="py-3 px-2">رقم الهاتف</th>
                    <th className="py-3 px-2">المحافظة</th>
                    <th className="py-3 px-2">العنوان</th>
                    <th className="py-3 px-2">عدد الطلبات</th>
                    <th className="py-3 px-2">إجمالي الشراء</th>
                    <th className="py-3 px-2">آخر طلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedCustomers.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-bold text-[#0D221A]">{cust.name || 'عميلة فيلورا'}</td>
                      <td className="py-3 px-2 text-gray-600">{cust.phone ? <span dir="ltr">{cust.phone}</span> : 'غير مسجل'}</td>
                      <td className="py-3 px-2 font-bold text-emerald-800">{cust.city || 'القاهرة'}</td>
                      <td className="py-3 px-2 text-gray-500 max-w-[200px] truncate" title={cust.address}>{cust.address || 'العنوان الرئيسي'}</td>
                      <td className="py-3 px-2 font-bold">{cust.ordersCount || 1} طلبات</td>
                      <td className="py-3 px-2 font-extrabold text-[#987834]">{(cust.totalSpent || 0).toLocaleString()} ج.م</td>
                      <td className="py-3 px-2 text-gray-400" dir="ltr">
                        {formatDateSafe(cust.lastOrderDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customers Pagination */}
            <Pagination
              currentPage={customersPage}
              totalPages={customersTotalPages}
              onPageChange={setCustomersPage}
              totalItems={filteredCustomers.length}
              itemsPerPage={customersPerPage}
            />

              </>
            )}

          </div>
        )}

        {/* TAB 5: COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">إدارة أكواد الخصم والعروض الحصرية</h3>
                <p className="text-xs text-gray-500">إنشاء، تفعيل، أو تعطيل الكوبونات المتاحة للعملاء في متجر فيلورا</p>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="btn-primary text-xs py-2.5 px-5 w-full sm:w-auto flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كود خصم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupons.map((coupon) => (
                <div 
                  key={coupon.id}
                  className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                    coupon.isActive 
                      ? 'bg-gradient-to-br from-[#FAF8F5] via-white to-[#F2EFE9] border-[#C5A059]/80' 
                      : 'bg-gray-100/80 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#143529] to-[#0D221A] text-[#EAD096] border border-[#C5A059]/40 flex items-center justify-center shadow-xs">
                        <Tag className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#987834] uppercase tracking-wider block">كود خصم حصري</span>
                        <h4 className="font-mono font-black text-lg text-[#0D221A] tracking-wider">{coupon.code}</h4>
                      </div>
                    </div>

                    <span className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                      خصم {coupon.discountPercentage}%
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCoupon(coupon.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          coupon.isActive 
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200' 
                            : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                        }`}
                      >
                        {coupon.isActive ? '✓ نشط ومفعل' : '✕ غير مفعّل'}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 6: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-4 sm:p-6 shadow-sm space-y-6 animate-fadeIn">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D221A]">إدارة المستخدمين والصلاحيات</h3>
                <p className="text-xs text-gray-500">عرض، تعديل صلاحيات، وحذف المستخدمين المسجلين في المنصة</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-[#F7F5F0] p-4 rounded-2xl border border-gray-200">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث باسم المستخدم، البريد الإلكتروني، أو رقم الهاتف..."
                  value={usersSearchQuery}
                  onChange={(e) => setUsersSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A059] bg-white"
                />
              </div>
            </div>

            {/* Empty State */}
            {paginatedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <User className="w-16 h-16 text-gray-300" />
                <p className="text-sm font-bold text-gray-500">لا يوجد مستخدمين مسجلين</p>
              </div>
            ) : (
              <>

            {/* Users Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {paginatedUsers.map((u, idx) => (
                <div key={u.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-[#F7F5F0] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs shadow-xs">
                        {u.fullName?.charAt(0) || 'م'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#0D221A]">{u.fullName}</h4>
                        <p className="text-[10px] text-gray-500" dir="ltr">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      u.role === 'Admin' 
                        ? 'bg-[#C5A059]/15 text-[#987834] border-[#C5A059]/30' 
                        : 'bg-[#143529]/10 text-gray-600 border-gray-200'
                    }`}>
                      {u.role === 'Admin' ? 'أدمن' : 'عميل'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400">{u.phone || 'بدون هاتف'}</p>
                      <p className="text-[10px] text-gray-400">{u.city || 'بدون مدينة'}</p>
                    </div>
                    {u.role !== 'Admin' && (
                      <button
                        onClick={async () => {
                          if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
                          try {
                            await deleteUserApi(u.id);
                            setUsers(prev => prev.filter(us => us.id !== u.id));
                          } catch (e) {
                            alert(e.message);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف المستخدم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Users Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 px-2">اسم المستخدم</th>
                    <th className="py-3 px-2">البريد الإلكتروني</th>
                    <th className="py-3 px-2">رقم الهاتف</th>
                    <th className="py-3 px-2">المحافظة</th>
                    <th className="py-3 px-2">الصلاحية</th>
                    <th className="py-3 px-2">الطلبات</th>
                    <th className="py-3 px-2">المشتريات</th>
                    <th className="py-3 px-2">تحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((u, idx) => (
                    <tr key={u.id || idx} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-bold text-[#0D221A]">{u.fullName}</td>
                      <td className="py-3 px-2 text-gray-600" dir="ltr">{u.email}</td>
                      <td className="py-3 px-2 text-gray-600" dir="ltr">{u.phone || '-'}</td>
                      <td className="py-3 px-2 text-gray-600">{u.city || '-'}</td>
                      <td className="py-3 px-2">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            const newRole = e.target.value;
                            try {
                              await updateUserRoleApi(u.id, newRole);
                              setUsers(prev => prev.map(us => us.id === u.id ? { ...us, role: newRole } : us));
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                            u.role === 'Admin'
                              ? 'bg-[#C5A059]/15 text-[#987834] border-[#C5A059]/30'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          <option value="Customer">عميل</option>
                          <option value="Admin">أدمن</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 font-bold">{u.orderCount || 0}</td>
                      <td className="py-3 px-2 font-extrabold text-[#987834]">{(u.totalSpent || 0).toLocaleString()} ج.م</td>
                      <td className="py-3 px-2">
                        {u.role !== 'Admin' ? (
                          <button
                            onClick={async () => {
                              if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
                              try {
                                await deleteUserApi(u.id);
                                setUsers(prev => prev.filter(us => us.id !== u.id));
                              } catch (e) {
                                alert(e.message);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Users Pagination */}
            <Pagination
              currentPage={usersPage}
              totalPages={usersTotalPages}
              onPageChange={setUsersPage}
              totalItems={filteredUsers.length}
              itemsPerPage={usersPerPage}
            />

              </>
            )}

          </div>
        )}

        {/* TAB 8: OFFERS MANAGEMENT */}
        {activeTab === 'offers' && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#C5A059]/30 shadow-md space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#0D221A] flex items-center gap-2">
                  <span>إدارة عروض الفلاش والخصومات</span>
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                </h2>
                <p className="text-xs text-gray-500 font-light mt-1">
                  أنشئي وخصصي عروض العداد التنازلي التفاعلية التي تظهر في بنر الشاشة الرئيسية لزيادة المبيعات في مصر
                </p>
              </div>

              <button
                onClick={() => { setEditingOffer(null); setIsOfferModalOpen(true); }}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة عرض جديد ✨</span>
              </button>
            </div>

            {offers.length === 0 ? (
              <div className="text-center py-12 bg-[#FAF8F5] rounded-2xl border border-dashed border-gray-300 p-6">
                <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto opacity-50 mb-2" />
                <h4 className="font-bold text-gray-700 text-sm">لا توجد عروض حالية</h4>
                <p className="text-xs text-gray-500 mt-1">اضغطي على إضافة عرض جديد لبدء عرض فلاش تنازلي مميز في المتجر.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                      off.isActive
                        ? 'bg-[#0D221A] text-white border-[#C5A059] shadow-xl'
                        : 'bg-gray-50 text-gray-700 border-gray-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold font-serif text-base text-[#EAD096]">{off.title}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            off.isActive ? 'bg-[#C5A059] text-[#0D221A]' : 'bg-gray-300 text-gray-700'
                          }`}>
                            {off.isActive ? 'نشط في المتجر 🟢' : 'معطل ⚪'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 font-light mt-1">{off.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#C5A059]/20 font-mono">
                      <div className="flex items-center gap-1.5 text-[#EAD096]">
                        <Tag className="w-3.5 h-3.5" />
                        <span>كود: <strong>{off.couponCode}</strong> ({off.discountPercentage}% خصم)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>ينتهي: {new Date(off.endTime).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleToggleOfferActive(off.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                          off.isActive
                            ? 'bg-rose-900/60 text-rose-200 border border-rose-500/40 hover:bg-rose-800'
                            : 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-800'
                        }`}
                      >
                        {off.isActive ? 'إيقاف العرض' : 'تفعيل العرض 🚀'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingOffer(off); setIsOfferModalOpen(true); }}
                          className="p-2 text-[#C5A059] hover:bg-[#143529] rounded-xl transition-colors"
                          title="تعديل العرض"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(off.id)}
                          className="p-2 text-rose-400 hover:bg-rose-950 rounded-xl transition-colors"
                          title="حذف العرض"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border-2 border-[#C5A059] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs text-[#C5A059] font-bold">تفاصيل الطلب الكاملة</span>
                <h3 className="font-mono font-bold text-lg text-[#0D221A]">{selectedOrderDetails.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F7F5F0] p-3 rounded-xl border border-gray-200 space-y-1">
                <p className="font-bold text-[#0D221A]">الاسم: {selectedOrderDetails.fullName}</p>
                <p className="text-gray-600">الهاتف: <span dir="ltr">{selectedOrderDetails.phone}</span></p>
                <p className="text-gray-600">المحافظة: {selectedOrderDetails.city}</p>
                <p className="text-gray-600">العنوان: {selectedOrderDetails.address}</p>
                <p className="text-gray-600">طريقة الدفع: {paymentLabels[selectedOrderDetails.paymentMethod] || selectedOrderDetails.paymentMethod}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0D221A] mb-2">المنتجات المطلوبة:</h4>
                <div className="space-y-2">
                  {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                    selectedOrderDetails.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border text-xs">
                        <span className="font-bold text-[#0D221A]">{item.productName} (x{item.quantity})</span>
                        <span className="font-bold text-[#987834]">{item.unitPrice * item.quantity} ج.م</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">لا توجد تفاصيل للمنتجات</p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t flex justify-between items-center font-bold text-sm text-[#0D221A]">
                <span>المجموع الكلي:</span>
                <span className="text-[#987834] font-serif">{selectedOrderDetails.total} ج.م</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="btn-primary w-full py-2.5 text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Product, Coupon, Hero & Offer Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <CouponFormModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSave={handleSaveCoupon}
      />

      <HeroSlideFormModal
        isOpen={isHeroSlideModalOpen}
        onClose={() => setIsHeroSlideModalOpen(false)}
        slide={editingHeroSlide}
        onSave={handleSaveHeroSlide}
      />

      <OfferFormModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        offer={editingOffer}
        onSave={handleSaveOffer}
      />

      {/* Native Android Mobile App Dock for Admin Dashboard */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D221A]/95 backdrop-blur-xl border-t border-[#C5A059]/40 shadow-2xl px-1.5 py-2 flex justify-around items-center text-white print:hidden">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 ${
            activeTab === 'overview' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl transition-all ${
            activeTab === 'overview' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">التقارير</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'hero' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'hero' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            {heroSlides.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-[#0D221A] text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                {heroSlides.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">الهيرو</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'orders' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'orders' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <ShoppingBag className="w-5 h-5" />
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-[#0D221A] text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                {orders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">الطلبات</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'products' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'products' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Package className="w-5 h-5" />
            {products.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                {products.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">المنتجات</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'customers' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'customers' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">العملاء</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'users' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'users' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">المستخدمين</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'coupons' ? 'text-[#EAD096]' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-2xl relative transition-all ${
            activeTab === 'coupons' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">الأكواد</span>
        </button>
      </div>

        </div>
      </div>

    </div>
  );
}
