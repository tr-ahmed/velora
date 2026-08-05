import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check, X, Tag, Flame } from 'lucide-react';

export default function OffersBanner({ offer, onApplyCoupon }) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!offer?.endTime) return;

    const calculateTime = () => {
      const difference = new Date(offer.endTime) - new Date();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [offer?.endTime]);

  if (dismissed || !offer || !offer.isActive) return null;

  const handleCopyCode = () => {
    const code = offer.couponCode || 'VELORA15';
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <div className="w-full print:hidden animate-fadeIn" dir="rtl">
      
      {/* Glassmorphic Floating Capsule Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-full bg-gradient-to-r from-[#0C241B]/90 via-[#143529]/90 to-[#0C241B]/90 border border-[#C5A059]/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl px-3 sm:px-6 py-2 transition-all">
        
        {/* Animated Golden Shimmer Bar */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0D221A] to-transparent animate-pulse" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 relative z-10">
          
          {/* Title & Promo Badge */}
          <div 
            className="group flex flex-col items-center gap-1.5 cursor-pointer relative text-center sm:text-start"
            title={isEn ? 'Click to copy coupon code' : 'انقري لنسخ كود الخصم'}
          >
            {/* Glowing Icon Orb */}
            <div className="w-8 h-8 rounded-full bg-white/20 border border-[#0D221A]/20 text-[#0D221A] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Flame className="w-4 h-4 text-[#0D221A] animate-bounce" />
            </div>

            <div>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#0D221A] font-serif leading-tight">
                  {isEn ? (offer.titleEn || offer.title || 'Flash Offers ✨') : (offer.title || 'عروض الفلاش السريعة ✨')}
                </h3>
                <p className="inline-block bg-[#0D221A] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-extrabold text-sm sm:text-base tracking-wider mt-1 sm:mt-2 shadow-md">
                  {isEn ? `Discount ${offer.discountPercentage || 15}%` : `خصم ${offer.discountPercentage || 15}%`}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#0D221A]/80 font-bold max-w-sm mx-auto md:mx-0 mt-2">
                {isEn ? (offer.subtitleEn || offer.subtitle || 'Exclusive royal discount on all emerald serums and oils in Egypt') : (offer.subtitle || 'خصم ملكي حصري على كافة السيرومات والزيوت الزمردية في مصر')}
              </p>
            </div>
          </div>

          {/* Timer & Copy Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            
            {/* Digital Timer Blocks */}
            <div className="flex items-center gap-1 bg-[#05120D]/90 border border-[#0D221A]/20 px-2.5 py-1 rounded-xl shadow-inner font-mono text-xs text-[#EAD096]" dir="ltr">
              <Clock className="w-3.5 h-3.5 text-[#EAD096] mr-1" />
              <div className="bg-[#143529] px-1.5 py-0.5 rounded border border-[#EAD096]/20 font-bold text-white">
                {formatDigit(timeLeft.hours)}
              </div>
              <span className="text-[#EAD096] font-bold">:</span>
              <div className="bg-[#143529] px-1.5 py-0.5 rounded border border-[#EAD096]/20 font-bold text-white">
                {formatDigit(timeLeft.minutes)}
              </div>
              <span className="text-[#EAD096] font-bold">:</span>
              <div className="bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold animate-pulse">
                {formatDigit(timeLeft.seconds)}
              </div>
            </div>

            {/* Luxury Copy Coupon Button */}
            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-95 ${
                copied
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-[#0D221A] hover:bg-white/90'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-800 text-[10px] sm:text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Copied!' : 'تم النسخ!'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#0D221A] text-[10px] sm:text-xs group-hover:text-emerald-800 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isEn ? `Code: ${offer.couponCode || 'VELORA15'}` : `كود: ${offer.couponCode || 'VELORA15'}`}</span>
                </span>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 rounded-full bg-white/40 hover:bg-[#0D221A] hover:text-[#EAD096] text-[#0D221A] flex items-center justify-center transition-all shadow-sm"
              title={isEn ? 'Hide Banner' : 'إخفاء البنر'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
