import React, { createContext, useContext, useState, useCallback } from 'react';

type AppError = Error & {
  title?: string;
  code?: number;
};

const ErrorContext = createContext<{
  error: AppError | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  showErrorMessage: (message: string, title?: string) => void;
}>({
  error: null,
  setError: () => {},
  clearError: () => {},
  showErrorMessage: () => {}
});

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<AppError | null>(null);

  const setError = useCallback((error: Error | null) => {
    setErrorState(error as AppError);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const showErrorMessage = useCallback((message: string, title?: string) => {
    const error = new Error(message);
    if (title) {
      (error as any).title = title;
    }
    setErrorState(error as AppError);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, showErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): {
  error: AppError | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  showErrorMessage: (message: string, title?: string) => void;
} => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}; 