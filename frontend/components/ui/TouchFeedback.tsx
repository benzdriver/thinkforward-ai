import React, { useState } from 'react';
import classNames from 'classnames';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className,
  activeClassName = 'bg-gray-100 dark:bg-gray-800',
  disabled = false,
  onClick,
}) => {
  const [isActive, setIsActive] = useState(false);
  
  const handleTouchStart = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };
  
  const handleTouchEnd = () => {
    if (!disabled) {
      setIsActive(false);
    }
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  
  return (
    <div
      className={classNames(
        'transition-colors duration-150',
        isActive && !disabled ? activeClassName : '',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}; 