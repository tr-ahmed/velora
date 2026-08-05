import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 text-xs font-sans">
      {totalItems !== undefined && (
        <span className="text-sm text-gray-600">
          {isEn ? (
            <>Showing <strong className="text-[#0D221A]">{startItem}</strong> to <strong className="text-[#0D221A]">{endItem}</strong> of <strong className="text-[#0D221A]">{totalItems}</strong> items</>
          ) : (
            <>عرض <strong className="text-[#0D221A]">{startItem}</strong> إلى <strong className="text-[#0D221A]">{endItem}</strong> من أصل <strong className="text-[#0D221A]">{totalItems}</strong> عنصر</>
          )}
        </span>
      )}

      <div className="flex items-center gap-1.5" dir="rtl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#0D221A] hover:bg-[#0D221A] hover:text-[#EAD096] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0D221A] transition-all"
          title={isEn ? 'Previous Page' : 'الصفحة السابقة'}
          aria-label={isEn ? 'Previous Page' : 'الصفحة السابقة'}
        >
          {isEn ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 rounded-xl font-bold transition-all text-xs flex items-center justify-center ${
              currentPage === num
                ? 'bg-[#0D221A] text-[#EAD096] border border-[#C5A059] shadow'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#0D221A] hover:bg-[#0D221A] hover:text-[#EAD096] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0D221A] transition-all"
          title={isEn ? 'Next Page' : 'الصفحة التالية'}
          aria-label={isEn ? 'Next Page' : 'الصفحة التالية'}
        >
          {isEn ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
