import axios, { AxiosError } from 'axios';
import { useError } from '../contexts/ErrorContext';

type ApiError = Error & {
  statusCode?: number;
  errorCode?: string;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 添加统一错误处理拦截器
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const apiError = new Error(error.message) as ApiError;
    
    if (error.response) {
      apiError.statusCode = error.response.status;
      apiError.errorCode = error.response.data?.code;
      apiError.message = error.response.data?.message || error.message;
    }

    throw apiError;
  }
);

// 使用示例
export const fetchData = async () => {
  try {
    const response = await apiClient.get('/data');
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`API Error [${apiError.statusCode}]: ${apiError.message}`);
    throw apiError;
  }
}; 