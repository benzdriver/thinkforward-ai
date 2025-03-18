import React from 'react';

type BadgeType = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'info';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  count?: number;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  type?: BadgeType;
  variant?: BadgeType;
  size?: BadgeSize;
  className?: string;
  children?: React.ReactNode;
  text?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  type = 'default',
  variant,
  size = 'md',
  className = '',
  children,
  text
}) => {
  // Use variant if provided, otherwise fall back to type
  const styleType = variant || type;
  
  // 类型样式映射
  const typeClasses = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    accent: 'bg-purple-500 text-white',
    info: 'bg-blue-400 text-white'
  };
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'text-xs px-1',
    md: 'text-xs px-1.5',
    lg: 'text-sm px-2'
  };
  
  // 圆点尺寸样式映射
  const dotSizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5'
  };
  
  // 是否显示徽标
  const showBadge = dot || text || (typeof count === 'number' && (count > 0 || showZero));
  
  // 徽标内容
  const badgeContent = () => {
    if (dot) {
      return null;
    }
    
    if (text) {
      return text;
    }
    
    if (typeof count === 'number') {
      return count > overflowCount ? `${overflowCount}+` : count;
    }
    
    return null;
  };
  
  // 独立徽标（没有子元素）
  if (!children) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full ${
          dot ? dotSizeClasses[size] : sizeClasses[size]
        } ${typeClasses[styleType]} ${className}`}
      >
        {!dot && badgeContent()}
      </span>
    );
  }
  
  // 附加到子元素的徽标
  return (
    <div className="relative inline-block">
      {children}
      
      {showBadge && (
        <span
          className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full ${
            dot ? dotSizeClasses[size] : sizeClasses[size]
          } ${typeClasses[styleType]} ${dot ? '' : 'min-w-[20px] h-5 flex items-center justify-center'} ${className}`}
        >
          {!dot && badgeContent()}
        </span>
      )}
    </div>
  );
}; 