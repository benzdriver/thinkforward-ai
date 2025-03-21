import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 定义路由规则
const publicRoutes = ['/sign-in', '/sign-up', '/', '/api/public(.*)'];
const ignoredRoutes = ['/_next/static/(.*)', '/_next/image(.*)', '/favicon.ico'];

export default clerkMiddleware();

// 确保matcher配置正确
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};