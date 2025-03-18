import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type TagSize = 'sm' | 'md' | 'lg';

interface TagProps {
  children: React.ReactNode;
  type?: TagType;
  size?: TagSize;
  closable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  bordered?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  children,
  type = 'default',
  size = 'md',
  closable = false,
  onClose,
  className = '',
  icon,
  bordered = true
}) => {
  // 类型样式映射
  const typeClasses = {
    default: bordered 
      ? 'bg-gray-50 text-gray-800 border-gray-300' 
      : 'bg-gray-100 text-gray-800',
    primary: bordered 
      ? 'bg-blue-50 text-blue-800 border-blue-300' 
      : 'bg-blue-100 text-blue-800',
    success: bordered 
      ? 'bg-green-50 text-green-800 border-green-300' 
      : 'bg-green-100 text-green-800',
    warning: bordered 
      ? 'bg-yellow-50 text-yellow-800 border-yellow-300' 
      : 'bg-yellow-100 text-yellow-800',
    danger: bordered 
      ? 'bg-red-50 text-red-800 border-red-300' 
      : 'bg-red-100 text-red-800'
  };
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };
  
  // 关闭按钮尺寸
  const closeSizeClasses = {
    sm: 'h-3 w-3 ml-1',
    md: 'h-4 w-4 ml-1.5',
    lg: 'h-5 w-5 ml-2'
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-md ${
        bordered ? 'border' : ''
      } ${typeClasses[type]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {closable && (
        <button
          type="button"
          className="inline-flex rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={onClose}
        >
          <XMarkIcon className={closeSizeClasses[size]} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}; 