import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check, X, Tag } from 'lucide-react';

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
    <div className="relative z-40 bg-gradient-to-r from-[#0A1A14] via-[#143529] to-[#0A1A14] text-white border-b border-[#C5A059]/40 shadow-[0_4px_25px_rgba(0,0,0,0.5)] print:hidden animate-fadeIn" dir="rtl">
      
      {/* Background Ambient Glow Sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        
        {/* Left Side: Title, Subtitle & Badge */}
        <div className="flex items-center gap-2.5 text-center sm:text-right">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAD096]/30 via-[#C5A059]/20 to-transparent border border-[#C5A059] text-[#EAD096] flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.4)]">
              <Sparkles className="w-4 h-4 text-[#EAD096] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs sm:text-sm font-extrabold text-[#EAD096] font-serif tracking-wide drop-shadow-sm">
                {offer.title || 'عروض الفلاش السريعة ✨'}
              </span>
              <span className="bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md">
                خصم {offer.discountPercentage || 15}%
              </span>
            </div>
            <p className="text-[11px] text-gray-300 font-light truncate max-w-xs sm:max-w-md hidden sm:block">
              {offer.subtitle || 'خصم ملكي حصري على كافة السيرومات والزيوت الزمردية في مصر'}
            </p>
          </div>
        </div>

        {/* Right Side: Digital Countdown Clock & Luxury Copy Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Digital Timer */}
          <div className="flex items-center gap-1 bg-[#05110D]/90 border border-[#C5A059]/50 px-3 py-1 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] font-mono text-xs text-[#EAD096]" dir="ltr">
            <Clock className="w-3.5 h-3.5 text-[#C5A059] mr-1" />
            <span className="font-bold">{formatDigit(timeLeft.hours)}</span>
            <span className="text-[#C5A059] font-bold">:</span>
            <span className="font-bold">{formatDigit(timeLeft.minutes)}</span>
            <span className="text-[#C5A059] font-bold">:</span>
            <span className="font-bold text-rose-300">{formatDigit(timeLeft.seconds)}</span>
          </div>

          {/* Luxury Coupon Copy Button */}
          <button
            onClick={handleCopyCode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#D4AF37] text-[#0D221A] hover:brightness-110 hover:shadow-[0_4px_20px_rgba(197,160,89,0.6)]'
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
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors mr-1"
            title="إخفاء البنر"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
