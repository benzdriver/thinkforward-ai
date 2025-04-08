import React from 'react';

interface CanadianFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CanadianFlag: React.FC<CanadianFlagProps> = ({ 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-4',
    md: 'w-8 h-5',
    lg: 'w-12 h-8'
  };
  
  return (
    <img 
      src="/images/canada/flags/canada-flag.svg" 
      alt="Canadian Flag" 
      className={`inline-block ${sizeClasses[size]} ${className}`}
      width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
      height={size === 'sm' ? 16 : size === 'md' ? 20 : 32}
    />
  );
};

export default CanadianFlag; 