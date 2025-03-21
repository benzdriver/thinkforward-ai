import 'react';

declare global {
  // 扩展 Error 类型
  interface Error {
    code?: string;
    status?: number;
    metadata?: Record<string, unknown>;
  }

  // 扩展 Window 类型
  interface Window {
    __APP_CONFIG__: {
      ENV: string;
      VERSION: string;
    };
  }
} 