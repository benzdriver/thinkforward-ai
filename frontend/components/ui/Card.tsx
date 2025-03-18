import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

interface CardSubComponentProps {
  children: React.ReactNode;
  className?: string;
}

// 子组件
export const CardHeader: React.FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardSubComponentProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

// 主Card组件
export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, className = '', hoverable = false }) => {
  const hoverClass = hoverable ? 'hover:shadow-lg transition-shadow duration-300' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

// 附加子组件
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;