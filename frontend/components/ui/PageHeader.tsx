import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string | null;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * PageHeader component
 * 
 * A reusable page header that displays a title and optional subtitle
 * Supports internationalization through props (should be pre-translated)
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  alignment = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignmentClasses[alignment]} ${className}`}>
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle != null && (
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader; 