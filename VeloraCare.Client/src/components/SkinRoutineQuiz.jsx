import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SkinRoutineQuiz({ onClose, onAddRoutineToCart }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    skinType: '',
    goal: '',
    preference: ''
  });

  const skinTypes = [
    { id: 'dry', label: 'بشرة جافة', desc: 'تحتاج ترطيباً مكثفاً واستعادة مرونة' },
    { id: 'combination', label: 'بشرة مختلطة', desc: 'توازن بين المناطق الدهنية والجافة' },
    { id: 'sensitive', label: 'بشرة حساسة', desc: 'تتطلب مكونات لطيفة ومهدئة جداً' },
    { id: 'aging', label: 'بشرة تحتاج نضارة', desc: 'تركز على مرونة الشباب وتقليل الخطوط' }
  ];

  const goals = [
    { id: 'glow', label: 'إشراقة ونضارة ملفتة', desc: 'تفتيح واكتساب لمعة ملكية طبيعية' },
    { id: 'hydration', label: 'ترطيب عميق 24 ساعة', desc: 'القضاء على الجفاف والتغشية' },
    { id: 'antiaging', label: 'محاربة علامات التقدم بالسن', desc: 'شد البشرة وتحفيز الكولاجين' }
  ];

  const preferences = [
    { id: 'serum', label: 'سيرومات سريعة الامتصاص', desc: 'تركيبة خفيفة وعالية التركيز' },
    { id: 'cream', label: 'كريمات قوام مخملي غني', desc: 'شعور فاخر ومحيط حماية غني' },
    { id: 'oil', label: 'زيوت طبيعية مغذية', desc: 'ترطيب عميق ولمعان ساطع' }
  ];

  const handleSelect = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const recommendedProducts = PRODUCTS.slice(0, 3); // 3-step routine

  const handleAddAll = () => {
    onAddRoutineToCart(recommendedProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0D221A] text-white rounded-3xl p-6 md:p-10 border-2 border-[#C5A059] shadow-2xl overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-[#C5A059] hover:text-white rounded-full bg-[#143529]"
        >
          <X className="w-6 h-6" />
        </button>

        {step <= 3 ? (
          <div>
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <span className="text-sm font-bold text-[#EAD096]">اختبار روتين VELORA لمطابقة بشرتك</span>
              </div>
              <span className="text-xs bg-[#143529] px-3 py-1 rounded-full border border-[#C5A059]/40 text-[#C5A059]">
                خطوة {step} من 3
              </span>
            </div>

            {/* Step 1: Skin Type */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold font-serif text-[#EAD096]">
                  1. ما هو نوع بشرتك الحالي؟
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skinTypes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect('skinType', item.id)}
                      className={`p-4 rounded-2xl text-right border transition-all ${
                        answers.skinType === item.id
                          ? 'bg-[#C5A059] text-[#0D221A] border-white font-bold scale-102'
                          : 'bg-[#143529] text-gray-200 border-[#C5A059]/30 hover:border-[#C5A059]'
                      }`}
                    >
                      <p className="font-bold text-base">{item.label}</p>
                      <p className={`text-xs mt-1 ${answers.skinType === item.id ? 'text-[#0D221A]/80' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Main Goal */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold font-serif text-[#EAD096]">
                  2. ما هو هدفك الأول لمظهر بشرتك؟
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect('goal', item.id)}
                      className={`p-4 rounded-2xl text-right border transition-all ${
                        answers.goal === item.id
                          ? 'bg-[#C5A059] text-[#0D221A] border-white font-bold scale-102'
                          : 'bg-[#143529] text-gray-200 border-[#C5A059]/30 hover:border-[#C5A059]'
                      }`}
                    >
                      <p className="font-bold text-base">{item.label}</p>
                      <p className={`text-xs mt-1 ${answers.goal === item.id ? 'text-[#0D221A]/80' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Texture Preference */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold font-serif text-[#EAD096]">
                  3. ما القوام والملمس المفضل لديك في المستحضرات؟
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {preferences.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect('preference', item.id)}
                      className={`p-4 rounded-2xl text-right border transition-all ${
                        answers.preference === item.id
                          ? 'bg-[#C5A059] text-[#0D221A] border-white font-bold scale-102'
                          : 'bg-[#143529] text-gray-200 border-[#C5A059]/30 hover:border-[#C5A059]'
                      }`}
                    >
                      <p className="font-bold text-base">{item.label}</p>
                      <p className={`text-xs mt-1 ${answers.preference === item.id ? 'text-[#0D221A]/80' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#C5A059]/30">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#C5A059] text-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              ) : <div />}

              <button
                disabled={
                  (step === 1 && !answers.skinType) ||
                  (step === 2 && !answers.goal) ||
                  (step === 3 && !answers.preference)
                }
                onClick={() => setStep(step + 1)}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{step === 3 ? 'إظهار الروتين المناسب لي ✦' : 'التالي'}</span>
                {step < 3 && <ArrowLeft className="w-4 h-4" />}
              </button>
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold font-serif text-[#EAD096]">
              روتين VELORA الزمردي المخصص لبشرتك ✨
            </h3>

            <p className="text-xs text-gray-300">
              بناءً على إجاباتك، صممنا لكِ روتيناً مكوناً من 3 خطوات متكاملة يضمن لك النضارة الكاملة خلال 14 يوماً.
            </p>

            {/* Recommended Products Bundle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {recommendedProducts.map((p, index) => (
                <div key={p.id} className="bg-[#143529] p-3 rounded-2xl border border-[#C5A059]/40 text-right">
                  <span className="text-[10px] text-[#C5A059] font-bold">الخطوة {index + 1}</span>
                  <div className="w-full h-24 my-2 rounded-xl overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-[#C5A059] font-bold mt-1">{p.price} ج.م</p>
                </div>
              ))}
            </div>

            {/* Special Discount offer */}
            <div className="p-3 bg-[#C5A059]/20 border border-[#C5A059] rounded-2xl text-xs text-[#EAD096] flex items-center justify-between">
              <span>وفري 20% عند شراء الروتين الكامل الآن</span>
              <span className="font-extrabold text-white text-sm">مجموع المجموعة: 1550 ج.م (بدلاً من 1950 ج.م)</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddAll}
                className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة الروتين الكامل للسلة بخصم 20%</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="btn-secondary py-3 text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة الاختبار</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
