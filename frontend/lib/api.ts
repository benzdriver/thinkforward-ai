import { toast } from '@/components/ui/Toast';
import { useTranslation } from 'next-i18next';

interface ApiOptions {
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

const defaultOptions: ApiOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 包含凭证（cookies）
};

/**
 * 发送 API 请求的通用函数
 */
async function fetchApi<T>(
  url: string,
  method: string,
  data?: any,
  options?: ApiOptions
): Promise<T> {
  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
    credentials: options?.withCredentials ? 'include' : 'same-origin',
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // 处理非 JSON 响应
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') === -1) {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return null as T;
    }
    
    const responseData = await response.json();
    
    if (!response.ok) {
      const error = new Error(responseData.message || 'API request failed') as ApiError;
      error.status = response.status;
      error.data = responseData;
      throw error;
    }
    
    return responseData;
  } catch (error) {
    // 重新抛出错误，以便调用者处理
    throw error;
  }
}

/**
 * API 请求方法
 */
export const api = {
  get: <T>(url: string, options?: ApiOptions): Promise<T> => 
    fetchApi<T>(url, 'GET', undefined, options),
  
  post: <T>(url: string, data?: any, options?: ApiOptions): Promise<T> => 
    fetchApi<T>(url, 'POST', data, options),
  
  put: <T>(url: string, data?: any, options?: ApiOptions): Promise<T> => 
    fetchApi<T>(url, 'PUT', data, options),
  
  patch: <T>(url: string, data?: any, options?: ApiOptions): Promise<T> => 
    fetchApi<T>(url, 'PATCH', data, options),
  
  delete: <T>(url: string, options?: ApiOptions): Promise<T> => 
    fetchApi<T>(url, 'DELETE', undefined, options),
};

/**
 * 处理 API 错误的通用函数
 * 返回错误消息的键，而不是直接翻译
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    
    // 处理特定状态码
    if (apiError.status === 401) {
      return 'unauthorized';
    }
    
    if (apiError.status === 403) {
      return 'forbidden';
    }
    
    if (apiError.status === 404) {
      return 'not_found';
    }
    
    if (apiError.status === 422) {
      return 'validation_error';
    }
    
    if (apiError.status && apiError.status >= 500) {
      return 'server_error';
    }
    
    // 使用错误消息或默认消息
    return apiError.message || 'unknown_error';
  }
  
  return 'unknown_error';
}

/**
 * 显示 API 错误提示
 * 这个函数应该在组件中使用，以便访问翻译函数
 */
export function useApiErrorHandler() {
  const { t } = useTranslation('error');
  
  return {
    showError: (error: unknown) => {
      const errorKey = handleApiError(error);
      const message = t(`api.${errorKey}`, {
        defaultValue: t('api.unknown_error')
      });
      toast.error(message);
    }
  };
}
