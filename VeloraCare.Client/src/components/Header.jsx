import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Sparkles, User, ShieldCheck, LogOut, Eye, ArrowLeft } from 'lucide-react';
import VeloraLogo from './VeloraLogo';

export default function Header({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenQuiz, 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'المتجر والمنتجات' },
    { id: 'wishlist', label: 'المفضلة ❤️' },
    { id: 'quiz', label: 'اختبار روتين البشرة', isSpecial: true },
    { id: 'about', label: 'قصة VELORA' },
    { id: 'reviews', label: 'تجارب العميلات' },
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
        p.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('products');
      setIsSearchFocused(false);
      setMobileSearchOpen(false);
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Native Mobile App Top Bar with Quick Login / Logout */}
      <div className="sm:hidden sticky top-0 z-40 bg-[#0D221A] text-white px-3.5 py-2 border-b border-[#C5A059]/30 flex items-center justify-between shadow-md print:hidden">
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group flex items-center gap-2"
        >
          <VeloraLogo size="sm" showText={true} />
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'Admin' && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="px-2.5 py-1 rounded-full bg-[#C5A059] text-[#0D221A] font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>الأدمن 👑</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] font-bold text-[11px] shadow-sm active:scale-95 transition-all group"
                title="تسجيل الخروج"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] text-[#0D221A] flex items-center justify-center font-bold shadow-xs">
                  <User className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-white group-hover:text-[#EAD096]">خروج</span>
                <LogOut className="w-3 h-3 text-rose-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 text-xs text-[#0D221A] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] shadow-md active:scale-95 transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#0D221A]" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Luxury Header */}
      <header className="hidden sm:block sticky top-0 z-40 w-full bg-[#0D221A] border-b border-[#C5A059]/30 shadow-2xl print:hidden">
      
      {/* Compact Deep Emerald Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-1.5 sm:py-2 transition-all duration-300">
        
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Toggles */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#C5A059] hover:text-white rounded-xl bg-[#143529] border border-[#C5A059]/30 active:scale-95 transition-all"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-[#C5A059] hover:text-white rounded-xl bg-[#143529] border border-[#C5A059]/30 active:scale-95 transition-all"
              aria-label="البحث"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Logo - Prominent Monogram Emblem */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group flex-shrink-0"
          >
            <VeloraLogo size="md" glow={true} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-[#143529]/90 p-1 rounded-full border border-[#C5A059]/35 backdrop-blur-md flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              
              if (link.isSpecial) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] text-[#0D221A] font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                  >
                    <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '5s' }} />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all relative whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-[#C5A059]/25 text-[#EAD096] border border-[#C5A059]/60 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons (Search & Controls) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Live Search Input */}
            <div className="relative hidden md:block w-48 lg:w-56 xl:w-64">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="بحث عن مستحضر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full bg-[#143529] text-white placeholder-gray-400 text-xs rounded-full py-1.5 pr-8 pl-3 border border-[#C5A059]/40 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-[#C5A059] absolute right-2.5 top-2.5" />
              </form>

              {/* Live Search Floating Results */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#0D221A] border border-[#C5A059]/40 rounded-2xl p-2 shadow-2xl z-50 max-h-64 overflow-y-auto space-y-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onQuickView(p);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#143529] cursor-pointer text-right transition-colors"
                      >
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#C5A059]/30" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-[#C5A059] font-bold">{p.price} ج.م</p>
                        </div>
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 p-2 text-center">لا توجد نتائج مطابقة</p>
                  )}
                  {searchResults.length > 0 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-[10px] text-[#EAD096] font-bold py-1.5 border-t border-[#C5A059]/20 hover:text-white flex items-center justify-center gap-1"
                    >
                      <span>عرض جميع النتائج في المتجر</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Action Icons */}
            <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={onOpenAdminDashboard}
                      className="px-2.5 py-1 rounded-full bg-[#C5A059] text-[#0D221A] font-bold text-xs flex items-center gap-1 shadow-md hover:bg-[#EAD096] transition-all whitespace-nowrap flex-shrink-0"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">الأدمن 👑</span>
                    </button>
                  )}

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143529] border border-[#C5A059]/40 text-[#EAD096] font-bold text-xs shadow-sm hover:border-[#C5A059] active:scale-95 transition-all group whitespace-nowrap flex-shrink-0"
                    title="تسجيل الخروج"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] text-[#0D221A] flex items-center justify-center font-bold flex-shrink-0">
                      <User className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-white group-hover:text-[#EAD096] whitespace-nowrap">خروج</span>
                    <LogOut className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1 text-xs text-[#EAD096] font-bold hover:text-white px-3 py-1 rounded-full bg-[#143529] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all shadow-sm whitespace-nowrap flex-shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="whitespace-nowrap">دخول</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button 
                onClick={() => setActiveTab('wishlist')}
                className="relative p-1.5 text-gray-200 hover:text-[#C5A059] rounded-full hover:bg-white/5 transition-colors flex-shrink-0"
                title="المفضلة"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#987834] text-[#0D221A] px-3 sm:px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all transform active:scale-95 border border-[#F3E5AB]/40 whitespace-nowrap flex-shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">السلة</span>
                <span className="w-4 h-4 bg-[#0D221A] text-[#EAD096] text-[10px] rounded-full flex items-center justify-center font-extrabold mr-0.5">
                  {cartCount}
                </span>
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="lg:hidden mt-2 pt-2 pb-1 border-t border-[#C5A059]/20 animate-fadeIn space-y-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="ابحثي عن مستحضر أو سيروم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#143529] text-white placeholder-gray-400 text-xs rounded-xl py-2 px-4 pr-10 border border-[#C5A059]/40 focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-[#C5A059]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {searchQuery.trim().length > 0 && searchResults.length > 0 && (
              <div className="bg-[#143529] rounded-xl p-2 border border-[#C5A059]/30 max-h-48 overflow-y-auto space-y-1">
                {searchResults.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onQuickView(p);
                      setMobileSearchOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#0D221A] text-xs text-white"
                  >
                    <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover" />
                    <span className="flex-1 font-bold truncate">{p.name}</span>
                    <span className="text-[#EAD096] font-bold">{p.price} ج.م</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-[#C5A059]/20 flex flex-col gap-1.5 pb-1 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-right py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                  link.isSpecial
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D221A] font-bold text-center mt-1'
                    : activeTab === link.id
                    ? 'bg-[#C5A059]/20 text-[#EAD096] border-r-4 border-[#C5A059]'
                    : 'text-gray-200 hover:bg-[#143529]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#143529] text-[#EAD096] text-center border border-[#C5A059]/40 mt-1"
              >
                تسجيل الدخول / حساب جديد
              </button>
            )}
          </div>
        )}

      </nav>
    </header>
    </>
  );
}
