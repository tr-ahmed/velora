import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Sparkles, User, ShieldCheck, LogOut, Eye, ArrowLeft, Truck, Globe, Tag } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isEn = i18n.language === 'en';

  const toggleLanguage = () => {
    const newLang = isEn ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
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
    setMobileMenuOpen(false);
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
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* --- MAIN HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-[#0D221A]/90 backdrop-blur-xl border-b border-[#C5A059]/30 shadow-xl print:hidden">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            
            {/* 1. Brand Logo */}
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group flex-shrink-0 flex items-center gap-2"
            >
              <VeloraLogo size="md" glow={true} />
            </div>

            {/* 2. Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Language & Track Order (Desktop) */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 p-1.5 text-gray-300 hover:text-[#EAD096] transition-colors"
                  title={isEn ? "Switch to Arabic" : "تغيير اللغة"}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{t('language', 'English')}</span>
                </button>
                <button
                  onClick={onOpenTrackOrder}
                  className="flex items-center gap-1 p-1.5 text-gray-300 hover:text-[#EAD096] transition-colors"
                  title={t('trackOrder', 'تتبع طلبك')}
                >
                  <Truck className="w-4 h-4" />
                </button>
              </div>
              
              {/* Expanding Search Bar (Desktop) */}
              <div className="relative hidden lg:flex items-center justify-end w-8 focus-within:w-48 xl:focus-within:w-64 transition-all duration-300 ease-out z-50">
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
                className="relative hidden sm:block p-1.5 text-gray-300 hover:text-[#C5A059] transition-colors group"
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
                <div className="hidden sm:flex items-center gap-3 border-r border-[#C5A059]/20 pr-4 rtl:pr-0 rtl:border-r-0 rtl:border-l rtl:pl-4">
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
                  className="hidden sm:flex p-1 text-gray-300 hover:text-[#C5A059] transition-colors border-r border-[#C5A059]/20 pr-4 rtl:pr-0 rtl:border-r-0 rtl:border-l rtl:pl-4"
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

              {/* Mobile Drawer Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-300 hover:text-[#C5A059] transition-colors"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>

          {/* Mobile Search & Menu Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-[#C5A059]/20 flex flex-col gap-2 animate-fadeIn pb-2">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder', 'ابحثي عن منتج...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#143529] text-white placeholder-gray-400 text-xs rounded-full py-2.5 px-4 border border-[#C5A059]/40 focus:outline-none focus:border-[#C5A059] transition-all"
                  style={{ [isEn ? 'paddingLeft' : 'paddingRight']: '40px' }}
                />
                <button type="submit" className="absolute top-2.5" style={{ [isEn ? 'left' : 'right']: '14px' }}>
                  <Search className="w-4 h-4 text-[#C5A059]" />
                </button>
              </form>

              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-start px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    link.isSpecial
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#987834] text-[#0D221A] text-center'
                      : activeTab === link.id
                      ? 'bg-[#143529] text-[#EAD096] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C5A059]'
                      : 'text-gray-200 hover:bg-[#143529]'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-2 p-3 bg-[#143529] rounded-xl border border-[#C5A059]/40 text-[#EAD096] hover:bg-[#C5A059]/20 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-bold text-xs">{t('language', 'English')}</span>
                </button>

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-[#143529] rounded-xl border border-[#C5A059]/40 text-[#EAD096] hover:bg-[#C5A059]/20 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span className="font-bold text-xs">{t('trackOrder', 'تتبع طلبك')}</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
