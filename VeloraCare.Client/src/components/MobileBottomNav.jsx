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
      {/* ==================== BOTTOM NAV BAR ==================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 print:hidden"
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}>
        
        {/* Glass background */}
        <div className="bg-[#0D221A]/96 backdrop-blur-2xl border-t border-[#C5A059]/25 shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex justify-around items-end px-2 pt-1.5 pb-1">
            
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              /* ---- FAB Center Button ---- */
              if (tab.isFAB) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex flex-col items-center gap-0.5 relative -mt-5"
                    aria-label={tab.label}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] flex items-center justify-center shadow-[0_6px_24px_rgba(197,160,89,0.5)] border-4 border-[#0D221A] active:scale-90 transition-transform">
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="text-[9px] font-extrabold text-[#EAD096] tracking-wide">
                      {tab.label}
                    </span>
                  </button>
                );
              }

              /* ---- Regular Tab ---- */
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="flex flex-col items-center gap-0.5 min-w-[48px] py-0.5 relative group active:scale-90 transition-transform"
                  aria-label={tab.label}
                >
                  {/* Active indicator pip */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-[#C5A059] opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`} />

                  {/* Icon Container */}
                  <div className={`relative w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C5A059]/20 text-[#EAD096]'
                      : 'text-gray-400 group-active:bg-white/5'
                  }`}>
                    <Icon
                      className={`w-[18px] h-[18px] transition-all duration-200 ${isActive ? 'text-[#EAD096]' : 'text-gray-500'}`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />

                    {/* Badge */}
                    {tab.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-[#C5A059] text-[#0D221A] text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0D221A]">
                        {tab.badge > 9 ? '9+' : tab.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-[10px] font-bold transition-all duration-200 max-w-[56px] truncate ${
                    isActive ? 'text-[#EAD096]' : 'text-gray-500'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ==================== PROFILE BOTTOM SHEET ==================== */}
      {isProfileMenuOpen && currentUser && (
        <div
          className="sm:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#0D221A] animate-slideFromBottom"
            style={{
              borderRadius: '28px 28px 0 0',
              paddingBottom: 'max(24px, env(safe-area-inset-bottom, 16px))'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Grab bar */}
            <div className="w-10 h-1 bg-[#C5A059]/40 rounded-full mx-auto mt-3 mb-4" />

            {/* User Card */}
            <div className="mx-4 mb-4 p-4 rounded-2xl bg-[#143529] border border-[#C5A059]/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EAD096] to-[#C5A059] border-2 border-[#C5A059] overflow-hidden flex items-center justify-center text-[#0D221A]">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 stroke-[2]" />
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-[#EAD096] text-sm">{currentUser.fullName}</p>
                  <p className="text-xs text-gray-400">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 space-y-2 mb-2">
              
              <button
                onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#143529]/80 border border-[#C5A059]/20 text-right active:bg-[#C5A059]/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">تعديل بياناتي وصورتي 👤</span>
                  <div className="w-9 h-9 rounded-xl bg-[#0D221A] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#C5A059]" />
                  </div>
                </div>
              </button>

              {currentUser?.role === 'Admin' && (
                <button
                  onClick={() => { onOpenAdminDashboard(); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/40 text-right active:bg-[#C5A059]/20 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#EAD096]">لوحة تحكم الأدمن 👑</span>
                    <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-right active:bg-rose-900/40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-rose-300">تسجيل الخروج</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-950 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-rose-400" />
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
