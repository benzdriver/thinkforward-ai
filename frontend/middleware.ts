import { clerkMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

// 定义受保护的路由
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 对于登录和注册页面，不做任何保护
  if (req.url.includes('/sign-in') || req.url.includes('/sign-up')) {
    return;
  }
  
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
