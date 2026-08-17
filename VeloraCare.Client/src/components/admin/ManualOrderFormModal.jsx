import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, ShoppingBag } from 'lucide-react';

export default function ManualOrderFormModal({ isOpen, onClose, onSave, products = [] }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'القاهرة',
    address: '',
    paymentMethod: 'vodafone',
    paymentReference: ''
  });

  const [cartItems, setCartItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(50);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        phone: '',
        city: 'القاهرة',
        address: '',
        paymentMethod: 'vodafone',
        paymentReference: ''
      });
      setCartItems([]);
      setShippingFee(50);
      setSelectedProductId('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + Number(shippingFee);

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.title, price: product.price, quantity: 1 }];
    });
    setSelectedProductId('');
  };

  const handleRemoveProduct = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('يجب إضافة منتج واحد على الأقل.');
      return;
    }
    if (!formData.fullName || !formData.phone || !formData.address) {
      setError('يرجى إكمال جميع بيانات العميل الأساسية.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      subtotal: subtotal,
      shippingFee: Number(shippingFee),
      total: total,
      paymentMethod: formData.paymentMethod,
      paymentReference: formData.paymentReference,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء حفظ الطلب.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="bg-[#0D221A] p-2.5 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D221A] font-serif">تسجيل طلب خارجي جديد</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Customer & Payment Details */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-[#C5A059] border-b pb-2">بيانات العميل</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all"
                  placeholder="الاسم الثلاثي"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">رقم الموبايل *</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all text-right"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">المحافظة</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none transition-all resize-none"
                  placeholder="اسم الشارع، رقم العمارة، الشقة، علامة مميزة"
                />
              </div>

              <h3 className="text-lg font-bold text-[#C5A059] border-b pb-2 mt-6">بيانات الدفع</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">طريقة الدفع</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] outline-none"
                  >
                    <option value="vodafone">فودافون كاش</option>
                    <option value="instapay">انستا باي</option>
                    <option value="cod">الدفع عند الاستلام</option>
                  </select>
                </div>
                {formData.paymentMethod !== 'cod' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">رقم التحويل / المرجع</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.paymentReference}
                      onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] outline-none text-right font-mono"
                      placeholder="رقم المحفظة المحول منها"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Order Items & Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-bold text-[#C5A059] border-b pb-2 mb-4">المنتجات</h3>
              
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] outline-none"
                >
                  <option value="">-- اختر منتجاً للإضافة --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} - {p.price} ج.م</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!selectedProductId}
                  className="bg-[#0D221A] text-[#C5A059] px-4 py-2 rounded-xl font-bold hover:bg-[#153327] disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-5 h-5" /> إضافة
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-xl bg-white min-h-[150px]">
                {cartItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4">
                    لم يتم إضافة منتجات بعد
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-[#C5A059] font-serif">{item.price} ج.م</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                            <button type="button" onClick={() => handleQuantityChange(item.id, 1)} className="px-2 py-1 text-gray-600 hover:text-black font-bold">+</button>
                            <span className="px-2 text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                            <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="px-2 py-1 text-gray-600 hover:text-black font-bold">-</button>
                          </div>
                          <button type="button" onClick={() => handleRemoveProduct(item.id)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 mt-auto">
                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                  <span>المجموع الفرعي (المنتجات):</span>
                  <span>{subtotal} ج.م</span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                  <span className="flex-1">رسوم الشحن:</span>
                  <input 
                    type="number" 
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C5A059] outline-none"
                    min="0"
                  />
                  <span className="mr-2">ج.م</span>
                </div>

                <div className="flex justify-between items-center text-xl font-bold text-[#0D221A] bg-[#C5A059]/20 p-3 rounded-xl border border-[#C5A059]/30">
                  <span>الإجمالي المطلوب:</span>
                  <span>{total} ج.م</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2 pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#0D221A] text-[#C5A059] font-bold rounded-xl hover:bg-[#153327] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>جاري الحفظ...</>
                ) : (
                  <><Save className="w-5 h-5" /> حفظ الطلب</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
