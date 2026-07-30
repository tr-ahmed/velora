import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Heart, Star, Check, Search, X } from 'lucide-react';
import Pagination from './Pagination';

export default function ProductGrid({ 
  products = [], 
  selectedCategory, 
  onAddToCart, 
  onQuickView, 
  wishlist, 
  onToggleWishlist,
  searchQuery = '',
  onClearSearch
}) {
  const [addedId, setAddedId] = useState(null);
  const [wishlistToast, setWishlistToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = !searchQuery || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Reset to page 1 on category or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleWishlistClick = (e, productId, productName) => {
    e.stopPropagation();
    onToggleWishlist(productId);
    const isNowWishlisted = !wishlist.includes(productId);
    setWishlistToast({
      message: isNowWishlisted ? `تمت إضافة "${productName}" للمفضلة ❤️` : `تمت إزالة "${productName}" من المفضلة`,
      isAdded: isNowWishlisted
    });
    setTimeout(() => setWishlistToast(null), 2200);
  };

  return (
    <section id="products-section" className="relative py-4 sm:py-6 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Feedback Notification */}
      {wishlistToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#0D221A] text-[#EAD096] border-2 border-[#C5A059] px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Heart className={`w-4 h-4 ${wishlistToast.isAdded ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
          <span>{wishlistToast.message}</span>
        </div>
      )}

      {/* Search Filter Header Notification */}
      {searchQuery && (
        <div className="bg-[#0D221A] text-white p-4 rounded-2xl border border-[#C5A059]/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C5A059]" />
            <p className="text-xs font-bold">
              نتائج البحث عن: <span className="text-[#EAD096]">"{searchQuery}"</span> ({filteredProducts.length} نتائج)
            </p>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-3 py-1 rounded-full bg-[#143529] text-xs font-bold text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A] transition-all flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء البحث</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#C5A059]/30 p-8 space-y-3">
          <Search className="w-12 h-12 text-[#C5A059] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#0D221A]">لم نجد أي نتائج تطابق بحثك</h3>
          <p className="text-xs text-gray-500">جربي البحث بكلمات أخرى مثل "سيروم" أو "كريم" أو اختاري قسم آخر.</p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="btn-primary text-xs py-2 px-6 mt-2"
            >
              عرض جميع المستحضرات
            </button>
          )}
        </div>
      )}

      {/* Grid Display */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {paginatedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Header */}
                <div className="relative aspect-[4/3] bg-[#0D221A] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D221A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block" />

                  {/* Badge Tag */}
                  {product.badge && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D221A] text-[9px] sm:text-xs font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md pointer-events-none truncate max-w-[110px] sm:max-w-none">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistClick(e, product.id, product.name)}
                    className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all transform active:scale-125 shadow-lg ${
                      isWishlisted 
                        ? 'bg-rose-600 text-white border-2 border-white' 
                        : 'bg-white/90 backdrop-blur-md text-[#0D221A] hover:bg-rose-500 hover:text-white border border-[#C5A059]/40'
                    }`}
                    aria-label="إضافة للمفضلة"
                    title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current text-white' : 'text-rose-500'}`} />
                  </button>

                  {/* Quick View Floating Button */}
                  <div className="absolute inset-0 z-10 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                      type="button"
                      onClick={() => onQuickView(product)}
                      className="btn-primary text-xs py-2 px-5 shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>معاينة سريعة</span>
                    </button>
                  </div>
                </div>

                {/* Product Info Body */}
                <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  
                  <div>
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'text-[#C5A059] fill-[#C5A059]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] sm:text-xs text-gray-500 mr-1.5 font-medium">
                        {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#0D221A] group-hover:text-[#987834] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs text-gray-500 font-light line-clamp-2 mt-1">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-extrabold text-[#0D221A] font-serif">
                        {product.price} <span className="text-xs font-normal">ج.م</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through font-light">
                          {product.originalPrice} ج.م
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mobile Quick View icon */}
                      <button
                        type="button"
                        onClick={() => onQuickView(product)}
                        className="md:hidden p-2.5 rounded-full bg-[#F7F5F0] text-[#0D221A] border border-[#C5A059]/40 hover:bg-[#C5A059]"
                        title="معاينة"
                      >
                        <Eye className="w-4 h-4 text-[#C5A059]" />
                      </button>

                      {/* Add to Cart button */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white scale-110'
                            : 'bg-[#0D221A] text-[#EAD096] hover:bg-[#C5A059] hover:text-[#0D221A]'
                        }`}
                        title="أضيفي للسلة"
                      >
                        {isJustAdded ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Storefront Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
      />

    </section>
  );
}
