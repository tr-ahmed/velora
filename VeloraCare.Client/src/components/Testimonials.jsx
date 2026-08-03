import React from 'react';
import { TESTIMONIALS } from '../data/products';
import { Star, Quote, Award, Sparkles } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#0D221A] text-white relative overflow-hidden border-t border-[#C5A059]/30">
      
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>تجارب حقيقية</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#EAD096] mt-2">
            ماذا تقول ملكات VELORA CARE؟
          </h2>
          <p className="text-gray-300 text-sm mt-3 font-light">
            ثقة أكثر من 15,000 عميلة في كافة محافظات جمهورية مصر العربية يستمتعن بنضارة وإشراقة طبيعية يومية.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#143529]/80 rounded-3xl p-6 border border-[#C5A059]/30 shadow-xl flex flex-col justify-between hover:border-[#C5A059] transition-all duration-300 group"
            >
              <div>
                <Quote className="w-8 h-8 text-[#C5A059]/40 mb-4 group-hover:text-[#C5A059] transition-colors" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                  ))}
                </div>

                <p className="text-sm text-gray-200 leading-relaxed font-light mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#C5A059]/20 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#C5A059]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-[#C5A059]">{t.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
