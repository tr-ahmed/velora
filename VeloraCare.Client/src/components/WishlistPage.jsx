import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, Check } from 'lucide-react';
import { fetchProductsFromApi } from '../services/api';

export default function WishlistPage({ wishlist, onToggleWishlist, onAddToCart, onExploreClick, cartItems = [] }) {
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

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#C5A059]/30 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#987834] font-bold">مجموعتكِ المحفوظة</span>
          <h1 className="text-3xl font-extrabold text-[#0D221A] font-serif mt-1 flex items-center gap-2">
            <span>مفضلات VELORA الملكية</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </h1>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="btn-primary text-xs py-3 px-6 flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>نقل جميع المفضلة للسلة</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#C5A059]/30 p-8 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#DFE6DB] border-2 border-[#C5A059] text-rose-500 flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0D221A] font-serif">قائمة المفضلة فارغة حالياً</h3>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            احفظي إكسيرات السيروم وكريمات الترطيب المفضلة لديكِ بالضغط على أيقونة القلب على أي منتج.
          </p>
          <button
            onClick={onExploreClick}
            className="btn-primary text-xs px-8 py-3 mt-2 inline-flex items-center gap-2"
          >
            <span>استكشفي تشكيلة VELORA</span>
            <ArrowLeft className="w-4 h-4" />
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
                    <div className="absolute bottom-3 right-3 z-20 bg-[#0D221A]/95 text-[#EAD096] border border-[#C5A059] text-xs font-extrabold px-3 py-1 rounded-full shadow-xl flex items-center gap-1 backdrop-blur-md animate-popIn">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span>في السلة {cartQty > 1 ? `(${cartQty})` : ''}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title="إزالة من المفضلة"
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
                    <h3 className="font-bold text-[#0D221A] text-base leading-snug">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">{product.tagline}</p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-lg font-extrabold text-[#0D221A] font-serif">
                      {product.price} <span className="text-xs font-normal">ج.م</span>
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
