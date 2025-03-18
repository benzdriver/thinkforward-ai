import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePermission, Permission } from '../../hooks/usePermission';

export function withPagePermission(permission: Permission) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedPage(props: P) {
      const router = useRouter();
      const { hasPermission, isLoading } = usePermission(permission);
      
      useEffect(() => {
        if (!isLoading && !hasPermission) {
          router.push('/unauthorized');
        }
      }, [hasPermission, isLoading, router]);
      
      if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
      }
      
      if (!hasPermission) {
        return null; // 将重定向到未授权页面
      }
      
      return <Component {...props} />;
    };
  };
} 