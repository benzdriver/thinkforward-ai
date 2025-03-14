import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * LoadingScreen component
 * Displays a loading spinner with an optional message
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[300px] h-full w-full">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-blue-700"></div>
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 