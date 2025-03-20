import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { ConsultantLayout } from './ConsultantLayout';
import { ClientLayout } from './ClientLayout';
import { AdminLayout } from './AdminLayout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  titleKey?: string;
  defaultTitle?: string;
  namespace?: string | string[];
  suffix?: string;
  requiredRoles?: UserRole[];
}

export const AuthenticatedLayout = ({
  children,
  titleKey,
  defaultTitle,
  namespace,
  suffix,
  requiredRoles
}: AuthenticatedLayoutProps) => {
  const { user, userRole, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      } else if (requiredRoles && !requiredRoles.includes(userRole!)) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, userRole, requiredRoles, router]);

  // 如果正在加载，显示加载屏幕
  if (isLoading || !isAuthenticated) {
    return <LoadingSkeleton />;
  }

  // 根据用户角色选择适当的布局
  if (userRole === UserRole.ADMIN) {
    return (
      <AdminLayout
        titleKey={titleKey}
        defaultTitle={defaultTitle}
        namespace={namespace}
        suffix={suffix}
      >
        {children}
      </AdminLayout>
    );
  }

  if (userRole === UserRole.CONSULTANT) {
    return (
      <ConsultantLayout
        titleKey={titleKey}
        defaultTitle={defaultTitle}
        namespace={namespace}
        suffix={suffix}
      >
        {children}
      </ConsultantLayout>
    );
  }

  if (userRole === UserRole.CLIENT) {
    return (
      <ClientLayout
        titleKey={titleKey}
        defaultTitle={defaultTitle}
        namespace={namespace}
        suffix={suffix}
      >
        {children}
      </ClientLayout>
    );
  }

  // 默认情况下，使用客户端布局
  return (
    <ClientLayout
      titleKey={titleKey}
      defaultTitle={defaultTitle}
      namespace={namespace}
      suffix={suffix}
    >
      {children}
    </ClientLayout>
  );
}; 