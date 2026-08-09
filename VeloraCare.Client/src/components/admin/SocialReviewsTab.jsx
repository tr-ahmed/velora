import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import {
  fetchSocialReviewsApi,
  createSocialReviewApi,
  updateSocialReviewApi,
  deleteSocialReviewApi,
  fetchSocialReviewSettingsApi,
  updateSocialReviewSettingsApi,
  API_BASE_URL
} from '../../services/api';

export default function SocialReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState({
    isVisible: true,
    sectionTitle: 'آراء عملائنا',
    sectionTitleEn: 'Customer Reviews',
    sectionSubtitle: 'تجارب حقيقية من عملائنا على وسائل التواصل الاجتماعي',
    sectionSubtitleEn: 'Real experiences from our customers on social media',
    autoPlay: true,
    autoPlayInterval: 3
  });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const revData = await fetchSocialReviewsApi(false);
      const setData = await fetchSocialReviewSettingsApi();
      setReviews(revData);
      if (setData) setSettings(setData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    await updateSocialReviewSettingsApi(settings);
    alert('تم الحفظ بنجاح');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    // Upload image
    const res = await fetch(`${API_BASE_URL}/Upload/image?folder=reviews`, {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      const data = await res.json();
      const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');
      const newReview = {
        imageUrl: data.url.replace(IMAGE_BASE_URL, ''), // Store relative path
        isActive: true,
        displayOrder: reviews.length + 1
      };
      
      const created = await createSocialReviewApi(newReview);
      setReviews([...reviews, created]);
    } else {
      alert('فشل رفع الصورة');
    }
    
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      await deleteSocialReviewApi(id);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const toggleActive = async (review) => {
    const updated = { ...review, isActive: !review.isActive };
    await updateSocialReviewApi(review.id, updated);
    setReviews(reviews.map(r => r.id === review.id ? updated : r));
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Settings Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">إعدادات قسم السوشيال ميديا</h2>
          <button onClick={handleSettingsSave} className="flex items-center gap-2 bg-[#0D221A] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#143529]">
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.isVisible}
                onChange={e => setSettings({...settings, isVisible: e.target.checked})}
                className="w-5 h-5 rounded text-[#0D221A]" 
              />
              <span className="font-semibold text-gray-900">عرض القسم في الموقع (Is Visible)</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">العنوان (عربي)</label>
            <input 
              type="text" 
              value={settings.sectionTitle}
              onChange={e => setSettings({...settings, sectionTitle: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">العنوان (إنجليزي)</label>
            <input 
              type="text" 
              value={settings.sectionTitleEn}
              onChange={e => setSettings({...settings, sectionTitleEn: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">الوصف (عربي)</label>
            <input 
              type="text" 
              value={settings.sectionSubtitle}
              onChange={e => setSettings({...settings, sectionSubtitle: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">الوصف (إنجليزي)</label>
            <input 
              type="text" 
              value={settings.sectionSubtitleEn}
              onChange={e => setSettings({...settings, sectionSubtitleEn: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl" 
              dir="ltr"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 flex items-center gap-6 mt-4 p-4 bg-gray-50 rounded-xl border">
             <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.autoPlay}
                onChange={e => setSettings({...settings, autoPlay: e.target.checked})}
                className="w-5 h-5 rounded text-[#0D221A]" 
              />
              <span className="font-semibold text-gray-900">تشغيل تلقائي (AutoPlay)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">سرعة العرض (ثواني)</span>
              <input 
                type="number" 
                value={settings.autoPlayInterval}
                onChange={e => setSettings({...settings, autoPlayInterval: parseInt(e.target.value)})}
                className="w-20 px-3 py-1 border rounded-lg" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">صور التقييمات ({reviews.length})</h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#C5A059] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#b08d48]"
          >
            <Plus className="w-4 h-4" />
            إضافة صورة
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden" 
          />
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {reviews.map((r, index) => (
              <div key={r.id} className="relative group rounded-xl border overflow-hidden">
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${r.imageUrl}`} 
                  alt="Review" 
                  className={`w-full h-48 object-cover transition-opacity ${!r.isActive ? 'opacity-50' : 'opacity-100'}`}
                />
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3">
                  <button 
                    onClick={() => toggleActive(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${r.isActive ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}
                  >
                    {r.isActive ? 'إخفاء' : 'تفعيل'}
                  </button>
                  <button 
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold"
                  >
                    حذف
                  </button>
                </div>
                
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
