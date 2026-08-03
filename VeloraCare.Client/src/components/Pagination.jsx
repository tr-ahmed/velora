import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
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
        <p className="text-gray-500 font-medium">
          عرض <strong className="text-[#0D221A]">{startItem}</strong> إلى <strong className="text-[#0D221A]">{endItem}</strong> من أصل <strong className="text-[#0D221A]">{totalItems}</strong> عنصر
        </p>
      )}

      <div className="flex items-center gap-1.5" dir="rtl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-[#DFE6DB] hover:border-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="الصفحة السابقة"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
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
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-[#DFE6DB] hover:border-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="الصفحة التالية"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
