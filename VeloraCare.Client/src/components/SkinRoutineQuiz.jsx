import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SkinRoutineQuiz({ onClose, onAddRoutineToCart, products = [] }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    skinType: '',
    goal: '',
    preference: ''
  });

  const skinTypes = [
    { id: 'dry', label: isEn ? 'Dry Skin' : 'بشرة جافة', desc: isEn ? 'Needs intense hydration and elasticity' : 'تحتاج ترطيباً مكثفاً واستعادة مرونة' },
    { id: 'combination', label: isEn ? 'Combination Skin' : 'بشرة مختلطة', desc: isEn ? 'Balance between oily and dry areas' : 'توازن بين المناطق الدهنية والجافة' },
    { id: 'sensitive', label: isEn ? 'Sensitive Skin' : 'بشرة حساسة', desc: isEn ? 'Requires very gentle and soothing ingredients' : 'تتطلب مكونات لطيفة ومهدئة جداً' },
    { id: 'aging', label: isEn ? 'Aging Skin' : 'بشرة تحتاج نضارة', desc: isEn ? 'Focuses on youthful elasticity and reducing lines' : 'تركز على مرونة الشباب وتقليل الخطوط' }
  ];

  const goals = [
    { id: 'glow', label: isEn ? 'Radiance and Glow' : 'إشراقة ونضارة ملفتة', desc: isEn ? 'Brighten and gain a natural royal shine' : 'تفتيح واكتساب لمعة ملكية طبيعية' },
    { id: 'hydration', label: isEn ? '24h Deep Hydration' : 'ترطيب عميق 24 ساعة', desc: isEn ? 'Eliminate dryness and dullness' : 'القضاء على الجفاف والتغشية' },
    { id: 'antiaging', label: isEn ? 'Anti-aging' : 'محاربة علامات التقدم بالسن', desc: isEn ? 'Firm skin and stimulate collagen' : 'شد البشرة وتحفيز الكولاجين' }
  ];

  const preferences = [
    { id: 'serum', label: isEn ? 'Fast-absorbing Serums' : 'سيرومات سريعة الامتصاص', desc: isEn ? 'Lightweight, highly concentrated formula' : 'تركيبة خفيفة وعالية التركيز' },
    { id: 'cream', label: isEn ? 'Rich Velvety Creams' : 'كريمات قوام مخملي غني', desc: isEn ? 'Luxurious feel and rich protection barrier' : 'شعور فاخر ومحيط حماية غني' },
    { id: 'oil', label: isEn ? 'Nourishing Natural Oils' : 'زيوت طبيعية مغذية', desc: isEn ? 'Deep hydration and bright shine' : 'ترطيب عميق ولمعان ساطع' }
  ];

  const handleSelect = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  // 3-step routine from the real API products (cleanser → toner → serum)
  const recommendedProducts = (() => {
    if (!products || products.length === 0) return [];
    const findFirst = (pred) => products.find(pred);
    const cleanser = findFirst(p => p.category === 'cleansers') || products[0];
    const toner = findFirst(p => p.category === 'toners') || products.find(p => p.id !== cleanser.id);
    const serum = findFirst(p => p.category === 'serums') || products.find(p => p.id !== cleanser.id && p.id !== (toner && toner.id));
    return [cleanser, toner, serum].filter(Boolean).slice(0, 3);
  })();

  const routineTotal = recommendedProducts.reduce((s, p) => s + (p.price || 0), 0);
  const routineOriginal = recommendedProducts.reduce((s, p) => s + (p.originalPrice || p.price || 0), 0);

  const handleAddAll = () => {
    onAddRoutineToCart(recommendedProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0D221A] text-white rounded-3xl p-5 md:p-10 border-2 border-[#C5A059] shadow-2xl overflow-hidden max-h-[88vh] sm:max-h-[90vh] overflow-y-auto animate-popIn">


        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 text-[#C5A059] hover:text-white rounded-full bg-[#143529]"
        >
          <X className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {step <= 3 ? (
          <div>
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <span className="text-sm font-bold text-[#EAD096]">{isEn ? 'VELORA Skin Match Routine Quiz' : 'اختبار روتين VELORA لمطابقة بشرتك'}</span>
              </div>
              <span className="text-xs bg-[#143529] px-3 py-1 rounded-full border border-[#C5A059]/40 text-[#C5A059]">
                {isEn ? `Step ${step} of 3` : `خطوة ${step} من 3`}
              </span>
            </div>

            {/* Step 1: Skin Type */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold font-serif text-[#EAD096]">
                  {isEn ? '1. What is your current skin type?' : '1. ما هو نوع بشرتك الحالي؟'}
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
                  {isEn ? '2. What is your primary goal for your skin?' : '2. ما هو هدفك الأول لمظهر بشرتك؟'}
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
                  {isEn ? '3. What texture do you prefer?' : '3. ما القوام والملمس المفضل لديك في المستحضرات؟'}
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
                  {isEn ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{isEn ? 'Previous' : 'السابق'}</span>
                </button>
              ) : <div />}

              <button
                disabled={
                  (step === 1 && !answers.skinType) ||
                  (step === 2 && !answers.goal) ||
                  (step === 3 && !answers.preference)
                }
                onClick={() => setStep(step + 1)}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>{step === 3 ? (isEn ? 'Show My Perfect Routine ✦' : 'إظهار الروتين المناسب لي ✦') : (isEn ? 'Next' : 'التالي')}</span>
                {step < 3 && (isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />)}
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
              {isEn ? 'Your Personalized VELORA Emerald Routine ✨' : 'روتين VELORA الزمردي المخصص لبشرتك ✨'}
            </h3>

            <p className="text-xs text-gray-300">
              {isEn ? 'Based on your answers, we designed a complete 3-step routine ensuring full radiance in 14 days.' : 'بناءً على إجاباتك، صممنا لكِ روتيناً مكوناً من 3 خطوات متكاملة يضمن لك النضارة الكاملة خلال 14 يوماً.'}
            </p>

            {/* Recommended Products Bundle */}
            {recommendedProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">{isEn ? 'Loading products... please try again ✨' : 'جاري تحميل المنتجات... أعد المحاولة بعد قليل ✨'}</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {recommendedProducts.map((p, index) => (
                <div key={p.id} className="bg-[#143529] p-3 rounded-2xl border border-[#C5A059]/40 text-right">
                  <span className="text-[10px] text-[#C5A059] font-bold">{isEn ? `Step ${index + 1}` : `الخطوة ${index + 1}`}</span>
                  <div className="w-full h-28 my-2 rounded-xl overflow-hidden flex items-center justify-center bg-white/5">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-center scale-110 transition-transform duration-500 hover:scale-125" />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{isEn ? (p.nameEn || p.name) : p.name}</h4>
                  <p className="text-[11px] text-[#C5A059] font-bold mt-1">{p.price} {isEn ? 'EGP' : 'ج.م'}</p>
                </div>
              ))}
            </div>
            )}

            {/* Special Discount offer */}
            <div className="p-3 bg-[#C5A059]/20 border border-[#C5A059] rounded-2xl text-xs text-[#EAD096] flex items-center justify-between">
              <span>{isEn ? 'Total:' : 'الإجمالي:'}</span>
              <div className="flex items-center gap-2">
                {routineOriginal > routineTotal && (
                  <span className="line-through text-gray-400 text-[10px]">{routineOriginal} {isEn ? 'EGP' : 'ج.م'}</span>
                )}
                <span className="font-extrabold text-white text-sm">{routineTotal} {isEn ? 'EGP' : 'ج.م'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddAll}
                disabled={recommendedProducts.length === 0}
                className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isEn ? 'Add Full Routine to Cart' : 'إضافة الروتين الكامل للسلة'}</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="btn-secondary py-3 text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Retake Quiz' : 'إعادة الاختبار'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
