import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';

export default function CouponFormModal({ isOpen, onClose, onSave }) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      code: code.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      isActive
    });
    setCode('');
    setDiscountPercentage(15);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#0D221A] text-white p-5 border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-bold font-serif text-base text-[#EAD096]">
              إضافة كود خصم جديد
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#143529] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">كود الخصم *</label>
            <input
              type="text"
              required
              placeholder="مثال: SUMMER20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs uppercase font-mono font-bold focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">نسبة الخصم (%) *</label>
            <input
              type="number"
              required
              min="1"
              max="90"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="couponActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#0D221A] border-gray-300 rounded"
            />
            <label htmlFor="couponActive" className="text-xs font-bold text-gray-700 cursor-pointer">
              تفعيل الكود فوراً للمتجر
            </label>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-100"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="btn-primary px-6 py-2 text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الكود</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
