import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, Check } from 'lucide-react';
import { fetchProductsFromApi } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function WishlistPage({ wishlist, onToggleWishlist, onAddToCart, onExploreClick, cartItems = [] }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProductsFromApi('all');
        setAllProducts(data);
      } catch (err) {
        console.warn('Failed to load products for wishlist:', err);
      }
    }
    load();
  }, []);

  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach(p => onAddToCart(p, 1));
  };

  const onRemove = (id) => onToggleWishlist(id);
  const onNavigateHome = () => onExploreClick();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#C5A059]/30 gap-4">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-[#987834] font-bold">{isEn ? 'Your Saved Collection' : 'مجموعتكِ المحفوظة'}</span>
          <h2 className="text-3xl md:text-5xl font-black font-serif text-[#0D221A] mt-2 flex items-center justify-center gap-3">
            <span>{isEn ? 'VELORA Royal Wishlist' : 'مفضلات VELORA الملكية'}</span>
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
          </h2>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-md flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isEn ? 'Move All to Cart' : 'نقل جميع المفضلة للسلة'}</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#C5A059]/30 shadow-sm max-w-2xl mx-auto">
          <Heart className="w-16 h-16 text-[#C5A059] mx-auto opacity-40 mb-6" />
          <h3 className="text-xl font-bold text-[#0D221A] font-serif">{isEn ? 'Your Wishlist is Empty' : 'قائمة المفضلة فارغة حالياً'}</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            {isEn ? 'Save your favorite serums and hydrating creams by clicking the heart icon on any product.' : 'احفظي إكسيرات السيروم وكريمات الترطيب المفضلة لديكِ بالضغط على أيقونة القلب على أي منتج.'}
          </p>
          
          <button
            onClick={onNavigateHome}
            className="btn-primary mt-8 px-8 py-3 text-sm flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? 'Explore VELORA Collection' : 'استكشفي تشكيلة VELORA'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => {
            const cartItem = cartItems.find(item => item.id === product.id);
            const isInCart = Boolean(cartItem);
            const cartQty = cartItem?.quantity || 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-md hover:border-[#C5A059] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[#0D221A]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {isInCart && (
                    <div className="absolute top-3 left-3 bg-[#0D221A]/90 text-[#EAD096] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{isEn ? `In Cart ${cartQty > 1 ? `(${cartQty})` : ''}` : `في السلة ${cartQty > 1 ? `(${cartQty})` : ''}`}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 flex items-center justify-center transition-all shadow-sm active:scale-90"
                    title={isEn ? 'Remove from Wishlist' : 'إزالة من المفضلة'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                      <span className="text-xs text-gray-500 font-bold">{product.rating}</span>
                    </div>
                    <h3 className="font-bold text-[#0D221A] text-base leading-snug">{isEn ? (product.nameEn || product.name) : product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">{isEn ? (product.taglineEn || product.tagline) : product.tagline}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-extrabold text-[#0D221A] font-serif">
                      {product.price} <span className="text-xs font-normal">{isEn ? 'EGP' : 'ج.م'}</span>
                    </span>
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      className={`text-xs py-2 px-4 flex items-center gap-1.5 rounded-full font-bold transition-all shadow-md ${
                        isInCart
                          ? 'bg-emerald-700 text-white border border-emerald-400'
                          : 'btn-primary'
                      }`}
                    >
                      {isInCart ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                      <span>{isInCart ? `في السلة (${cartQty})` : 'إضافة للسلة'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
