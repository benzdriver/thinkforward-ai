// @ts-ignore
import { authMiddleware, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types/user';

// 定义路由规则
const adminRoutes = ['/admin(.*)', '/settings/admin(.*)'];
const consultantRoutes = ['/consultant(.*)', '/settings/consultant(.*)'];
const clientRoutes = ['/client(.*)', '/settings/client(.*)'];
const authenticatedRoutes = ['/dashboard(.*)', '/profile(.*)', '/settings(.*)'];

export default authMiddleware({
  publicRoutes: [
    '/',
    '/login',
    '/sign-in',
    '/sign-up',
    '/auth/forgot-password',
    '/auth/verify',
    '/about',
    '/contact',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy',
    '/blog(.*)'
  ],
  ignoredRoutes: [
    '/_next/static/(.*)',
    '/_next/image(.*)',
    '/favicon.ico',
    '/api/public/(.*)',
    '/assets/(.*)'
  ],
  
  async afterAuth(auth: any, req: any) {
    // 如果是公共路由或未认证的请求，直接通过
    if (auth.isPublicRoute || !auth.userId) {
      return NextResponse.next();
    }
    
    const path = req.nextUrl.pathname;
    
    try {
      // 获取用户信息和角色
      const user = await clerkClient.users.getUser(auth.userId);
      const userRole = user.publicMetadata.role as UserRole || UserRole.GUEST;
      
      // 检查管理员路由
      if (adminRoutes.some(pattern => new RegExp(pattern).test(path))) {
        if (userRole !== UserRole.ADMIN) {
          console.log(`Unauthorized access to admin route: ${path} by user with role: ${userRole}`);
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
      
      // 检查顾问路由
      else if (consultantRoutes.some(pattern => new RegExp(pattern).test(path))) {
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.CONSULTANT) {
          console.log(`Unauthorized access to consultant route: ${path} by user with role: ${userRole}`);
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
      
      // 检查客户路由
      else if (clientRoutes.some(pattern => new RegExp(pattern).test(path))) {
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.CLIENT) {
          console.log(`Unauthorized access to client route: ${path} by user with role: ${userRole}`);
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
      
      // 检查需要认证的通用路由
      else if (authenticatedRoutes.some(pattern => new RegExp(pattern).test(path))) {
        // 所有已认证用户都可以访问这些路由，无需额外检查
        // 但我们可以在这里添加额外的检查，例如订阅状态
        
        // 检查用户是否有活跃订阅（如果需要）
        const hasActiveSubscription = user.publicMetadata.hasActiveSubscription as boolean;
        
        // 如果路径包含高级功能且用户没有活跃订阅
        if (path.includes('/premium-features') && !hasActiveSubscription) {
          console.log(`Unauthorized access to premium feature: ${path} by user without active subscription`);
          return NextResponse.redirect(new URL('/subscription', req.url));
        }
      }
      
      // 将用户角色添加到请求头中，以便在API路由中使用
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-role', userRole);
      
      // 继续处理请求
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
    } catch (error) {
      console.error('Role check failed:', error);
      // 出错时，为安全起见，重定向到错误页面
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
