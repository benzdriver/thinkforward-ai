import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showTotal?: boolean;
  totalItems?: number;
  pageSize?: number;
  showQuickJumper?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
  showTotal = false,
  totalItems = 0,
  pageSize = 10,
  showQuickJumper = false
}) => {
  const { t } = useTranslation();
  const [jumpValue, setJumpValue] = React.useState('');
  
  // 生成页码数组
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // 左右兄弟节点 + 当前页 + 首尾页
    const totalBlocks = totalNumbers + 2; // +2 是两个省略号
    
    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      
      return [...leftRange, '...', totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      
      return [1, '...', ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      
      return [1, '...', ...middleRange, '...', totalPages];
    }
    
    return [];
  };
  
  const pageNumbers = getPageNumbers();
  
  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(jumpValue);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
        setJumpValue('');
      }
    }
  };
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showTotal && (
        <div className="text-sm text-gray-700">
          {t('components.pagination.total', {
            defaultValue: 'Total {{total}} items',
            total: totalItems
          })}
        </div>
      )}
      
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
            currentPage === 1
              ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">{t('components.pagination.previous', 'Previous')}</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="hidden md:flex">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
            currentPage === totalPages
              ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">{t('components.pagination.next', 'Next')}</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {showQuickJumper && (
          <div className="ml-3 flex items-center">
            <span className="text-sm text-gray-700 mr-2">
              {t('components.pagination.jumpTo', 'Jump to')}
            </span>
            <input
              type="text"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleJump}
              className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 