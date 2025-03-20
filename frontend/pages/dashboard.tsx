import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserRole } from '../types/user';
import { function as AdminDashboard } from './admin/dashboard';
import Link from 'next/link';
import { function as AIAssistant } from '../components/AIAssistant';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageHeader from '../components/ui/PageHeader';

// Add this interface near the top of your file
interface UserInfo {
  clientCount?: number;
  pendingReviews?: number;
  isSubscribed?: boolean;
  consultantName?: string;
  recentActivities?: any[];
  // Add other properties as needed
}

export function Dashboard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t } = useTranslation('dashboard');
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        // 获取用户角色
        const roleResponse = await fetch('/api/user/role', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('clerk-token')}`
          }
        });
        if (!roleResponse.ok) {
          throw new Error('Failed to fetch user role');
        }
        const roleData = await roleResponse.json();
        setUserRole(roleData.role);
        
        // 如果是游客，重定向到游客仪表板
        if (roleData.role === UserRole.GUEST) {
          router.push('/guest/dashboard');
          return;
        }
        
        // 获取用户信息
        const infoResponse = await fetch('/api/user/info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('clerk-token')}`
          }
        });
        if (!infoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        const infoData = await infoResponse.json();
        setUserInfo(infoData);
        setIsSubscribed(infoData.isSubscribed);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchUserData();
    } else if (isLoaded && !userId) {
      // 未登录用户视为游客
      router.push('/guest/dashboard');
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
          <PageHeader 
            title={t('consultant.title')} 
            subtitle={t('consultant.subtitle')} 
            alignment="left"
          />
          
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
                        {t('consultant.client_management')}
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
                      {t('consultant.view_all_clients')}
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
            <h2 className="text-lg font-medium text-gray-900">{t('consultant.recent_activities')}</h2>
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
                    {t('consultant.no_activity_record')}
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
  if (userRole === UserRole.CLIENT) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader 
            title={t('client.title')} 
            subtitle={t('client.subtitle')} 
            alignment="left"
          />
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* 进度概览 */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">{t('client.progress_overview')}</h2>
              {isSubscribed ? (
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {t('client.application_progress')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        30%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">{t('client.profile_completed')}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">{t('client.assessment_completed')}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">{t('client.documents_pending')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">{t('client.subscribe_to_view_progress')}</p>
                  <Link href="/subscription">
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      {t('client.subscribe_now')}
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* 顾问信息 */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">{t('client.your_consultant')}</h2>
              {isSubscribed && userInfo?.consultantName ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-gray-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-medium">{userInfo.consultantName}</h3>
                  <p className="text-gray-600 text-sm">{t('client.immigration_consultant')}</p>
                  <Link href="/client/chat">
                    <span className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                      {t('client.send_message')}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">{t('client.subscribe_to_get_consultant')}</p>
                  <Link href="/subscription">
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      {t('client.subscribe_now')}
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* 快速链接 */}
            <div className="col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">{t('client.quick_links')}</h2>
              <nav className="space-y-2">
                <Link href="/client/forms">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    {t('client.my_forms')}
                  </span>
                </Link>
                <Link href="/client/documents">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    {t('client.my_documents')}
                  </span>
                </Link>
                <Link href="/client/chat">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    {t('client.chat_with_consultant')}
                  </span>
                </Link>
                <Link href="/client/profile">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    {t('client.profile')}
                  </span>
                </Link>
              </nav>
            </div>

            {/* 待办事项 */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">{t('client.todo_items')}</h2>
              {isSubscribed ? (
                <ul className="divide-y divide-gray-200">
                  <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="ml-2 text-gray-700">{t('client.complete_personal_info')}</span>
                    </div>
                    <span className="text-sm text-gray-500">{t('client.due_in_days', { days: 3 })}</span>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="ml-2 text-gray-700">{t('client.upload_education_proof')}</span>
                    </div>
                    <span className="text-sm text-gray-500">{t('client.due_today')}</span>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="ml-2 text-gray-700">{t('client.schedule_consultant_call')}</span>
                    </div>
                    <span className="text-sm text-gray-500">{t('client.due_next_week')}</span>
                  </li>
                </ul>
              ) : (
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-600">{t('client.subscribe_to_view_todos')}</p>
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
  
  // 如果没有认可的用户角色，显示默认仪表板或重定向
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader 
          title={t('default.title')} 
          subtitle={t('default.subtitle')} 
          alignment="center"
        />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            {t('default.go_home')}
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common', 'dashboard'])),
    },
  };
}