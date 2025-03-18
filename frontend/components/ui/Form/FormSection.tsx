import React from 'react';

interface FormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  divider?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentClassName = '',
  divider = true
}) => {
  return (
    <div className={`${divider ? 'border-b border-gray-200 pb-6' : ''} ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className={`text-lg font-medium leading-6 text-gray-900 ${titleClassName}`}>
              {title}
            </h3>
          )}
          
          {description && (
            <p className={`mt-1 text-sm text-gray-500 ${descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={`space-y-6 ${contentClassName}`}>{children}</div>
    </div>
  );
}; 