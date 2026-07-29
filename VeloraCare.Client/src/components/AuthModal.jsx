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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-[#0D221A] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => { resetForm(); onClose(); }}
          className="absolute top-4 left-4 p-2 text-[#C5A059] hover:text-white rounded-full bg-[#143529]"
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

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#EAD096] mb-1">الاسم الكامل *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="أدخلي اسمك الكريم"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#EAD096] mb-1">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EAD096] mb-1">كلمة المرور *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1">رقم الموبايل *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1">المحافظة *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059] appearance-none"
                  >
                    {EGYPT_GOVERNORATES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EAD096] mb-1">العنوان التفصيلي *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="المنطقة، الشارع، رقم العمارة أو الشقة"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 bg-[#143529] border border-[#C5A059]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm mt-2 font-bold shadow-lg"
          >
            {loading ? 'جاري التحقق...' : isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>

        </form>

        <div className="mt-6 pt-4 border-t border-[#C5A059]/20 text-center">
          <button
            type="button"
            onClick={handleFillAdminDemo}
            className="text-[11px] text-[#C5A059] hover:underline font-bold"
          >
            دخول كـ مدير النظام (Admin Demo)
          </button>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => { resetForm(); setIsRegister(!isRegister); }}
              className="text-xs text-gray-300 hover:text-white"
            >
              {isRegister ? 'لديكِ حساب بالفعل؟ تسجيل الدخول' : 'ليس لديكِ حساب؟ انشئي حساباً جديداً'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
