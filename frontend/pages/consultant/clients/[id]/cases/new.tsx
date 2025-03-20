// Page: /consultant/clients/[id]/cases/new - 顾问为客户创建新案例页面
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { UserRole } from '../../../../../types/user';

interface CaseFormData {
  title: string;
  description: string;
  immigrationType: string;
  destination: string;
  targetDate: string;
  notes: string;
}

interface NewCaseProps {
  userRole: UserRole;
}

interface ClientBasic {
  id: string;
  name: string;
  email: string;
}

export function NewCase({ userRole }: NewCaseProps) {
  const router = useRouter();
  const { id } = router.query;
  const { isLoaded, userId, getToken } = useAuth();
  const [client, setClient] = useState<ClientBasic | null>(null);
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    description: '',
    immigrationType: '',
    destination: '',
    targetDate: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 获取客户基本数据
  useEffect(() => {
    async function fetchClientData() {
      if (!id || !isLoaded) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`/api/consultant/clients/${id}/basic`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('无法获取客户数据');
        }
        
        const data = await response.json();
        setClient(data.client);
        
        // 如果客户有意向移民国家和类型，自动填充
        if (data.client.preferredDestination) {
          setFormData(prev => ({
            ...prev,
            destination: data.client.preferredDestination
          }));
        }
        
        if (data.client.immigrationType) {
          setFormData(prev => ({
            ...prev,
            immigrationType: data.client.immigrationType
          }));
        }
        
      } catch (error) {
        console.error('获取客户数据出错:', error);
        setError('无法加载客户数据，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && id) {
      fetchClientData();
    }
  }, [isLoaded, id, getToken]);
  
  // 如果不是顾问角色，重定向到控制台
  useEffect(() => {
    if (isLoaded && userRole !== UserRole.CONSULTANT && userRole !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [isLoaded, userRole, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('案例标题不能为空');
      return;
    }
    
    if (!formData.immigrationType) {
      setError('请选择移民类型');
      return;
    }
    
    if (!formData.destination) {
      setError('请选择目标国家');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = await getToken();
      const response = await fetch(`/api/consultant/clients/${id}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '创建案例失败');
      }
      
      const data = await response.json();
      setSuccess('案例创建成功');
      
      // 3秒后重定向到客户详情页面
      setTimeout(() => {
        router.push(`/consultant/clients/${id}?tab=cases`);
      }, 3000);
      
    } catch (error) {
      console.error('创建案例出错:', error);
      setError(error instanceof Error ? error.message : '创建案例失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="spinner">加载中...</div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">客户不存在</h1>
          <p className="text-gray-600 mb-4">找不到该客户信息或您没有权限访问。</p>
          <div className="mt-6">
            <Link href="/consultant/clients">
              <span className="text-blue-600 hover:text-blue-800">返回客户列表</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">为 {client.name} 创建新案例</h1>
            <Link href={`/consultant/clients/${id}`}>
              <span className="text-blue-600 hover:text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                返回客户详情
              </span>
            </Link>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    案例标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="例如：加拿大联邦技术移民申请"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    案例描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="请输入对案例的简要描述"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="immigrationType" className="block text-sm font-medium text-gray-700">
                      移民类型 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="immigrationType"
                      name="immigrationType"
                      value={formData.immigrationType}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">选择移民类型</option>
                      <option value="skilled_worker">技术移民</option>
                      <option value="investment">投资移民</option>
                      <option value="family">家庭团聚</option>
                      <option value="study">留学转移民</option>
                      <option value="work_permit">工作签证</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                      目标国家 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">选择目标国家</option>
                      <option value="canada">加拿大</option>
                      <option value="australia">澳大利亚</option>
                      <option value="usa">美国</option>
                      <option value="uk">英国</option>
                      <option value="new_zealand">新西兰</option>
                      <option value="singapore">新加坡</option>
                      <option value="europe">欧洲</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                    目标完成日期
                  </label>
                  <input
                    type="date"
                    name="targetDate"
                    id="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    附加说明
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="请输入任何其他需要说明的信息"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => router.push(`/consultant/clients/${id}`)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? '创建中...' : '创建案例'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 