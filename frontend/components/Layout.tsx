import { SignOutButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserRole } from "../types/user";

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export default function Layout({ children, userRole }: LayoutProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-xl font-bold text-blue-600">Thinkforward移民AI助手</span>
                </Link>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <Link href="/">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === "/" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}>
                    首页
                  </span>
                </Link>
                
                <Link href="/initial-assessment">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === "/initial-assessment" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}>
                    评估
                  </span>
                </Link>
                
                {isSignedIn && (
                  <Link href="/dashboard">
                    <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname === "/dashboard" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}>
                      控制台
                    </span>
                  </Link>
                )}
                
                {userRole === UserRole.CONSULTANT && (
                  <Link href="/consultant/clients">
                    <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname.startsWith("/consultant") ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}>
                      客户管理
                    </span>
                  </Link>
                )}
                
                {userRole === UserRole.ADMIN && (
                  <Link href="/admin/dashboard">
                    <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname.startsWith("/admin") ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}>
                      管理员
                    </span>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {!isSignedIn ? (
                <div className="flex items-center space-x-2">
                  <Link href="/sign-in">
                    <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      登录
                    </span>
                  </Link>
                  <Link href="/sign-up">
                    <span className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                      注册
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/client/profile">
                    <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      个人资料
                    </span>
                  </Link>
                  <SignOutButton>
                    <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      登出
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 sm:py-8 lg:py-10">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Thinkforward移民AI助手. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
}
