import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import SkinRoutineQuiz from './components/SkinRoutineQuiz';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ContactWidget from './components/ContactWidget';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/admin/AdminDashboard';
import WishlistPage from './components/WishlistPage';
import UserProfilePage from './components/UserProfilePage';
import TrackOrderModal from './components/TrackOrderModal';
import MobileBottomNav from './components/MobileBottomNav';
import InfoModal from './components/InfoModal';
import { Search, X, Sparkles, Settings, Clock, Instagram, Lock } from 'lucide-react';
import { 
  fetchProductsFromApi,
  fetchHeroSlidesApi, fetchHeroSettingsApi, saveHeroSlideApi, deleteHeroSlideApi, updateHeroSettingsApi, fetchStoreSettingsApi
} from './services/api';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [infoModalType, setInfoModalType] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Persistent Wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_wishlist');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch (e) {
      return [1, 3];
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [storeSettings, setStoreSettings] = useState(null);

  // Allow admin login via URL hash
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      setIsAuthModalOpen(true);
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      badge: 'المتجر الملكي الأول للعناية العضوية 👑',
      titleHighlight: 'إكسير النضارة',
      titleRest: 'الزمردية والجمال الفاخر',
      description: 'اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية. تركيبة دقيقة تمنحك إشراقة شبابية فورية ولمسة مخملية تليق بأناقتك.',
      productImage: '/images/serum.png',
      productTitle: 'سيروم الزمرد لإعادة إحياء الشباب',
      productSub: 'إكسير نباتي مكثف لإشراقة ملكية',
      rating: '★ 4.9',
      miniCardImage: '/images/cream.png',
      miniCardTitle: 'كريم الترطيب الفاخر',
      miniCardOffer: 'منتجات طبيعية 100%',
      active: true
    },
    {
      id: 2,
      badge: 'ترطيب ملكي مخملي 🧴',
      titleHighlight: 'حماية وتنعيم',
      titleRest: 'يدوم 72 ساعة فائقة',
      description: 'كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي وسيروم الزمرد المعصور بارداً لإصلاح حاجز البشرة الواقي ومنحها ملمس المخمل الحريري.',
      productImage: '/images/cream.png',
      productTitle: 'كريم الترطيب الزمردي الفاخر',
      productSub: 'ترطيب عميق وسيراميد نباتي',
      rating: '★ 4.8',
      miniCardImage: '/images/glow_oil.png',
      miniCardTitle: 'زيت فيلورا الذهبي',
      miniCardOffer: 'إشراقة الذهب النقي',
      active: true
    },
    {
      id: 3,
      badge: 'إصدار محدود بالذهب ✨',
      titleHighlight: 'قطرات الذهب',
      titleRest: 'وإشراقة ملكية متوهجة',
      description: 'مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي. يغذي خلايا البشرة العميق ويمنحك إشراقة متوهجة كالجمال الإمبراطوري.',
      productImage: '/images/glow_oil.png',
      productTitle: 'زيت فيلورا الذهبي للوجه والرقبة',
      productSub: 'تغذية بالذهب والنباتات النادرة',
      rating: '★ 5.0',
      miniCardImage: '/images/candle.png',
      miniCardTitle: 'شمعة الاسترخاء',
      miniCardOffer: 'عبير اللافندر الملكي',
      active: true
    }
  ]);

  const [heroSettings, setHeroSettings] = useState({ autoPlay: true, autoPlayInterval: 5.5, showTrustHighlights: true });

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function loadHeroData() {
      try {
        const slides = await fetchHeroSlidesApi();
        if (slides && slides.length > 0) setHeroSlides(slides);

        const settings = await fetchHeroSettingsApi();
        if (settings) setHeroSettings(settings);
      } catch (err) {
        console.warn('Hero API load failed:', err);
      }
    }
    loadHeroData();
  }, []);

  // Persist Current User
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('velora_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('velora_user');
      }
    } catch (e) {
      console.warn('LocalStorage save failed for user');
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('velora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save failed');
    }
  }, [wishlist]);

  // Automatic Admin Route & Hash Detection (#admin, /admin, ?admin=true)
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const path = window.location.pathname;

      if (hash === '#admin' || search.includes('admin') || path.endsWith('/admin')) {
        if (currentUser?.role === 'Admin') {
          setIsAdminView(true);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, [currentUser]);

  // Load Global Store Settings
  useEffect(() => {
    fetchStoreSettingsApi().then(settings => {
      if (settings) {
        setStoreSettings(settings);
      }
    }).catch(err => console.error('Failed to load global store settings:', err));
  }, []);

  const loadProducts = async () => {
    try {
      const category = selectedCategory === 'offers' ? 'all' : selectedCategory;
      const data = await fetchProductsFromApi(category);
      setProducts(data);
    } catch (err) {
      console.warn('Failed to load products:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  // Always scroll to top when changing tabs or views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, isAdminView]);

  // Cart Management
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleAddRoutineToCart = (routineProducts) => {
    routineProducts.forEach(p => handleAddToCart(p, 1));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item)
    );
  };

  const handleQuickBuy = (product, qty = 1) => {
    if (!product) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setQuickViewProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleToggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleExploreClick = () => {
    setActiveTab('products');
    window.scrollTo(0, 0);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Render Admin Dashboard if Admin View is Active
  if (isAdminView && currentUser?.role === 'Admin') {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={() => {
          setIsAdminView(false);
          setCurrentUser(null);
        }}
        onGoToStore={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }}
        heroSlides={heroSlides}
        setHeroSlides={setHeroSlides}
        heroSettings={heroSettings}
        setHeroSettings={setHeroSettings}
      />
    );
  }

  if (storeSettings?.maintenanceMode && currentUser?.role !== 'Admin') {
    return (
      <div dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen bg-[#0D221A] text-[#EAD096] flex flex-col items-center justify-center p-6 text-center font-serif relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C5A059] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#987834] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-[#C5A059]/30 p-10 sm:p-16 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-2xl w-full mx-auto transform hover:scale-[1.02] transition-transform duration-500">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-[#C5A059] blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <Settings className="w-20 h-20 text-[#C5A059] animate-[spin_8s_linear_infinite] relative z-10 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
            <Sparkles className="w-8 h-8 text-white absolute top-0 right-1/4 animate-bounce z-20" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834]">
            {isEn ? 'Site Upgrade in Progress' : 'جاري تطوير الموقع حالياً'}
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-8 rounded-full"></div>
          
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto mb-10 font-light">
            {isEn 
              ? 'We are currently upgrading our systems to provide you with a better shopping experience. The store will be back online shortly. Thank you for your patience.' 
              : 'نعمل حالياً على تحديث وتطوير أنظمة المتجر لتقديم تجربة تسوق أفضل لعملائنا الكرام. سيعود المتجر للعمل في أقرب وقت ممكن، شكراً لتفهمكم.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold tracking-wide">
            <div className="flex items-center gap-2 bg-[#0D221A]/50 px-6 py-3 rounded-full border border-[#C5A059]/20 shadow-inner">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>{isEn ? 'Coming Back Soon' : 'نعود إليكم قريباً'}</span>
            </div>
            {storeSettings?.whatsAppNumber && (
              <a 
                href={`https://wa.me/${storeSettings.whatsAppNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#987834] text-[#0D221A] px-6 py-3 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.6)] transition-all hover:-translate-y-1"
              >
                <span>{isEn ? 'Contact Support' : 'تواصل معنا (واتساب)'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Hidden Admin Login Access */}
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="absolute bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity p-2"
          title="Admin Login"
        >
          <Lock className="w-5 h-5 text-[#EAD096]" />
        </button>

        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
            onLogin={(user) => {
              setCurrentUser(user);
              setIsAuthModalOpen(false);
              if (user.role === 'Admin') {
                setIsAdminView(true);
              }
            }} 
          />
        )}
      </div>
    );
  }

  return (
    <div dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen flex flex-col bg-[#E6EDE4] text-[#0D221A] pb-16 sm:pb-0">
      
      {/* Header Bar */}
      <Header
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onOpenAdminDashboard={() => setIsAdminView(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Main Page Routing/Views */}
      <main className="flex-1">
        
        {activeTab === 'home' && (
          <>
            <Hero
                onExploreClick={handleExploreClick}
                onOpenQuiz={() => setIsQuizOpen(true)}
                slides={heroSlides}
                settings={heroSettings}
              />
            <Categories
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleExploreClick();
              }}
            />
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onQuickView={(p) => setQuickViewProduct(p)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              cartItems={cartItems}
            />
            <Testimonials />
          </>
        )}

        {activeTab === 'products' && (
          <div className="py-8">
            <Categories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onQuickView={(p) => setQuickViewProduct(p)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              cartItems={cartItems}
            />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onExploreClick={handleExploreClick}
            cartItems={cartItems}
          />
        )}

        {(activeTab === 'profile' || activeTab === 'orders') && (
          <UserProfilePage
            key={activeTab}
            currentUser={currentUser}
            initialTab={activeTab === 'orders' ? 'orders' : 'info'}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
            }}
            onExploreClick={handleExploreClick}
          />
        )}

        {activeTab === 'about' && (
          <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">{isEn ? 'The VELORA CARE Story' : 'قصة VELORA CARE'}</span>
            <h1 className="text-4xl font-extrabold font-serif text-[#0D221A]">
              {isEn ? 'Where Rare Nature Meets Imperial Luxury' : 'عندما تلتقي الطبيعة النادرة بالفخامة الإمبراطورية'}
            </h1>
            <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            <p className="text-gray-700 leading-relaxed text-base font-light">
              {isEn ? 'VELORA CARE was founded to redefine natural and royal skincare in Egypt. We believe every woman deserves premium care inspired by the purest organic emerald botanicals, without compromising on results and beauty.' : 'تأسست VELORA CARE لتعيد تعريف العناية بالبشرة الطبيعية والملكية في مصر. نؤمن بأن كل امرأة تستحق عناية فائقة مستوحاة من أنقى خلاصة النباتات العضوية الزمردية بدون مساومة على النتيجة والجمال.'}
            </p>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 ${isEn ? 'text-left' : 'text-right'}`}>
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">{isEn ? 'Rare Ingredients 🌿' : 'مكونات نادرة 🌿'}</h3>
                <p className="text-xs text-gray-600">{isEn ? 'We extract from certified organic farms worldwide to ensure efficacy and purity.' : 'نستخلص المستحضرات من مزارع عضويّة معتمدة حول العالم لضمان الفاعلية والنقاء.'}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">{isEn ? 'Luxurious Design ✨' : 'تصميم وفاخر ✨'}</h3>
                <p className="text-xs text-gray-600">{isEn ? 'Luxurious bottles with emerald and gold shades to decorate your vanity and give you a daily spa experience.' : 'عبوات فاخرة بظلال الزمرد والذهب لتزين طاولتك وتمنحك تجربة سبا يومية.'}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">{isEn ? 'Clinical Results 👑' : 'نتائج سريرية 👑'}</h3>
                <p className="text-xs text-gray-600">{isEn ? 'All products are clinically tested to guarantee noticeable hydration and glow from the first use.' : 'جميع المنتجات مختبرة سريرياً وتضمن ترطيب ونضارة ملحوظة من أول استخدام.'}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <div className="py-8">
            <Testimonials />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenQuiz={() => setIsQuizOpen(true)}
        setActiveTab={setActiveTab}
        onOpenInfoModal={(type) => setInfoModalType(type)}
      />

      {/* Info & Policy Modal */}
      <InfoModal
        isOpen={!!infoModalType}
        contentType={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Modals & Drawers */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {isQuizOpen && (
        <SkinRoutineQuiz
          products={products}
          onClose={() => setIsQuizOpen(false)}
          onAddRoutineToCart={handleAddRoutineToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
        currentUser={currentUser}
      />

      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            if (user.role === 'Admin') {
              setIsAdminView(true);
            }
          }} 
        />
      )}

      {isTrackOrderOpen && (
        <TrackOrderModal onClose={() => setIsTrackOrderOpen(false)} />
      )}

      <ContactWidget />

      {/* Native Android Bottom Navigation Dock for Mobile */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminView(true)}
        onLogout={() => setCurrentUser(null)}
      />

    </div>
  );
}
