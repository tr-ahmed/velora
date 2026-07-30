import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Clock, Tag } from 'lucide-react';

export default function OfferFormModal({ isOpen, onClose, offer, onSave }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [couponCode, setCouponCode] = useState('VELORA15');
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [hoursValid, setHoursValid] = useState(48);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (offer) {
      setTitle(offer.title || '');
      setSubtitle(offer.subtitle || '');
      setCouponCode(offer.couponCode || 'VELORA15');
      setDiscountPercentage(offer.discountPercentage || 15);
      setIsActive(offer.isActive ?? true);
    } else {
      setTitle('عروض الفلاش السريعة ✨');
      setSubtitle('خصم ملكي حصري 15% على كافة السيرومات والزيوت الزمردية في مصر');
      setCouponCode('VELORA15');
      setDiscountPercentage(15);
      setHoursValid(48);
      setIsActive(true);
    }
  }, [offer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const endTime = new Date(Date.now() + Number(hoursValid) * 3600 * 1000).toISOString();
    onSave({
      ...(offer || {}),
      title: title.trim(),
      subtitle: subtitle.trim(),
      couponCode: couponCode.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      endTime: offer?.endTime || endTime,
      isActive
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl animate-popIn">
        
        {/* Header */}
        <div className="bg-[#0D221A] text-white p-5 border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-bold font-serif text-base text-[#EAD096]">
              {offer ? 'تعديل عرض فلاش' : 'إضافة عرض فلاش جديد'}
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
            <label className="block text-xs font-bold text-gray-700 mb-1">عنوان العرض الرئيسي *</label>
            <input
              type="text"
              required
              placeholder="مثال: عروض الفلاش السريعة ✨"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">وصف العرض والخصم *</label>
            <input
              type="text"
              required
              placeholder="مثال: خصم ملكي 15% على السيروم والزيوت الزمردية"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">كود الخصم المرتبط *</label>
              <input
                type="text"
                required
                placeholder="VELORA15"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-mono font-bold uppercase focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">نسبة الخصم (%) *</label>
              <input
                type="number"
                required
                min="5"
                max="90"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">مدة العداد التنازلي (بالساعات) *</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#C5A059] absolute right-3 top-3" />
              <input
                type="number"
                required
                min="1"
                max="168"
                value={hoursValid}
                onChange={(e) => setHoursValid(e.target.value)}
                className="w-full pr-9 pl-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="offerActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#0D221A] border-gray-300 rounded"
            />
            <label htmlFor="offerActive" className="text-xs font-bold text-gray-700 cursor-pointer">
              تفعيل العرض فوراً في المتجر وبنر الصفحة الرئيسية
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="btn-primary flex-1 py-3 text-xs justify-center shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>حفظ العرض الملكي</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-3 px-5 text-xs justify-center"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
