import React from 'react';
import { useTranslation } from 'next-i18next';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
  className?: string;
  dashed?: boolean;
  type?: 'solid' | 'dashed' | 'dotted';
  textPosition?: 'left' | 'center' | 'right';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  children,
  className = '',
  type = 'solid',
  textPosition = 'center',
  dashed = false
}) => {
  const { t } = useTranslation();
  
  // 如果dashed属性为true，则覆盖type
  const borderStyle = dashed ? 'dashed' : type;
  
  // 边框样式
  const borderStyleClass = `border-${borderStyle}`;
  
  // 文本位置样式
  const textPositionClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };
  
  if (orientation === 'vertical') {
    return (
      <div 
        className={`inline-block h-full border-l border-gray-200 ${borderStyleClass} ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }
  
  if (children) {
    return (
      <div className={`relative ${className}`} role="separator" aria-orientation="horizontal">
        <div className={`absolute inset-0 flex items-center ${textPositionClass[textPosition]}`}>
          <div className={`w-full border-t border-gray-200 ${borderStyleClass}`} />
        </div>
        <div className={`relative flex ${textPositionClass[textPosition]}`}>
          <span className="bg-white px-2 text-sm text-gray-500">
            {children || t('components.divider.text', 'Text')}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <hr 
      className={`border-t border-gray-200 ${borderStyleClass} ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}; 