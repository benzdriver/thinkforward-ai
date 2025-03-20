import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 默认不在窗口聚焦时重新获取数据
      retry: 1, // 失败时最多重试1次
      staleTime: 5 * 60 * 1000, // 数据5分钟内视为新鲜
    },
  },
});
