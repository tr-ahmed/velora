import React, { useState } from 'react';
import { X, Search, Package, CheckCircle, Truck, Clock, AlertCircle } from 'lucide-react';
import { trackOrderApi, fetchMyOrdersApi } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function TrackOrderModal({ onClose, initialOrderNumber, initialPhone }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const [tab, setTab] = useState('track'); // 'track' or 'history'
  const [ordersList, setOrdersList] = useState(null);

  const handleTrack = async (e, num, ph) => {
    if (e) e.preventDefault();
    setError(null);
    setOrder(null);
    setOrdersList(null);
    setLoading(true);

    try {
      if (tab === 'track') {
        const data = await trackOrderApi(num || orderNumber, ph || phone);
        setOrder(data);
      } else {
        const data = await fetchMyOrdersApi(ph || phone, '');
        if (data.length === 0) {
           setError(isEn ? 'No orders found for this phone number' : 'لم يتم العثور على طلبات مرتبطة برقم الهاتف هذا');
        } else {
           setOrdersList(data);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      handleTrack(new Event('submit'), initialOrderNumber, initialPhone);
    }
  }, []);

  const steps = [
    { label: isEn ? 'Pending' : 'قيد الانتظار', icon: Clock },
    { label: isEn ? 'Processing' : 'تم الدفع وجاري التجهيز', icon: Package },
    { label: isEn ? 'Shipped' : 'تم الشحن', icon: Truck },
    { label: isEn ? 'Completed' : 'مكتمل', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'قيد الانتظار': return 0;
      case 'تم الدفع وجاري التجهيز': return 1;
      case 'تم الشحن': return 2;
      case 'مكتمل': return 3;
      case 'ملغي': return -1;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0A1913] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-2xl animate-popIn">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-[#143529] text-white rounded-full hover:bg-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A059]">
            <Search className="w-8 h-8 text-[#EAD096]" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#EAD096]">{isEn ? 'Track Your Order' : 'تتبع طلبك'}</h2>
          <p className="text-sm text-gray-400 mt-2">{isEn ? 'Enter your order number and phone to check the status' : 'أدخلي رقم الطلب ورقم الهاتف لمعرفة حالة الشحنة'}</p>
        </div>

        {!order && !ordersList ? (
          <>
            <div className="flex border-b border-[#C5A059]/30 mb-6">
              <button 
                onClick={() => { setTab('track'); setError(null); }}
                className={`flex-1 py-2 text-sm font-bold transition-all ${tab === 'track' ? 'text-[#EAD096] border-b-2 border-[#C5A059]' : 'text-gray-400'}`}
              >
                {isEn ? 'By Order Number' : 'برقم الطلب'}
              </button>
              <button 
                onClick={() => { setTab('history'); setError(null); }}
                className={`flex-1 py-2 text-sm font-bold transition-all ${tab === 'history' ? 'text-[#EAD096] border-b-2 border-[#C5A059]' : 'text-gray-400'}`}
              >
                {isEn ? 'All My Orders' : 'كل طلباتي'}
              </button>
            </div>
            
            <form onSubmit={handleTrack} className="space-y-4">
              {tab === 'track' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{isEn ? 'Order Number' : 'رقم الطلب'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? 'e.g. VEL-EG-123456' : 'مثال: VEL-EG-123456'}
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className={`w-full h-12 px-4 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                    dir="ltr"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{isEn ? 'Phone Number' : 'رقم الهاتف'}</label>
                <input
                  type="tel"
                  required
                  placeholder={isEn ? (tab === 'track' ? 'Phone used in the order' : 'Enter your phone number') : (tab === 'track' ? 'رقم الهاتف المستخدم في الطلب' : 'أدخلي رقم الهاتف')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full h-12 px-4 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                  dir="ltr"
                />
              </div>

            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-2 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>{isEn ? 'Searching...' : 'جاري البحث...'}</>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {isEn ? 'Track Order' : 'بحث عن الطلب'}
                </>
              )}
            </button>
            </form>
          </>
        ) : ordersList ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
             <h3 className="text-[#EAD096] font-bold mb-3">{isEn ? 'Your Orders' : 'طلباتك السابقة'}</h3>
             {ordersList.map((ord) => (
                <div key={ord.orderNumber} onClick={() => { setOrder(ord); setOrdersList(null); }} className="p-4 bg-[#143529] rounded-xl border border-[#C5A059]/30 cursor-pointer hover:bg-[#C5A059]/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold text-sm" dir="ltr">{ord.orderNumber}</span>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      ord.status === 'مكتمل' ? 'bg-emerald-500/20 text-emerald-400' :
                      ord.status === 'ملغي' ? 'bg-red-500/20 text-red-400' :
                      'bg-[#C5A059]/20 text-[#EAD096]'
                    }`}>
                      {isEn ? (ord.status === 'مكتمل' ? 'Completed' : ord.status === 'ملغي' ? 'Cancelled' : ord.status === 'تم الشحن' ? 'Shipped' : ord.status === 'تم الدفع وجاري التجهيز' ? 'Processing' : 'Pending') : ord.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{new Date(ord.createdAt).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}</span>
                    <span>{ord.total} {isEn ? 'EGP' : 'ج.م'}</span>
                  </div>
                </div>
             ))}
             <button
               onClick={() => { setOrdersList(null); setTab('history'); }}
               className="w-full py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm mt-4"
             >
               {isEn ? 'Back' : 'رجوع'}
             </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-[#143529] rounded-xl border border-[#C5A059]/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#EAD096] font-bold">{isEn ? 'Order:' : 'طلب رقم:'} <span dir="ltr">{order.orderNumber}</span></h3>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                  order.status === 'مكتمل' ? 'bg-emerald-500/20 text-emerald-400' :
                  order.status === 'ملغي' ? 'bg-red-500/20 text-red-400' :
                  'bg-[#C5A059]/20 text-[#EAD096]'
                }`}>
                  {isEn ? (order.status === 'مكتمل' ? 'Completed' : order.status === 'ملغي' ? 'Cancelled' : order.status === 'تم الشحن' ? 'Shipped' : order.status === 'تم الدفع وجاري التجهيز' ? 'Processing' : 'Pending') : order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">{isEn ? 'Date:' : 'تاريخ الطلب:'} {new Date(order.createdAt).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}</p>
              <p className="text-xs text-gray-400">{isEn ? 'Total:' : 'الإجمالي:'} {order.total} {isEn ? 'EGP' : 'ج.م'}</p>
            </div>

            {order.status !== 'ملغي' && (
              <div className="relative py-4">
                <div className="absolute top-1/2 right-4 left-4 h-0.5 bg-gray-700 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 right-4 h-0.5 bg-[#C5A059] -translate-y-1/2 z-0 transition-all duration-1000"
                  style={{ width: `calc(${(getStepIndex(order.status) / (steps.length - 1)) * 100}% - 2rem)` }}
                />
                
                <div className="relative z-10 flex justify-between">
                  {steps.map((step, idx) => {
                    const isCompleted = getStepIndex(order.status) >= idx;
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted ? 'bg-[#C5A059] border-[#C5A059] text-[#0A1913]' : 'bg-[#143529] border-gray-600 text-gray-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold ${isCompleted ? 'text-[#EAD096]' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {order.status === 'ملغي' && (
              <div className="text-center p-4 text-red-400 bg-red-900/20 rounded-xl border border-red-900/50">
                {isEn ? 'This order has been cancelled.' : 'تم إلغاء هذا الطلب.'}
              </div>
            )}

            <button
              onClick={() => {
                setOrder(null);
                if (tab === 'history') {
                   // Optional: auto-refetch or just go back to form
                   setOrdersList(null);
                }
              }}
              className="w-full py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-white/5 transition-colors text-sm"
            >
              {isEn ? 'Back' : 'رجوع'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
