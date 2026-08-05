import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InfoModal({ isOpen, onClose, contentType }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  if (!isOpen || !contentType) return null;

  const contentMap = {
    faq: {
      title: isEn ? 'Frequently Asked Questions (FAQ)' : 'الأسئلة الشائعة (FAQ)',
      icon: <HelpCircle className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-700">
          <div className="bg-[#E6EDE4] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">{isEn ? 'Q: Are VELORA products natural and safe?' : 'س: هل مستحضرات VELORA طبيعية وآمنة؟'}</h4>
            <p className="text-gray-600 font-light">{isEn ? 'A: Yes, all our products are extracted from 100% organic emerald herbs and ingredients, safe and effective.' : 'ج: نعم، جميع منتجاتنا مستخلصة من أعشاب ومكونات زمردية عضوية 100% وآمنة ومؤثرة لضمان الفاعلية وأعلى درجات الأمان.'}</p>
          </div>
          <div className="bg-[#E6EDE4] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">{isEn ? 'Q: How long does delivery take inside Egypt?' : 'س: ما هي مدة توصيل الشحنة داخل مصر؟'}</h4>
            <p className="text-gray-600 font-light">{isEn ? 'A: Delivery within Cairo and Giza takes 24-48 hours, and to other governorates takes 2-3 business days.' : 'ج: يتم التوصيل داخل القاهرة والجيزة خلال 24 إلى 48 ساعة، وباقي المحافظات خلال 2 إلى 3 أيام عمل.'}</p>
          </div>
          <div className="bg-[#E6EDE4] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">{isEn ? 'Q: What are the available payment methods?' : 'س: ما هي وسائل الدفع المتاحة؟'}</h4>
            <p className="text-gray-600 font-light">{isEn ? 'A: We provide fast and secure electronic payment via Vodafone Cash and InstaPay app.' : 'ج: نوفر الدفع الإلكتروني السريع والآمن عبر فودافون كاش (Vodafone Cash) وتطبيق انستا باي (InstaPay).'}</p>
          </div>
        </div>
      )
    },
    shipping: {
      title: isEn ? 'Shipping & Delivery Policy' : 'سياسة الشحن والتوصيل',
      icon: <Truck className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">{isEn ? 'We offer fast shipping to all governorates in Egypt:' : 'نقدم خدمة الشحن السريع لكافة محافظات جمهورية مصر العربية:'}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>{isEn ? 'Shipping fees are determined by the shipping company and paid directly to the courier upon delivery.' : 'يتم تحديد رسوم الشحن بواسطة شركة الشحن وتُدفع مباشرة للمندوب عند الاستلام.'}</li>
            <li>{isEn ? 'All products are carefully packaged in luxurious boxes to protect them during transit.' : 'يتم تغليف جميع المنتجات بعناية في عبوات فاخرة لحمايتها أثناء النقل.'}</li>
          </ul>
        </div>
      )
    },
    returns: {
      title: isEn ? 'Return & Exchange Policy' : 'سياسة الاستبدال والاسترجاع',
      icon: <RotateCcw className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">{isEn ? 'Your satisfaction and trust are our top priorities at VELORA CARE:' : 'رضاكم وشعوركم بالثقة هو أولويتنا القصوى في VELORA CARE:'}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>{isEn ? 'Products can be exchanged or returned within 14 days of receipt provided the outer seal is unbroken.' : 'يمكن استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط عدم فتح الغلاف الخارجي للمنتج.'}</li>
            <li>{isEn ? 'If a damaged or incorrect product arrives, it will be exchanged immediately free of charge.' : 'في حالة وصول منتج تالف أو غير مطابق للطلب، يتم الاستبدال فوراً مجاناً دون تكبد أي مصاريف شحن إضافية.'}</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: isEn ? 'Terms & Conditions' : 'الشروط والأحكام',
      icon: <FileText className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">{isEn ? 'All orders via the official VELORA CARE store are subject to the following terms:' : 'تخضع جميع الطلبات عبر متجر VELORA CARE الرسمي للشروط التالية:'}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>{isEn ? 'All product prices are in Egyptian Pounds and include taxes and services.' : 'جميع أسعار المنتجات مدونة بالجنيه المصري وشاملة للضرائب والخدمات.'}</li>
            <li>{isEn ? 'VELORA CARE guarantees the privacy and protection of customer data.' : 'تضمن VELORA CARE خصوصية وحماية بيانات العملاء وعدم مشاركتها مع أي جهة خارجية.'}</li>
            <li>{isEn ? 'Orders are confirmed immediately after transferring the amount via Vodafone Cash or InstaPay.' : 'يتم تأكيد الطلب فور تحويل قيمة الشحنة عبر فودافون كاش أو انستا باي.'}</li>
          </ul>
        </div>
      )
    }
  };

  const activeContent = contentMap[contentType] || contentMap.faq;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full border-2 border-[#C5A059] shadow-2xl space-y-4 max-h-[88vh] sm:max-h-[90vh] overflow-y-auto relative animate-popIn">


        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D221A] flex items-center justify-center border border-[#C5A059]/40 shadow-sm">
              {activeContent.icon}
            </div>
            <h3 className="font-bold font-serif text-lg text-[#0D221A]">{activeContent.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#0D221A] rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-2">
          {activeContent.body}
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full py-3 text-xs mt-4"
        >
          {isEn ? 'Got it, Close' : 'فهمت ذلك، إغلاق'}
        </button>
      </div>
    </div>
  );
}
