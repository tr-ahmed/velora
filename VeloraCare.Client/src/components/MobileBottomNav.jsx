import React, { useState } from 'react';
import { Home, ShoppingBag, Sparkles, Heart, ShoppingCart, User, ShieldCheck, LogOut, X, Store, ChevronRight } from 'lucide-react';

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

  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'products', icon: ShoppingBag, label: 'المتجر' },
    { id: 'cart', icon: ShoppingCart, label: 'سلّتي', badge: cartCount },
    { id: 'quiz', isFAB: true, icon: Sparkles, label: 'الروتين' },
    { id: 'wishlist', icon: Heart, label: 'مفضلتي', badge: wishlistCount },
    { id: 'profile', icon: User, label: currentUser ? (currentUser.fullName?.split(' ')[0] || 'حسابي') : 'حسابي' },
  ];

  return (
    <>
      {/* ==================== ULTRA-MODERN FLOATING APP DOCK ==================== */}
      <nav className="sm:hidden fixed bottom-1 left-2 right-2 z-50 print:hidden"
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 2px)' }}>
        
        {/* Floating Glassmorphic Container */}
        <div className="bg-[#0D221A]/95 backdrop-blur-2xl border border-[#C5A059]/40 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.65)] px-2 py-1.5 transition-all">
          <div className="flex justify-around items-center">
            
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              /* ---- Center Elevated Golden FAB Button ---- */
              if (tab.isFAB) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex flex-col items-center gap-0.5 relative -mt-5 group"
                    aria-label={tab.label}
                  >
                    <div className="relative">
                      {/* Golden Halo Outer Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EAD096] via-[#C5A059] to-[#987834] blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                      
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] flex items-center justify-center shadow-[0_6px_20px_rgba(197,160,89,0.5)] border-2 border-[#0D221A] active:scale-90 transition-transform">
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#EAD096] tracking-wider drop-shadow-sm">
                      {tab.label}
                    </span>
                  </button>
                );
              }

              /* ---- Regular Sleek Tab ---- */
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="flex flex-col items-center justify-center min-w-[44px] py-1 relative group active:scale-95 transition-transform"
                  aria-label={tab.label}
                >
                  {/* Icon Container with subtle active pill */}
                  <div className={`relative w-9 h-8 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#C5A059]/30 to-[#987834]/20 text-[#EAD096] border border-[#C5A059]/40 shadow-inner'
                      : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    <Icon
                      className={`w-[19px] h-[19px] transition-all duration-200 ${
                        isActive ? 'text-[#EAD096] scale-110 drop-shadow-[0_2px_8px_rgba(234,208,150,0.5)]' : 'text-gray-400'
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />

                    {/* Notification Badge */}
                    {Boolean(tab.badge) && tab.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-extrabold text-[9px] min-w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-[#0D221A] shadow-md px-1 animate-popIn">
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  {/* Active Indicator Pip Underneath */}
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#EAD096] shadow-[0_0_8px_#EAD096] scale-100 opacity-100'
                      : 'bg-transparent scale-0 opacity-0'
                  }`} />

                  {/* Label */}
                  <span className={`text-[9.5px] font-extrabold transition-all duration-200 leading-none ${
                    isActive ? 'text-[#EAD096]' : 'text-gray-400 font-medium'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

      </nav>

      {/* ==================== PROFILE DRAWER MENU ==================== */}
      {isProfileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#C5A059] shadow-2xl space-y-4 animate-popIn">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#143529] text-[#EAD096] border border-[#C5A059] flex items-center justify-center font-bold text-lg font-serif">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0D221A]">{currentUser?.fullName}</h3>
                  <span className="text-[10px] text-[#987834] font-semibold">{currentUser?.email}</span>
                </div>
              </div>
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <button
                onClick={() => { setIsProfileMenuOpen(false); setActiveTab('profile'); }}
                className="w-full p-3 rounded-2xl bg-[#E6EDE4] hover:bg-[#F0EBE1] border border-gray-200 flex items-center justify-between font-bold text-[#0D221A] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>تعديل الملف الشخصي والعنوان</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
              </button>

              {currentUser?.role === 'Admin' && (
                <button
                  onClick={() => { setIsProfileMenuOpen(false); onOpenAdminDashboard(); }}
                  className="w-full p-3 rounded-2xl bg-[#0D221A] text-[#EAD096] border border-[#C5A059] flex items-center justify-between font-bold transition-all shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>لوحة إدارة VELORA (الأدمن) 👑</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C5A059] rotate-180" />
                </button>
              )}

              <button
                onClick={() => { setIsProfileMenuOpen(false); onLogout(); }}
                className="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-2.5 font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
