import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, Leaf, Award, HeartHandshake, ChevronRight, ChevronLeft } from 'lucide-react';
import VeloraLogo from './VeloraLogo';

const DEFAULT_SLIDES = [
  {
    id: 1,
    badge: 'المتجر الملكي الأول للعناية العضوية 👑',
    titleHighlight: 'إكسير النضارة',
    titleRest: 'الزمردية والجمال الفاخر',
    description: 'اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية. تركيبة دقيقة تمنحك إشراقة شبابية فورية ولمسة مخملية تليق بأناقتك.',
    productImage: '/images/serum.png',
    productTitle: 'سيروم الزمرد لإعادة إحياء الشباب',
    productSub: 'إكسير نباتي مكثف لإشراقة ملكية',
    rating: '★ 4.9',
    miniCardImage: '/images/cream.png',
    miniCardTitle: 'كريم الترطيب الفاخر',
    miniCardOffer: 'خصم 15% اليوم فقط',
    active: true
  },
  {
    id: 2,
    badge: 'ترطيب ملكي مخملي 🧴',
    titleHighlight: 'حماية وتنعيم',
    titleRest: 'يدوم 72 ساعة فائقة',
    description: 'كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي وسيروم الزمرد المعصور بارداً لإصلاح حاجز البشرة الواقي ومنحها ملمس المخمل الحريري.',
    productImage: '/images/cream.png',
    productTitle: 'كريم الترطيب الزمردي الفاخر',
    productSub: 'ترطيب عميق وسيراميد نباتي',
    rating: '★ 4.8',
    miniCardImage: '/images/glow_oil.png',
    miniCardTitle: 'زيت فيلورا الذهبي',
    miniCardOffer: 'إشراقة الذهب النقي',
    active: true
  },
  {
    id: 3,
    badge: 'إصدار محدود بالذهب ✨',
    titleHighlight: 'قطرات الذهب',
    titleRest: 'وإشراقة ملكية متوهجة',
    description: 'مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي. يغذي خلايا البشرة العميق ويمنحك إشراقة متوهجة كالجمال الإمبراطوري.',
    productImage: '/images/glow_oil.png',
    productTitle: 'زيت فيلورا الذهبي للوجه والرقبة',
    productSub: 'تغذية بالذهب والنباتات النادرة',
    rating: '★ 5.0',
    miniCardImage: '/images/candle.png',
    miniCardTitle: 'شمعة الاسترخاء',
    miniCardOffer: 'عبير اللافندر الملكي',
    active: true
  }
];

export default function Hero({ onExploreClick, onOpenQuiz, slides: customSlides, settings }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = (customSlides && customSlides.length > 0)
    ? customSlides.filter(s => s.active !== false)
    : DEFAULT_SLIDES;

  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_SLIDES;

  const autoPlay = settings?.autoPlay !== false;
  const intervalMs = (settings?.autoPlayInterval || 5.5) * 1000;
  const showTrustHighlights = settings?.showTrustHighlights !== false;

  // Auto-play Slider Timer
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, autoPlay, intervalMs]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative flex flex-col justify-between overflow-hidden bg-[#0D221A] pt-4 pb-8 sm:min-h-[88vh] lg:min-h-[92vh] sm:pt-14 lg:pt-16 px-4 sm:px-6 sm:pb-32">
      
      {/* Background Glows & Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 opacity-25 sm:opacity-40"
          style={{ backgroundImage: "url('/images/hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D221A]/85 via-[#0D221A]/65 to-[#0D221A]/95" />
      </div>

      {/* Refined Radial Gold Orbs */}
      <div className="absolute top-1/4 -right-24 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-gradient-to-br from-[#C5A059]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-gradient-to-tr from-[#143529] via-[#C5A059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Frame Accent */}
      <div className="absolute inset-2.5 sm:inset-6 border border-[#C5A059]/25 rounded-3xl pointer-events-none" />

      {/* Slide Navigation Arrow Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 right-2 sm:right-6 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl active:scale-90"
        title="السلايد السابق"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 left-2 sm:left-6 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl active:scale-90"
        title="السلايد التالي"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Main Content Grid */}
      <div key={slide.id} className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-center my-auto animate-fadeIn">
        
        {/* Mobile Product Spotlight Showcase (Prominent & Enlarged Card on Mobile) */}
        <div className="lg:hidden flex items-center justify-center my-3">
          <div className="relative w-60 xs:w-68 sm:w-80 aspect-square rounded-3xl p-2.5 bg-gradient-to-b from-[#C5A059]/50 via-[#143529]/80 to-[#0D221A] backdrop-blur-xl border-2 border-[#C5A059]/60 shadow-[0_0_30px_rgba(197,160,89,0.25)] animate-float">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0D221A]">
              <img src={slide.productImage} alt={slide.productTitle} className="w-full h-full object-cover object-center scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A] via-[#0D221A]/20 to-transparent opacity-85" />
              
              {/* Product Badge Overlay */}
              <div className="absolute bottom-2.5 right-2.5 left-2.5 p-2.5 rounded-xl bg-[#0D221A]/90 backdrop-blur-md border border-[#C5A059]/40 text-right shadow-lg">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-[#C5A059] font-extrabold flex items-center gap-1">
                    <span>مستحضر ملكي 👑</span>
                  </span>
                  <span className="text-emerald-400 font-extrabold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">{slide.rating}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{slide.productTitle}</h4>
                <p className="text-[10px] text-[#EAD096] truncate font-light mt-0.5">{slide.productSub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-7 text-center lg:text-right space-y-3 sm:space-y-6">
          
          {/* Badge Crest */}
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143529]/95 border border-[#C5A059]/50 text-[#EAD096] text-[10px] sm:text-xs font-bold shadow-md backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug font-serif tracking-tight">
            {slide.titleHighlight}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] block sm:inline">
              {slide.titleRest}
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
            {slide.description}
          </p>

          {/* Side-by-Side Mobile CTA Buttons */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 pt-1 sm:pt-3">
            <button
              onClick={onExploreClick}
              className="btn-primary flex-1 sm:flex-initial text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-8 group justify-center"
            >
              <span>تسوقي التشكيلة</span>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="btn-secondary flex-1 sm:flex-initial text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-8 justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>اختبار الروتين</span>
            </button>
          </div>

          {/* Trust Highlights */}
          {showTrustHighlights && (
            <div className="pt-3 sm:pt-6 border-t border-[#C5A059]/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs font-semibold text-gray-300">
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <Leaf className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>100% نباتي عضوي</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>مُختبر سريرياً</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>جودة ملكية</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>بدون مواد كيميائية</span>
              </div>
            </div>
          )}

        </div>

        {/* Desktop Product Showcase */}
        <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
          <div className="relative z-10 w-full max-w-md aspect-square rounded-3xl p-3 bg-gradient-to-b from-[#C5A059]/30 to-[#143529]/60 backdrop-blur-md border border-[#C5A059]/40 shadow-2xl animate-float">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0D221A]">
              <img src={slide.productImage} alt={slide.productTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 right-3 left-3 p-4 rounded-xl glass-panel-dark border border-[#C5A059]/40 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#C5A059] font-bold">مستحضر ملكي 👑</span>
                  <span className="text-xs text-emerald-400 font-semibold">{slide.rating}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{slide.productTitle}</h4>
                <p className="text-[11px] text-gray-300 font-light">{slide.productSub}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Carousel Dots Indicator */}
      <div className="relative z-30 flex items-center justify-center gap-2 mt-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx 
                ? 'w-7 bg-[#C5A059] shadow-[0_0_10px_#C5A059]' 
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`انتقل إلى السلايد ${idx + 1}`}
          />
        ))}
      </div>

      {/* Decorative Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-16 sm:h-36 lg:h-44 text-[#FAF8F5]" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path d="M0,40 C150,140 350,-40 550,90 C750,220 950,10 1200,80 L1200,160 L0,160 Z" fill="currentColor" opacity="0.45" />
          <path d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120 L1200,160 L0,160 Z" fill="currentColor" />
          <path d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120" fill="none" stroke="#C5A059" strokeWidth="3" opacity="0.8" />
        </svg>
      </div>

    </section>
  );
}
