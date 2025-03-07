import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserRole } from '../types/user';
import AdminDashboard from './admin/dashboard';
import Link from 'next/link';
import AIAssistant from '../components/AIAssistant';

// Add this interface near the top of your file
interface UserInfo {
  clientCount?: number;
  pendingReviews?: number;
  isSubscribed?: boolean;
  consultantName?: string;
  recentActivities?: any[];
  // Add other properties as needed
}

export default function Dashboard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        // 获取用户角色
        const roleResponse = await fetch('/api/user/role');
        if (!roleResponse.ok) {
          throw new Error('Failed to fetch user role');
        }
        const roleData = await roleResponse.json();
        setUserRole(roleData.role);
        
        // 获取用户信息
        const infoResponse = await fetch('/api/user/info');
        if (!infoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        const infoData = await infoResponse.json();
        setUserInfo(infoData);
        setIsSubscribed(infoData.isSubscribed);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchUserData();
    } else if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);
  
  // 加载中状态
  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // 根据用户角色显示相应仪表板
  if (userRole === UserRole.ADMIN) {
    return <AdminDashboard userRole={userRole} />;
  }
  
  if (userRole === UserRole.CONSULTANT) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-gray-900">顾问控制台</h1>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        客户管理
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {userInfo?.clientCount || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/clients">
                    <span className="font-medium text-blue-700 hover:text-blue-900">
                      查看所有客户
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        待处理表格
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {userInfo?.pendingReviews || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/forms">
                    <span className="font-medium text-blue-700 hover:text-blue-900">
                      查看待审核表格
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* 最近活动 */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">最近活动</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {userInfo?.recentActivities && userInfo.recentActivities.length > 0 ? (
                  userInfo.recentActivities.map((activity, index) => (
                    <li key={index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {activity.type === 'form_submission' && (
                                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                                {activity.type === 'client_message' && (
                                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                )}
                                {activity.type === 'system_notification' && (
                                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {activity.description}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="inline-flex text-xs text-gray-500">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    暂无活动记录
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* AI助手 */}
          <div className="mt-8">
            <AIAssistant 
              userRole={userRole || UserRole.GUEST} 
              isSubscribed={isSubscribed} 
            />
          </div>
        </div>
      </div>
    );
  }
  
  // 客户控制台
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-4">欢迎来到客户控制台</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 客户状态卡片 */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">您的状态</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">用户类型:</span>
                <span className="font-medium">客户</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">订阅状态:</span>
                <span className={`font-medium ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                  {isSubscribed ? '已订阅' : '未订阅'}
                </span>
              </div>
              {userInfo?.consultantName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">您的顾问:</span>
                  <span className="font-medium">{userInfo.consultantName}</span>
                </div>
              )}
              {!isSubscribed && (
                <div className="mt-4">
                  <Link href="/subscription">
                    <span className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                      升级订阅
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 进度卡片 */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">移民进度</h2>
            {isSubscribed ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>信息收集</span>
                    <span>70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>表格准备</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>顾问审核</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/client/forms">
                    <span className="text-blue-600 hover:underline">
                      继续填写表格 →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-600">您需要订阅我们的服务才能跟踪移民进度。</p>
              </div>
            )}
          </div>

          {/* 快速链接 */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">快速链接</h2>
            <nav className="space-y-2">
              <Link href="/client/forms">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  我的表格
                </span>
              </Link>
              <Link href="/client/documents">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  我的文档
                </span>
              </Link>
              <Link href="/client/chat">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  与顾问聊天
                </span>
              </Link>
              <Link href="/client/profile">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  个人资料
                </span>
              </Link>
            </nav>
          </div>

          {/* 待办事项 */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">待办事项</h2>
            {isSubscribed ? (
              <ul className="divide-y divide-gray-200">
                <li className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-gray-700">完成个人信息表</span>
                  </div>
                  <span className="text-sm text-gray-500">截止：3天后</span>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-gray-700">上传学历证明</span>
                  </div>
                  <span className="text-sm text-gray-500">截止：今天</span>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-gray-700">安排顾问通话</span>
                  </div>
                  <span className="text-sm text-gray-500">截止：下周</span>
                </li>
              </ul>
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-600">订阅后查看您的待办事项。</p>
              </div>
            )}
          </div>

          {/* AI助手 */}
          <div className="col-span-3">
            <AIAssistant 
              userRole={userRole || UserRole.GUEST} 
              isSubscribed={isSubscribed} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}