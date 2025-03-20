import React from 'react';
import classNames from 'classnames';
import { useResponsive } from '../../contexts/ResponsiveContext';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  fluid = false,
  maxWidth = '2xl',
  padding = true,
}) => {
  const { isMobile } = useResponsive();
  
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };
  
  return (
    <div
      className={classNames(
        'w-full mx-auto',
        fluid ? 'max-w-full' : maxWidthClasses[maxWidth],
        padding && (isMobile ? 'px-4' : 'px-6'),
        className
      )}
    >
      {children}
    </div>
  );
}; 