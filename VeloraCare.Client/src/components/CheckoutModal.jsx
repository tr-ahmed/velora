import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck, Sparkles, ShoppingBag, ArrowLeft, MapPin, Phone, User, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createOrderApi, saveLocalOrder } from '../services/api';
import { EGYPT_GOVERNORATES } from '../data/governorates';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete, currentUser }) {
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

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        phone: currentUser.phone || prev.phone,
        city: currentUser.city || prev.city,
        address: currentUser.address || prev.address
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
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
      saveLocalOrder({ ...orderPayload, orderNumber: result.orderNumber });
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
      const fallbackOrder = saveLocalOrder(orderPayload);
      setCompletedOrder({
        orderNumber: fallbackOrder.orderNumber,
        ...formData,
        items: [...cartItems],
        subtotal,
        shippingFee,
        total
      });
      setStep('success');
      onOrderComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentLabels = {
    vodafone: 'فودافون كاش (Vodafone Cash)',
    instapay: 'انستا باي (InstaPay)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-white border-t-2 sm:border-2 sm:rounded-3xl border-[#C5A059] shadow-2xl flex flex-col"
           style={{ borderRadius: '28px 28px 0 0', maxHeight: '92svh' }}>
        
        {/* Mobile Grab Handle */}
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-0 sm:hidden flex-shrink-0" />

        <button
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-10 h-10 rounded-full bg-[#0D221A] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors shadow-lg active:scale-90"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              
              <div>
                <span className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">إنهاء الطلب الآمن</span>
                <h2 className="text-2xl font-bold text-[#0D221A] font-serif">
                  بيانات الشحن والتوصيل في مصر
                </h2>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">

                {/* Name field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="أدخلي اسمك الكريم"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#F7F5F0] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الموبايل *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#F7F5F0] transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">المحافظة *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] bg-[#F7F5F0] transition-all"
                    >
                      {EGYPT_GOVERNORATES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">العنوان التفصيلي *</label>
                  <input
                    type="text"
                    required
                    placeholder="المنطقة، الشارع، رقم العمارة أو الشقة"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-[#C5A059]/40 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 bg-[#F7F5F0] transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-3">طريقة الدفع المتاحة في مصر 💳</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'vodafone' })}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        formData.paymentMethod === 'vodafone'
                          ? 'bg-[#0D221A] text-[#EAD096] border-[#C5A059] font-bold shadow-md ring-2 ring-[#C5A059]/40'
                          : 'bg-[#F7F5F0] text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-[#C5A059]" />
                      <span className="text-xs font-bold">فودافون كاش</span>
                      <span className="text-[10px] text-gray-400 font-light">Vodafone Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'instapay' })}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        formData.paymentMethod === 'instapay'
                          ? 'bg-[#0D221A] text-[#EAD096] border-[#C5A059] font-bold shadow-md ring-2 ring-[#C5A059]/40'
                          : 'bg-[#F7F5F0] text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#C5A059]" />
                      <span className="text-xs font-bold">انستا باي</span>
                      <span className="text-[10px] text-gray-400 font-light">InstaPay</span>
                    </button>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-base mt-4 shadow-xl disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب والتوصيل'}</span>
                  {!isSubmitting && <ArrowLeft className="w-5 h-5" />}
                </button>

              </form>

            </div>

            <div className="lg:col-span-5 bg-[#0D221A] text-white p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-[#C5A059]/30">
              <div>
                <h3 className="text-lg font-bold font-serif text-[#EAD096] mb-4 pb-2 border-b border-[#C5A059]/30">
                  ملخص الطلب ({cartItems.length})
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 rounded-lg bg-black/40 border border-[#C5A059]/40 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white line-clamp-1">{item.name}</h4>
                        <p className="text-gray-400 text-[10px]">الكمية: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#EAD096]">{item.price * item.quantity} ج.م</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#C5A059]/30 space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>المجموع:</span>
                    <span>{subtotal} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الشحن والتوصيل:</span>
                    <span>{shippingFee === 0 ? 'مجاني' : `${shippingFee} ج.م`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#EAD096] pt-2 border-t border-[#C5A059]/20 font-serif">
                    <span>المجموع النهائي:</span>
                    <span>{total} ج.م</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C5A059]/20 text-[11px] text-gray-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>ضمان VELORA الملكي: تغليف محمي 100% وتوصيل خلال 2-4 أيام عمل.</span>
              </div>
            </div>

          </div>
        ) : completedOrder && (
          <div className="p-6 md:p-10 text-center bg-[#0D221A] text-white space-y-5 overflow-y-auto max-h-[90vh]">
            
            <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 border-2 border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">تم تأكيد طلبك بنجاح</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#EAD096] mt-1">
                شكراً لاختيارك VELORA CARE!
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                رقم الطلب الخاص بك هو: <strong className="text-[#C5A059] text-base font-mono">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="max-w-lg mx-auto p-5 bg-[#143529] rounded-2xl border border-[#C5A059]/40 text-right text-xs space-y-4">
              
              <div className="border-b border-[#C5A059]/20 pb-3">
                <h4 className="text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  بيانات العميل
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>الاسم:</span>
                    <span className="font-bold text-white">{completedOrder.fullName}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>الموبايل:</span>
                    <span className="font-bold text-white" dir="ltr">{completedOrder.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#C5A059]/20 pb-3">
                <h4 className="text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  عنوان التوصيل
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>المحافظة:</span>
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
                  المنتجات ({completedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded border border-[#C5A059]/30 object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-bold text-[11px] line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.quantity} × {item.price} ج.م</p>
                      </div>
                      <span className="font-bold text-[#EAD096]">{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-gray-300 text-[11px]">
                  <span>المجموع الفرعي:</span>
                  <span>{completedOrder.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-300 text-[11px]">
                  <span>الشحن والتوصيل:</span>
                  <span>{completedOrder.shippingFee === 0 ? 'مجاني' : `${completedOrder.shippingFee} ج.م`}</span>
                </div>
                <div className="flex justify-between text-[#EAD096] font-extrabold text-base pt-2 border-t border-[#C5A059]/20 font-serif">
                  <span>الإجمالي:</span>
                  <span>{completedOrder.total} ج.م</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C5A059]/20">
                <div className="flex justify-between text-gray-300">
                  <span>طريقة الدفع:</span>
                  <span className="font-bold text-[#EAD096]">{paymentLabels[completedOrder.paymentMethod] || completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-300 mt-1">
                  <span>حالة الطلب:</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">قيد الانتظار</span>
                </div>
              </div>

            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              سيتم التواصل معكِ عبر الواتساب والجوال على الرقم <strong className="text-gray-300" dir="ltr">{completedOrder.phone}</strong> لتزويدك برابط تتبع الشحنة فور انطلاقها.
            </p>

            <button
              onClick={onClose}
              className="btn-primary px-8 py-3 text-sm"
            >
              العودة للتسوق في المتجر
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
