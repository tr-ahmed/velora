import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSocialReviewsApi, fetchSocialReviewSettingsApi } from '../services/api';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function SocialReviewsSlider() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);

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

  if (!settings || !settings.isVisible || reviews.length === 0) return null;

  const API_BASE = 'http://localhost:5095';

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
                <div 
                  key={`${batch}-${i}`} 
                  className="w-[280px] md:w-[320px] h-[400px] flex-shrink-0 rounded-2xl overflow-hidden border border-[#C5A059]/20 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:border-[#C5A059]/50"
                >
                  <img 
                    src={`${API_BASE}${r.imageUrl}`} 
                    alt="Social Review" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
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
