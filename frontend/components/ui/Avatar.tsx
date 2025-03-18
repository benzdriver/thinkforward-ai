import React from 'react';
import { useTranslation } from 'next-i18next';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarShape = 'circle' | 'square';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  icon?: React.ReactNode;
  text?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  className = '',
  icon,
  text,
  status,
  onClick
}) => {
  const { t } = useTranslation();
  const [imgError, setImgError] = React.useState(false);
  
  // 尺寸样式映射
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };
  
  // 形状样式映射
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md'
  };
  
  // 状态样式映射
  const statusClasses = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  };
  
  // 获取文本头像的内容
  const getTextAvatar = () => {
    if (!text) return '';
    
    // 获取首字母或首个字符
    const words = text.split(' ');
    if (words.length === 1) {
      return text.charAt(0).toUpperCase();
    }
    
    // 获取首字母和姓氏首字母
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };
  
  // 随机背景色（基于文本）
  const getRandomColor = () => {
    if (!text) return 'bg-blue-500';
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };
  
  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center justify-center ${sizeClasses[size]} ${shapeClasses[shape]} ${
          !src || imgError ? getRandomColor() : 'bg-gray-200'
        } text-white ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || t('components.avatar.alt', 'Avatar') as string}
            className={`h-full w-full object-cover ${shapeClasses[shape]}`}
            onError={() => setImgError(true)}
          />
        ) : icon ? (
          icon
        ) : text ? (
          <span>{getTextAvatar()}</span>
        ) : (
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusClasses[status]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}; 