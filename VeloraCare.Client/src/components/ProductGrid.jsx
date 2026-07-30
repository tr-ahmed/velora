import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Heart, Star, Check, Search, X, Sparkles } from 'lucide-react';
import Pagination from './Pagination';

export default function ProductGrid({ 
  products = [], 
  selectedCategory, 
  onAddToCart, 
  onRemoveFromCart,
  onQuickView, 
  onQuickBuy,
  wishlist, 
  onToggleWishlist,
  searchQuery = '',
  onClearSearch,
  cartItems = []
}) {
  const [addedId, setAddedId] = useState(null);
  const [wishlistToast, setWishlistToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || 
      (selectedCategory === 'offers' ? Boolean(p.originalPrice && p.originalPrice > p.price) : p.category === selectedCategory);
    const matchSearch = !searchQuery || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    const alreadyInCart = cartItems.some(item => item.id === product.id);
    if (alreadyInCart) {
      onRemoveFromCart(product.id);
      setAddedId(null);
    } else {
      onAddToCart(product);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1800);
    }
  };

  const handleWishlistClick = (e, productId, productName) => {
    e.stopPropagation();
    onToggleWishlist(productId);
    const isNowWishlisted = !wishlist.includes(productId);
    setWishlistToast({
      message: isNowWishlisted ? `تمت الإضافة للمفضلة ❤️` : `تمت الإزالة من المفضلة`,
      isAdded: isNowWishlisted
    });
    setTimeout(() => setWishlistToast(null), 2200);
  };

  return (
    <section id="products-section" className="relative py-4 sm:py-6 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-5 sm:space-y-8">
      
      {/* Toast */}
      {wishlistToast && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#0D221A] text-[#EAD096] border-2 border-[#C5A059] px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-popIn">
          <Heart className={`w-4 h-4 ${wishlistToast.isAdded ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
          <span>{wishlistToast.message}</span>
        </div>
      )}

      {/* Search banner */}
      {searchQuery && (
        <div className="bg-[#0D221A] text-white p-3 sm:p-4 rounded-2xl border border-[#C5A059]/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <p className="text-xs font-bold">
              نتائج: <span className="text-[#EAD096]">"{searchQuery}"</span> ({filteredProducts.length})
            </p>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="w-8 h-8 rounded-full bg-[#143529] text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center justify-center flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#C5A059]/30 p-8 space-y-4">
          <Search className="w-12 h-12 text-[#C5A059] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#0D221A]">لم نجد أي نتائج</h3>
          <p className="text-xs text-gray-500">جربي البحث بكلمات أخرى مثل "سيروم" أو "كريم".</p>
          {onClearSearch && (
            <button onClick={onClearSearch} className="btn-primary text-xs py-2.5 px-6">
              عرض جميع المستحضرات
            </button>
          )}
        </div>
      )}

      {/* ============================================================
          PRODUCT GRID
          ============================================================ */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {paginatedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isJustAdded = addedId === product.id;
            const cartItem = cartItems.find(item => item.id === product.id);
            const isInCart = Boolean(cartItem);
            const cartQty = cartItem?.quantity || 0;

            return (
              <div
                key={product.id}
                className="group product-card flex flex-col relative"
                onClick={() => onQuickView(product)}
              >
                {/* ---- IMAGE ---- */}
                <div className="relative bg-[#0D221A] overflow-hidden"
                     style={{ aspectRatio: '3/4' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A]/60 via-transparent to-transparent" />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D221A] text-[9px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md pointer-events-none max-w-[90px] sm:max-w-none truncate">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist btn — always visible on mobile, hover on desktop */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleWishlistClick(e, product.id, product.name); }}
                    className={`absolute top-2.5 left-2.5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all active:scale-110 shadow-lg ${
                      isWishlisted
                        ? 'bg-rose-600 text-white border-2 border-white'
                        : 'bg-white/90 backdrop-blur-md text-rose-500 border border-[#C5A059]/30 sm:opacity-0 sm:group-hover:opacity-100'
                    }`}
                    aria-label="إضافة للمفضلة"
                  >
                    <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* Quick View hover — desktop only */}
                  <div className="absolute inset-0 z-10 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                      className="btn-primary text-xs py-2 px-5 shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>معاينة</span>
                    </button>
                  </div>

                  {/* In Cart Badge Indicator */}
                  {isInCart && (
                    <div className="absolute bottom-2.5 right-2.5 z-20 bg-[#0D221A]/95 text-[#EAD096] border border-[#C5A059] text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xl flex items-center gap-1 backdrop-blur-md animate-popIn">
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                      <span>في السلة {cartQty > 1 ? `(${cartQty})` : ''}</span>
                    </div>
                  )}

                  {/* Discount badge */}
                  {product.originalPrice && product.originalPrice > product.price && !isInCart && (
                    <div className="absolute bottom-2.5 left-2.5 bg-gradient-to-r from-emerald-800 to-emerald-700 border border-emerald-400 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                      وفرت {product.originalPrice - product.price} ج.م 🔥
                    </div>
                  )}
                </div>

                {/* ---- BODY ---- */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#C5A059] fill-[#C5A059]' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                    <span className="text-[10px] sm:text-[11px] text-gray-400 mr-1 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0D221A] leading-snug line-clamp-2 group-hover:text-[#987834] transition-colors">
                    {product.name}
                  </h3>

                  {/* Tagline — hidden on very small mobile */}
                  <p className="hidden sm:block text-xs text-gray-500 font-light line-clamp-1">
                    {product.tagline}
                  </p>

                  {/* ---- FOOTER ---- */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-gray-100">
                    {/* Price */}
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-extrabold text-[#0D221A] font-serif leading-none">
                        {product.price} <span className="text-[10px] font-normal text-gray-500">ج.م</span>
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-gray-500 font-light mt-0.5 whitespace-nowrap">
                          بدلاً من <span className="line-through text-rose-600/80 font-bold">{product.originalPrice} ج.م</span>
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
{/* Quick View Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (onQuickView) onQuickView(product);
                        }}
                        className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] shadow-md active:scale-95 transition-all hover:brightness-110 cursor-pointer flex items-center justify-center"
                        title="معاينة سريعة"
                        aria-label="معاينة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Add to cart button */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 relative ${
                          isInCart
                            ? 'bg-rose-700 text-white border border-rose-400 shadow-md'
                            : isJustAdded
                            ? 'bg-emerald-700 text-white border border-emerald-400 shadow-md'
                            : 'bg-[#0D221A] text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A]'
                        }`}
                        title={isInCart ? `إزالة من السلة` : "أضيفي للسلة"}
                        aria-label={isInCart ? "إزالة من السلة" : "أضيفي للسلة"}
                      >
                        {isInCart ? (
                          <X className="w-4 h-4 stroke-[3]" />
                        ) : isJustAdded ? (
                          <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo(0, 0);
        }}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
      />
    </section>
  );
}
