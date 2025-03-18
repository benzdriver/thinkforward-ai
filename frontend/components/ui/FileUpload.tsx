import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'next-i18next';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  accept?: string;
  error?: boolean;
  errorMessage?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  className = '',
  error = false,
  errorMessage,
  ...props
}) => {
  const { t } = useTranslation();
  
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className}`}>
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={props.id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>{t('components.form.upload.button')}</span>
              <input
                id={props.id}
                type="file"
                className="sr-only"
                accept={accept}
                {...props}
              />
            </label>
            <p className="pl-1">{t('components.form.upload.dragDrop')}</p>
          </div>
          <p className="text-xs text-gray-500">{t('components.form.upload.fileTypes')}</p>
        </div>
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}; 