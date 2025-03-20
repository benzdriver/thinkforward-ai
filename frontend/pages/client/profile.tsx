import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  languageProficiency: {
    english: string;
    french: string;
    other: string;
  };
  educationLevel: string;
  occupation: string;
  maritalStatus: string;
  familyMembers: number;
  preferredDestination: string;
  currentImmigrationStatus: string;
}

export function ClientProfile() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/client/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data.profile);
        setFormData(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('无法加载您的个人资料，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchProfile();
    } else if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 处理嵌套属性如 languageProficiency.english
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof UserProfile] as Record<string, any>),
            [child]: value
          }
        } as UserProfile;
      });
    } else {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value
        } as UserProfile;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('更新个人资料时出错，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };
  
  const cancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">发生错误</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            个人资料
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            管理您的个人信息和移民资料
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/dashboard">
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              返回控制台
            </span>
          </Link>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              编辑资料
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                编辑个人资料
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                请提供准确的个人信息，这将有助于我们为您提供更好的移民服务
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    全名
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData?.fullName || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    电子邮件
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData?.email || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    电话号码
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData?.phone || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
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
                      value={formData?.nationality || ''}
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
                      value={formData?.dateOfBirth || ''}
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
                      value={formData?.passportNumber || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    街道地址
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData?.address || ''}
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
                      value={formData?.city || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    国家
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={formData?.country || ''}
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
                      value={formData?.postalCode || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="languageProficiency.english" className="block text-sm font-medium text-gray-700">
                    英语水平
                  </label>
                  <div className="mt-1">
                    <select
                      id="languageProficiency.english"
                      name="languageProficiency.english"
                      value={formData?.languageProficiency?.english || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">请选择</option>
                      <option value="native">母语</option>
                      <option value="fluent">流利</option>
                      <option value="intermediate">中级</option>
                      <option value="basic">基础</option>
                      <option value="none">无</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="languageProficiency.french" className="block text-sm font-medium text-gray-700">
                    法语水平
                  </label>
                  <div className="mt-1">
                    <select
                      id="languageProficiency.french"
                      name="languageProficiency.french"
                      value={formData?.languageProficiency?.french || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">请选择</option>
                      <option value="native">母语</option>
                      <option value="fluent">流利</option>
                      <option value="intermediate">中级</option>
                      <option value="basic">基础</option>
                      <option value="none">无</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                    最高学历
                  </label>
                  <div className="mt-1">
                    <select
                      id="educationLevel"
                      name="educationLevel"
                      value={formData?.educationLevel || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">请选择</option>
                      <option value="highSchool">高中</option>
                      <option value="college">大专</option>
                      <option value="bachelor">本科</option>
                      <option value="master">硕士</option>
                      <option value="phd">博士</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                    职业
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="occupation"
                      id="occupation"
                      value={formData?.occupation || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                    婚姻状况
                  </label>
                  <div className="mt-1">
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      value={formData?.maritalStatus || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">请选择</option>
                      <option value="single">未婚</option>
                      <option value="married">已婚</option>
                      <option value="divorced">离婚</option>
                      <option value="widowed">丧偶</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="familyMembers" className="block text-sm font-medium text-gray-700">
                    随行家庭成员数量
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="familyMembers"
                      id="familyMembers"
                      min="0"
                      value={formData?.familyMembers || 0}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="preferredDestination" className="block text-sm font-medium text-gray-700">
                    意向移民国家
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="preferredDestination"
                      id="preferredDestination"
                      value={formData?.preferredDestination || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="currentImmigrationStatus" className="block text-sm font-medium text-gray-700">
                    当前移民状态
                  </label>
                  <div className="mt-1">
                    <select
                      id="currentImmigrationStatus"
                      name="currentImmigrationStatus"
                      value={formData?.currentImmigrationStatus || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">请选择</option>
                      <option value="not_started">尚未开始</option>
                      <option value="application_submitted">已提交申请</option>
                      <option value="under_review">申请审核中</option>
                      <option value="additional_docs_requested">需要补充材料</option>
                      <option value="interview_scheduled">已安排面试</option>
                      <option value="approved">已获批准</option>
                      <option value="rejected">申请被拒</option>
                      <option value="appealing">上诉中</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                个人信息
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                您的基本个人资料和联系方式
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">全名</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.fullName || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">电子邮件</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.email || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">电话号码</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.phone || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">国籍</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.nationality || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">出生日期</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.dateOfBirth || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">护照号码</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.passportNumber || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">地址</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.address ? (
                      <>
                        {profile.address}<br />
                        {profile.city}, {profile.country} {profile.postalCode}
                      </>
                    ) : '未设置'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="border-t border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                移民相关信息
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                与您的移民申请相关的详细信息
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">英语水平</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.languageProficiency?.english === 'native' ? '母语' :
                     profile?.languageProficiency?.english === 'fluent' ? '流利' :
                     profile?.languageProficiency?.english === 'intermediate' ? '中级' :
                     profile?.languageProficiency?.english === 'basic' ? '基础' :
                     profile?.languageProficiency?.english === 'none' ? '无' : '未设置'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">法语水平</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.languageProficiency?.french === 'native' ? '母语' :
                     profile?.languageProficiency?.french === 'fluent' ? '流利' :
                     profile?.languageProficiency?.french === 'intermediate' ? '中级' :
                     profile?.languageProficiency?.french === 'basic' ? '基础' :
                     profile?.languageProficiency?.french === 'none' ? '无' : '未设置'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">最高学历</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.educationLevel === 'highSchool' ? '高中' :
                     profile?.educationLevel === 'college' ? '大专' :
                     profile?.educationLevel === 'bachelor' ? '本科' :
                     profile?.educationLevel === 'master' ? '硕士' :
                     profile?.educationLevel === 'phd' ? '博士' : '未设置'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">职业</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.occupation || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">婚姻状况</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.maritalStatus === 'single' ? '未婚' :
                     profile?.maritalStatus === 'married' ? '已婚' :
                     profile?.maritalStatus === 'divorced' ? '离婚' :
                     profile?.maritalStatus === 'widowed' ? '丧偶' : '未设置'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">随行家庭成员数量</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.familyMembers || '0'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">意向移民国家</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.preferredDestination || '未设置'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">当前移民状态</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profile?.currentImmigrationStatus === 'not_started' ? '尚未开始' :
                     profile?.currentImmigrationStatus === 'application_submitted' ? '已提交申请' :
                     profile?.currentImmigrationStatus === 'under_review' ? '申请审核中' :
                     profile?.currentImmigrationStatus === 'additional_docs_requested' ? '需要补充材料' :
                     profile?.currentImmigrationStatus === 'interview_scheduled' ? '已安排面试' :
                     profile?.currentImmigrationStatus === 'approved' ? '已获批准' :
                     profile?.currentImmigrationStatus === 'rejected' ? '申请被拒' :
                     profile?.currentImmigrationStatus === 'appealing' ? '上诉中' : '未设置'}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
