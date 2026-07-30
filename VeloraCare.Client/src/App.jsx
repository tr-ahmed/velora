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
import MobileBottomNav from './components/MobileBottomNav';
import InfoModal from './components/InfoModal';
import { 
  fetchProductsFromApi,
  fetchHeroSlidesApi, fetchHeroSettingsApi, saveHeroSlideApi, deleteHeroSlideApi, updateHeroSettingsApi 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoModalType, setInfoModalType] = useState(null);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'سيروم الزمرد لإعادة إحياء الشباب',
      price: 650,
      image: '/images/serum.png',
      quantity: 1
    }
  ]);
  
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
  const [isAdminView, setIsAdminView] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  // Dynamic Hero Slides & Settings State
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_hero_slides');
      return saved ? JSON.parse(saved) : [
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
          miniCardOffer: 'خصم 15% اليوم فقط',
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
      ];
    } catch (e) {
      return [];
    }
  });

  const [heroSettings, setHeroSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_hero_settings');
      return saved ? JSON.parse(saved) : { autoPlay: true, autoPlayInterval: 5.5, showTrustHighlights: true };
    } catch (e) {
      return { autoPlay: true, autoPlayInterval: 5.5, showTrustHighlights: true };
    }
  });

  useEffect(() => {
    async function loadHeroData() {
      try {
        const slides = await fetchHeroSlidesApi();
        if (slides && slides.length > 0) setHeroSlides(slides);

        const settings = await fetchHeroSettingsApi();
        if (settings) setHeroSettings(settings);
      } catch (err) {
        console.warn('Hero API Load Fallback:', err);
      }
    }
    loadHeroData();
  }, []);

  useEffect(() => {
    localStorage.setItem('velora_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('velora_hero_settings', JSON.stringify(heroSettings));
  }, [heroSettings]);

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

  // Load products from API / Local fallback
  const loadProducts = async () => {
    const data = await fetchProductsFromApi(selectedCategory);
    setProducts(data);
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
  if (isAdminView) {
    if (currentUser?.role === 'Admin') {
      return (
        <AdminDashboard
          user={currentUser}
          onLogout={() => {
            setIsAdminView(false);
            setCurrentUser(null);
          }}
          onGoToStore={() => setIsAdminView(false)}
          heroSlides={heroSlides}
          setHeroSlides={setHeroSlides}
          heroSettings={heroSettings}
          setHeroSettings={setHeroSettings}
        />
      );
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0D221A] pb-16 sm:pb-0">
      
      {/* Header Bar */}
      <Header
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
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
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">قصة VELORA CARE</span>
            <h1 className="text-4xl font-extrabold font-serif text-[#0D221A]">
              عندما تلتقي الطبيعة النادرة بالفخامة الإمبراطورية
            </h1>
            <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            <p className="text-gray-700 leading-relaxed text-base font-light">
              تأسست VELORA CARE لتعيد تعريف العناية بالبشرة في العالم العربي ومصر. نؤمن بأن كل امرأة تستحق عناية فائقة مستوحاة من أنقى خلاصة النباتات العضوية الزمردية بدون مساومة على النتيجة والجمال.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-right">
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">مكونات نادرة 🌿</h3>
                <p className="text-xs text-gray-600">نستخلص المستحضرات من مزارع عضويّة معتمدة حول العالم لضمان الفاعلية والنقاء.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">تصميم وفاخر ✨</h3>
                <p className="text-xs text-gray-600">عبوات فاخرة بظلال الزمرد والذهب لتزين طاولتك وتمنحك تجربة سبا يومية.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
                <h3 className="font-bold text-[#0D221A] text-lg mb-2">نتائج سريرية 👑</h3>
                <p className="text-xs text-gray-600">جميع المنتجات مختبرة سريرياً وتضمن ترطيب ونضارة ملحوظة من أول استخدام.</p>
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
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {isQuizOpen && (
        <SkinRoutineQuiz
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'Admin') {
            setIsAdminView(true);
          }
        }}
      />

      <ContactWidget />

      {/* Native Android Bottom Navigation Dock for Mobile */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminView(true)}
        onLogout={() => setCurrentUser(null)}
      />

    </div>
  );
}
