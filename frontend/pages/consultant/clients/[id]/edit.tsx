// Page: /consultant/clients/[id]/edit - 顾问编辑客户资料页面
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { UserRole } from '../../../../types/user';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  preferredDestination: string;
  immigrationType: string;
  status: 'active' | 'pending' | 'completed';
  notes: string;
}

interface EditClientProps {
  userRole: UserRole;
}

export function EditClient({ userRole }: EditClientProps) {
  const router = useRouter();
  const { id } = router.query;
  const { isLoaded, userId, getToken } = useAuth();
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    passportNumber: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    preferredDestination: '',
    immigrationType: '',
    status: 'pending',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  
  // 获取客户数据
  useEffect(() => {
    async function fetchClientData() {
      if (!id || !isLoaded) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`/api/consultant/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('无法获取客户数据');
        }
        
        const data = await response.json();
        setFormData(data.client);
        setOriginalEmail(data.client.email);
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
    
    // 如果正在编辑邮箱并之前有邮箱存在错误，清除错误
    if (name === 'email' && emailExists) {
      setEmailExists(false);
    }
  };
  
  const checkEmailExists = async (email: string): Promise<boolean> => {
    // 如果邮箱没有变化，不需要检查
    if (email === originalEmail) return false;
    
    try {
      const token = await getToken();
      const response = await fetch(`/api/consultant/clients/check-email?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('检查邮箱出错:', error);
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 检查邮箱是否已存在(但仅当邮箱已更改时)
      if (formData.email !== originalEmail) {
        const exists = await checkEmailExists(formData.email);
        if (exists) {
          setEmailExists(true);
          setError('该邮箱已被其他客户使用，请使用其他邮箱');
          setIsSubmitting(false);
          return;
        }
      }
      
      const token = await getToken();
      const response = await fetch(`/api/consultant/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新客户失败');
      }
      
      setSuccess('客户资料更新成功！');
      
      // 3秒后重定向到客户详情页
      setTimeout(() => {
        router.push(`/consultant/clients/${id}`);
      }, 3000);
    } catch (error) {
      console.error('更新客户出错:', error);
      setError((error as Error).message || '更新客户失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/consultant/dashboard">
                <span className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  控制台
                </span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/consultant/clients">
                  <span className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2">客户管理</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href={`/consultant/clients/${id}`}>
                  <span className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2">{formData.name}</span>
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">编辑客户</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            编辑客户: {formData.name}
          </h2>
        </div>
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
              <p className="text-sm text-red-700">
                {error}
              </p>
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
              <p className="text-sm text-green-700">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">基本信息</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    客户的基本个人信息
                  </p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名 *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      邮箱地址 *
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${
                          emailExists ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
                        } rounded-md`}
                      />
                      {emailExists && (
                        <p className="mt-2 text-sm text-red-600">该邮箱已被其他客户使用</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      电话
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      客户状态
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="pending">待处理</option>
                        <option value="active">进行中</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                      国籍
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="nationality"
                        id="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      出生日期
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
                      护照号码
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="passportNumber"
                        id="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">联系地址</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    客户的联系地址信息
                  </p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      详细地址
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      城市
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      国家/地区
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      邮政编码
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">移民信息</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    客户的移民意向信息
                  </p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="preferredDestination" className="block text-sm font-medium text-gray-700">
                      意向移民国家
                    </label>
                    <div className="mt-1">
                      <select
                        id="preferredDestination"
                        name="preferredDestination"
                        value={formData.preferredDestination}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
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
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="immigrationType" className="block text-sm font-medium text-gray-700">
                      移民类型
                    </label>
                    <div className="mt-1">
                      <select
                        id="immigrationType"
                        name="immigrationType"
                        value={formData.immigrationType}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">请选择</option>
                        <option value="skilled_worker">技术移民</option>
                        <option value="investment">投资移民</option>
                        <option value="family">家庭团聚</option>
                        <option value="study">留学转移民</option>
                        <option value="work_permit">工作签证</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      备注信息
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">关于客户的其他重要信息</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => router.push(`/consultant/clients/${id}`)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
