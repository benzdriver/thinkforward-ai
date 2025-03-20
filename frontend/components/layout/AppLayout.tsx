import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { PublicLayout } from './PublicLayout';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { UserRole } from '@/types/user';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface AppLayoutProps {
  children: React.ReactNode;
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string | string[];
  suffix?: string;
  isPublic?: boolean;
  requiredRoles?: UserRole[];
}

export const AppLayout = ({
  children,
  titleKey,
  defaultTitle,
  namespace,
  suffix,
  isPublic = false,
  requiredRoles
}: AppLayoutProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // 如果页面需要认证但用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isLoading, isAuthenticated, isPublic, router]);

  // 如果正在加载，显示加载屏幕
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 如果是公共页面或用户未认证，使用公共布局
  if (isPublic || !isAuthenticated) {
    return (
      <PublicLayout
        titleKey={titleKey}
        defaultTitle={defaultTitle}
        namespace={namespace}
        suffix={suffix}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </PublicLayout>
    );
  }

  // 如果用户已认证，使用认证布局
  return (
    <AuthenticatedLayout
      titleKey={titleKey}
      defaultTitle={defaultTitle}
      namespace={namespace}
      suffix={suffix}
      requiredRoles={requiredRoles}
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AuthenticatedLayout>
  );
}; 