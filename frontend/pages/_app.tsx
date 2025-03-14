import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { UserRole } from "../types/user";
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '../contexts/AuthContext';

// 公共页面列表
const publicPages = [
  "/",
  "/landing",
  "/about",
  "/pricing",
  "/sign-in",
  "/sign-in/[[...index]]",
  "/sign-up",
  "/sign-up/[[...index]]",
  "/initial-assessment"
];

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = pageProps;
  
  const localeMapping = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'ar': 'ar',
    'ja': 'ja-JP',
    'ko': 'ko-KR'
  };
  
  const clerkLocale = locale ? localeMapping[locale as keyof typeof localeMapping] : 'zh-CN';
  
  const router = useRouter();

  useEffect(() => {
    // 监听路由变化
    const handleRouteChange = (url: string) => {
      console.log('App is navigating to:', url);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    // 打印当前路由信息
    console.log('Current route:', {
      pathname: router.pathname,
      asPath: router.asPath,
      locale: router.locale,
      query: router.query
    });

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <ClerkProvider
      localization={{
        locale: clerkLocale
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
          footerActionLink: 'text-blue-600 hover:text-blue-500'
        }
      }}
      signInFallbackRedirectUrl="/landing"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <AuthProvider>
        <AuthenticatedApp Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </ClerkProvider>
  );
}

// Define custom props type for AuthenticatedApp
type AuthAppProps = {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
};

// 嵌套的组件，可以安全地使用useAuth
function AuthenticatedApp({ Component, pageProps }: AuthAppProps) {
  const router = useRouter();
  const { userId, isLoaded, getToken } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  
  // 检查当前页面是否为公共页面
  const isPublicPage = publicPages.includes(router.pathname) || 
                        router.pathname.startsWith("/api/");

  // 获取用户角色
  useEffect(() => {
    async function fetchUserRole() {
      const roleResponse = await fetch('/api/user/role', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clerk-token')}`
        }
      });
      const data = await roleResponse.json();
      setUserRole(data.role || UserRole.CLIENT);
    }
    
    fetchUserRole();
  }, []);

  // 路由保护逻辑
  useEffect(() => {
    // 已经在登录页面，不要再重定向到登录页面
    if (router.pathname === "/sign-in" || router.pathname.startsWith("/sign-in/")) {
      return;
    }

    if (!localStorage.getItem('clerk-token')) {
      // 未登录用户只能访问公共页面
      if (!isPublicPage) {
        router.push("/sign-in");
      }
    } else {
      // 角色权限路由保护
      if (router.pathname.startsWith("/consultant/") && 
          userRole !== UserRole.CONSULTANT && 
          userRole !== UserRole.ADMIN) {
        router.push("/dashboard");
      }
      
      if (router.pathname.startsWith("/admin/") && 
          userRole !== UserRole.ADMIN) {
        router.push("/dashboard");
      }
    }
  }, [router.pathname, isPublicPage, userRole, router]);

  // 认证相关逻辑
  // 如果页面正在加载或是公共页面，直接渲染
  if (!isLoaded || isPublicPage) {
    return <Component {...pageProps} userRole={userRole} />;
  }
  
  // 如果非公共页面且用户未登录，重定向到登录页
  if (!userId) {
    // 使用客户端重定向
    if (typeof window !== 'undefined') {
      router.push('/sign-in');
      return <div>Redirecting to sign in...</div>;
    }
    return null;
  }
  
  // 用户已登录，渲染页面
  useEffect(() => {
    if (isLoaded && userId) {
      // 获取Clerk token并存储
      getToken().then(token => {
        if (token) {
          localStorage.setItem('clerk-token', token);
          // 添加: 同步用户到后端
          fetch("/api/auth/sync-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ token })
          });
        }
      });
    }
  }, [isLoaded, userId, getToken]);

  return <Component {...pageProps} userRole={userRole} />;
}

// 确保导出包装过的组件
export default appWithTranslation(MyApp);