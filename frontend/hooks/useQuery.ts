import { 
  useQuery, 
  useMutation, 
  useInfiniteQuery,
  type InfiniteData,
  UseQueryOptions, 
  UseInfiniteQueryOptions,
  UseMutationOptions,
  QueryKey,
  useQueryClient
} from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { useI18n } from '@/hooks/useI18n';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

/**
 * 用于获取数据的 hook
 */
export function useFetch<TData = unknown, TError = unknown>(
  key: QueryKey,
  url: string,
  options?: UseQueryOptions<TData, TError> & { onError?: (error: TError) => void }
) {
  const { t } = useI18n('error');
  
  const result = useQuery<TData, TError>({
    queryKey: key,
    queryFn: () => api.get<TData>(url),
    ...options,
  });
  
  useEffect(() => {
    if (result.error && !options?.onError) {
      const errorMessage = handleApiError(result.error);
      const translatedMessage = t(`api.${errorMessage}`, errorMessage);
      toast.error(translatedMessage);
    } else if (result.error && options?.onError) {
      options.onError(result.error);
    }
  }, [result.error, t, options]);
  
  return result;
}

/**
 * 用于创建数据的 hook
 */
export function useCreate<TData = unknown, TVariables = unknown, TError = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const { t } = useI18n('error');
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => api.post<TData>(url, variables),
    onError: (error) => {
      if (!options?.onError) {
        const errorMessage = handleApiError(error);
        const translatedMessage = t(`api.${errorMessage}`, errorMessage);
        toast.error(translatedMessage);
      }
    },
    ...options,
  });
}

/**
 * 用于更新数据的 hook
 */
export function useUpdate<TData = unknown, TVariables = unknown, TError = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const { t } = useI18n('error');
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => api.put<TData>(url, variables),
    onError: (error) => {
      if (!options?.onError) {
        const errorMessage = handleApiError(error);
        const translatedMessage = t(`api.${errorMessage}`, errorMessage);
        toast.error(translatedMessage);
      }
    },
    ...options,
  });
}

/**
 * 用于部分更新数据的 hook
 */
export function usePatch<TData = unknown, TVariables = unknown, TError = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const { t } = useI18n('error');
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => api.patch<TData>(url, variables),
    onError: (error) => {
      if (!options?.onError) {
        const errorMessage = handleApiError(error);
        const translatedMessage = t(`api.${errorMessage}`, errorMessage);
        toast.error(translatedMessage);
      }
    },
    ...options,
  });
}

/**
 * 用于删除数据的 hook
 */
export function useDelete<TData = unknown, TVariables = unknown, TError = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const { t } = useI18n('error');
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => {
      const finalUrl = typeof variables === 'string' 
        ? `${url}/${variables}` 
        : url;
      return api.delete<TData>(finalUrl);
    },
    onError: (error) => {
      if (!options?.onError) {
        const errorMessage = handleApiError(error);
        const translatedMessage = t(`api.${errorMessage}`, errorMessage);
        toast.error(translatedMessage);
      }
    },
    ...options,
  });
}

/**
 * 用于无限加载数据的 hook
 */
export function useInfiniteData<TData = unknown, TError = unknown>(
  key: QueryKey,
  url: string,
  getNextPageParam: (lastPage: any) => any,
  options?: Omit<UseInfiniteQueryOptions<TData, TError, InfiniteData<TData, unknown>, TData, QueryKey, unknown>, 'queryKey' | 'queryFn' | 'getNextPageParam'>
) {
  const { t } = useI18n('error');
  
  const result = useInfiniteQuery<TData, TError>({
    queryKey: key,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const pageUrl = pageParam ? `${url}?page=${pageParam}` : url;
      return api.get<TData>(pageUrl);
    },
    getNextPageParam,
    ...options,
  });
  
  useEffect(() => {
    if (result.error) {
      const errorMessage = handleApiError(result.error);
      const translatedMessage = t(`api.${errorMessage}`, errorMessage);
      toast.error(translatedMessage);
    }
  }, [result.error, t]);
  
  return result;
}

/**
 * 用于乐观更新的辅助函数
 */
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();
  const { t } = useI18n('common');
  
  return {
    // 乐观添加项目到列表
    addItem: <T>(queryKey: QueryKey, newItem: T, successMessage?: string) => {
      queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
        return old ? [...old, newItem] : [newItem];
      });
      
      if (successMessage) {
        toast.success(t(successMessage));
      }
    },
    
    // 乐观更新列表中的项目
    updateItem: <T extends { id: string | number }>(
      queryKey: QueryKey, 
      updatedItem: T,
      successMessage?: string
    ) => {
      queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
        if (!old) return [updatedItem];
        return old.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );
      });
      
      if (successMessage) {
        toast.success(t(successMessage));
      }
    },
    
    // 乐观删除列表中的项目
    removeItem: <T extends { id: string | number }>(
      queryKey: QueryKey, 
      itemId: string | number,
      successMessage?: string
    ) => {
      queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
        if (!old) return [];
        return old.filter(item => item.id !== itemId);
      });
      
      if (successMessage) {
        toast.success(t(successMessage));
      }
    }
  };
}
