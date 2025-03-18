import React from 'react';
import { useTranslation } from 'next-i18next';

interface EmptyProps {
  image?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  image,
  description,
  children,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const defaultDescription = t('components.empty.description', 'No data');
  
  const defaultImage = (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
  
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="space-y-6">
        {image || defaultImage}
        
        <div className="text-sm text-gray-500">
          {description || defaultDescription}
        </div>
        
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}; 