import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Heart, Sparkles, Droplet, Clock, MessageSquare, Send, AlertCircle } from 'lucide-react';
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

export default function QuickViewModal({ product, onClose, onAddToCart, currentUser, onOpenAuth }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl max-h-[92vh] flex flex-col md:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-[#0D221A]/80 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0D221A] flex items-center justify-center transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 relative bg-[#0D221A] flex items-center justify-center p-6 min-h-[260px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full max-h-[380px] object-cover rounded-2xl shadow-xl border border-[#C5A059]/30"
          />
          {product.badge && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D221A] font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          
          <div className="space-y-3 text-right">
            
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

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0D221A] leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#987834] font-semibold mt-0.5">{product.tagline}</p>
            </div>

            <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
              <span className="text-2xl font-extrabold text-[#0D221A] font-serif">
                {product.price} <span className="text-xs font-normal">ج.م</span>
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-light">
                  {product.originalPrice} ج.م
                </span>
              )}
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                شامل الضريبة | شحن مجاني فوق 1000 ج.م
              </span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                الوصف
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'ingredients' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                المكونات
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'howToUse' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                الاستخدام
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'reviews' ? 'bg-[#0D221A] text-[#EAD096]' : 'text-gray-600'}`}
              >
                <MessageSquare className="w-3 h-3" />
                التقييمات
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-2 animate-fadeIn text-xs leading-relaxed text-gray-700">
                <p>{product.description || 'تركيبة فاخرة تمزج بين المكونات العضوية الزمردية والمستخلصات النباتية النادرة لنتائج سريعة ومبهرة.'}</p>
                {product.benefits && (
                  <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#C5A059]/30 mt-2">
                    <span className="font-bold text-[#0D221A] block mb-1">الفوائد الرئيسية:</span>
                    <p className="text-gray-700 font-light">{product.benefits}</p>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500">
                  <span>نوع البشرة: <strong className="text-[#0D221A]">{product.skinType || 'جميع أنواع البشرة'}</strong></span>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="animate-fadeIn space-y-2 text-xs leading-relaxed text-gray-700">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                    المكونات النادرة العضوية:
                  </span>
                  <p className="text-emerald-800 font-light">{product.ingredients || 'زيت الزمرد النادر، حمض الهيالورون الثلاثي، فيتامين C، مستخلص الورد الجوري العضوي، والببتيدات النباتية.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div className="animate-fadeIn space-y-2 text-xs leading-relaxed text-gray-700">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30">
                  <span className="font-bold text-[#0D221A] block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    خطوات الاستخدام الصحيحة:
                  </span>
                  <p className="text-gray-700 font-light">{product.howToUse || 'ضعي 3 إلى 4 قطرات على بشرة نظيفة وجافة صباحاً ومساءً مع تدليك ناعم بحركات دائرية لأعلى.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fadeIn space-y-3">
                
                <div className="flex items-center gap-4 p-3 bg-[#F7F5F0] rounded-xl border border-[#C5A059]/20">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold text-[#0D221A] font-serif">{avgRating || product.rating || '—'}</span>
                    <StarRatingDisplay rating={avgRating || product.rating} size="w-3.5 h-3.5" />
                    <span className="text-[10px] text-gray-500">{totalReviews} تقييم</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-[10px]" dir="ltr">
                          <span className="w-3 text-gray-500 text-right">{star}</span>
                          <Star className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C5A059] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-4 text-gray-400 text-left">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {currentUser && currentUser.role !== 'Admin' && (
                  <div className="p-3 bg-white rounded-xl border border-[#C5A059]/30 space-y-2">
                    <p className="text-[11px] font-bold text-[#0D221A]">كتبي تقييمك للمنتج:</p>
                    <StarRatingInput value={myRating} onChange={setMyRating} />
                    <textarea
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      placeholder="اكتبي رأيك في المنتج..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#C5A059] bg-[#F7F5F0] resize-none"
                    />
                    {reviewError && (
                      <div className="flex items-center gap-1 text-rose-600 text-[10px]">
                        <AlertCircle className="w-3 h-3" />
                        {reviewError}
                      </div>
                    )}
                    {reviewSuccess && (
                      <div className="text-emerald-600 text-[10px] font-bold">تم إرسال تقييمك بنجاح!</div>
                    )}
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="btn-primary text-[11px] py-2 px-4 w-full"
                    >
                      <Send className="w-3 h-3" />
                      {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </button>
                  </div>
                )}

                {!currentUser && (
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-2.5 rounded-xl border border-[#C5A059]/40 text-[11px] font-bold text-[#0D221A] hover:bg-[#F7F5F0] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                    سجلي دخولك لكتابة تقييم
                  </button>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {reviews.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4">لا توجد تقييمات بعد — كوني أول من يقيّم!</p>
                  )}
                  {reviews.map((review) => (
                    <div key={review.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-100 text-right">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#143529] text-[#EAD096] flex items-center justify-center text-[10px] font-bold">
                            {review.userName?.charAt(0)}
                          </div>
                          <span className="text-[11px] font-bold text-[#0D221A]">{review.userName}</span>
                        </div>
                        <StarRatingDisplay rating={review.rating} size="w-3 h-3" />
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{review.comment}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block" dir="ltr">
                        {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-[#0D221A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn-primary flex-1 text-xs py-3 px-6 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة للسلة ({product.price * quantity} ج.م)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
