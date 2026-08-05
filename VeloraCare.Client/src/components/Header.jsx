import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Sparkles, User, ShieldCheck, LogOut, Eye, ArrowLeft, Truck, Globe } from 'lucide-react';
import VeloraLogo from './VeloraLogo';
import { useTranslation } from 'react-i18next';

export default function Header({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenQuiz,
  onOpenTrackOrder,
  activeTab, 
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminDashboard,
  searchQuery,
  setSearchQuery,
  products = [],
  onQuickView
}) {
  const { t, i18n } = useTranslation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const isEn = i18n.language === 'en';

  const toggleLanguage = () => {
    const newLang = isEn ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    setIsFloatingMenuOpen(false); // Close mobile floating menu after switching
  };

  const navLinks = [
    { id: 'home', label: t('home', 'الرئيسية') },
    { id: 'products', label: t('products', 'المتجر والمنتجات') },
    { id: 'quiz', label: t('quiz', 'اختبار روتين البشرة'), isSpecial: true },
    { id: 'about', label: t('about', 'قصة VELORA') },
    { id: 'reviews', label: t('reviews', 'تجارب العميلات') },
  ];

  const handleNavClick = (id) => {
    if (id === 'quiz') {
      onOpenQuiz();
    } else {
      setActiveTab(id);
    }
  };

  // Live Matching Products
  const searchResults = searchQuery.trim().length > 0
    ? products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('products');
      setIsSearchFocused(false);
      setMobileSearchOpen(false);
      setIsFloatingMenuOpen(false); // Close mobile menu when searching
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* --- DESKTOP HEADER (Hidden on mobile) --- */}
      <header className="hidden sm:block sticky top-0 z-40 w-full bg-[#0D221A]/90 backdrop-blur-xl border-b border-[#C5A059]/30 shadow-xl print:hidden">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-8">
            
            {/* 1. Brand Logo */}
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group flex-shrink-0 flex items-center gap-2"
            >
              <VeloraLogo size="md" glow={true} />
            </div>

            {/* 2. Navigation Links (Desktop) */}
            <div className="flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                
                if (link.isSpecial) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] text-[#0D221A] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{link.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-sm font-bold transition-all whitespace-nowrap relative ${
                      isActive
                        ? 'text-[#EAD096] after:content-[""] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[2px] after:bg-[#C5A059] after:rounded-t-sm'
                        : 'text-gray-300 hover:text-white hover:drop-shadow-md'
                    }`}
                  >
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Icons & Actions */}
            <div className="flex items-center gap-4">

              {/* Language & Track Order */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 p-1.5 text-gray-300 hover:text-[#EAD096] transition-colors"
                  title={isEn ? "Switch to Arabic" : "تغيير اللغة"}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden lg:inline text-[10px] font-bold">{t('language', 'English')}</span>
                </button>
                <button
                  onClick={onOpenTrackOrder}
                  className="flex items-center gap-1 p-1.5 text-gray-300 hover:text-[#EAD096] transition-colors"
                  title={t('trackOrder', 'تتبع طلبك')}
                >
                  <Truck className="w-4 h-4" />
                </button>
              </div>
              
              {/* Expanding Search Bar */}
              <div className="relative flex items-center justify-end w-8 focus-within:w-48 xl:focus-within:w-64 transition-all duration-300 ease-out z-50">
                <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
                  <Search className="w-4 h-4 text-gray-300 absolute pointer-events-none" style={{ [isEn ? 'left' : 'right']: '6px' }} />
                  <input
                    type="text"
                    placeholder={isSearchFocused ? t('searchPlaceholder', 'ابحثي عن منتج...') : ''}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className={`w-full bg-transparent text-white text-xs border-b border-transparent focus:border-[#C5A059] placeholder-gray-500 focus:outline-none transition-all py-1 ${isEn ? 'pl-7 pr-2' : 'pr-7 pl-2'} ${!isSearchFocused && searchQuery.length === 0 ? 'cursor-pointer' : ''}`}
                    style={{ [isEn ? 'paddingLeft' : 'paddingRight']: isSearchFocused || searchQuery.length > 0 ? '28px' : '0' }}
                  />
                </form>

                {/* Floating Search Results */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-[140%] mt-1 left-0 right-0 min-w-[250px] bg-[#0D221A] border border-[#C5A059]/40 rounded-2xl p-2 shadow-2xl z-[100] max-h-64 overflow-y-auto space-y-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onQuickView(p);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#143529] cursor-pointer transition-colors"
                        >
                          <img src={p.image} alt={isEn ? p.nameEn : p.name} className="w-8 h-8 rounded-lg object-cover border border-[#C5A059]/30" />
                          <div className="flex-1 overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
                            <p className="text-xs font-bold text-white truncate text-start">{isEn ? p.nameEn : p.name}</p>
                            <p className="text-[10px] text-[#C5A059] font-bold text-start">{p.price} {t('currency', 'ج.م')}</p>
                          </div>
                          <Eye className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mx-1" />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 p-2 text-center">{t('noResults', 'لا توجد نتائج مطابقة')}</p>
                    )}
                    {searchResults.length > 0 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-[10px] text-[#EAD096] font-bold py-1.5 border-t border-[#C5A059]/20 hover:text-white flex items-center justify-center gap-1"
                      >
                        <span>{t('viewAllResults', 'عرض جميع النتائج')}</span>
                        <ArrowLeft className={`w-3 h-3 ${isEn ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={() => setActiveTab('wishlist')}
                className="relative p-1.5 text-gray-300 hover:text-[#C5A059] transition-colors group"
                title={t('wishlist', 'المفضلة')}
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm border border-[#0D221A]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth */}
              {currentUser ? (
                <div className="flex items-center gap-3 border-r border-[#C5A059]/20 pr-4 rtl:pr-0 rtl:border-r-0 rtl:border-l rtl:pl-4">
                  {currentUser?.role === 'Admin' && (
                    <button
                      onClick={onOpenAdminDashboard}
                      className="p-1.5 text-[#C5A059] hover:text-[#EAD096] hover:scale-110 transition-all"
                      title={t('admin', 'الأدمن')}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-1 text-gray-300 hover:text-[#C5A059] transition-colors relative group"
                    title={t('myAccount', 'حسابي')}
                  >
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.fullName} className="w-6 h-6 rounded-full object-cover border border-transparent group-hover:border-[#C5A059] transition-colors" />
                    ) : (
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex p-1 text-gray-300 hover:text-[#C5A059] transition-colors border-r border-[#C5A059]/20 pr-4 rtl:pr-0 rtl:border-r-0 rtl:border-l rtl:pl-4"
                  title={t('login', 'دخول')}
                >
                  <User className="w-5 h-5 hover:scale-110 transition-transform" />
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2 text-[#EAD096] transition-colors group"
                title={t('cart', 'السلة')}
              >
                <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full group-hover:bg-[#C5A059]/20 transition-colors"></div>
                <ShoppingBag className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#C5A059] text-[#0D221A] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm z-20 border border-[#0D221A]">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </nav>
      </header>

      {/* --- MOBILE FLOATING TOGGLE (Visible only on mobile) --- */}
      <div className="sm:hidden fixed top-4 right-4 rtl:right-auto rtl:left-4 z-[60] print:hidden pointer-events-auto">
        <button
          onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] border-2 transition-all duration-300 ${
            isFloatingMenuOpen 
              ? 'bg-[#143529] border-[#C5A059] text-[#EAD096] rotate-90' 
              : 'bg-[#0D221A]/85 backdrop-blur-md border-[#C5A059]/60 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A]'
          }`}
          aria-label="Menu"
        >
          {isFloatingMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Floating Panel */}
        <div className={`absolute top-14 right-0 rtl:right-auto rtl:left-0 w-[calc(100vw-32px)] max-w-sm transition-all duration-300 origin-top-right rtl:origin-top-left ${
          isFloatingMenuOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-[#0D221A]/95 backdrop-blur-3xl border border-[#C5A059]/40 rounded-3xl p-4 shadow-2xl flex flex-col gap-3">
            
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'ابحثي عن منتج...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#143529] text-white placeholder-gray-400 text-xs rounded-2xl py-3 px-4 border border-[#C5A059]/40 focus:outline-none focus:border-[#C5A059] transition-all"
                style={{ [isEn ? 'paddingLeft' : 'paddingRight']: '42px' }}
                autoFocus={isFloatingMenuOpen}
              />
              <button type="submit" className="absolute top-3" style={{ [isEn ? 'left' : 'right']: '14px' }}>
                <Search className="w-4 h-4 text-[#C5A059]" />
              </button>
            </form>

            {/* Quick Actions (Language & Track Order) */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex-1 bg-[#143529] border border-[#C5A059]/30 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#EAD096] hover:bg-[#C5A059]/20 transition-colors shadow-inner"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">{t('language', 'English')}</span>
              </button>

              <button
                onClick={() => { setIsFloatingMenuOpen(false); onOpenTrackOrder(); }}
                className="flex-1 bg-[#143529] border border-[#C5A059]/30 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#EAD096] hover:bg-[#C5A059]/20 transition-colors shadow-inner"
              >
                <Truck className="w-4 h-4" />
                <span className="text-xs font-bold">{t('trackOrder', 'تتبع طلبك')}</span>
              </button>
            </div>

            {/* Mobile Search Results */}
            {searchQuery.trim().length > 0 && (
              <div className="max-h-48 overflow-y-auto mt-1 space-y-1 bg-[#143529]/80 rounded-2xl p-2 border border-[#C5A059]/20">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onQuickView(p);
                        setIsFloatingMenuOpen(false);
                        setSearchQuery(''); 
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#0D221A] cursor-pointer transition-colors"
                    >
                      <img src={p.image} alt={isEn ? p.nameEn : p.name} className="w-10 h-10 rounded-lg object-cover border border-[#C5A059]/30" />
                      <div className="flex-1 overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
                        <p className="text-[11px] font-bold text-white truncate text-start">{isEn ? p.nameEn : p.name}</p>
                        <p className="text-[9px] text-[#C5A059] font-bold text-start">{p.price} {t('currency', 'ج.م')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 p-3 text-center">{t('noResults', 'لا توجد نتائج مطابقة')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
