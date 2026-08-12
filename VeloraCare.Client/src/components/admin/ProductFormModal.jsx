import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Package, Upload, Link, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export default function ProductFormModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    tagline: '',
    taglineEn: '',
    description: '',
    descriptionEn: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    category: 'serum',
    image: '/images/serum.png',
    badge: '',
    badgeEn: '',
    stock: 50,
    ingredients: '',
    ingredientsEn: '',
    benefits: '',
    benefitsEn: '',
    howToUse: '',
    howToUseEn: '',
    volume: '50ml',
    skinType: 'جميع أنواع البشرة',
    skinTypeEn: 'All Skin Types'
  });
  const [imageMode, setImageMode] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        nameEn: product.nameEn || '',
        tagline: product.tagline || '',
        taglineEn: product.taglineEn || '',
        description: product.description || '',
        descriptionEn: product.descriptionEn || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        costPrice: product.costPrice || '',
        category: product.category || 'serum',
        image: product.image || '/images/serum.png',
        badge: product.badge || '',
        badgeEn: product.badgeEn || '',
        stock: product.stock || 50,
        ingredients: product.ingredients || '',
        ingredientsEn: product.ingredientsEn || '',
        benefits: product.benefits || '',
        benefitsEn: product.benefitsEn || '',
        howToUse: product.howToUse || '',
        howToUseEn: product.howToUseEn || '',
        volume: product.volume || '50ml',
        skinType: product.skinType || 'جميع أنواع البشرة',
        skinTypeEn: product.skinTypeEn || 'All Skin Types'
      });
      if (product.image && product.image.startsWith('http')) {
        setImageMode('url');
      } else {
        setImageMode('url');
      }
    } else {
      setFormData({
        name: '',
        nameEn: '',
        tagline: '',
        taglineEn: '',
        description: '',
        descriptionEn: '',
        price: '',
        originalPrice: '',
        costPrice: '',
        category: 'serum',
        image: '/images/serum.png',
        badge: '',
        badgeEn: '',
        stock: 50,
        ingredients: '',
        ingredientsEn: '',
        benefits: '',
        benefitsEn: '',
        howToUse: '',
        howToUseEn: '',
        volume: '50ml',
        skinType: 'جميع أنواع البشرة',
        skinTypeEn: 'All Skin Types'
      });
      setImageMode('url');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: uploadData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }
      const result = await res.json();
      setFormData({ ...formData, image: result.url });
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      costPrice: formData.costPrice ? Number(formData.costPrice) : null,
      stock: Number(formData.stock)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0D221A] text-white p-5 border-b border-[#C5A059]/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-bold font-serif text-base text-[#EAD096]">
              {product ? 'تعديل بيانات المنتج الشاملة' : 'إضافة منتج ملكي جديد'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#143529] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم المنتج *</label>
              <input
                type="text"
                required
                placeholder="مثال: سيروم الزمرد للإحياء"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Name (EN)</label>
              <input
                type="text"
                placeholder="e.g. Emerald Revive Serum"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">التصنيف *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none cursor-pointer"
              >
                <option value="serum">السيروم والإكسير 🧪</option>
                <option value="moisturizer">الترطيب الفاخر 🧴</option>
                <option value="oils">زيوت البشرة الزمردية 🌿</option>
                <option value="candles">شموع الاسترخاء 🕯️</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">الشعار الترويجي الفرعي (Tagline)</label>
              <input
                type="text"
                placeholder="مثال: إكسير نباتي مكثف لإشراقة ملكية"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tagline (EN)</label>
              <input
                type="text"
                placeholder="e.g. Intense botanical elixir for royal radiance"
                value={formData.taglineEn}
                onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0D221A] mb-1">سعر البيع الحالي (ج.م) *</label>
              <input
                type="number"
                required
                placeholder="650"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">السعر الأصلي (بدلاً من) <s>ج.م</s></label>
              <input
                type="number"
                placeholder="850"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border border-rose-300 bg-rose-50/50 rounded-xl text-xs font-bold text-rose-800 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#143529] mb-1">سعر التكلفة (ج.م) 🏷️</label>
              <input
                type="number"
                placeholder="290"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-emerald-400 bg-emerald-50/60 rounded-xl text-xs font-bold focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">المخزون *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          {/* Live Profit Margin Calculator Banner */}
          {parseFloat(formData.price) > 0 && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0D221A] via-[#143529] to-[#0D221A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border border-[#C5A059]/40 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-[#EAD096] font-bold">حاسبة الأرباح الحية:</span>
                <span>صافي ربح القطعة: <strong className="text-emerald-400 font-extrabold text-sm">{parseFloat(formData.price) - (parseFloat(formData.costPrice) || Math.round(parseFloat(formData.price) * 0.45))} ج.م</strong></span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#0D221A] font-black text-xs shadow-sm">
                نسبة هامش الربح: {Math.round(((parseFloat(formData.price) - (parseFloat(formData.costPrice) || Math.round(parseFloat(formData.price) * 0.45))) / parseFloat(formData.price)) * 100)}%
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">حجم العبوة (مثال: 50ml / 30ml)</label>
              <input
                type="text"
                placeholder="30ml"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">نوع البشرة المناسب</label>
              <input
                type="text"
                placeholder="جميع أنواع البشرة"
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Skin Type (EN)</label>
              <input
                type="text"
                placeholder="All Skin Types"
                value={formData.skinTypeEn}
                onChange={(e) => setFormData({ ...formData, skinTypeEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">صورة المنتج *</label>
            
            {/* Toggle between Upload and URL */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  imageMode === 'upload'
                    ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059]'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                رفع صورة
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  imageMode === 'url'
                    ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059]'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                رابط خارجي
              </button>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mb-3 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
                <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-[#C5A059]/40" />
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold">معاينة الصورة</p>
                  <p className="text-[10px] text-gray-600 font-mono truncate max-w-xs">{formData.image}</p>
                </div>
              </div>
            )}

            {imageMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="product-image-upload"
                />
                <label
                  htmlFor="product-image-upload"
                  className={`flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploading
                      ? 'border-[#C5A059]/40 bg-gray-50 cursor-wait'
                      : 'border-gray-300 hover:border-[#C5A059] hover:bg-[#DFE6DB]'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-[#C5A059] animate-spin" />
                      <span className="text-xs text-gray-500 font-bold">جاري رفع الصورة...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs text-gray-500 font-bold">اضغط لاختيار صورة (JPG, PNG, WebP - حد أقصى 5MB)</span>
                    </>
                  )}
                </label>
                {uploadError && <p className="text-[11px] text-rose-600 font-bold mt-1">{uploadError}</p>}
              </div>
            ) : (
              <input
                type="url"
                required
                placeholder="https://example.com/product-image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs ltr font-mono focus:border-[#C5A059] focus:outline-none"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">الشارة الترويجية (Badge)</label>
              <input
                type="text"
                placeholder="الأكثر مبيعاً 👑"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Badge (EN)</label>
              <input
                type="text"
                placeholder="Best Seller 👑"
                value={formData.badgeEn}
                onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">المكونات النادرة العضوية</label>
              <textarea
                rows="2"
                placeholder="زيت الزمرد النادر، حمض الهيالورونيك، فيتامين C..."
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ingredients (EN)</label>
              <textarea
                rows="2"
                placeholder="Rare Emerald Oil, Hyaluronic Acid, Vitamin C..."
                value={formData.ingredientsEn}
                onChange={(e) => setFormData({ ...formData, ingredientsEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">فوائد المستحضر للبشرة</label>
              <textarea
                rows="2"
                placeholder="ترطيب يدوم 72 ساعة، تحفيز الكولاجين، إشراقة وتوحيد لون البشرة..."
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Benefits (EN)</label>
              <textarea
                rows="2"
                placeholder="72h hydration, collagen boost, brightening..."
                value={formData.benefitsEn}
                onChange={(e) => setFormData({ ...formData, benefitsEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">طريقة الاستخدام الصحية</label>
              <textarea
                rows="2"
                placeholder="ضعي 3 قطرات على بشرة نظيفة وجافة صباحاً ومساءً..."
                value={formData.howToUse}
                onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">How To Use (EN)</label>
              <textarea
                rows="2"
                placeholder="Apply 3 drops to clean dry skin morning and night..."
                value={formData.howToUseEn}
                onChange={(e) => setFormData({ ...formData, howToUseEn: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none resize-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3 flex-shrink-0">
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
              <span>حفظ التعديلات</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
