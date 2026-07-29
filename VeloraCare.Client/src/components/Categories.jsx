import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles } from 'lucide-react';

export default function Categories({ selectedCategory, onSelectCategory }) {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-6">
      
      {/* Center-Aligned Title & Description Block */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto pb-4 border-b border-[#C5A059]/30 space-y-3">
        
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#987834] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>تشكيلاتنا الفاخرة</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
          <span className="text-[#0D221A]">مجموعات </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] drop-shadow-sm">
            VELORA
          </span>
          <span className="text-[#0D221A]"> العضوية 🌿</span>
        </h2>

        <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
          جميع مستحضراتنا يتم تصنيعها بدقة عالية باستخدام خلاصة المكونات العضوية الزمردية بدون زيوت معدنية أو بارابين.
        </p>

      </div>

      {/* Filter Pills Bar (Centered) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059] shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-[#F7F5F0] border border-gray-200 hover:border-[#C5A059]/40'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
