import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse'
}) => {
  // 变体样式映射
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };
  
  // 动画样式映射
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };
  
  // 默认高度
  const defaultHeight = {
    text: '1rem',
    circular: '40px',
    rectangular: '100px'
  };
  
  // 默认宽度
  const defaultWidth = {
    text: '100%',
    circular: '40px',
    rectangular: '100%'
  };
  
  const finalWidth = width || defaultWidth[variant];
  const finalHeight = height || defaultHeight[variant];
  
  const widthStyle = typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth;
  const heightStyle = typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight;
  
  return (
    <div
      className={`bg-gray-200 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle
      }}
      aria-hidden="true"
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  animation = 'pulse'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 && lines > 1 ? '80%' : '100%'}
          animation={animation}
        />
      ))}
    </div>
  );
}; 