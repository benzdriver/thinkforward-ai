import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { UserRole } from "../types/user";

// 公共页面列表
const publicPages = [
  "/",
  "/sign-in",
  "/sign-up",
  "/initial-assessment",
  "/subscription"
];

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const { userId, isLoaded, getToken } = useAuth();
  
  // 检查当前页面是否为公共页面
  const isPublicPage = publicPages.includes(router.pathname) || 
                        router.pathname.startsWith("/subscription/");

  // 获取用户角色
  useEffect(() => {
    async function fetchUserRole() {
      if (userId) {
        try {
          const token = await getToken();
          const response = await fetch("/api/user/role", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await response.json();
          setUserRole(data.role || UserRole.CLIENT);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUserRole(UserRole.CLIENT); // 默认为客户角色
        }
      } else {
        setUserRole(UserRole.GUEST);
      }
    }
    
    if (isLoaded) {
      fetchUserRole();
    }
  }, [userId, isLoaded, getToken]);

  // 路由保护逻辑
  useEffect(() => {
    if (!isLoaded) return;

    // 未登录用户只能访问公共页面
    if (!userId && !isPublicPage) {
      router.push("/sign-in");
      return;
    }

    // 角色权限路由保护
    if (userId && !isPublicPage) {
      // 顾问专区路由保护
      if (router.pathname.startsWith("/consultant/") && 
          userRole !== UserRole.CONSULTANT && 
          userRole !== UserRole.ADMIN) {
        router.push("/dashboard");
        return;
      }
      
      // 管理员专区路由保护
      if (router.pathname.startsWith("/admin/") && 
          userRole !== UserRole.ADMIN) {
        router.push("/dashboard");
        return;
      }
    }
  }, [userId, isLoaded, router.pathname, isPublicPage, userRole, router]);

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Component {...pageProps} userRole={userRole} />
    </ClerkProvider>
  );
}

export default MyApp;