import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  autoResize?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  className = '',
  error = false,
  errorMessage,
  autoResize = false,
  rows = 3,
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // 自动调整高度
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      };
      
      adjustHeight();
      textareaRef.current.addEventListener('input', adjustHeight);
      
      return () => {
        if (textareaRef.current) {
          textareaRef.current.removeEventListener('input', adjustHeight);
        }
      };
    }
  }, [autoResize]);
  
  return (
    <div>
      <textarea
        ref={textareaRef}
        rows={rows}
        className={`block w-full rounded-md shadow-sm ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && errorMessage && (
        <p id={`${props.id}-error`} className="mt-2 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 