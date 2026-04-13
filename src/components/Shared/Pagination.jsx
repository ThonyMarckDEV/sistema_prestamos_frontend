import React from 'react';

const DOTS = '...';

const getPaginationRange = ({ totalPages, currentPage, siblingCount = 1 }) => {
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const totalPageNumbers = siblingCount + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return range(1, totalPages);
};


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = getPaginationRange({ currentPage, totalPages });

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full mt-4 md:mt-0">
      <button
          type="button" // 🔥 CRUCIAL: Evita el submit accidental
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1} 
          className="px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
          Anterior
      </button>

      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return <span key={`${pageNumber}-${index}`} className="px-1 md:px-2 py-1 text-xs md:text-sm font-medium text-gray-500">...</span>;
            }
            return (
              <button
                type="button" // 🔥 CRUCIAL: Evita el submit accidental
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm font-medium border rounded-md transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button> 
            );
          })}
      </div>

      <button
          type="button" // 🔥 CRUCIAL: Evita el submit accidental
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
          Siguiente
      </button>
    </nav>
  );
};

export default Pagination;