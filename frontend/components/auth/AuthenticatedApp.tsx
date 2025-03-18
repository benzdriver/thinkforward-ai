import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { useUserRole } from '../../hooks/useUserRole';
import { LoadingScreen } from '../ui/LoadingScreen';

interface AuthenticatedAppProps {
  children: React.ReactNode;
  publicRoutes?: string[];
  adminRoutes?: string[];
  consultantRoutes?: string[];
  clientRoutes?: string[];
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  children,
  publicRoutes = ['/login', '/signup', '/forgot-password', '/'],
  adminRoutes = ['/admin'],
  consultantRoutes = ['/consultant'],
  clientRoutes = ['/client'],
}) => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { role, isLoading: roleLoading } = useUserRole();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded || roleLoading) {
      return;
    }

    const currentPath = router.pathname;
    
    // 公共路由总是允许访问
    if (publicRoutes.some(route => currentPath.startsWith(route))) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // 需要登录才能访问的路由
    if (!isSignedIn) {
      router.push('/login');
      setIsChecking(false);
      return;
    }

    // 基于角色的路由访问控制
    if (adminRoutes.some(route => currentPath.startsWith(route)) && role !== 'ADMIN') {
      router.push('/unauthorized');
    } else if (consultantRoutes.some(route => currentPath.startsWith(route)) && role !== 'CONSULTANT' && role !== 'ADMIN') {
      router.push('/unauthorized');
    } else if (clientRoutes.some(route => currentPath.startsWith(route)) && role !== 'CLIENT' && role !== 'ADMIN') {
      router.push('/unauthorized');
    } else {
      setIsAuthorized(true);
    }

    setIsChecking(false);
  }, [isLoaded, isSignedIn, role, roleLoading, router, publicRoutes, adminRoutes, consultantRoutes, clientRoutes]);

  if (!isLoaded || roleLoading || isChecking) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null; // 将重定向到适当的页面
  }

  return <>{children}</>;
};