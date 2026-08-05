import React, { useState } from 'react';
import { X, Save, Layers } from 'lucide-react';

export default function CategoryFormModal({ isOpen, onClose, onSave, editingCategory }) {
  const [code, setCode] = useState(editingCategory?.code || '');
  const [name, setName] = useState(editingCategory?.name || '');
  const [nameEn, setNameEn] = useState(editingCategory?.nameEn || '');
  const [description, setDescription] = useState(editingCategory?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(editingCategory?.descriptionEn || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...(editingCategory?.id && { id: editingCategory.id }),
      code: code.trim(),
      name: name.trim(),
      nameEn: nameEn.trim(),
      description: description.trim(),
      descriptionEn: descriptionEn.trim()
    });
    setCode('');
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">

      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl">

        <div className="bg-[#0D221A] text-white p-5 border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-bold font-serif text-base text-[#EAD096]">
              {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
            </h3>
          </div>
          <button
            onClick={() => { setCode(''); setName(''); setNameEn(''); setDescription(''); setDescriptionEn(''); onClose(); }}
            className="w-8 h-8 rounded-full bg-[#143529] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">الرمز (Code) *</label>
            <input
              type="text"
              required
              dir="ltr"
              placeholder="serum"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">معرف التصنيف المستخدم لربط المنتجات (مثال: serum, moisturizer, oils)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم التصنيف *</label>
              <input
                type="text"
                required
                placeholder="مثال: سيروم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category Name (EN) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Serum"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">وصف التصنيف</label>
              <textarea
                rows={3}
                placeholder="وصف قصير لهذا التصنيف..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description (EN)</label>
              <textarea
                rows={3}
                placeholder="Short description for this category..."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:border-[#C5A059] focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setCode(''); setName(''); setNameEn(''); setDescription(''); setDescriptionEn(''); onClose(); }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-100"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="btn-primary px-6 py-2 text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingCategory ? 'حفظ التعديلات' : 'حفظ التصنيف'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
