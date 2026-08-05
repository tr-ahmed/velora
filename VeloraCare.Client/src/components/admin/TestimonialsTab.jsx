import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, MessageSquare, Star } from 'lucide-react';
import { addTestimonialApi, updateTestimonialApi, deleteTestimonialApi } from '../../services/api';

export default function TestimonialsTab({ testimonials, setTestimonials, isEn }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '', nameEn: '', role: '', roleEn: '', avatar: '', comment: '', commentEn: '', rating: 5, product: '', isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', nameEn: '', role: '', roleEn: '', avatar: '', comment: '', commentEn: '', rating: 5, product: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTestimonial(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        const updated = await updateTestimonialApi(editingTestimonial.id, { ...editingTestimonial, ...formData });
        setTestimonials(prev => prev.map(t => t.id === updated.id ? updated : t));
      } else {
        const added = await addTestimonialApi(formData);
        setTestimonials(prev => [added, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving testimonial");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonialApi(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("Error deleting");
    }
  };

  const toggleActive = async (t) => {
    try {
      const updated = await updateTestimonialApi(t.id, { ...t, isActive: !t.isActive });
      setTestimonials(prev => prev.map(x => x.id === updated.id ? updated : x));
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#C5A059]/30 shadow-md space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0D221A] flex items-center gap-2">
            <span>آراء العملاء (الصفحة الرئيسية)</span>
            <MessageSquare className="w-5 h-5 text-[#C5A059]" />
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            إدارة آراء وتجارب العملاء المعروضة في الصفحة الرئيسية
          </p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-[#0D221A] text-[#EAD096] px-4 py-2 rounded-xl text-sm hover:bg-[#143529] transition">
          <Plus className="w-4 h-4" />
          <span>إضافة رأي جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className={`p-4 rounded-xl border relative ${t.isActive ? 'bg-[#0D221A] border-[#C5A059]/40' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[#C5A059]/50" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {t.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className={`text-sm font-bold ${t.isActive ? 'text-white' : 'text-gray-700'}`}>{t.name}</h4>
                  <p className={`text-xs ${t.isActive ? 'text-[#C5A059]' : 'text-gray-500'}`}>{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(t)} className="p-1.5 rounded-lg bg-white/10 hover:bg-black/10 transition" title={t.isActive ? "Hide" : "Show"}>
                  {t.isActive ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                </button>
                <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg bg-white/10 hover:bg-black/10 transition text-[#EAD096]"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-black/10 transition text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />)}
              </div>
              <p className={`text-xs leading-relaxed ${t.isActive ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>{t.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6">
            <h3 className="text-xl font-bold text-[#0D221A] mb-6 border-b pb-4">
              {editingTestimonial ? 'تعديل الرأي' : 'إضافة رأي جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">الاسم (عربي)</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">الاسم (انجليزي)</label><input type="text" required value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="w-full p-2 border rounded-xl" dir="ltr" /></div>
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">اللقب/المدينة (عربي)</label><input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">اللقب/المدينة (انجليزي)</label><input type="text" value={formData.roleEn} onChange={e => setFormData({ ...formData, roleEn: e.target.value })} className="w-full p-2 border rounded-xl" dir="ltr" /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#0D221A] mb-1">رابط الصورة (Avatar URL)</label><input type="url" value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className="w-full p-2 border rounded-xl" dir="ltr" placeholder="https://..." /></div>
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">التقييم (1-5)</label><input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full p-2 border rounded-xl" /></div>
                <div><label className="block text-xs font-bold text-[#0D221A] mb-1">المنتج المقيم (اختياري)</label><input type="text" value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#0D221A] mb-1">التعليق (عربي)</label><textarea required rows={3} value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold text-[#0D221A] mb-1">التعليق (انجليزي)</label><textarea required rows={3} value={formData.commentEn} onChange={e => setFormData({ ...formData, commentEn: e.target.value })} className="w-full p-2 border rounded-xl" dir="ltr" /></div>
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-[#C5A059]" />
                  <label htmlFor="isActive" className="text-sm font-bold text-[#0D221A]">مفعل (يظهر في الموقع)</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-50 text-sm font-bold transition">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-[#0D221A] text-[#EAD096] hover:bg-[#143529] text-sm font-bold transition flex items-center justify-center min-w-[120px]">
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
