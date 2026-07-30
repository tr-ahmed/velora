import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, Leaf, Award, HeartHandshake, ChevronRight, ChevronLeft } from 'lucide-react';
import VeloraLogo from './VeloraLogo';

const DEFAULT_SLIDES = [
  {
    id: 1,
    badge: 'المتجر الملكي الأول للعناية العضوية 👑',
    titleHighlight: 'إكسير النضارة',
    titleRest: 'الزمردية',
    description: 'اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية.',
    productImage: '/images/serum.png',
    productTitle: 'سيروم الزمرد لإحياء الشباب',
    productSub: 'إكسير نباتي مكثف',
    rating: '4.9',
    accent: 'from-emerald-600/30 to-[#C5A059]/20',
  },
  {
    id: 2,
    badge: 'ترطيب ملكي مخملي 🧴',
    titleHighlight: 'حماية وتنعيم',
    titleRest: 'يدوم 72 ساعة',
    description: 'كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي لإصلاح حاجز البشرة.',
    productImage: '/images/cream.png',
    productTitle: 'كريم الترطيب الزمردي',
    productSub: 'ترطيب عميق بالسيراميد',
    rating: '4.8',
    accent: 'from-[#143529]/60 to-[#C5A059]/20',
  },
  {
    id: 3,
    badge: 'إصدار محدود بالذهب ✨',
    titleHighlight: 'قطرات الذهب',
    titleRest: 'وإشراقة ملكية',
    description: 'مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي.',
    productImage: '/images/glow_oil.png',
    productTitle: 'زيت فيلورا الذهبي',
    productSub: 'تغذية بالذهب والنباتات',
    rating: '5.0',
    accent: 'from-amber-900/40 to-[#C5A059]/25',
  }
];

export default function Hero({ onExploreClick, onOpenQuiz, slides: customSlides, settings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(null);

  const activeSlides = (customSlides && customSlides.length > 0)
    ? customSlides.filter(s => s.active !== false)
    : DEFAULT_SLIDES;

  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_SLIDES;
  const autoPlay = settings?.autoPlay !== false;
  const intervalMs = (settings?.autoPlayInterval || 5.5) * 1000;
  const showTrustHighlights = settings?.showTrustHighlights !== false;

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, autoPlay, intervalMs]);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  /* Touch swipe */
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-[#0D221A]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================================
          MOBILE HERO — Full-Screen App Style
          ============================================================ */}
      <div className="sm:hidden relative min-h-[100svh] flex flex-col">

        {/* Background Product Image */}
        <div
          key={`bg-${slide.id}`}
          className="absolute inset-0 animate-fadeIn"
        >
          <img
            src={slide.productImage}
            alt={slide.productTitle}
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Multi-layer gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D221A]/80 via-[#0D221A]/30 to-[#0D221A]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D221A]/60 to-transparent" />
        </div>

        {/* Gold Orb Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C5A059]/15 blur-3xl pointer-events-none" />

        {/* Middle floating — Centered Logo, Badge, Headline, Description & Rating */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-5 pt-16 sm:pt-20 pb-4">
          
          {/* VELORA Care Logo — Positioned right above the central headline text */}
          <div className="mb-3 flex items-center justify-center mx-auto animate-fadeIn">
            <VeloraLogo size="xl" glow={true} className="scale-110 sm:scale-130 drop-shadow-[0_6px_25px_rgba(197,160,89,0.6)]" />
          </div>

          {/* Category badge (إصدار محدود بالذهب ✨) */}
          <div
            key={`badge-${slide.id}`}
            className="animate-slideUp inline-flex items-center gap-1.5 mb-3 px-3.5 py-1.5 rounded-full bg-[#143529]/90 border border-[#C5A059]/50 backdrop-blur-md mx-auto shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[#EAD096] text-[11px] font-extrabold">{slide.badge}</span>
          </div>

          {/* Main Headline */}
          <h1
            key={`h1-${slide.id}`}
            className="animate-slideUp text-[2.4rem] sm:text-[2.8rem] leading-[1.15] font-extrabold text-white text-center mb-3 font-serif max-w-md mx-auto"
            style={{ animationDelay: '0.05s' }}
          >
            {slide.titleHighlight}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834]">
              {slide.titleRest}
            </span>
          </h1>

          <p
            key={`desc-${slide.id}`}
            className="animate-slideUp text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 max-w-sm font-light text-center mx-auto"
            style={{ animationDelay: '0.1s' }}
          >
            {slide.description}
          </p>

          {/* Rating pill & Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 mx-auto">
            <div className="flex items-center gap-1 bg-[#0D221A]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/40 shadow-sm">
              <span className="text-[#C5A059] text-xs">★</span>
              <span className="text-white text-xs font-extrabold">{slide.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300 font-medium bg-[#0D221A]/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/20 shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% عضوي</span>
              <span className="text-gray-500">•</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>آمن ومؤثر</span>
            </div>
          </div>
        </div>

        {/* Bottom sticky CTA panel */}
        <div className="relative z-20 px-5 pb-4"
             style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>
          
          {/* Mobile Slider Controller Bar (Thumb Friendly) */}
          {slides.length > 1 && (
            <div className="flex items-center justify-between gap-3 mb-3 px-1">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center active:scale-90 transition-transform shadow-md"
                aria-label="السلايد السابق"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-1.5 bg-[#0D221A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/30 shadow-inner">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === idx
                        ? 'w-6 h-1.5 bg-[#C5A059]'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center active:scale-90 transition-transform shadow-md"
                aria-label="السلايد التالي"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

          {/* Product mini info bar */}
          <div
            key={`info-${slide.id}`}
            className="animate-slideUp flex items-center gap-3 mb-4 p-3 rounded-2xl bg-[#0D221A]/80 backdrop-blur-xl border border-[#C5A059]/30"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C5A059]/40 flex-shrink-0">
              <img src={slide.productImage} alt={slide.productTitle} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-extrabold truncate">{slide.productTitle}</p>
              <p className="text-[#EAD096] text-[11px] truncate">{slide.productSub}</p>
            </div>
            <button
              onClick={onExploreClick}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] text-[#0D221A] flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Two CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onExploreClick}
              className="btn-primary flex-1 py-4 text-sm justify-center"
            >
              <span>تسوقي الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQuiz}
              className="btn-secondary flex-shrink-0 px-5 py-4 text-sm justify-center"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>

          {/* Safe area spacer for bottom nav */}
          <div className="h-16" />
        </div>
      </div>

      {/* ============================================================
          DESKTOP HERO — Original Premium Layout (sm and above)
          ============================================================ */}
      <div className="hidden sm:flex flex-col justify-between min-h-[88vh] lg:min-h-[92vh] pt-14 lg:pt-16 px-4 sm:px-6 pb-32 relative">
        
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 opacity-40"
            style={{ backgroundImage: "url('/images/hero.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D221A]/85 via-[#0D221A]/65 to-[#0D221A]/95" />
        </div>

        {/* Gold orbs */}
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-[#C5A059]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#143529] via-[#C5A059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-6 border border-[#C5A059]/25 rounded-3xl pointer-events-none" />

        {/* Nav arrows */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 right-6 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl hover:bg-[#C5A059] hover:text-[#0D221A] active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 left-6 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#143529]/90 text-[#C5A059] border border-[#C5A059]/50 flex items-center justify-center transition-all shadow-xl hover:bg-[#C5A059] hover:text-[#0D221A] active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div key={slide.id} className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto animate-fadeIn">

          {/* Content */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#143529]/95 border border-[#C5A059]/50 text-[#EAD096] text-xs font-bold shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }} />
                <span>{slide.badge}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug font-serif tracking-tight">
              {slide.titleHighlight}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834]">
                {slide.titleRest}
              </span>
            </h1>

            <p className="text-gray-300 text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={onExploreClick}
                className="btn-primary text-base py-3.5 px-8 group"
              >
                <span>تسوقي التشكيلة</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenQuiz}
                className="btn-secondary text-base py-3.5 px-8"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>اختبار الروتين</span>
              </button>
            </div>

            {showTrustHighlights && (
              <div className="pt-6 border-t border-[#C5A059]/20 grid grid-cols-4 gap-2 text-xs font-semibold text-gray-300">
                <div className="flex items-center justify-center lg:justify-start gap-1"><Leaf className="w-3.5 h-3.5 text-[#C5A059]" /><span>100% نباتي عضوي</span></div>
                <div className="flex items-center justify-center lg:justify-start gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /><span>آمن ومؤثر</span></div>
                <div className="flex items-center justify-center lg:justify-start gap-1"><Award className="w-3.5 h-3.5 text-[#C5A059]" /><span>جودة ملكية</span></div>
                <div className="flex items-center justify-center lg:justify-start gap-1"><HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" /><span>بدون مواد كيميائية</span></div>
              </div>
            )}
          </div>

          {/* Desktop Product Card */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            <div className="relative z-10 w-full max-w-md aspect-square rounded-3xl p-3 bg-gradient-to-b from-[#C5A059]/30 to-[#143529]/60 backdrop-blur-md border border-[#C5A059]/40 shadow-2xl animate-float">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0D221A]">
                <img src={slide.productImage} alt={slide.productTitle} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 right-3 left-3 p-4 rounded-xl glass-panel-dark border border-[#C5A059]/40 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#C5A059] font-bold">مستحضر ملكي 👑</span>
                    <span className="text-xs text-emerald-400 font-semibold">★ {slide.rating}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{slide.productTitle}</h4>
                  <p className="text-[11px] text-gray-300 font-light">{slide.productSub}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="relative z-30 flex items-center justify-center gap-2 mt-3">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-7 bg-[#C5A059] shadow-[0_0_10px_#C5A059]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg className="relative block w-full h-36 lg:h-44 text-[#FAF8F5]" viewBox="0 0 1200 160" preserveAspectRatio="none">
            <path d="M0,40 C150,140 350,-40 550,90 C750,220 950,10 1200,80 L1200,160 L0,160 Z" fill="currentColor" opacity="0.45" />
            <path d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120 L1200,160 L0,160 Z" fill="currentColor" />
            <path d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120" fill="none" stroke="#C5A059" strokeWidth="3" opacity="0.8" />
          </svg>
        </div>
      </div>
    </section>
  );
}
