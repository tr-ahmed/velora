import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export default function HeroSlideFormModal({ isOpen, onClose, slide, onSave }) {
  const [formData, setFormData] = useState({
    badge: 'المتجر الملكي الأول للعناية العضوية 👑',
    badgeEn: 'The First Royal Organic Care Store 👑',
    titleHighlight: 'إكسير النضارة',
    titleHighlightEn: 'Elixir of Radiance',
    titleRest: 'الزمردية والجمال الفاخر',
    titleRestEn: 'Emerald & Luxurious Beauty',
    description: 'اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية.',
    descriptionEn: 'Discover the VELORA CARE collection extracted from the purest botanicals and organic emerald oils.',
    productTitle: 'سيروم الزمرد لإعادة إحياء الشباب',
    productTitleEn: 'Emerald Youth Revival Serum',
    productSub: 'إكسير نباتي مكثف لإشراقة ملكية',
    productSubEn: 'Intense botanical elixir for royal radiance',
    rating: '★ 4.9',
    productImage: '/images/serum.png',
    miniCardTitle: 'كريم الترطيب الفاخر',
    miniCardTitleEn: 'Luxurious Hydration Cream',
    miniCardOffer: 'منتجات طبيعية 100%',
    miniCardOfferEn: '100% Natural Products',
    miniCardImage: '/images/cream.png',
    active: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData({
        id: slide.id,
        badge: slide.badge || '',
        badgeEn: slide.badgeEn || '',
        titleHighlight: slide.titleHighlight || '',
        titleHighlightEn: slide.titleHighlightEn || '',
        titleRest: slide.titleRest || '',
        titleRestEn: slide.titleRestEn || '',
        description: slide.description || '',
        descriptionEn: slide.descriptionEn || '',
        productTitle: slide.productTitle || '',
        productTitleEn: slide.productTitleEn || '',
        productSub: slide.productSub || '',
        productSubEn: slide.productSubEn || '',
        rating: slide.rating || '★ 5.0',
        productImage: slide.productImage || '/images/serum.png',
        miniCardTitle: slide.miniCardTitle || '',
        miniCardTitleEn: slide.miniCardTitleEn || '',
        miniCardOffer: slide.miniCardOffer || '',
        miniCardOfferEn: slide.miniCardOfferEn || '',
        miniCardImage: slide.miniCardImage || '/images/cream.png',
        active: slide.active !== false
      });
    } else {
      setFormData({
        badge: 'عرض جديد خديوي 👑',
        badgeEn: 'New Royal Offer 👑',
        titleHighlight: 'مستحضر جديد',
        titleHighlightEn: 'New Product',
        titleRest: 'لجمال ونضارة مستمرة',
        titleRestEn: 'for continuous beauty and glow',
        description: 'تركيبة فاخرة مستخلصة من أنقى الزيوت النباتية والزمرد العضوي.',
        descriptionEn: 'Luxurious formula extracted from the purest botanical oils and organic emerald.',
        productTitle: 'مستحضر فيلورا الجديد',
        productTitleEn: 'New Velora Product',
        productSub: 'عناية فائقة وتغذية سريعة',
        productSubEn: 'Ultimate care and fast nutrition',
        rating: '★ 5.0',
        productImage: '/images/serum.png',
        miniCardTitle: 'عرض محدود',
        miniCardTitleEn: 'Limited Offer',
        miniCardOffer: 'خصم 20% لفترة محدودة',
        miniCardOfferEn: '20% off for a limited time',
        miniCardImage: '/images/cream.png',
        active: true
      });
    }
  }, [slide, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: uploadData
      });
      if (res.ok) {
        const result = await res.json();
        setFormData(prev => ({ ...prev, [field]: result.url }));
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#C5A059]/40 shadow-2xl max-w-2xl w-full p-6 space-y-5 text-right my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0D221A] text-[#EAD096] border border-[#C5A059]/40 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-lg text-[#0D221A]">
                {slide ? 'تعديل سلايد الهيرو' : 'إضافة سلايد جديد للهيرو'}
              </h3>
              <p className="text-xs text-gray-500">خصص عنوان وعروض وصور السلايد في الواجهة الرئيسية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Active Status Toggle */}
          <div className="p-3 rounded-2xl bg-[#E6EDE4] border border-[#C5A059]/30 flex items-center justify-between">
            <span className="font-bold text-[#0D221A]">حالة تفعيل السلايد في الواجهة</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">الشارة الترويجية (Badge) *</label>
              <input
                type="text"
                required
                placeholder="المتجر الملكي الأول للعناية العضوية 👑"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none font-bold text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge (EN) *</label>
              <input
                type="text"
                required
                placeholder="The First Royal Organic Care Store 👑"
                value={formData.badgeEn}
                onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none font-bold text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">التقييم المعروض</label>
              <input
                type="text"
                placeholder="★ 4.9"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-emerald-950 mb-1">العنوان البارز الملون *</label>
              <input
                type="text"
                required
                placeholder="إكسير النضارة"
                value={formData.titleHighlight}
                onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                className="w-full px-3.5 py-2 border border-emerald-400 bg-emerald-50/50 rounded-xl focus:border-emerald-700 focus:outline-none font-bold text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Highlighted Title (EN) *</label>
              <input
                type="text"
                required
                placeholder="Elixir of Radiance"
                value={formData.titleHighlightEn}
                onChange={(e) => setFormData({ ...formData, titleHighlightEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-emerald-400 bg-emerald-50/50 rounded-xl focus:border-emerald-700 focus:outline-none font-bold text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">باقي العنوان الرئيسي *</label>
              <input
                type="text"
                required
                placeholder="الزمردية والجمال الفاخر"
                value={formData.titleRest}
                onChange={(e) => setFormData({ ...formData, titleRest: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none font-bold text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Rest of Title (EN) *</label>
              <input
                type="text"
                required
                placeholder="Emerald & Luxurious Beauty"
                value={formData.titleRestEn}
                onChange={(e) => setFormData({ ...formData, titleRestEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none font-bold text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">الوصف التفصيلي للسلايد *</label>
              <textarea
                rows={2}
                required
                placeholder="اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Description (EN) *</label>
              <textarea
                rows={2}
                required
                placeholder="Discover the VELORA CARE collection extracted from the purest botanicals..."
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Main Product Showcase Info */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-[#E6EDE4] space-y-3">
            <h4 className="font-bold text-[#0D221A] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#C5A059]" />
              <span>بيانات المنتج المعروض في السلايد:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-600 mb-1">اسم المنتج المعروض</label>
                <input
                  type="text"
                  placeholder="سيروم الزمرد الملكي"
                  value={formData.productTitle}
                  onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">Product Name (EN)</label>
                <input
                  type="text"
                  placeholder="Emerald Royal Serum"
                  value={formData.productTitleEn}
                  onChange={(e) => setFormData({ ...formData, productTitleEn: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block font-medium text-gray-600 mb-1">الوصف الفرعي للمنتج</label>
                <input
                  type="text"
                  placeholder="إكسير نباتي مكثف لإشراقة ملكية"
                  value={formData.productSub}
                  onChange={(e) => setFormData({ ...formData, productSub: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">Product Subtitle (EN)</label>
                <input
                  type="text"
                  placeholder="Intense botanical elixir for royal radiance"
                  value={formData.productSubEn}
                  onChange={(e) => setFormData({ ...formData, productSubEn: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">رابط أو صورة المنتج الرئيسي</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/images/serum.png أو رابط صورة"
                  value={formData.productImage}
                  onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white"
                />
                <label className="px-3 py-1.5 rounded-xl bg-[#0D221A] text-[#EAD096] font-bold text-[11px] cursor-pointer flex items-center gap-1 hover:bg-[#143529]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'productImage')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Mini Showcase Card Info */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-[#E6EDE4] space-y-3">
            <h4 className="font-bold text-[#0D221A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>بيانات البطاقة المصغرة الإضافية (Mini Card):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-600 mb-1">عنوان البطاقة المصغرة</label>
                <input
                  type="text"
                  placeholder="كريم الترطيب الفاخر"
                  value={formData.miniCardTitle}
                  onChange={(e) => setFormData({ ...formData, miniCardTitle: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">Mini Card Title (EN)</label>
                <input
                  type="text"
                  placeholder="Luxurious Hydration Cream"
                  value={formData.miniCardTitleEn}
                  onChange={(e) => setFormData({ ...formData, miniCardTitleEn: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block font-medium text-gray-600 mb-1">العرض أو الشارة</label>
                <input
                  type="text"
                  placeholder="منتجات طبيعية 100%"
                  value={formData.miniCardOffer}
                  onChange={(e) => setFormData({ ...formData, miniCardOffer: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">Mini Card Offer (EN)</label>
                <input
                  type="text"
                  placeholder="100% Natural Products"
                  value={formData.miniCardOfferEn}
                  onChange={(e) => setFormData({ ...formData, miniCardOfferEn: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:border-[#C5A059] focus:outline-none text-xs bg-white text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary py-2 px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ السلايد</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
