import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Mail, Lock, Camera, CheckCircle, ShoppingBag, Clock, ShieldCheck, LogOut, ArrowLeft, Store, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { EGYPT_GOVERNORATES } from '../data/governorates';
import { fetchMyOrdersApi, updateUserApi } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function UserProfilePage({ currentUser, onUpdateUser, onLogout, onExploreClick, initialTab = 'info' }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [activeSubTab, setActiveSubTab] = useState(initialTab);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'القاهرة');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser?.phone || currentUser?.fullName) {
      setOrdersLoading(true);
      fetchMyOrdersApi(currentUser.phone, currentUser.fullName)
        .then(setMyOrders)
        .finally(() => setOrdersLoading(false));
    }
  }, [currentUser?.phone, currentUser?.fullName]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const updatedUser = {
        fullName,
        phone,
        city,
        address,
        avatar
      };

      const result = await updateUserApi(currentUser.id, updatedUser);
      if (onUpdateUser) {
        onUpdateUser(result);
      }

      setSuccessMessage(isEn ? 'Personal information updated successfully! ✨' : 'تم تحديث بيانات حسابك الشخصية بنجاح! ✨');
    } catch (err) {
      setErrorMessage(err.message || (isEn ? 'Failed to update. Please try again.' : 'فشل تحديث البيانات. يرجى المحاولة مرة أخرى.'));
    }

    setTimeout(() => { setSuccessMessage(''); setErrorMessage(''); }, 4000);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(isEn ? 'New password must be at least 6 characters long' : 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(isEn ? 'Passwords do not match!' : 'كلمتا المرور غير متطابقتين!');
      return;
    }

    try {
      await updateUserApi(currentUser.id, { password: newPassword });
      setSuccessMessage(isEn ? 'Password changed successfully! 🔒' : 'تم تغيير كلمة المرور بنجاح! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.message || (isEn ? 'Failed to change password' : 'فشل تغيير كلمة المرور'));
    }

    setTimeout(() => { setSuccessMessage(''); setErrorMessage(''); }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#E6EDE4] text-[#0D221A] py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Royal Header Banner */}
        <div className="bg-[#0D221A] text-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#C5A059]/20 to-transparent blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            
            {/* Avatar Profile Image Upload Box */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#143529] border-2 border-[#C5A059] overflow-hidden flex items-center justify-center text-[#EAD096] shadow-xl relative">
                {avatar ? (
                  <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 stroke-[1.5]" />
                )}
                
                {/* Upload Image Overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold">
                  <Camera className="w-5 h-5 text-[#C5A059] mb-1" />
                  <span>{isEn ? 'Change Photo' : 'تغيير الصورة'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Camera Badge Trigger */}
              <label className="absolute bottom-0 left-0 bg-[#C5A059] text-[#0D221A] p-2 rounded-full cursor-pointer shadow-md hover:bg-[#EAD096] transition-all">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#EAD096]">{fullName || (isEn ? 'VELORA User' : 'مستخدم VELORA')}</h1>
                <span className="px-3 py-0.5 rounded-full bg-[#143529] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold">
                  {currentUser?.role === 'Admin' ? (isEn ? 'System Admin 👑' : 'مدير النظام 👑') : (isEn ? 'VIP Customer ✨' : 'عميلة مميزة ✨')}
                </span>
              </div>

              <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{currentUser?.email || 'user@example.com'}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs pt-1 text-gray-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  {phone ? <span dir="ltr">{phone}</span> : <span>{isEn ? 'Not registered' : 'غير مسجل'}</span>}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{city}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-rose-950/80 text-rose-200 border border-rose-500/40 text-xs font-bold hover:bg-rose-900 flex items-center gap-1.5 transition-all self-center sm:self-start"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{isEn ? 'Log Out' : 'تسجيل الخروج'}</span>
            </button>

          </div>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-900/90 text-emerald-100 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-md animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/90 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-2 shadow-md animate-fadeIn">
            <Lock className="w-5 h-5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-around sm:justify-start gap-2 border-b border-[#C5A059]/30 pb-2">
          <button
            onClick={() => setActiveSubTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'info'
                ? 'bg-[#143529] text-[#EAD096] border border-[#C5A059]/50 shadow-sm'
                : 'text-gray-600 hover:text-[#0D221A]'
            }`}
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>{isEn ? 'Personal Info ✏️' : 'البيانات الشخصية والصورة ✏️'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'orders'
                ? 'bg-[#143529] text-[#EAD096] border border-[#C5A059]/50 shadow-sm'
                : 'text-gray-600 hover:text-[#0D221A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span>{isEn ? `Order History (${myOrders.length}) 🛍️` : `سجل طلباتي (${myOrders.length}) 🛍️`}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'security'
                ? 'bg-[#143529] text-[#EAD096] border border-[#C5A059]/50 shadow-sm'
                : 'text-gray-600 hover:text-[#0D221A]'
            }`}
          >
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <span>{isEn ? 'Password & Security 🔒' : 'كلمة المرور والأمان 🔒'}</span>
          </button>
        </div>

        {/* SUBTAB 1: EDIT PERSONAL INFO */}
        {activeSubTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="font-bold font-serif text-base text-[#0D221A] border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'Edit Personal Info & Avatar' : 'تعديل البيانات الشخصية وصورة الحساب'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'Full Name' : 'الاسم الكامل'}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold text-[#0D221A]`}
                  dir={isEn ? 'ltr' : 'rtl'}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'Contact Phone' : 'رقم الهاتف التواصل'}</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold text-[#0D221A] ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>

              {/* City / Governorate */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'Governorate / City' : 'المحافظة / المدينة'}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold text-[#0D221A]`}
                  dir={isEn ? 'ltr' : 'rtl'}
                >
                  {EGYPT_GOVERNORATES.map(c => (
                    <option key={c} value={c} className="text-[#0D221A] bg-white font-bold">{c}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-gray-700">{isEn ? 'Detailed Delivery Address (Home/Work)' : 'عنوان التوصيل التفصيلي (المنزل/العمل)'}</label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isEn ? 'Street name, building no, apartment, etc...' : 'اسم الشارع، رقم العمارة، الشقة، وأي علامة مميزة...'}
                  className={`w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold text-[#0D221A]`}
                  dir={isEn ? 'ltr' : 'rtl'}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="btn-primary text-xs py-3 px-8 shadow-md font-bold"
              >
                {isEn ? 'Save Changes 💾' : 'حفظ التعديلات والتغييرات 💾'}
              </button>
            </div>
          </form>
        )}

        {/* SUBTAB 2: MY ORDERS */}
        {activeSubTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm space-y-4 animate-fadeIn">
            <h3 className="font-bold font-serif text-base text-[#0D221A] border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>{isEn ? 'Order History & Status' : 'سجل طلباتي السابقة وحالتها'}</span>
              </span>
              <span className="text-xs text-gray-500 font-normal">{myOrders.length} {isEn ? 'Orders placed' : 'طلبات مسجلة'}</span>
            </h3>

            {ordersLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">{isEn ? 'Loading your orders...' : 'جاري تحميل طلباتك...'}</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-500">{isEn ? 'You haven\'t placed any orders yet!' : 'لم تقومي بإجراء أية طلبات بعد!'}</p>
                <button onClick={onExploreClick} className="btn-primary text-xs py-2.5 px-6">
                  {isEn ? 'Explore Products & Shop Now 🛍️' : 'استكشاف المنتجات والتسوق الآن 🛍️'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isEn={isEn} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: CHANGE PASSWORD */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm space-y-5 animate-fadeIn max-w-md mx-auto">
            <h3 className="font-bold font-serif text-base text-[#0D221A] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'Change Password' : 'تغيير كلمة المرور'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'Current Password' : 'كلمة المرور الحالية'}</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'New Password' : 'كلمة المرور الجديدة'}</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">{isEn ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#E6EDE4] border border-gray-300 focus:border-[#C5A059] rounded-2xl p-3 text-xs focus:outline-none font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full text-xs py-3 shadow-md font-bold mt-2"
            >
              {isEn ? 'Update Password 🔒' : 'تحديث كلمة المرور 🔒'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

function OrderCard({ order, isEn }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    'قيد الانتظار': 'bg-amber-100 text-amber-800 border-amber-300',
    'تم الدفع وجاري التجهيز': 'bg-blue-100 text-blue-800 border-blue-300',
    'تم الشحن': 'bg-purple-100 text-purple-800 border-purple-300',
    'تم التوصيل': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'ملغي': 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-[#E6EDE4] space-y-3 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-gray-300">
            {order.orderNumber}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{new Date(order.createdAt || Date.now()).toLocaleDateString('ar-EG')}</span>
          </span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
          {isEn ? (order.status === 'مكتمل' ? 'Completed' : order.status === 'ملغي' ? 'Cancelled' : order.status === 'تم الشحن' ? 'Shipped' : order.status === 'تم الدفع وجاري التجهيز' ? 'Processing' : 'Pending') : (order.status || 'قيد الانتظار')}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-gray-500">
          <span className="text-gray-400">{isEn ? 'Shipping: ' : 'الشحن: '}</span>
          <strong className="text-[#0D221A]">{order.city}</strong>
        </span>
        <span className="text-[#987834] font-serif text-sm font-bold">{order.total} {isEn ? 'EGP' : 'ج.م'}</span>
      </div>

      {order.items && order.items.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[#C5A059] text-xs font-bold hover:underline mt-1"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{expanded ? (isEn ? 'Hide Items' : 'إخفاء المنتجات') : (isEn ? `View Items (${order.items.length})` : `عرض المنتجات (${order.items.length})`)}</span>
          </button>

          {expanded && (
            <div className="space-y-2 pt-1 border-t border-gray-200">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#143529] text-[#EAD096] text-[10px] flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                    <span className="font-bold text-gray-700">{item.productName}</span>
                  </div>
                  <span className="text-gray-500">{item.unitPrice} {isEn ? 'EGP' : 'ج.م'}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-bold bg-[#143529]/10 p-2.5 rounded-xl">
                <span className="text-gray-600">{isEn ? 'Total' : 'المجموع الكلي'}</span>
                <span className="text-[#987834]">{order.total} {isEn ? 'EGP' : 'ج.م'}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
