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
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EAD096] to-transparent animate-pulse" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 relative z-10">
          
          {/* Title & Promo Badge */}
          <div className="flex items-center gap-2.5 text-center sm:text-right">
            
            {/* Glowing Icon Orb */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAD096]/30 via-[#C5A059]/20 to-transparent border border-[#C5A059] text-[#EAD096] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.4)]">
              <Flame className="w-4 h-4 text-[#EAD096] animate-bounce" />
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs sm:text-sm font-black text-white font-serif tracking-wide drop-shadow-sm">
                  {offer.title || 'عروض الفلاش السريعة ✨'}
                </span>
                <span className="bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#D4AF37] text-[#0D221A] text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md tracking-wider">
                  خصم {offer.discountPercentage || 15}%
                </span>
              </div>
              <p className="text-[11px] text-[#EAD096]/90 font-light truncate max-w-xs sm:max-w-md hidden md:block">
                {offer.subtitle || 'خصم ملكي حصري على كافة السيرومات والزيوت الزمردية في مصر'}
              </p>
            </div>

          </div>

          {/* Timer & Copy Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            
            {/* Digital Timer Blocks */}
            <div className="flex items-center gap-1 bg-[#05120D]/90 border border-[#C5A059]/60 px-2.5 py-1 rounded-xl shadow-inner font-mono text-xs text-[#EAD096]" dir="ltr">
              <Clock className="w-3.5 h-3.5 text-[#C5A059] mr-1" />
              
              <div className="bg-[#143529] px-1.5 py-0.5 rounded border border-[#C5A059]/30 font-bold text-white">
                {formatDigit(timeLeft.hours)}
              </div>
              <span className="text-[#C5A059] font-bold">:</span>
              <div className="bg-[#143529] px-1.5 py-0.5 rounded border border-[#C5A059]/30 font-bold text-white">
                {formatDigit(timeLeft.minutes)}
              </div>
              <span className="text-[#C5A059] font-bold">:</span>
              <div className="bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold animate-pulse">
                {formatDigit(timeLeft.seconds)}
              </div>
            </div>

            {/* Luxury Copy Coupon Button */}
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#D4AF37] text-[#0D221A] hover:scale-105 hover:brightness-110'
              }`}
              title="انقري لنسخ كود الخصم"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5" />
                  <span>كود: {offer.couponCode || 'VELORA15'}</span>
                  <Copy className="w-3 h-3 opacity-80" />
                </>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              title="إخفاء البنر"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
