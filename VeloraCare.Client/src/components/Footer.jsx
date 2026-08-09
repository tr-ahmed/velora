import React, { useState } from 'react';
import { Mail, Instagram, Twitter, Facebook, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import VeloraLogo from './VeloraLogo';
import { useTranslation } from 'react-i18next';

export default function Footer({ onOpenQuiz, setActiveTab, onOpenInfoModal }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A1913] text-gray-300 border-t-2 border-[#C5A059]/40 pt-16 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        

        {/* Footer Navigation Columns */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#C5A059]/20 ${isEn ? 'text-left' : 'text-right'}`}>
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <VeloraLogo size="lg" />

            <p className="text-xs text-gray-300 font-light leading-relaxed max-w-sm">
              {isEn 
                ? 'A royal brand specializing in innovating skincare products extracted from premium nature and rare herbs to highlight your natural beauty.'
                : 'علامة تجارية ملكية متخصصة في ابتكار مستحضرات عناية بالبشرة مستخلصة من الطبيعة الزمردية والأعشاب النادرة لإبراز جمالك الطبيعي.'}
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#C5A059]">
              <a 
                href="https://www.tiktok.com/@velora.care7?_r=1&_t=ZS-98PJL7tSMDc" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-[#143529] border border-[#C5A059]/30 flex items-center justify-center hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors"
                title="TikTok"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.17v-3.45a4.85 4.85 0 01-2-.93 4.84 4.84 0 010-7.3z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/care_velora?utm_source=qr&igsh=czhheGFxbnZsYnFy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-[#143529] border border-[#C5A059]/30 flex items-center justify-center hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/share/1DGKUiYnqH/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-[#143529] border border-[#C5A059]/30 flex items-center justify-center hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#EAD096] font-serif mb-4">{isEn ? 'Quick Links' : 'روابط سريعة'}</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#C5A059] transition-colors">{isEn ? 'Home' : 'الصفحة الرئيسية'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('products')} className="hover:text-[#C5A059] transition-colors">{isEn ? 'All Products' : 'جميع المنتجات'}</button>
              </li>
              <li>
                <button onClick={onOpenQuiz} className="hover:text-[#C5A059] transition-colors font-bold text-[#C5A059]">{isEn ? 'Skin Routine Quiz ✦' : 'اختبار روتين البشرة ✦'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reviews')} className="hover:text-[#C5A059] transition-colors">{isEn ? 'Customer Reviews' : 'تجارب وتقييمات العملاء'}</button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-[#EAD096] font-serif mb-4">{isEn ? 'Customer Care' : 'خدمة العملاء'}</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button onClick={() => onOpenInfoModal && onOpenInfoModal('faq')} className={`hover:text-[#C5A059] transition-colors ${isEn ? 'text-left' : 'text-right'}`}>
                  {isEn ? 'FAQs' : 'الأسئلة الشائعة'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoModal && onOpenInfoModal('shipping')} className={`hover:text-[#C5A059] transition-colors ${isEn ? 'text-left' : 'text-right'}`}>
                  {isEn ? 'Shipping Policy' : 'سياسة الشحن والتوصيل'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfoModal && onOpenInfoModal('terms')} className={`hover:text-[#C5A059] transition-colors ${isEn ? 'text-left' : 'text-right'}`}>
                  {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-[#EAD096] font-serif mb-4">{isEn ? 'Contact Us (Egypt)' : 'تواصل معنا في مصر'}</h4>
            <div className="space-y-3 text-xs text-gray-300">
              <a href="tel:+201038035240" className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span dir="ltr">+20 103 803 5240</span>
              </a>
              <a href="mailto:care@velorabeauty.eg" className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>care@velorabeauty.eg</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>{isEn ? 'Cairo - Egypt' : 'القاهرة - جمهورية مصر العربية'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 ${isEn ? 'md:flex-row-reverse' : ''}`}>
          <p>{isEn ? '© 2026 VELORA CARE. All rights reserved.' : '© 2026 VELORA CARE. جميع الحقوق محفوظة.'}</p>
          <div className="flex items-center gap-3 font-semibold text-gray-300 flex-wrap justify-center">
            <span>{isEn ? 'Accepted Payments:' : 'طرق الدفع المعتمدة:'}</span>
            <span className="bg-[#143529] px-3 py-1 rounded-full border border-[#C5A059]/40 text-xs text-[#EAD096] font-bold">
              {isEn ? 'Vodafone Cash' : 'فودافون كاش'}
            </span>
            <span className="bg-[#143529] px-3 py-1 rounded-full border border-[#C5A059]/40 text-xs text-[#EAD096] font-bold">
              {isEn ? 'InstaPay' : 'انستا باي InstaPay'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
