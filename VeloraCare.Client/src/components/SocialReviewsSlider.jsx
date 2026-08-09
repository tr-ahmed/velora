import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSocialReviewsApi, fetchSocialReviewSettingsApi, API_BASE_URL } from '../services/api';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SocialReviewsSlider() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const setData = await fetchSocialReviewSettingsApi();
      if (setData && setData.isVisible) {
        setSettings(setData);
        const revData = await fetchSocialReviewsApi(true); // only active
        setReviews(revData);
      } else {
        setSettings({ isVisible: false }); // hidden
      }
    };
    loadData();
  }, []);

  // Keyboard navigation + body scroll lock while lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      else if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + reviews.length) % reviews.length);
      else if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % reviews.length);
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, reviews.length]);

  if (!settings || !settings.isVisible || reviews.length === 0) return null;

  const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');
  const activeReview = lightboxIndex !== null ? reviews[lightboxIndex] : null;

  return (
    <section className="py-20 bg-[#0D221A] border-t border-[#C5A059]/10 relative overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 mb-12 text-center">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold flex items-center justify-center gap-1.5 mb-3">
          <ImageIcon className="w-4 h-4" />
          <span>{isEn ? 'From Social Media' : 'من وسائل التواصل'}</span>
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#EAD096] mb-4">
          {isEn ? settings.sectionTitleEn : settings.sectionTitle}
        </h2>
        <p className="text-gray-300 text-sm md:text-base font-light max-w-2xl mx-auto">
          {isEn ? settings.sectionSubtitleEn : settings.sectionSubtitle}
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden" dir="ltr">
        
        {/* Left/Right fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0D221A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0D221A] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 w-max animate-marquee hover:pause-animation">
          {/* We render the list 3 times to create a seamless infinite loop effect */}
          {[1, 2, 3].map((batch) => (
            <React.Fragment key={batch}>
              {reviews.map((r, i) => (
                <button
                  key={`${batch}-${i}`}
                  onClick={() => setLightboxIndex(i)}
                  title={isEn ? 'View full image' : 'عرض الصورة كاملة'}
                  className="w-[280px] md:w-[320px] h-[400px] flex-shrink-0 rounded-2xl overflow-hidden border border-[#C5A059]/20 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:border-[#C5A059]/50 bg-[#0F2A20] group cursor-zoom-in"
                >
                  <img 
                    src={`${IMAGE_BASE_URL}${r.imageUrl}`} 
                    alt="Social Review" 
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Lightbox - full image viewer */}
      {activeReview && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4"
          onClick={() => setLightboxIndex(null)}
          dir="ltr"
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + reviews.length) % reviews.length); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#C5A059] text-white flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % reviews.length); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#C5A059] text-white flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Image */}
          <div className="max-w-[94vw] max-h-[90vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${IMAGE_BASE_URL}${activeReview.imageUrl}`}
              alt="Social Review"
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="text-white/70 text-sm font-light tracking-wider">
              {lightboxIndex + 1} / {reviews.length}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-marquee {
          animation: marquee ${settings.autoPlay ? (settings.autoPlayInterval * reviews.length) : 0}s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
