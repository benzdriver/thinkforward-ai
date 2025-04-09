import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { usePermissions } from '@/hooks/usePermissions';
import { LoadingScreen } from '../ui/LoadingScreen';

interface AuthenticatedAppProps {
  children: React.ReactNode;
}

// 不需要认证的路由列表
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/forgot-password',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/blog',
  '/terms',
  '/privacy',
  '/test-canadian-features', // Added for testing Canadian features without authentication
];

export function AuthenticatedApp({ children }: AuthenticatedAppProps) {
  const router = useRouter();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isAuthenticated, userRole } = usePermissions();
  
  // 检查当前路径是否是公共路由
  const isPublicRoute = publicRoutes.some(route => 
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  // 如果用户信息正在加载，显示加载屏幕
  if (!isUserLoaded) {
    return <LoadingScreen />;
  }

  // 如果是公共路由，直接显示内容
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // 如果用户未登录且当前路由需要认证，重定向到登录页面
  if (!isSignedIn || !isAuthenticated) {
    router.push('/auth/login');
    return <LoadingScreen />;
  }

  // 用户已登录，显示内容
  return <>{children}</>;
}
