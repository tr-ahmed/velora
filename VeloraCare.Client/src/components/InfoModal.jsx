import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, contentType }) {
  if (!isOpen || !contentType) return null;

  const contentMap = {
    faq: {
      title: 'الأسئلة الشائعة (FAQ)',
      icon: <HelpCircle className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-700">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">س: هل مستحضرات VELORA طبيعية وآمنة؟</h4>
            <p className="text-gray-600 font-light">ج: نعم، جميع منتجاتنا مستخلصة من أعشاب ومكونات زمردية عضوية 100% وآمنة ومؤثرة لضمان الفاعلية وأعلى درجات الأمان.</p>
          </div>
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">س: ما هي مدة توصيل الشحنة داخل مصر؟</h4>
            <p className="text-gray-600 font-light">ج: يتم التوصيل داخل القاهرة والجيزة خلال 24 إلى 48 ساعة، وباقي المحافظات خلال 2 إلى 3 أيام عمل.</p>
          </div>
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-[#0D221A] text-sm">س: ما هي وسائل الدفع المتاحة؟</h4>
            <p className="text-gray-600 font-light">ج: نوفر الدفع الإلكتروني السريع والآمن عبر فودافون كاش (Vodafone Cash) وتطبيق انستا باي (InstaPay).</p>
          </div>
        </div>
      )
    },
    shipping: {
      title: 'سياسة الشحن والتوصيل',
      icon: <Truck className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">نقدم خدمة الشحن السريع لكافة محافظات جمهورية مصر العربية:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>شحن مجاني بالكامل للطلبات ذات القيمة 1000 جنيه أو أكثر.</li>
            <li>رسوم شحن موحدة 60 جنيه فقط للطلبات الأقل من 1000 جنيه.</li>
            <li>يتم تغليف جميع المنتجات بعناية في عبوات فاخرة لحمايتها أثناء النقل.</li>
          </ul>
        </div>
      )
    },
    returns: {
      title: 'سياسة الاستبدال والاسترجاع',
      icon: <RotateCcw className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">رضاكم وشعوركم بالثقة هو أولويتنا القصوى في VELORA CARE:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>يمكن استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط عدم فتح الغلاف الخارجي للمنتج.</li>
            <li>في حالة وصول منتج تالف أو غير مطابق للطلب، يتم الاستبدال فوراً مجاناً دون تكبد أي مصاريف شحن إضافية.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: 'الشروط والأحكام',
      icon: <FileText className="w-6 h-6 text-[#C5A059]" />,
      body: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-[#0D221A]">تخضع جميع الطلبات عبر متجر VELORA CARE الرسمي للشروط التالية:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>جميع أسعار المنتجات مدونة بالجنيه المصري وشاملة للضرائب والخدمات.</li>
            <li>تضمن VELORA CARE خصوصية وحماية بيانات العملاء وعدم مشاركتها مع أي جهة خارجية.</li>
            <li>يتم تأكيد الطلب فور تحويل قيمة الشحنة عبر فودافون كاش أو انستا باي.</li>
          </ul>
        </div>
      )
    }
  };

  const activeContent = contentMap[contentType] || contentMap.faq;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
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
          فهمت ذلك، إغلاق
        </button>
      </div>
    </div>
  );
}
