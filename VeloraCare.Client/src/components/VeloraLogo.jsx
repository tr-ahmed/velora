import React from 'react';

export default function VeloraLogo({ size = 'md', showText = true, className = '', glow = true }) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 sm:w-12 h-11 sm:h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 sm:w-28 h-24 sm:h-28'
  };

  const textSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-5xl'
  };

  const subTextSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs sm:text-sm'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAD096]/30 via-[#C5A059]/20 to-transparent rounded-full blur-md" />
        )}
        <img
          src="/images/logo.png"
          alt="VELORA Care Logo"
          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(197,160,89,0.65)]"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right whitespace-nowrap flex-shrink-0">
          <span className={`${textSizeClasses[size]} font-black tracking-widest text-[#EAD096] font-serif leading-none drop-shadow-[0_2px_8px_rgba(197,160,89,0.3)] whitespace-nowrap`}>
            VELORA
          </span>
          <span className={`${subTextSizeClasses[size]} tracking-[0.3em] text-[#C5A059] uppercase font-bold mt-1 whitespace-nowrap`}>
            CARE • BOTANICS
          </span>
        </div>
      )}
    </div>
  );
}
