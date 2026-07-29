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
    <section className="relative flex flex-col justify-between overflow-hidden bg-[#0D221A] pt-5 pb-8 sm:min-h-[88vh] lg:min-h-[92vh] sm:pt-14 lg:pt-16 px-4 sm:px-6 sm:pb-32">
      
      {/* Original High-Res Hero Background Image */}
      <div 
        className="absolute inset-0 opacity-20 sm:opacity-25 bg-cover bg-center pointer-events-none mix-blend-luminosity scale-105"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#C5A059]/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#1E4D3C]/50 rounded-full blur-[100px] pointer-events-none" />

      {/* Deep Decorative Wavy Lines Background SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
        <path fill="none" stroke="url(#goldWaveGrad)" strokeWidth="3" d="M0,160 Q360,320 720,160 T1440,240" />
        <path fill="none" stroke="url(#emeraldWaveGrad)" strokeWidth="4" d="M0,380 Q360,180 720,420 T1440,320" />
        <path fill="none" stroke="url(#goldWaveGrad)" strokeWidth="2" d="M0,550 Q360,700 720,500 T1440,600" />
        <defs>
          <linearGradient id="goldWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
            <stop offset="50%" stopColor="#EAD096" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emeraldWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E4D3C" stopOpacity="0" />
            <stop offset="50%" stopColor="#C5A059" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1E4D3C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Luxury Gold Wavy Frame Overlay */}
      <div className="absolute inset-3 sm:inset-6 border border-[#C5A059]/20 rounded-3xl pointer-events-none" />

      {/* Slide Navigation Arrow Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 right-3 sm:right-6 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#143529]/80 text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-all shadow-2xl active:scale-90"
        title="السلايد السابق"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 left-3 sm:left-6 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#143529]/80 text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-all shadow-2xl active:scale-90"
        title="السلايد التالي"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Main Slide Content Container */}
      <div key={slide.id} className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center my-auto animate-fadeIn">
        
        {/* Left/Content Section */}
        <div className="lg:col-span-7 text-center lg:text-right space-y-3 sm:space-y-6">
          
          {/* Prominent Royal Brand Logo Crest Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#143529] via-[#0D221A] to-[#143529] p-1.5 sm:p-2.5 px-3.5 sm:px-4 rounded-2xl border border-[#C5A059]/60 shadow-xl backdrop-blur-md hover:border-[#C5A059] transition-all">
              <VeloraLogo size="md" showText={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-[#143529]/90 border border-[#C5A059]/40 text-[#EAD096] text-[10px] sm:text-xs md:text-sm font-medium shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif tracking-tight">
            {slide.titleHighlight} <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834]">
              {slide.titleRest}
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
            {slide.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-3">
            <button
              onClick={onExploreClick}
              className="btn-primary w-full sm:w-auto text-xs sm:text-base py-2.5 sm:py-3.5 px-5 sm:px-8 group"
            >
              <span>تسوقي التشكيلة الفاخرة</span>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="btn-secondary w-full sm:w-auto text-xs sm:text-base py-2.5 sm:py-3.5 px-5 sm:px-8"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>اختبار روتين البشرة</span>
            </button>
          </div>

          {/* Trust Highlights */}
          {showTrustHighlights && (
            <div className="pt-3 sm:pt-8 border-t border-[#C5A059]/20 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-[10px] sm:text-xs font-semibold text-gray-300">
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                <span>100% نباتي عضوي</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                <span>مُختبر سريرياً</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                <span>جودة ملكية مضمونة</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                <span>بدون مواد كيميائية</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Product Spotlight Image Showcase */}
        <div className="lg:col-span-5 relative flex items-center justify-center mt-2 lg:mt-0">
          
          {/* Main Floating Product Mockup */}
          <div className="relative z-10 w-full max-w-[200px] sm:max-w-sm lg:max-w-md aspect-square rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-[#C5A059]/30 to-[#143529]/60 backdrop-blur-md border border-[#C5A059]/40 shadow-2xl animate-float">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0D221A]">
              <img 
                src={slide.productImage} 
                alt={slide.productTitle} 
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A] via-transparent to-transparent opacity-60" />
              
              {/* Product Badge Overlay */}
              <div className="absolute bottom-3 right-3 left-3 p-3 sm:p-4 rounded-xl glass-panel-dark border border-[#C5A059]/40 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] sm:text-xs text-[#C5A059] font-bold">مستحضر ملكي 👑</span>
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold">{slide.rating}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{slide.productTitle}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-300 font-light">{slide.productSub}</p>
              </div>
            </div>
          </div>

          {/* Secondary Floating Mini Card */}
          <div className="absolute -bottom-4 -left-2 z-20 hidden sm:flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#143529]/95 border border-[#C5A059]/50 shadow-2xl backdrop-blur-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-[#C5A059]">
              <img src={slide.miniCardImage} alt="Mini Card" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white">{slide.miniCardTitle}</p>
              <p className="text-[10px] text-[#C5A059]">{slide.miniCardOffer}</p>
            </div>
          </div>

        </div>

      </div>

      {/* Carousel Dots Navigation Indicator */}
      <div className="relative z-30 flex items-center justify-center gap-2 mt-4">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx 
                ? 'w-8 bg-[#C5A059] shadow-[0_0_10px_#C5A059]' 
                : 'w-2.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`انتقل إلى السلايد ${idx + 1}`}
          />
        ))}
      </div>

      {/* Deep Multi-Layered Wavy Separator */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg 
          className="relative block w-full h-24 sm:h-36 lg:h-44 text-[#FAF8F5]" 
          viewBox="0 0 1200 160" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,40 C150,140 350,-40 550,90 C750,220 950,10 1200,80 L1200,160 L0,160 Z" 
            fill="currentColor" 
            opacity="0.45" 
          />
          <path 
            d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120 L1200,160 L0,160 Z" 
            fill="currentColor" 
          />
          <path 
            d="M0,80 C200,170 450,10 650,110 C850,210 1050,40 1200,120" 
            fill="none" 
            stroke="#C5A059" 
            strokeWidth="3" 
            opacity="0.8"
          />
        </svg>
      </div>

    </section>
  );
}
