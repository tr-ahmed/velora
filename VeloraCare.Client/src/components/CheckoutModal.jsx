import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck, Sparkles, ShoppingBag, ArrowLeft, MapPin, Phone, User, Package, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createOrderApi, validateCouponApi } from '../services/api';
import { EGYPT_GOVERNORATES } from '../data/governorates';
import { useTranslation } from 'react-i18next';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete, currentUser }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'القاهرة',
    address: '',
    notes: '',
    paymentMethod: 'vodafone'
  });
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setCompletedOrder(null);
      setOrderError('');
      
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          fullName: currentUser.fullName || prev.fullName,
          phone: currentUser.phone || prev.phone,
          city: currentUser.city || prev.city,
          address: currentUser.address || prev.address
        }));
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee = 0; // Paid directly to courier
  const total = discountedSubtotal;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await validateCouponApi(couponInput.trim());
      setAppliedCoupon(res);
      setCouponSuccess(isEn ? `Coupon applied! ${res.discountPercentage}% off 🎉` : `تم تطبيق كود الخصم بنجاح! خصم ${res.discountPercentage}% 🎉`);
    } catch (err) {
      setCouponError(err.message || (isEn ? 'Invalid or inactive coupon code' : 'كود الخصم غير صحيح أو غير مفعل'));
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderError('');
    setIsSubmitting(true);

    const orderPayload = {
      fullName: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      subtotal,
      shippingFee,
      total,
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    try {
      const result = await createOrderApi(orderPayload);
      setCompletedOrder({
        orderNumber: result.orderNumber,
        ...formData,
        items: [...cartItems],
        subtotal,
        shippingFee,
        total
      });

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A059', '#143529', '#EAD096', '#FFFFFF']
        });
      } catch (err) {
        console.log('Confetti effect triggered');
      }

      setStep('success');
      onOrderComplete();
    } catch (err) {
      console.error('Order creation failed:', err);
      setOrderError(err.message || (isEn ? 'Failed to create order. Please try again.' : 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.'));
      setIsSubmitting(false);
    }
  };

  const paymentLabels = {
    vodafone: 'فودافون كاش (Vodafone Cash)',
    instapay: 'انستا باي (InstaPay)'
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-white border-2 rounded-3xl border-[#C5A059] shadow-2xl flex flex-col animate-popIn"
           style={{ maxHeight: '88svh' }}>


        <button
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-10 h-10 rounded-full bg-[#0D221A] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors shadow-lg active:scale-90"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            
            {/* 1. ORDER SUMMARY & PROMO COUPON (FIRST / TOP) */}
            <div className="lg:col-span-5 bg-[#0D221A] text-white p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-[#C5A059]/30">
              <div>
                <h3 className="text-lg font-bold font-serif text-[#EAD096] mb-4 pb-2 border-b border-[#C5A059]/30 flex items-center justify-between">
                  <span>{isEn ? 'Order Summary' : 'ملخص الطلب والمنتجات'}</span>
                  <span className="bg-[#C5A059] text-[#0D221A] text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {cartItems.length} {isEn ? 'items' : 'عنصر'}
                  </span>
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#C5A059]/40 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white line-clamp-1">{isEn ? (item.nameEn || item.name) : item.name}</h4>
                        <p className="text-gray-400 text-[10px]">{isEn ? 'Qty:' : 'الكمية:'} {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#EAD096]">{item.price * item.quantity} {isEn ? 'EGP' : 'ج.م'}</span>
                    </div>
                  ))}
                </div>

                {/* Promo Coupon Box */}
                <div className="mt-4 p-3 bg-[#143529] rounded-2xl border border-[#C5A059]/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#EAD096]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{isEn ? 'Coupon / Promo Code 🏷️' : 'كود الخصم / الكوبون 🏷️'}</span>
                    </span>
                    {appliedCoupon && (
                      <span className="text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/40">
                        {isEn ? `${appliedCoupon.discountPercentage}% off Active ✓` : `خصم ${appliedCoupon.discountPercentage}% مفعل ✓`}
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isEn ? 'Coupon Code (e.g. VELORA15)' : 'كود الخصم (مثال: VELORA15)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={Boolean(appliedCoupon)}
                      className="flex-1 px-3 py-1.5 bg-[#0D221A] border border-[#C5A059]/40 text-[#EAD096] rounded-xl text-xs uppercase font-mono font-bold focus:outline-none focus:border-[#C5A059]"
                      dir={isEn ? 'ltr' : 'rtl'}
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => { setAppliedCoupon(null); setCouponInput(''); setCouponSuccess(''); }}
                        className="px-3 py-1.5 bg-rose-900/60 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold hover:bg-rose-800"
                      >
                        {isEn ? 'Remove' : 'إلغاء'}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={validatingCoupon || !couponInput.trim()}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#EAD096] to-[#C5A059] text-[#0D221A] rounded-xl text-xs font-black hover:brightness-110 disabled:opacity-50"
                      >
                        {validatingCoupon ? (isEn ? '...' : 'جاري...') : (isEn ? 'Apply' : 'تطبيق')}
                      </button>
                    )}
                  </form>

                  {couponError && <p className="text-[10px] text-rose-400 font-bold">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-emerald-400 font-bold">{couponSuccess}</p>}
                </div>

                <div className="mt-4 pt-3 border-t border-[#C5A059]/30 space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>{isEn ? 'Subtotal:' : 'المجموع قبل الخصم:'}</span>
                    <span>{subtotal} {isEn ? 'EGP' : 'ج.م'}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>{isEn ? `Discount (${appliedCoupon.discountPercentage}%):` : `قيمة الخصم (${appliedCoupon.discountPercentage}%):`}</span>
                      <span>- {discountAmount} {isEn ? 'EGP' : 'ج.م'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>{isEn ? 'Shipping Fee:' : 'الشحن والتوصيل:'}</span>
                    <span className="text-[10px]">{isEn ? 'Paid to courier' : 'يُدفع لشركة الشحن'}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#EAD096] pt-2 border-t border-[#C5A059]/20 font-serif">
                    <span>{isEn ? 'Total:' : 'المجموع النهائي:'}</span>
                    <span>{total} {isEn ? 'EGP' : 'ج.م'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C5A059]/20 text-[11px] text-gray-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>{isEn ? 'VELORA Royal Guarantee: 100% Protected Packaging & Delivery in 2-4 Business Days.' : 'ضمان VELORA الملكي: تغليف محمي 100% وتوصيل خلال 2-4 أيام عمل.'}</span>
              </div>
            </div>

            {/* 2. SHIPPING DATA & PERSONAL FORM (SECOND) */}
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              
              <div>
                <span className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">{isEn ? 'Final Step' : 'الخطوة الأخيرة'}</span>
                <h2 className="text-2xl font-bold text-[#0D221A] font-serif">
                  {isEn ? 'Shipping Details in Egypt' : 'بيانات الشحن والتوصيل في مصر'}
                </h2>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">

                {/* Name field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Full Name *' : 'الاسم الكامل *'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? 'Enter your name' : 'أدخلي اسمك'}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#DFE6DB] transition-all`}
                    dir={isEn ? 'ltr' : 'rtl'}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Mobile Number *' : 'رقم الموبايل *'}</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#DFE6DB] transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Governorate *' : 'المحافظة *'}</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] bg-[#DFE6DB] transition-all"
                      dir={isEn ? 'ltr' : 'rtl'}
                    >
                      {EGYPT_GOVERNORATES.map(c => (
                        <option key={c} value={c} className="text-[#0D221A] bg-white font-bold">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isEn ? 'Detailed Address *' : 'العنوان التفصيلي *'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? 'Area, street, building or apartment no.' : 'المنطقة، الشارع، رقم العمارة أو الشقة'}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#DFE6DB] transition-all"
                    dir={isEn ? 'ltr' : 'rtl'}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-3">{isEn ? 'Available Payment Methods in Egypt 💳' : 'طريقة الدفع المتاحة في مصر 💳'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'vodafone' })}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        formData.paymentMethod === 'vodafone'
                          ? 'bg-[#0D221A] text-[#EAD096] border-[#C5A059] font-bold shadow-md ring-2 ring-[#C5A059]/40'
                          : 'bg-[#DFE6DB] text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-[#C5A059]" />
                      <span className="text-xs font-bold">{isEn ? 'Vodafone Cash' : 'فودافون كاش'}</span>
                      <span className="text-[10px] text-gray-400 font-light">Vodafone Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'instapay' })}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        formData.paymentMethod === 'instapay'
                          ? 'bg-[#0D221A] text-[#EAD096] border-[#C5A059] font-bold shadow-md ring-2 ring-[#C5A059]/40'
                          : 'bg-[#DFE6DB] text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#C5A059]" />
                      <span className="text-xs font-bold">{isEn ? 'InstaPay' : 'انستا باي'}</span>
                      <span className="text-[10px] text-gray-400 font-light">InstaPay</span>
                    </button>

                  </div>
                </div>

                {orderError && (
                  <div className="text-rose-600 bg-rose-50 border border-rose-200 text-xs font-bold p-3 rounded-xl text-center mt-4">
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-base mt-4 shadow-xl disabled:opacity-50"
                >
                  <span>{isSubmitting ? (isEn ? 'Confirming order...' : 'جاري تأكيد الطلب...') : (isEn ? 'Confirm Order & Deliver' : 'تأكيد الطلب والتوصيل')}</span>
                  {!isSubmitting && <ArrowLeft className={`w-5 h-5 ${isEn ? 'rotate-180' : ''}`} />}
                </button>

              </form>

            </div>

          </div>
        ) : completedOrder && (
          <div className="p-6 md:p-10 text-center bg-[#0D221A] text-white space-y-5 overflow-y-auto max-h-[90vh]">
            
            <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">{isEn ? 'Order Confirmed Successfully' : 'تم تأكيد طلبك بنجاح'}</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#EAD096] mt-1">
                {isEn ? 'Thank you for choosing VELORA CARE!' : 'شكراً لاختيارك VELORA CARE!'}
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                {isEn ? 'Your order number is:' : 'رقم الطلب الخاص بك هو:'} <strong className="text-[#C5A059] text-base font-mono">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className={`max-w-lg mx-auto p-5 bg-[#143529] rounded-2xl border border-[#C5A059]/40 text-xs space-y-4 ${isEn ? 'text-left' : 'text-right'}`}>
              
              <div className="border-b border-[#C5A059]/20 pb-3">
                <h4 className="text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {isEn ? 'Customer Details' : 'بيانات العميل'}
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>{isEn ? 'Name:' : 'الاسم:'}</span>
                    <span className="font-bold text-white">{completedOrder.fullName}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>{isEn ? 'Mobile:' : 'الموبايل:'}</span>
                    <span className="font-bold text-white" dir="ltr">{completedOrder.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#C5A059]/20 pb-3">
                <h4 className="text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {isEn ? 'Delivery Address' : 'عنوان التوصيل'}
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>{isEn ? 'Governorate:' : 'المحافظة:'}</span>
                    <span className="font-bold text-white">{completedOrder.city}</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="font-bold text-white text-[11px]">{completedOrder.address}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#C5A059]/20 pb-3">
                <h4 className="text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  {isEn ? `Products (${completedOrder.items.length})` : `المنتجات (${completedOrder.items.length})`}
                </h4>
                <div className="space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded border border-[#C5A059]/30 object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-bold text-[11px] line-clamp-1">{isEn ? (item.nameEn || item.name) : item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.quantity} × {item.price} {isEn ? 'EGP' : 'ج.م'}</p>
                      </div>
                      <span className="font-bold text-[#EAD096]">{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-gray-300 text-[11px]">
                  <span>{isEn ? 'Subtotal:' : 'المجموع الفرعي:'}</span>
                  <span>{completedOrder.subtotal} {isEn ? 'EGP' : 'ج.م'}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>{isEn ? 'Shipping:' : 'الشحن والتوصيل:'}</span>
                  <span className="text-[10px]">{isEn ? 'Paid to courier' : 'يُدفع لشركة الشحن'}</span>
                </div>
                <div className="flex justify-between text-[#EAD096] font-extrabold text-base pt-2 border-t border-[#C5A059]/20 font-serif">
                  <span>{isEn ? 'Total:' : 'الإجمالي:'}</span>
                  <span>{completedOrder.total} {isEn ? 'EGP' : 'ج.م'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C5A059]/20">
                <div className="flex justify-between text-gray-300">
                  <span>{isEn ? 'Payment Method:' : 'طريقة الدفع:'}</span>
                  <span className="font-bold text-[#EAD096]">{paymentLabels[completedOrder.paymentMethod] || completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-300 mt-1">
                  <span>{isEn ? 'Order Status:' : 'حالة الطلب:'}</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">{isEn ? 'Pending' : 'قيد الانتظار'}</span>
                </div>
              </div>

            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {isEn ? 'We will contact you via WhatsApp and mobile on' : 'سيتم التواصل معكِ عبر الواتساب والجوال على الرقم'} <strong className="text-gray-300" dir="ltr">{completedOrder.phone}</strong> {isEn ? 'to provide your tracking link.' : 'لتزويدك برابط تتبع الشحنة فور انطلاقها.'}
            </p>

            <button
              onClick={onClose}
              className="btn-primary px-8 py-3 text-sm"
            >
              {isEn ? 'Back to Store' : 'العودة للتسوق في المتجر'}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
