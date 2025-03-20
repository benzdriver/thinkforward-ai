import { toast as reactHotToast } from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const toast = {
  success: (message: string, options?: ToastOptions) => 
    reactHotToast.success(message, options),
  
  error: (message: string, options?: ToastOptions) => 
    reactHotToast.error(message, options),
  
  info: (message: string, options?: ToastOptions) => 
    reactHotToast(message, options),
  
  warning: (message: string, options?: ToastOptions) => 
    reactHotToast(message, { ...options, icon: '⚠️' }),
}; 