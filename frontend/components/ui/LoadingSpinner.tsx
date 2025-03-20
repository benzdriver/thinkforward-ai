import React from 'react';
import classNames from 'classnames';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  thickness?: 'thin' | 'regular' | 'thick';
}

/**
 * 局部加载状态的旋转指示器组件
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className,
  thickness = 'regular'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white'
  };

  const thicknessClasses = {
    thin: 'border-2',
    regular: 'border-3',
    thick: 'border-4'
  };

  return (
    <div className={classNames('relative', className)}>
      <div
        className={classNames(
          'rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color],
          thicknessClasses[thickness],
          'border-t-transparent border-solid'
        )}
      />
    </div>
  );
}; 