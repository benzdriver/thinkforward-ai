import React from 'react';
import classNames from 'classnames';

interface FormErrorProps {
  error?: string;
  className?: string;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className, id }) => {
  if (!error) return null;

  return (
    <p
      id={id}
      className={classNames(
        'mt-1 text-sm text-red-600 dark:text-red-400',
        className
      )}
    >
      {error}
    </p>
  );
}; 