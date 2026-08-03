import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { validateCouponApi } from '../services/api';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal === 0 ? 0 : 60;
  const total = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    setCouponLoading(true);
    try {
      const result = await validateCouponApi(coupon.trim());
      setDiscountPercent(result.discountPercentage);
      setCouponSuccess(`تم تطبيق خصم ${result.discountPercentage}% بنجاح!`);
    } catch (err) {
      setDiscountPercent(0);
      setCouponError(err.message || 'كود الخصم غير صحيح');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn" aria-modal="true" role="dialog">
      
      {/* Backdrop click */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* ============================================================
          MOBILE: Centered Modal Dialog
          ============================================================ */}
      <div className="sm:hidden relative w-full max-w-md bg-white rounded-3xl border-2 border-[#C5A059] shadow-2xl animate-popIn flex flex-col overflow-hidden"
           style={{
             maxHeight: '88svh'
           }}>


        {/* Sheet Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pb-3 pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="font-extrabold text-[#0D221A] text-base font-serif">سلة التسوق</h3>
            <p className="text-xs text-gray-500">{cartItems.length} منتج</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0D221A] text-[#EAD096] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>



        {/* Scrollable items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3" style={{ overscrollBehavior: 'contain' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-800 text-base">سلتك فارغة حالياً</h4>
              <p className="text-xs text-gray-500 max-w-[220px] mx-auto">
                استكشفي منتجات VELORA CARE واختاري إكسير النضارة المناسب.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[#F7F5F0] rounded-2xl border border-[#C5A059]/20"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-[#0D221A] overflow-hidden flex-shrink-0 border border-[#C5A059]/30">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold text-[#0D221A] line-clamp-1">{item.name}</h4>
                  <p className="text-sm font-extrabold text-[#987834] mt-0.5 font-serif">{item.price} ج.م</p>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#C5A059]/40 flex items-center justify-center text-[#0D221A] active:scale-90 transition-transform"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-extrabold w-5 text-center text-[#0D221A]">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#C5A059]/40 flex items-center justify-center text-[#0D221A] active:scale-90 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
                  aria-label="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer sticky */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3 pb-4 space-y-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
            
            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#C5A059] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="كود الخصم"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="input-mobile pr-9 text-sm h-12"
                />
              </div>
              <button
                type="submit"
                disabled={couponLoading}
                className="bg-[#0D221A] text-[#EAD096] text-sm font-bold px-4 h-12 rounded-xl hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {couponLoading ? '...' : 'تطبيق'}
              </button>
            </form>
            {couponSuccess && <p className="text-xs text-emerald-700 font-bold">{couponSuccess}</p>}
            {couponError && <p className="text-xs text-rose-600 font-bold">{couponError}</p>}

            {/* Totals */}
            <div className="space-y-2 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-gray-800">{subtotal} ج.م</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>الخصم ({discountPercent}%):</span>
                  <span className="font-bold">-{discountAmount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>رسوم الشحن:</span>
                <span>{shippingFee === 0 ? '-' : `${shippingFee} ج.م`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0D221A] pt-2 border-t border-gray-100">
                <span>المجموع الكلي:</span>
                <span className="text-[#987834]">{total} ج.م</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onProceedToCheckout}
              className="btn-primary w-full py-4 text-base justify-center"
            >
              <span>إتمام الشراء</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>دفع آمن 100% | ضمان استرجاع 14 يوم</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          DESKTOP: Side Drawer (right side)
          ============================================================ */}
      <div className="hidden sm:flex absolute top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl flex-col border-l-2 border-[#C5A059] transition-transform duration-300">

        {/* Drawer Header */}
        <div className="bg-[#0D221A] text-white p-5 border-b border-[#C5A059]/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
            <div>
              <h3 className="font-bold font-serif text-lg text-[#EAD096]">سلة التسوق الملكية</h3>
              <p className="text-[11px] text-gray-300">{cartItems.length} منتجات مختارة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#143529] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-800 text-lg">سلتك فارغة حالياً</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">استكشفي منتجات VELORA CARE العضوية واختاري إكسير النضارة المناسب.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-[#F7F5F0] rounded-2xl border border-[#C5A059]/20 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-[#0D221A] overflow-hidden flex-shrink-0 border border-[#C5A059]/40">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[#0D221A] line-clamp-1">{item.name}</h4>
                  <p className="text-xs font-extrabold text-[#987834] mt-1 font-serif">{item.price} ج.م</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-[#C5A059]/40 flex items-center justify-center hover:bg-[#C5A059] hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-[#C5A059]/40 flex items-center justify-center hover:bg-[#C5A059] hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-400 hover:text-rose-600 p-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white p-5 border-t border-[#C5A059]/30 space-y-4 shadow-lg flex-shrink-0">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#C5A059] absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="كود الخصم (مثال: VELORA15)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs border border-[#C5A059]/40 rounded-xl focus:outline-none focus:border-[#C5A059] bg-[#F7F5F0]"
                />
              </div>
              <button
                type="submit"
                disabled={couponLoading}
                className="bg-[#0D221A] text-[#EAD096] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors disabled:opacity-50"
              >
                {couponLoading ? 'جاري...' : 'تطبيق'}
              </button>
            </form>

            {couponSuccess && <p className="text-[11px] text-emerald-700 font-bold">{couponSuccess}</p>}
            {couponError && <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>}

            <div className="space-y-1.5 text-xs text-gray-600 border-t pt-3">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-gray-800">{subtotal} ج.م</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم ({discountPercent}%):</span>
                  <span>-{discountAmount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>رسوم الشحن:</span>
                <span>{shippingFee === 0 ? '-' : `${shippingFee} ج.م`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#0D221A] pt-2 border-t font-serif">
                <span>المجموع الكلي:</span>
                <span className="text-[#987834]">{total} ج.م</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-xl"
            >
              <span>إتمام طلب الشراء الملكي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-light pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>دفع آمن 100% | استرجاع خلال 14 يوم</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
