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
    <div className="bg-gradient-to-r from-[#0D221A] via-[#143529] to-[#0D221A] text-white border-b border-[#C5A059]/40 shadow-xl relative z-30 print:hidden animate-fadeIn" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-2.5 text-center sm:text-right">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#EAD096] flex items-center justify-center flex-shrink-0 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-black text-[#EAD096] font-serif tracking-wide">{offer.title || 'عروض الفلاش السريعة ✨'}</span>
              <span className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D221A] text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">
                خصم {offer.discountPercentage || 15}%
              </span>
            </div>
            <p className="text-[11px] text-gray-300 font-light truncate max-w-xs sm:max-w-md">
              {offer.subtitle || 'خصم ملكي حصري على كافة السيرومات والزيوت الزمردية في مصر'}
            </p>
          </div>
        </div>

        {/* Countdown Timer & Coupon Copy Button */}
        <div className="flex items-center gap-3">
          
          {/* Live Countdown */}
          <div className="flex items-center gap-1 bg-[#0D221A]/80 border border-[#C5A059]/40 px-3 py-1 rounded-xl shadow-inner font-mono text-xs text-[#EAD096]" dir="ltr">
            <Clock className="w-3.5 h-3.5 text-[#C5A059] mr-1" />
            <span>{formatDigit(timeLeft.hours)}</span>:
            <span>{formatDigit(timeLeft.minutes)}</span>:
            <span>{formatDigit(timeLeft.seconds)}</span>
          </div>

          {/* Coupon Copy Button */}
          <button
            onClick={handleCopyCode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white border border-emerald-300'
                : 'bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] hover:brightness-110'
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

          {/* Dismiss button */}
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
  );
}
