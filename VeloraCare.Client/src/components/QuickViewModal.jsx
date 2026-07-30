import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Heart, Sparkles, Droplet, Clock, MessageSquare, Send, AlertCircle, Zap } from 'lucide-react';
import { fetchProductReviewsApi, submitReviewApi } from '../services/api';

function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hover || value) ? 'text-[#C5A059] fill-[#C5A059]' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarRatingDisplay({ rating, size = 'w-4 h-4' }) {
  return (
    <div className="flex gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= Math.round(rating) ? 'text-[#C5A059] fill-[#C5A059]' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function QuickViewModal({ product, onClose, onAddToCart, onQuickBuy, currentUser, onOpenAuth }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product && activeTab === 'reviews') {
      loadReviews();
    }
  }, [product, activeTab]);

  const loadReviews = async () => {
    const data = await fetchProductReviewsApi(product.id);
    setReviews(data.reviews || []);
    setTotalReviews(data.totalReviews || 0);
    setAvgRating(data.averageRating || 0);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (myRating === 0) {
      setReviewError('اختاري تقييم من 1 إلى 5 نجوم');
      return;
    }
    if (!myComment.trim()) {
      setReviewError('اكتبي كومنتار');
      return;
    }
    setSubmitting(true);
    try {
      await submitReviewApi({
        productId: product.id,
        userId: currentUser.id,
        userName: currentUser.fullName,
        rating: myRating,
        comment: myComment.trim()
      });
      setMyRating(0);
      setMyComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      await loadReviews();
    } catch (err) {
      setReviewError(err.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn print:hidden"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      
      {/* Modal Card Box — centered on all screens */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl flex flex-col animate-popIn"
           style={{ maxHeight: '90svh' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0D221A] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors shadow-lg"
          title="إغلاق"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-4 pb-2" style={{ overscrollBehavior: 'contain' }}>
          
          {/* Product Image Section — taller on mobile */}
          <div className="md:col-span-6 relative bg-[#0D221A] flex items-center justify-center overflow-hidden"
               style={{ minHeight: '240px', maxHeight: '55vw' }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover sm:rounded-none"
              style={{ objectPosition: 'center top' }}
            />
            {product.badge && (
              <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#987834] text-[#0D221A] font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details Section */}
          <div className="md:col-span-6 p-4 sm:p-6 text-right space-y-3">
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#143529] text-[#EAD096]">
                  {product.volume || '50ml'}
                </span>

                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('reviews')}>
                  <StarRatingDisplay rating={product.rating || avgRating} />
                  <span className="text-xs font-bold text-gray-700">{product.rating || avgRating}</span>
                  <span className="text-[10px] text-gray-400">({totalReviews || product.reviewsCount || 0} تقييم)</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold font-serif text-[#0D221A] leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#987834] font-semibold mt-0.5">{product.tagline}</p>
            </div>

            <div className="flex items-baseline gap-3 py-2 border-y border-gray-100 flex-wrap">
              <span className="text-xl sm:text-2xl font-extrabold text-[#0D221A] font-serif">
                {product.price} <span className="text-xs font-normal">ج.م</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-500 font-light">
                  بدلاً من <span className="line-through text-rose-600/80 font-bold">{product.originalPrice} ج.م</span>
                </span>
              )}
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                شامل الضريبة | شحن مجاني فوق 1000 ج.م
              </span>
            </div>

            {/* Content Tabs — touch-friendly 44px height */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2.5 rounded-lg transition-all active:scale-95 ${activeTab === 'overview' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                الوصف
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-2.5 rounded-lg transition-all active:scale-95 ${activeTab === 'ingredients' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                المكونات
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`flex-1 py-2.5 rounded-lg transition-all active:scale-95 ${activeTab === 'howToUse' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                الاستخدام
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 ${activeTab === 'reviews' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                <MessageSquare className="w-3 h-3" />
                آراء
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-2 animate-fadeIn text-xs leading-relaxed text-gray-700">
                <p>{product.description || 'تركيبة فاخرة تمزج بين المكونات العضوية الزمردية والمستخلصات النباتية النادرة لنتائج سريعة ومبهرة.'}</p>
                {product.benefits && (
                  <div className="bg-[#F7F5F0] p-2.5 rounded-xl border border-[#C5A059]/30 mt-1">
                    <span className="font-bold text-[#0D221A] block mb-0.5">الفوائد الرئيسية:</span>
                    <p className="text-gray-700 font-light text-[11px]">{product.benefits}</p>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span>نوع البشرة: <strong className="text-[#0D221A]">{product.skinType || 'جميع أنواع البشرة'}</strong></span>
                </div>
              </div>
            )}

            {/* Tab 2: Ingredients */}
            {activeTab === 'ingredients' && (
              <div className="animate-fadeIn space-y-2 text-xs leading-relaxed text-gray-700">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                    المكونات العضوية الزمردية 🌿
                  </span>
                  <p className="text-gray-600 font-light">{product.ingredients || 'زيت الزمرد العضوي، حمض الهيالورونيك الثلاثي، خلاصة الشاي الأخضر، وزيت جوجوبا بكر.'}</p>
                </div>
              </div>
            )}

            {/* Tab 3: How to Use */}
            {activeTab === 'howToUse' && (
              <div className="animate-fadeIn space-y-2 text-xs leading-relaxed text-gray-700">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-gray-200">
                  <span className="font-bold text-[#0D221A] block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    طريقة الاستخدام الأمثلة ✨
                  </span>
                  <p className="text-gray-600 font-light">{product.howToUse || 'ضعي 3-4 قطرات على بشرة نظيفة وجافة صباحاً ومساءً. دلكي بحركات دائرية لطيفة حتى تمام الامتصاص.'}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div className="animate-fadeIn space-y-3">
                {currentUser ? (
                  <form onSubmit={handleSubmitReview} className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 space-y-2">
                    <span className="font-bold text-[#0D221A] text-xs block">أضيفي تقييمكِ لمستحضر فيلورا:</span>
                    <StarRatingInput value={myRating} onChange={setMyRating} />
                    <textarea
                      rows="2"
                      placeholder="اكتبي رأيك بكل صراحة..."
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#C5A059]"
                    />
                    {reviewError && <p className="text-[10px] text-rose-600 font-bold">{reviewError}</p>}
                    {reviewSuccess && <p className="text-[10px] text-emerald-600 font-bold">تم نشر تقييمكِ بنجاح! ❤️</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-1.5 rounded-lg bg-[#0D221A] text-[#EAD096] text-xs font-bold hover:bg-[#C5A059] hover:text-[#0D221A] transition-colors flex items-center justify-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>{submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}</span>
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-2.5 rounded-xl border border-[#C5A059]/40 text-[11px] font-bold text-[#0D221A] hover:bg-[#F7F5F0] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                    سجلي دخولك لكتابة تقييم
                  </button>
                )}

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {reviews.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-3">لا توجد تقييمات بعد — كوني أول من يقيّم!</p>
                  )}
                  {reviews.map((review) => (
                    <div key={review.id} className="p-2.5 bg-[#FAF8F5] rounded-xl border border-gray-100 text-right">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#143529] text-[#EAD096] flex items-center justify-center text-[10px] font-bold">
                            {review.userName?.charAt(0)}
                          </div>
                          <span className="text-[11px] font-bold text-[#0D221A]">{review.userName}</span>
                        </div>
                        <StarRatingDisplay rating={review.rating} size="w-3 h-3" />
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* ALWAYS STICKY BOTTOM ACTION BAR */}
        <div
          className="flex-shrink-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 sm:gap-3 max-w-xl mx-auto">
            
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-extrabold text-lg active:bg-gray-300"
              >
                -
              </button>
              <span className="px-3 text-sm font-extrabold text-[#0D221A] min-w-[32px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-extrabold text-lg active:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Quick Buy Express CTA */}
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                if (onQuickBuy) onQuickBuy(product);
                onClose();
              }}
              className="flex-1 rounded-2xl text-xs sm:text-sm font-black py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 shadow-xl bg-gradient-to-r from-[#EAD096] via-[#C5A059] to-[#987834] text-[#0D221A] hover:brightness-110 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current stroke-[2.5]" />
              <span>شراء سريع فوري</span>
            </button>

            {/* Main Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className="bg-[#0D221A] text-[#EAD096] border border-[#C5A059] rounded-2xl text-xs sm:text-sm font-bold py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سلة ({product.price * quantity} ج.م)</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
