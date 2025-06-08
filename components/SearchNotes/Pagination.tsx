'use client';

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex justify-between items-center mt-8 text-sm text-cyan-400">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`hover:underline transition ${
          currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        ← 上一頁
      </button>
      <span>
        第 {currentPage} 頁 / 共 {totalPages} 頁
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`hover:underline transition ${
          currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        下一頁 →
      </button>
    </div>
  );
}
