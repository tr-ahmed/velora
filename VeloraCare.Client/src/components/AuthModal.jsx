import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, Phone, MapPin, Building2 } from 'lucide-react';
import { loginUserApi, registerUserApi } from '../services/api';
import { EGYPT_GOVERNORATES } from '../data/governorates';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setCity('القاهرة');
    setAddress('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const response = await registerUserApi(fullName, email, password, phone, city, address);
        onLoginSuccess(response.user);
        resetForm();
        onClose();
      } else {
        const response = await loginUserApi(email, password);
        onLoginSuccess(response.user);
        resetForm();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ في عملية تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdminDemo = () => {
    setEmail('admin@velora.com');
    setPassword('Admin123!');
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div
        className="relative w-full max-w-md bg-[#0D221A] text-white border-2 border-[#C5A059] rounded-3xl shadow-2xl overflow-hidden overflow-y-auto animate-popIn"
        style={{
          maxHeight: '88svh',
          paddingBottom: '0'
        }}
      >
        <div className="px-5 sm:px-8 pt-6 sm:pt-6">
        <button
          onClick={() => { resetForm(); onClose(); }}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 text-[#C5A059] hover:text-white rounded-full bg-[#143529] flex items-center justify-center active:scale-90 transition-transform"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] bg-[#143529] flex items-center justify-center mx-auto text-[#C5A059]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#EAD096]">
            {isRegister ? 'إنشاء حساب جديد في VELORA' : 'تسجيل الدخول إلى VELORA'}
          </h3>
          <p className="text-xs text-gray-300">
            {isRegister ? 'انضمي لعالم الجمال الزمردي والعروض الحصرية' : 'مرحباً بعودتكِ، استمتعي بتجربة تسوق ملكية'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-900/50 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">

          {/* Field helper function pattern */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#EAD096] mb-1.5">الاسم الكامل *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C5A059] absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="أدخلي اسمك"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#EAD096] mb-1.5">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C5A059] absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EAD096] mb-1.5">كلمة المرور *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C5A059] absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1.5">رقم الموبايل *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C5A059] absolute right-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1.5">المحافظة *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#C5A059] absolute right-4 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] appearance-none"
                  >
                    {EGYPT_GOVERNORATES.map(c => (
                      <option key={c} value={c} className="text-[#0D221A] bg-white font-bold">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1.5">العنوان التفصيلي *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C5A059] absolute right-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="المنطقة، الشارع، رقم العمارة أو الشقة"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 pr-11 pl-4 bg-[#143529] border border-[#C5A059]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base mt-3 font-bold shadow-lg"
          >
            {loading ? 'جاري التحقق...' : isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>

        </form>
        </div>{/* end px-5 wrapper */}

        {/* Footer Links */}
        <div className="px-5 sm:px-8 mt-5 pb-4 pt-4 border-t border-[#C5A059]/20 text-center">

          <div className="mt-4">
            <button
              type="button"
              onClick={() => { resetForm(); setIsRegister(!isRegister); }}
              className="text-sm text-gray-300 hover:text-white font-medium"
            >
              {isRegister ? 'لديكِ حساب بالفعل؟ تسجيل الدخول' : 'ليس لديكِ حساب؟ انشئي حساباً جديداً'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
