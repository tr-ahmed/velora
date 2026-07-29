import React, { useState } from 'react';
import { Home, ShoppingBag, Sparkles, Heart, ShoppingCart, User, ShieldCheck, LogOut, X, Store } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenQuiz,
  currentUser,
  onOpenAuthModal,
  onOpenAdminDashboard,
  onLogout
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    if (tabId === 'cart') {
      onOpenCart();
    } else if (tabId === 'quiz') {
      onOpenQuiz();
    } else if (tabId === 'profile') {
      if (currentUser) {
        setIsProfileMenuOpen(true);
      } else {
        onOpenAuthModal();
      }
    } else {
      setActiveTab(tabId);
    }
  };

  const isProfileActive = activeTab === 'profile';

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D221A]/95 backdrop-blur-xl border-t border-[#C5A059]/40 shadow-2xl px-1.5 py-2 flex justify-around items-center print:hidden">
        
        {/* 1. Home Tab */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 ${
            activeTab === 'home'
              ? 'text-[#EAD096]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className={`p-1.5 rounded-2xl transition-all ${
            activeTab === 'home' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        {/* 2. Store Products Catalog Tab */}
        <button
          onClick={() => handleTabClick('products')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 ${
            activeTab === 'products'
              ? 'text-[#EAD096]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className={`p-1.5 rounded-2xl transition-all ${
            activeTab === 'products' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">المتجر</span>
        </button>

        {/* 3. Skin Quiz Tab (Highlighted Hero FAB) */}
        <button
          onClick={() => handleTabClick('quiz')}
          className="flex flex-col items-center justify-center gap-1 relative -top-3 transition-all duration-200 active:scale-95"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#987834] text-[#0D221A] flex items-center justify-center shadow-lg shadow-[#C5A059]/40 border-2 border-[#F3E5AB]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-[#EAD096]">الروتين</span>
        </button>

        {/* 4. Wishlist Tab */}
        <button
          onClick={() => handleTabClick('wishlist')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 ${
            activeTab === 'wishlist'
              ? 'text-[#EAD096]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className={`p-1.5 rounded-2xl transition-all relative ${
            activeTab === 'wishlist' ? 'bg-[#C5A059]/20 text-[#EAD096] border border-[#C5A059]/40' : ''
          }`}>
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-[#0D221A] text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">المفضلة</span>
        </button>

        {/* 5. Cart Drawer Trigger Tab */}
        <button
          onClick={() => handleTabClick('cart')}
          className="flex flex-col items-center justify-center gap-1 relative transition-all duration-200 active:scale-90 text-gray-400 hover:text-gray-200"
        >
          <div className="p-1.5 rounded-2xl relative">
            <ShoppingCart className="w-5 h-5 text-[#EAD096]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">السلة</span>
        </button>

        {/* 6. Profile / Admin Tab */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 ${
            isProfileActive
              ? 'text-[#EAD096]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="p-1.5 rounded-2xl">
            {currentUser?.role === 'Admin' ? (
              <ShieldCheck className="w-5 h-5 text-[#EAD096]" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <span className="text-[10px] font-bold">
            {currentUser ? (currentUser.role === 'Admin' ? 'الأدمن' : 'حسابي') : 'دخول'}
          </span>
        </button>

      </div>

      {/* Mobile Logged-in User Profile Modal Sheet */}
      {isProfileMenuOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D221A] text-white rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full border-t-2 sm:border-2 border-[#C5A059] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#143529] border border-[#C5A059] flex items-center justify-center text-[#EAD096] font-bold">
                  {currentUser.role === 'Admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#EAD096]">{currentUser.fullName}</h4>
                  <p className="text-[11px] text-gray-400">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#143529]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setActiveTab('profile');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#143529] text-[#EAD096] border border-[#C5A059]/50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-[#C5A059]" />
                <span>تعديل بياناتي وصورتي الشخصية 👤</span>
              </button>

              {/* Strict Admin Role Guard */}
              {currentUser?.role === 'Admin' && (
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenAdminDashboard();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#987834] text-[#0D221A] font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>دخول لوحة تحكم الأدمن 👑</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-950/80 text-rose-200 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>تسجيل الخروج 🚪</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
