import React, { useState, useEffect } from 'react';
import { fetchCategoriesApi } from '../services/api';
import { Sparkles, ChevronDown, Tag } from 'lucide-react';

export default function Categories({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCategoriesApi();
        setCategories(data);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    }
    load();
  }, []);

  const filterItems = [
    { code: 'all', name: 'الكل', icon: '✨' },
    { code: 'offers', name: 'عروض حصرية 🔥', icon: '🔥' },
    ...categories.map(c => ({ code: c.code, name: c.name, icon: c.icon || '📦' }))
  ];

  return (
    <section className="py-4 sm:py-6 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      <div className="flex flex-col items-center text-center max-w-3xl mx-auto pb-3 sm:pb-4 border-b border-[#C5A059]/30 space-y-2 sm:space-y-3">

        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#987834] text-[10px] sm:text-xs font-bold">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A059]" />
          <span>تشكيلاتنا الفاخرة</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
          <span className="text-[#0D221A]">مجموعات </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] drop-shadow-sm">
            VELORA
          </span>
          <span className="text-[#0D221A]"> العضوية 🌿</span>
        </h2>

        <p className="text-gray-600 text-[11px] sm:text-sm max-w-xl mx-auto font-light leading-relaxed px-2">
          جميع مستحضراتنا يتم تصنيعها بدقة عالية باستخدام خلاصة المكونات العضوية الزمردية بدون زيوت معدنية أو بارابين.
        </p>

      </div>

      <div className="md:hidden w-full">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full appearance-none bg-white border border-[#C5A059]/40 text-[#0D221A] font-bold text-xs rounded-2xl px-4 py-3.5 pr-10 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 shadow-sm"
            dir="rtl"
          >
            {filterItems.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] pointer-events-none" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 flex-wrap justify-center">
        {filterItems.map((cat) => {
          const isSelected = selectedCategory === cat.code;
          return (
            <button
              key={cat.code}
              onClick={() => onSelectCategory(cat.code)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-xs ${
                isSelected
                  ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059] shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-[#F7F5F0] border border-gray-200 hover:border-[#C5A059]/40'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
