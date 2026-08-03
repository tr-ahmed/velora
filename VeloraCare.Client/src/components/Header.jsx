import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Sparkles, User, ShieldCheck, LogOut, Eye, ArrowLeft, Truck, Phone } from 'lucide-react';
import VeloraLogo from './VeloraLogo';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'المتجر والمنتجات' },
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
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="hidden sm:flex sticky top-0 z-40 w-full bg-[#0D221A]/95 backdrop-blur-xl border-b border-[#C5A059]/30 shadow-xl print:hidden">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Brand Logo (Right Side in RTL) */}
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group flex-shrink-0 flex items-center gap-2"
            >
              <VeloraLogo size="md" glow={true} />
            </div>

            {/* 2. Navigation Links (Center Column Desktop) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                
                if (link.isSpecial) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] text-[#0D221A] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap relative ${
                      isActive
                        ? 'text-[#EAD096] bg-[#143529] border border-[#C5A059]/50 shadow-xs'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Action Controls & Search (Left Column) */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={onOpenTrackOrder}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#C5A059] bg-[#C5A059]/10 rounded-full hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors border border-[#C5A059]/30"
              >
                <Truck className="w-4 h-4" />
                <span>تتبع طلبك</span>
              </button>
              
              {/* Expandable Live Search Box */}
              <div className="relative w-[130px] sm:w-40 lg:w-48 xl:w-56">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="ابحثي عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="w-full bg-[#143529] text-white placeholder-gray-400 text-xs rounded-full py-1.5 pr-8 pl-3 border border-[#C5A059]/40 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner"
                  />
                  <Search className="w-3.5 h-3.5 text-[#C5A059] absolute right-2.5 top-2.5" />
                </form>

                {/* Floating Search Results */}
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

              {/* Wishlist Button */}
              <button 
                onClick={() => setActiveTab('wishlist')}
                className="relative hidden sm:block p-2 text-gray-300 hover:text-[#C5A059] rounded-full hover:bg-white/5 transition-colors"
                title="المفضلة"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account / Admin Badge */}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-1.5">
                  {/* Strict Admin Check */}
                  {currentUser?.role === 'Admin' && (
                    <button
                      onClick={onOpenAdminDashboard}
                      className="px-3 py-1.5 rounded-full bg-[#C5A059] text-[#0D221A] font-extrabold text-xs flex items-center gap-1 shadow-md hover:bg-[#EAD096] active:scale-95 transition-all"
                      title="لوحة تحكم الأدمن"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>الأدمن 👑</span>
                    </button>
                  )}

                  {/* Customer Profile Button */}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      activeTab === 'profile'
                        ? 'bg-[#C5A059] text-[#0D221A] border-[#C5A059]'
                        : 'bg-[#143529] text-[#EAD096] border-[#C5A059]/40 hover:border-[#C5A059]'
                    }`}
                    title="حسابي الشخصي"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] text-[#0D221A] overflow-hidden flex items-center justify-center font-bold border border-[#C5A059]">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </div>
                    <span className="hidden sm:inline">{currentUser.fullName?.split(' ')[0] || 'حسابي'}</span>
                  </button>

                  {/* Quick Logout Icon */}
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-full bg-[#143529] border border-rose-500/40 text-rose-300 hover:bg-rose-950 transition-all"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-[#EAD096] font-bold hover:text-white px-3.5 py-1.5 rounded-full bg-[#143529] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>دخول</span>
                </button>
              )}

              {/* Cart Drawer Main CTA Button */}
              <button
                onClick={onOpenCart}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#987834] text-[#0D221A] px-3.5 py-1.5 rounded-full font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 border border-[#F3E5AB]/40 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">السلة</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 bg-[#0D221A] text-[#EAD096] text-[10px] font-mono rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Drawer Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-[#C5A059] hover:text-white rounded-xl bg-[#143529] border border-[#C5A059]/30 active:scale-95 transition-all"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-[#C5A059]/20 flex flex-col gap-2 animate-fadeIn">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-right py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    link.isSpecial
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#987834] text-[#0D221A] text-center'
                      : activeTab === link.id
                      ? 'bg-[#143529] text-[#EAD096] border-r-4 border-[#C5A059]'
                      : 'text-gray-200 hover:bg-[#143529]'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 mt-2 bg-[#143529] rounded-xl border border-[#C5A059]/40 text-[#EAD096] hover:bg-[#C5A059]/20 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span className="font-bold text-xs">تتبع طلبك كزائر</span>
              </button>
            </div>
          )}
        </nav>
      </header>
  );
}
