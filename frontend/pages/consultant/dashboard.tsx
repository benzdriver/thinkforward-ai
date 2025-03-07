// Page: /consultant/dashboard - 顾问专用控制台页面
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { UserRole } from '../../types/user';

interface ClientSummary {
  id: string;
  name: string;
  email: string;
  status: string;
  progress: number;
  country: string;
  lastActivity: string;
}

interface ChatSummary {
  id: string;
  clientName: string;
  clientId: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

interface FormReview {
  id: string;
  formId: string;
  formTitle: string;
  clientName: string;
  clientId: string;
  submittedAt: string;
}

interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  pendingForms: number;
  completedCases: number;
}

export default function ConsultantDashboard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [recentChats, setRecentChats] = useState<ChatSummary[]>([]);
  const [pendingReviews, setPendingReviews] = useState<FormReview[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    activeClients: 0,
    pendingForms: 0,
    completedCases: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 获取顾问仪表盘数据
        const response = await fetch('/api/consultant/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setClients(data.clients);
        setRecentChats(data.recentChats);
        setPendingReviews(data.pendingReviews);
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('无法加载仪表盘数据，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchDashboardData();
    } else if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              顾问控制台
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              管理您的客户和移民申请案例
            </p>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 总客户数 */}
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
                        总客户数
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metrics.totalClients}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/clients">
                    <span className="font-medium text-blue-600 hover:text-blue-500">查看所有客户</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 活跃客户 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        活跃客户
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metrics.activeClients}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/clients?status=active">
                    <span className="font-medium text-blue-600 hover:text-blue-500">查看活跃客户</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 待审核表格 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        待审核表格
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metrics.pendingForms}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/forms/pending">
                    <span className="font-medium text-blue-600 hover:text-blue-500">审核表格</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 已完成案例 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        已完成案例
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metrics.completedCases}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/consultant/cases/completed">
                    <span className="font-medium text-blue-600 hover:text-blue-500">查看已完成案例</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 待办事项和最近消息 */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 待审核表格 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">待审核表格</h3>
              <Link href="/consultant/forms/pending">
                <span className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  查看全部
                </span>
              </Link>
            </div>
            <ul className="divide-y divide-gray-200">
              {pendingReviews.length > 0 ? (
                pendingReviews.map((review) => (
                  <li key={review.id}>
                    <Link href={`/consultant/forms/${review.formId}`}>
                      <span className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{review.formTitle}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                待审核
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                客户: {review.clientName}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>
                                提交于 {review.submittedAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-sm text-gray-500">
                  没有待审核的表格
                </li>
              )}
            </ul>
          </div>
          
          {/* 最近消息 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">最近消息</h3>
              <Link href="/consultant/messages">
                <span className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  查看全部
                </span>
              </Link>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <li key={chat.id}>
                    <Link href={`/consultant/messages/${chat.id}`}>
                      <span className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{chat.clientName}</p>
                            {chat.unread && (
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  未读
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500 truncate">
                                {chat.lastMessage.length > 50 ? `${chat.lastMessage.substring(0, 50)}...` : chat.lastMessage}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>
                                {chat.lastMessageTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-sm text-gray-500">
                  没有最近消息
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* 客户列表 */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg leading-6 font-medium text-gray-900">我的客户</h3>
              <p className="mt-1 text-sm text-gray-500">
                管理您的移民客户列表
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link href="/consultant/clients">
                <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  查看所有客户
                </span>
              </Link>
            </div>
          </div>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {clients.length > 0 ? (
                clients.slice(0, 5).map((client) => (
                  <li key={client.id}>
                    <Link href={`/consultant/clients/${client.id}`}>
                      <span className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="sm:flex">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {client.name}
                              </p>
                              <p className="mt-1 flex-grow text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                {client.email}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                client.status === 'active' ? 'bg-green-100 text-green-800' :
                                client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                client.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {client.status === 'active' ? '活跃' :
                                 client.status === 'pending' ? '待处理' :
                                 client.status === 'completed' ? '已完成' : '未知'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                                {client.country}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>
                                最近活动: {client.lastActivity}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">申请进度</span>
                              <span className="font-medium">{client.progress}%</span>
                            </div>
                            <div className="mt-1 overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div style={{ width: `${client.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">暂无客户</h3>
                  <p className="mt-1 text-sm text-gray-500">开始添加新客户以管理他们的移民申请。</p>
                  <div className="mt-6">
                    <Link href="/consultant/clients/new">
                      <span className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        添加客户
                      </span>
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
